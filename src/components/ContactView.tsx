'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  MapPin, 
  Mail, 
  Phone, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ShieldCheck 
} from 'lucide-react';
import { NGO, SiteSettings } from '@/types/database';

interface ContactViewProps {
  ngo: NGO;
  settings: SiteSettings;
}

export default function ContactView({ ngo, settings }: ContactViewProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ngoId: ngo.id,
          name,
          email,
          phone,
          subject,
          message,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit inquiry');
      }

      setSubmitted(true);
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred while submitting your message.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex flex-col bg-[#FCFBF8] text-[#292D32] selection:bg-[#087FC1] selection:text-white"
      style={{
        // @ts-ignore
        '--ngo-primary': ngo.primary_color || '#087FC1',
        '--ngo-secondary': ngo.secondary_color || '#ea580c',
        '--ngo-accent': ngo.accent_color || '#10C9D4',
      }}
    >
      <Navbar ngo={ngo} />

      <main className="flex-1 py-12 lg:py-16">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-left max-w-3xl mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-[#087FC1] bg-[#087FC1]/10 px-3 py-1 rounded-md">
              Connect With Us
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-[46px] font-bold text-[#172B4D] mt-3 tracking-tight font-heading">
              Get in Touch with {ngo.name}
            </h1>
            <p className="text-base text-[#73777D] mt-3 leading-relaxed font-body">
              Whether you want to volunteer, contribute supplies, coordinate CSR initiatives, or visit our office, our team welcomes your reach.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Contact Details & Map (5 Cols) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Office Address Card */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E8E5DE] shadow-subtle space-y-5">
                <h3 className="text-lg font-bold text-[#172B4D] border-b border-[#E8E5DE] pb-3 font-heading">
                  Secretariat & Office
                </h3>

                <div className="space-y-4 text-xs text-[#292D32] font-body">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-[#F5F2EA] text-[#087FC1] flex items-center justify-center shrink-0 border border-[#E8E5DE]">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <strong className="block text-[#172B4D]">Headquarters Address:</strong>
                      <span className="leading-relaxed text-[#73777D] block mt-0.5">
                        {settings.registered_address}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-[#F5F2EA] text-[#087FC1] flex items-center justify-center shrink-0 border border-[#E8E5DE]">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <strong className="block text-[#172B4D]">Telephone / WhatsApp:</strong>
                      <a href={`tel:${settings.phone}`} className="text-[#087FC1] hover:underline block mt-0.5">
                        {settings.phone}
                      </a>
                      {settings.whatsapp_number && (
                        <a 
                          href={`https://wa.me/${settings.whatsapp_number.replace(/[^0-9]/g, '')}`} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-emerald-700 font-semibold inline-flex items-center mt-1"
                        >
                          Chat on WhatsApp →
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-[#F5F2EA] text-[#087FC1] flex items-center justify-center shrink-0 border border-[#E8E5DE]">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <strong className="block text-[#172B4D]">Official Email:</strong>
                      <a href={`mailto:${settings.email}`} className="text-[#087FC1] hover:underline block mt-0.5">
                        {settings.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-[#F5F2EA] text-[#087FC1] flex items-center justify-center shrink-0 border border-[#E8E5DE]">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <strong className="block text-[#172B4D]">Visiting Hours:</strong>
                      <span className="text-[#73777D] block mt-0.5">
                        Monday – Saturday: 10:00 AM – 5:00 PM IST
                      </span>
                    </div>
                  </div>
                </div>

                {/* Trust Verification Note */}
                <div className="pt-2">
                  <div className="p-3 bg-[#F5F2EA] rounded-xl border border-[#E8E5DE] text-[11px] text-[#73777D]">
                    <div className="flex items-center text-[#172B4D] font-semibold mb-1">
                      <ShieldCheck className="w-3.5 h-3.5 mr-1 text-[#087FC1]" /> Statutory Trust Details
                    </div>
                    Registered under Indian Trusts Act (Reg No. {settings.trust_reg_number}). Approvals under 12A ({settings.section_12a_urn}) and 80G ({settings.section_80g_urn}).
                  </div>
                </div>
              </div>

              {/* Office Map Card */}
              <div className="bg-white rounded-2xl overflow-hidden border border-[#E8E5DE] shadow-subtle h-64 relative">
                {settings.google_maps_embed_url ? (
                  <iframe
                    src={settings.google_maps_embed_url}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={false}
                    loading="lazy"
                    title="Office Location Map"
                  />
                ) : (
                  <div className="h-full flex flex-col items-center justify-center p-4 text-center text-xs text-[#73777D] bg-[#F5F2EA]">
                    <MapPin className="w-8 h-8 text-[#087FC1] mx-auto mb-2" />
                    <p className="font-semibold text-[#172B4D]">{settings.registered_address}</p>
                    <p>{settings.city}, {settings.state} – {settings.pincode}</p>
                  </div>
                )}
              </div>

            </div>

            {/* Interactive Contact Form (7 Cols) */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-2xl p-6 sm:p-10 border border-[#E8E5DE] shadow-subtle">
                
                {submitted ? (
                  <div className="text-center py-12 space-y-4 animate-in fade-in">
                    <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-7 h-7" />
                    </div>
                    <h3 className="text-2xl font-bold text-[#172B4D] font-heading">Message Received!</h3>
                    <p className="text-sm text-[#73777D] max-w-md mx-auto leading-relaxed font-body">
                      Thank you for contacting {ngo.name}. Your inquiry has been routed to our team. We will respond within 24 to 48 hours.
                    </p>
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setName('');
                        setEmail('');
                        setPhone('');
                        setSubject('');
                        setMessage('');
                      }}
                      className="px-6 h-[44px] rounded-xl text-xs font-bold text-[#172B4D] bg-[#F5F2EA] hover:bg-[#E8E5DE] transition inline-flex items-center justify-center"
                    >
                      Send Another Enquiry
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="border-b border-[#E8E5DE] pb-4">
                      <h3 className="text-xl font-bold text-[#172B4D] font-heading">Send an Inquiry or Volunteer Request</h3>
                      <p className="text-xs text-[#73777D] mt-1 font-body">
                        We respond to all genuine inquiries, collaborations, and volunteer requests.
                      </p>
                    </div>

                    {errorMessage && (
                      <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{errorMessage}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#172B4D] mb-1">
                          Your Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Aditi Sharma"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E5DE] text-xs text-[#292D32] focus:outline-none focus:border-[#087FC1]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#172B4D] mb-1">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your.email@example.com"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E5DE] text-xs text-[#292D32] focus:outline-none focus:border-[#087FC1]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#172B4D] mb-1">
                          Phone Number (Optional)
                        </label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+91 98765 43210"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E5DE] text-xs text-[#292D32] focus:outline-none focus:border-[#087FC1]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#172B4D] mb-1">
                          Subject *
                        </label>
                        <input
                          type="text"
                          required
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                          placeholder="e.g. Volunteer for weekend drive"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E5DE] text-xs text-[#292D32] focus:outline-none focus:border-[#087FC1]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#172B4D] mb-1">
                        Your Message *
                      </label>
                      <textarea
                        required
                        rows={5}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Please share details about how you would like to collaborate, volunteer, or support..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E5DE] text-xs text-[#292D32] focus:outline-none focus:border-[#087FC1]"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full h-[48px] rounded-xl font-bold text-xs text-white bg-[#087FC1] hover:bg-[#076ea7] shadow-subtle hover:shadow-warm transition flex items-center justify-center space-x-2 disabled:opacity-50"
                    >
                      {loading ? (
                        <span>Sending Message...</span>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Submit Message</span>
                        </>
                      )}
                    </button>
                  </form>
                )}

              </div>
            </div>

          </div>

        </div>
      </main>

      <Footer ngo={ngo} settings={settings} />
    </div>
  );
}
