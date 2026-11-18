'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Building2, 
  QrCode, 
  Smartphone, 
  Copy, 
  Check, 
  Download, 
  ShieldCheck, 
  HeartHandshake, 
  Info, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle,
  FileCheck,
  Send,
  HelpCircle,
  X
} from 'lucide-react';
import { NGO, SiteSettings, DonationPurpose, DonationPaymentSettings } from '@/types/database';

interface DonationFormProps {
  ngo: NGO;
  settings: SiteSettings;
  paymentSettings?: DonationPaymentSettings;
  purposes: DonationPurpose[];
  initialAmount?: number;
}

export default function DonationForm({ 
  ngo, 
  settings, 
  paymentSettings, 
  purposes, 
  initialAmount 
}: DonationFormProps) {
  const searchParams = useSearchParams();
  const queryAmount = Number(searchParams.get('amount')) || initialAmount || 1000;

  // Amount & Purpose state
  const [amount, setAmount] = useState<number>(queryAmount);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [selectedPurposeId, setSelectedPurposeId] = useState<string>(purposes[0]?.id || '');

  // Active Payment Tab
  const [activeTab, setActiveTab] = useState<'bank' | 'qr' | 'upi'>('bank');

  // Copy Feedback state
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Desktop UPI Warning Modal
  const [showDesktopUpiNotice, setShowDesktopUpiNotice] = useState<boolean>(false);

  // Transfer Acknowledgment / 80G Request Form
  const [showAcknowledgeForm, setShowAcknowledgeForm] = useState<boolean>(false);
  const [donorName, setDonorName] = useState<string>('');
  const [donorEmail, setDonorEmail] = useState<string>('');
  const [donorPhone, setDonorPhone] = useState<string>('');
  const [donorPan, setDonorPan] = useState<string>('');
  const [transactionRef, setTransactionRef] = useState<string>('');
  const [requires80g, setRequires80g] = useState<boolean>(false);
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [notes, setNotes] = useState<string>('');

  const [submittingDeclaration, setSubmittingDeclaration] = useState<boolean>(false);
  const [declarationSuccess, setDeclarationSuccess] = useState<{ receiptNumber: string; message: string } | null>(null);
  const [declarationError, setDeclarationError] = useState<string | null>(null);

  const predefinedAmounts = [500, 1000, 2500, 5000];

  // Resolve payment details with fail-safe defaults for The Crawl Foundation
  const payConfig = {
    bankAccountName: paymentSettings?.bank_account_name || 'The Crawl Foundation',
    bankName: paymentSettings?.bank_name || 'Union Bank of India',
    bankAccountNumber: paymentSettings?.bank_account_number || '564501010033661',
    bankIfsc: paymentSettings?.bank_ifsc || 'UBIN0556459',
    bankBranch: paymentSettings?.bank_branch || 'Union Bank of India, Patel Nagar Branch, Industrial Area, Patel Nagar, Dehradun - 248001',
    upiId: paymentSettings?.upi_id || '89512401@ubin',
    upiPayeeName: paymentSettings?.upi_payee_name || ngo.name || 'The Crawl Foundation',
    qrCodeUrl: paymentSettings?.qr_code_url || '/images/payments/crawl-foundation-upi-qr.png',
    enableBank: paymentSettings?.enable_bank_transfer ?? true,
    enableQr: paymentSettings?.enable_qr_code ?? true,
    enableUpi: paymentSettings?.enable_upi_app ?? true,
    instructions: paymentSettings?.instructions || 'Direct contribution to The Crawl Foundation. Contributions go directly towards our medical assistance and children welfare programs in Dehradun, Uttarakhand.',
  };

  // Ensure initial tab is one that is enabled
  useEffect(() => {
    if (activeTab === 'bank' && !payConfig.enableBank) {
      if (payConfig.enableQr) setActiveTab('qr');
      else if (payConfig.enableUpi) setActiveTab('upi');
    } else if (activeTab === 'qr' && !payConfig.enableQr) {
      if (payConfig.enableBank) setActiveTab('bank');
      else if (payConfig.enableUpi) setActiveTab('upi');
    } else if (activeTab === 'upi' && !payConfig.enableUpi) {
      if (payConfig.enableBank) setActiveTab('bank');
      else if (payConfig.enableQr) setActiveTab('qr');
    }
  }, [payConfig.enableBank, payConfig.enableQr, payConfig.enableUpi]);

  const handleAmountSelect = (val: number) => {
    setAmount(val);
    setIsCustom(false);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    setCustomAmount(val);
    if (val) {
      const num = parseInt(val, 10);
      setAmount(num);
      setIsCustom(true);
    } else {
      setAmount(0);
      setIsCustom(true);
    }
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // Launch UPI Deep Link
  const handleLaunchUpi = () => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      typeof navigator !== 'undefined' ? navigator.userAgent : ''
    ) || (typeof window !== 'undefined' && window.innerWidth <= 768);

    const effectiveAmount = amount > 0 ? amount : '';
    const encodedUpiId = encodeURIComponent(payConfig.upiId);
    const encodedPayee = encodeURIComponent(payConfig.upiPayeeName);

    // Standard NPCI UPI URI Scheme
    let upiDeepLink = `upi://pay?pa=${encodedUpiId}&pn=${encodedPayee}&cu=INR`;
    if (effectiveAmount) {
      upiDeepLink += `&am=${effectiveAmount}`;
    }

    if (isMobile) {
      // Direct intent navigation on mobile
      window.location.href = upiDeepLink;
    } else {
      // Desktop browser cannot handle upi:// intent scheme natively
      setShowDesktopUpiNotice(true);
    }
  };

  // Handle Transfer Declaration submission
  const handleDeclarationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDeclarationError(null);
    setSubmittingDeclaration(true);

    try {
      const res = await fetch('/api/donations/record', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          donor_name: donorName,
          donor_email: donorEmail,
          donor_phone: donorPhone,
          donor_pan: donorPan,
          purpose_id: selectedPurposeId,
          purpose_name: purposes.find((p) => p.id === selectedPurposeId)?.name || 'General Support',
          payment_method: activeTab === 'bank' ? 'Bank Transfer' : activeTab === 'qr' ? 'UPI QR Scan' : 'UPI App',
          transaction_ref: transactionRef,
          requires_80g: requires80g,
          is_anonymous: isAnonymous,
          notes,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setDeclarationSuccess({
          receiptNumber: data.receiptNumber,
          message: data.message,
        });
      } else {
        setDeclarationError(data.error || 'Failed to submit declaration details.');
      }
    } catch (err: any) {
      setDeclarationError('Network error while recording details. Please verify your connection.');
    } finally {
      setSubmittingDeclaration(false);
    }
  };

  const selectedPurpose = purposes.find((p) => p.id === selectedPurposeId) || purposes[0];

  return (
    <div className="space-y-8">

      {/* Main Donation Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-[#E8E5DE] shadow-subtle space-y-8">
        
        {/* Step 1: Contribution Amount Selector */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#087FC1] font-heading flex items-center">
              <span className="w-5 h-5 rounded-full bg-[#087FC1] text-white flex items-center justify-center text-[10px] mr-2">1</span>
              Select Contribution Amount
            </span>
            <span className="text-xs text-[#73777D] font-mono">Currency: INR (₹)</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {predefinedAmounts.map((amt) => {
              const isSelected = !isCustom && amount === amt;
              return (
                <button
                  key={amt}
                  type="button"
                  onClick={() => handleAmountSelect(amt)}
                  className={`py-3.5 px-4 rounded-2xl text-center border font-bold text-sm transition-all duration-200 ${
                    isSelected
                      ? 'border-[#087FC1] bg-[#087FC1] text-white shadow-subtle'
                      : 'border-[#E8E5DE] bg-[#FCFBF8] text-[#172B4D] hover:border-[#087FC1]/40 hover:bg-white'
                  }`}
                >
                  ₹{amt.toLocaleString('en-IN')}
                </button>
              );
            })}
          </div>

          {/* Custom Amount Field */}
          <div className="mt-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#73777D] font-bold text-sm">
                ₹
              </div>
              <input
                type="text"
                placeholder="Or enter custom amount (e.g. 15000)"
                value={customAmount}
                onChange={handleCustomAmountChange}
                className={`w-full pl-8 pr-4 py-3 rounded-xl border text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-[#087FC1] ${
                  isCustom
                    ? 'border-[#087FC1] bg-white text-[#172B4D]'
                    : 'border-[#E8E5DE] bg-[#FCFBF8] text-[#172B4D]'
                }`}
              />
            </div>
            {amount > 0 && (
              <p className="text-xs text-[#73777D] mt-2 font-medium">
                Contributing: <strong className="text-[#172B4D]">₹{amount.toLocaleString('en-IN')}</strong> directly towards charitable relief initiatives.
              </p>
            )}
          </div>
        </div>

        {/* Step 2: Choose Purpose of Contribution */}
        {purposes.length > 0 && (
          <div className="pt-6 border-t border-[#E8E5DE]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#087FC1] font-heading flex items-center">
                <span className="w-5 h-5 rounded-full bg-[#087FC1] text-white flex items-center justify-center text-[10px] mr-2">2</span>
                Cause / Purpose
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {purposes.map((p) => {
                const isSelected = selectedPurposeId === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedPurposeId(p.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'border-[#087FC1] bg-[#F5F2EA] shadow-xs'
                        : 'border-[#E8E5DE] bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="text-xs font-bold text-[#172B4D]">{p.name}</div>
                    {p.description && (
                      <div className="text-[11px] text-[#73777D] mt-0.5 line-clamp-2">
                        {p.description}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3: Choose From The Three Direct Payment Options */}
        <div className="pt-6 border-t border-[#E8E5DE]">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#087FC1] font-heading flex items-center">
              <span className="w-5 h-5 rounded-full bg-[#087FC1] text-white flex items-center justify-center text-[10px] mr-2">3</span>
              Select Direct Payment Option
            </span>
            <span className="text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md font-semibold border border-emerald-200">
              Zero Payment Gateway Fees
            </span>
          </div>

          {/* Three Payment Tabs */}
          <div className="bg-[#F5F2EA] p-1.5 rounded-2xl grid grid-cols-1 sm:grid-cols-3 gap-1.5 border border-[#E8E5DE]">
            
            {/* Tab 1: Bank Transfer */}
            {payConfig.enableBank && (
              <button
                type="button"
                onClick={() => setActiveTab('bank')}
                className={`py-3 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
                  activeTab === 'bank'
                    ? 'bg-white text-[#172B4D] shadow-sm'
                    : 'text-[#73777D] hover:text-[#172B4D]'
                }`}
              >
                <Building2 className={`w-4 h-4 ${activeTab === 'bank' ? 'text-[#087FC1]' : 'text-slate-400'}`} />
                <span>1. Bank Transfer</span>
              </button>
            )}

            {/* Tab 2: Scan & Pay QR */}
            {payConfig.enableQr && (
              <button
                type="button"
                onClick={() => setActiveTab('qr')}
                className={`py-3 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
                  activeTab === 'qr'
                    ? 'bg-white text-[#172B4D] shadow-sm'
                    : 'text-[#73777D] hover:text-[#172B4D]'
                }`}
              >
                <QrCode className={`w-4 h-4 ${activeTab === 'qr' ? 'text-[#087FC1]' : 'text-slate-400'}`} />
                <span>2. Scan & Pay QR</span>
              </button>
            )}

            {/* Tab 3: Pay Using UPI App */}
            {payConfig.enableUpi && (
              <button
                type="button"
                onClick={() => setActiveTab('upi')}
                className={`py-3 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
                  activeTab === 'upi'
                    ? 'bg-white text-[#172B4D] shadow-sm'
                    : 'text-[#73777D] hover:text-[#172B4D]'
                }`}
              >
                <Smartphone className={`w-4 h-4 ${activeTab === 'upi' ? 'text-[#087FC1]' : 'text-slate-400'}`} />
                <span>3. Pay Using UPI App</span>
              </button>
            )}

          </div>

          {/* TAB 1 CONTENT: BANK TRANSFER */}
          {activeTab === 'bank' && payConfig.enableBank && (
            <div className="mt-6 bg-[#FCFBF8] rounded-2xl p-6 sm:p-7 border border-[#E8E5DE] space-y-5 animate-in fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-[#E8E5DE]">
                <div>
                  <h3 className="text-base font-bold text-[#172B4D] font-heading">
                    Official Bank Account Details
                  </h3>
                  <p className="text-xs text-[#73777D] mt-0.5 font-body">
                    Transfer directly via NEFT, RTGS, IMPS, or Net Banking from any Indian bank.
                  </p>
                </div>
                <div className="hidden sm:flex items-center space-x-1 text-xs text-slate-500 font-medium">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Verified Beneficiary</span>
                </div>
              </div>

              <div className="space-y-4">
                
                {/* Account Name */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 bg-white rounded-xl border border-[#E8E5DE]">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#73777D] block">
                      Account Name / Beneficiary
                    </span>
                    <span className="text-sm sm:text-base font-bold text-[#172B4D]">
                      {payConfig.bankAccountName}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(payConfig.bankAccountName, 'accName')}
                    className="inline-flex items-center space-x-1.5 self-start sm:self-auto px-3 py-1.5 rounded-lg text-xs font-bold bg-[#F5F2EA] hover:bg-[#E8E5DE] text-[#087FC1] transition shadow-xs"
                  >
                    {copiedKey === 'accName' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Name</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Bank Name */}
                <div className="p-3.5 bg-white rounded-xl border border-[#E8E5DE]">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#73777D] block">
                    Bank Name
                  </span>
                  <span className="text-sm sm:text-base font-bold text-[#172B4D]">
                    {payConfig.bankName}
                  </span>
                </div>

                {/* Account Number */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 bg-white rounded-xl border border-[#E8E5DE]">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#73777D] block">
                      Account Number
                    </span>
                    <span className="text-base sm:text-lg font-bold font-mono text-[#172B4D] tracking-wider">
                      {payConfig.bankAccountNumber}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(payConfig.bankAccountNumber, 'accNum')}
                    className="inline-flex items-center space-x-1.5 self-start sm:self-auto px-3 py-1.5 rounded-lg text-xs font-bold bg-[#F5F2EA] hover:bg-[#E8E5DE] text-[#087FC1] transition shadow-xs"
                  >
                    {copiedKey === 'accNum' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Account</span>
                      </>
                    )}
                  </button>
                </div>

                {/* IFSC Code */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 bg-white rounded-xl border border-[#E8E5DE]">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#73777D] block">
                      IFSC Code
                    </span>
                    <span className="text-base sm:text-lg font-bold font-mono text-[#172B4D] tracking-wider">
                      {payConfig.bankIfsc}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(payConfig.bankIfsc, 'ifsc')}
                    className="inline-flex items-center space-x-1.5 self-start sm:self-auto px-3 py-1.5 rounded-lg text-xs font-bold bg-[#F5F2EA] hover:bg-[#E8E5DE] text-[#087FC1] transition shadow-xs"
                  >
                    {copiedKey === 'ifsc' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy IFSC</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Branch */}
                <div className="p-3.5 bg-white rounded-xl border border-[#E8E5DE]">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#73777D] block">
                    Branch Address
                  </span>
                  <span className="text-xs sm:text-sm font-medium text-[#292D32] leading-relaxed">
                    {payConfig.bankBranch}
                  </span>
                </div>

              </div>

              {/* Wire Help Notice */}
              <div className="bg-[#F5F2EA] rounded-xl p-4 border border-[#E8E5DE] text-xs text-[#73777D] flex items-start space-x-2.5">
                <Info className="w-4 h-4 text-[#087FC1] shrink-0 mt-0.5" />
                <div className="leading-relaxed font-body">
                  <strong>Transfer Reference:</strong> In your bank’s transfer remarks, you may mention <em>“Donation {amount > 0 ? `₹${amount}` : ''}”</em>. After initiating the transfer, record your UTR reference below to claim an official Section 80G tax certificate.
                </div>
              </div>
            </div>
          )}

          {/* TAB 2 CONTENT: SCAN & PAY USING QR CODE */}
          {activeTab === 'qr' && payConfig.enableQr && (
            <div className="mt-6 bg-[#FCFBF8] rounded-2xl p-6 sm:p-8 border border-[#E8E5DE] text-center space-y-6 animate-in fade-in">
              <div>
                <h3 className="text-base font-bold text-[#172B4D] font-heading">
                  Scan & Pay Using Any UPI App
                </h3>
                <p className="text-xs text-[#73777D] mt-1 font-body">
                  Open Google Pay, PhonePe, Paytm, BHIM, or any banking app and scan this official QR code to donate.
                </p>
              </div>

              {/* QR Code Container with padding and white border */}
              <div className="inline-block bg-white p-5 sm:p-6 rounded-3xl border border-[#E8E5DE] shadow-warm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={payConfig.qrCodeUrl}
                  alt={`Official UPI QR Code for ${payConfig.upiPayeeName}`}
                  className="w-56 h-56 sm:w-64 sm:h-64 object-contain mx-auto"
                />
                
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <div className="text-xs font-bold text-[#172B4D] font-heading">
                    {payConfig.upiPayeeName}
                  </div>
                  <div className="text-[11px] font-mono text-slate-500 font-semibold mt-0.5">
                    {payConfig.upiId}
                  </div>
                </div>
              </div>

              {/* Download QR Button & Copy UPI ID */}
              <div className="flex flex-wrap items-center justify-center gap-3">
                <a
                  href={payConfig.qrCodeUrl}
                  download="crawl-foundation-upi-qr.png"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#087FC1] hover:bg-[#076ea7] text-white transition shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>Download QR Code</span>
                </a>

                <button
                  type="button"
                  onClick={() => handleCopy(payConfig.upiId, 'qrUpiId')}
                  className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-white text-[#172B4D] border border-[#E8E5DE] hover:bg-slate-50 transition shadow-xs"
                >
                  {copiedKey === 'qrUpiId' ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-700">UPI ID Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-[#087FC1]" />
                      <span>Copy UPI ID ({payConfig.upiId})</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-[11px] text-[#73777D] max-w-md mx-auto leading-relaxed">
                Compatible with all UPI 2.0 interoperable apps across India. No convenience charges or processing fees deducted.
              </p>
            </div>
          )}

          {/* TAB 3 CONTENT: PAY USING UPI APP (DEEP LINK) */}
          {activeTab === 'upi' && payConfig.enableUpi && (
            <div className="mt-6 bg-[#FCFBF8] rounded-2xl p-6 sm:p-8 border border-[#E8E5DE] text-center space-y-6 animate-in fade-in">
              <div>
                <h3 className="text-base font-bold text-[#172B4D] font-heading">
                  Pay Directly Using Installed UPI App
                </h3>
                <p className="text-xs text-[#73777D] mt-1 font-body">
                  Tap below to launch Google Pay, PhonePe, Paytm, or BHIM directly on your mobile device.
                </p>
              </div>

              {/* Verified Payee Card */}
              <div className="max-w-md mx-auto bg-white p-5 rounded-2xl border border-[#E8E5DE] shadow-subtle space-y-3 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#73777D]">
                    Payee Name
                  </span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Verified NGO
                  </span>
                </div>
                <div className="text-sm font-bold text-[#172B4D]">
                  {payConfig.upiPayeeName}
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#73777D] block">
                      UPI ID (VPA)
                    </span>
                    <span className="text-sm font-mono font-bold text-[#172B4D]">
                      {payConfig.upiId}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(payConfig.upiId, 'upiTabVpa')}
                    className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#F5F2EA] text-[#087FC1] hover:bg-slate-200 transition"
                  >
                    {copiedKey === 'upiTabVpa' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy UPI ID</span>
                      </>
                    )}
                  </button>
                </div>

                {amount > 0 && (
                  <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-xs">
                    <span className="text-[#73777D] font-semibold">Prefilled Transfer Amount:</span>
                    <span className="font-bold text-[#172B4D] text-sm">₹{amount.toLocaleString('en-IN')}</span>
                  </div>
                )}
              </div>

              {/* Action Button: Launches UPI Deep Link */}
              <div>
                <button
                  type="button"
                  onClick={handleLaunchUpi}
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 px-10 h-[52px] rounded-xl text-base font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-warm transition-all duration-200"
                >
                  <Smartphone className="w-5 h-5 fill-white" />
                  <span>Pay Using UPI App {amount > 0 ? `(₹${amount.toLocaleString('en-IN')})` : ''}</span>
                </button>
              </div>

              <p className="text-[11px] text-[#73777D] max-w-sm mx-auto leading-relaxed">
                If you are browsing on a desktop computer, use the <strong>Scan & Pay QR</strong> option with your phone's camera or UPI app.
              </p>
            </div>
          )}

        </div>

        {/* Step 4: Transfer Acknowledgment & 80G Receipt Details */}
        <div className="pt-6 border-t border-[#E8E5DE]">
          <div className="bg-[#F5F2EA] rounded-2xl p-5 border border-[#E8E5DE]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-bold text-[#172B4D] font-heading flex items-center space-x-2">
                  <FileCheck className="w-4 h-4 text-[#087FC1]" />
                  <span>Completed Your Bank or UPI Transfer?</span>
                </h4>
                <p className="text-xs text-[#73777D] mt-1 font-body">
                  Submit your transaction reference (UTR) to obtain your official Section 80G tax exemption certificate.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAcknowledgeForm(!showAcknowledgeForm)}
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#087FC1] hover:bg-[#076ea7] text-white transition shrink-0 shadow-xs"
              >
                <span>{showAcknowledgeForm ? 'Hide Form' : 'Submit Transfer Details'}</span>
              </button>
            </div>

            {/* Expandable Form */}
            {showAcknowledgeForm && (
              <form onSubmit={handleDeclarationSubmit} className="mt-5 pt-5 border-t border-[#E8E5DE] space-y-4">
                
                {declarationSuccess && (
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs space-y-1">
                    <div className="font-bold flex items-center">
                      <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-600" />
                      Details Submitted Successfully! Reference: {declarationSuccess.receiptNumber}
                    </div>
                    <p className="text-emerald-700 leading-relaxed font-body">
                      {declarationSuccess.message}
                    </p>
                  </div>
                )}

                {declarationError && (
                  <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                    <span>{declarationError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  
                  {/* Full Name */}
                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Donor Full Name {!isAnonymous && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      type="text"
                      disabled={isAnonymous}
                      value={isAnonymous ? 'Anonymous Supporter' : donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      placeholder="e.g. Ramesh Kumar"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#087FC1]"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={donorEmail}
                      onChange={(e) => setDonorEmail(e.target.value)}
                      placeholder="donor@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#087FC1]"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Phone Number (WhatsApp)
                    </label>
                    <input
                      type="tel"
                      value={donorPhone}
                      onChange={(e) => setDonorPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#087FC1]"
                    />
                  </div>

                  {/* Transaction Ref / UTR */}
                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Bank UTR / UPI Ref Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={transactionRef}
                      onChange={(e) => setTransactionRef(e.target.value)}
                      placeholder="e.g. 432190876543 / UBIN..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 bg-white font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#087FC1]"
                    />
                  </div>

                  {/* PAN for 80G */}
                  <div className="sm:col-span-2">
                    <div className="flex items-center space-x-2 mb-1.5">
                      <input
                        type="checkbox"
                        id="requires80gCheck"
                        checked={requires80g}
                        onChange={(e) => setRequires80g(e.target.checked)}
                        className="rounded border-slate-300 text-[#087FC1] focus:ring-[#087FC1]"
                      />
                      <label htmlFor="requires80gCheck" className="font-bold text-slate-700 cursor-pointer">
                        I require a Section 80G Tax Exemption Certificate (Requires Indian PAN)
                      </label>
                    </div>

                    {requires80g && (
                      <input
                        type="text"
                        required
                        maxLength={10}
                        value={donorPan}
                        onChange={(e) => setDonorPan(e.target.value.toUpperCase())}
                        placeholder="Permanent Account Number (PAN) e.g. ABCDE1234F"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 bg-white font-mono uppercase focus:outline-none focus:ring-2 focus:ring-[#087FC1]"
                      />
                    )}
                  </div>

                  {/* Notes */}
                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Additional Message or Notes
                    </label>
                    <input
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Optional notes or instructions for the trust team"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#087FC1]"
                    />
                  </div>

                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={submittingDeclaration}
                    className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-[#087FC1] hover:bg-[#076ea7] disabled:opacity-50 transition shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{submittingDeclaration ? 'Submitting Details...' : 'Submit Transfer Details'}</span>
                  </button>
                </div>

                <div className="text-[11px] text-slate-500 italic">
                  * Note: Submissions are manually matched against Union Bank of India bank ledger entries before 80G certificates are generated. We do not generate unverified automated receipts.
                </div>

              </form>
            )}

          </div>
        </div>

      </div>

      {/* Desktop UPI Helper Notice Modal */}
      {showDesktopUpiNotice && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 border border-[#E8E5DE] shadow-2xl relative space-y-4">
            <button
              type="button"
              onClick={() => setShowDesktopUpiNotice(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-[#087FC1] flex items-center justify-center">
              <Smartphone className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-bold text-[#172B4D] font-heading">
                Mobile UPI App Required
              </h3>
              <p className="text-xs text-[#73777D] mt-1.5 leading-relaxed font-body">
                Direct UPI app intent links only work on mobile devices where apps like Google Pay, PhonePe, Paytm, or BHIM are installed.
              </p>
            </div>

            <div className="bg-[#F5F2EA] rounded-2xl p-4 border border-[#E8E5DE] space-y-2 text-xs text-[#292D32]">
              <div className="font-bold text-[#172B4D]">To pay from this computer:</div>
              <ol className="list-decimal list-inside space-y-1 text-[#73777D]">
                <li>Click <strong>"Scan & Pay QR"</strong> tab above.</li>
                <li>Scan the authentic QR code with your mobile camera or UPI app.</li>
                <li>Or copy the official UPI ID: <strong className="text-[#172B4D] font-mono">{payConfig.upiId}</strong>.</li>
              </ol>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowDesktopUpiNotice(false);
                  setActiveTab('qr');
                }}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-[#087FC1] text-white hover:bg-[#076ea7] transition shadow-xs"
              >
                Switch to QR Code
              </button>
              <button
                type="button"
                onClick={() => {
                  handleCopy(payConfig.upiId, 'modalUpi');
                }}
                className="px-4 py-2.5 rounded-xl text-xs font-bold bg-[#F5F2EA] text-[#087FC1] hover:bg-slate-200 transition"
              >
                {copiedKey === 'modalUpi' ? 'Copied!' : 'Copy UPI ID'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
