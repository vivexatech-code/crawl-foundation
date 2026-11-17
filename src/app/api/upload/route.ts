import { NextResponse } from 'next/server';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  try {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const ngoId = (formData.get('ngoId') as string) || 'default';
    const folder = (formData.get('folder') as string) || `ngos/${ngoId}`;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    if (cloudName && apiKey && apiSecret && !apiKey.includes('your_api_key')) {
      const timestamp = Math.floor(Date.now() / 1000);
      const signaturePayload = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
      const signature = crypto.createHash('sha1').update(signaturePayload).digest('hex');

      const cloudinaryFormData = new FormData();
      const blob = new Blob([buffer], { type: file.type });
      cloudinaryFormData.append('file', blob, file.name);
      cloudinaryFormData.append('api_key', apiKey);
      cloudinaryFormData.append('timestamp', timestamp.toString());
      cloudinaryFormData.append('signature', signature);
      cloudinaryFormData.append('folder', folder);

      const clRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: cloudinaryFormData,
      });

      const clData = await clRes.json();
      if (!clRes.ok) {
        throw new Error(clData.error?.message || 'Cloudinary upload failed');
      }

      return NextResponse.json({
        success: true,
        url: clData.secure_url,
        public_id: clData.public_id,
        format: clData.format,
        width: clData.width,
        height: clData.height,
        storage: 'cloudinary',
      });
    }

    const ext = path.extname(file.name) || '.jpg';
    const fileName = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}${ext}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, fileName);
    fs.writeFileSync(filePath, buffer);

    return NextResponse.json({
      success: true,
      url: `/uploads/${fileName}`,
      fileName,
      storage: 'local',
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: error.message || 'Image upload failed' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { publicId, url } = await req.json();
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (cloudName && apiKey && apiSecret && publicId && !apiKey.includes('your_api_key')) {
      const timestamp = Math.floor(Date.now() / 1000);
      const signaturePayload = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
      const signature = crypto.createHash('sha1').update(signaturePayload).digest('hex');

      const clRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          public_id: publicId,
          api_key: apiKey,
          timestamp,
          signature,
        }),
      });

      const clData = await clRes.json();
      return NextResponse.json({ success: true, result: clData.result });
    }

    if (url && url.startsWith('/uploads/')) {
      const localPath = path.join(process.cwd(), 'public', url);
      if (fs.existsSync(localPath)) {
        fs.unlinkSync(localPath);
      }
    }

    return NextResponse.json({ success: true, message: 'Resource removed' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Deletion failed' }, { status: 500 });
  }
}
