'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Heart, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  CreditCard,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { NGO, SiteSettings, DonationPurpose } from '@/types/database';

interface DonationFormProps {
  ngo: NGO;
  settings: SiteSettings;
  purposes: DonationPurpose[];
  initialAmount?: number;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function DonationForm({ ngo, settings, purposes, initialAmount }: DonationFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const queryAmount = Number(searchParams.get('amount')) || initialAmount || 1000;

  // Form states
  const [amount, setAmount] = useState<number>(queryAmount);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [selectedPurposeId, setSelectedPurposeId] = useState<string>(purposes[0]?.id || '');

  const [donorName, setDonorName] = useState<string>('');
  const [donorEmail, setDonorEmail] = useState<string>('');
  const [donorPhone, setDonorPhone] = useState<string>('');
  const [donorPan, setDonorPan] = useState<string>('');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [requires80g, setRequires80g] = useState<boolean>(false);

  // Flow states
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [simulationModalOpen, setSimulationModalOpen] = useState<boolean>(false);
  const [pendingOrderData, setPendingOrderData] = useState<any>(null);

  const predefinedAmounts = [100, 500, 1000, 2500, 5000];

  // Dynamic Razorpay script loader
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleAmountSelect = (val: number) => {
    setAmount(val);
    setIsCustom(false);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    setCustomAmount(val);
    if (val) {
      setAmount(Number(val));
      setIsCustom(true);
    }
  };

  const selectedPurpose = purposes.find((p) => p.id === selectedPurposeId) || purposes[0];

  const handleDonationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (amount < 10) {
      setErrorMessage('Please select or enter an amount of at least ₹10.');
      return;
    }

    if (!donorEmail || !donorEmail.includes('@')) {
      setErrorMessage('A valid email address is required to receive your donation receipt.');
      return;
    }

    if (!isAnonymous && !donorName.trim()) {
      setErrorMessage('Please provide your name or check "Make this donation anonymously".');
      return;
    }

    if (requires80g && !donorPan.trim()) {
      setErrorMessage('Please provide your PAN number to issue an 80G compliant donation receipt.');
      return;
    }

    setLoading(true);

    try {
      // 1. Create order on secure backend
      const res = await fetch('/api/donations/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ngoId: ngo.id,
          amount,
          donorName: isAnonymous ? 'Anonymous Donor' : donorName,
          donorEmail,
          donorPhone,
          donorPan: requires80g ? donorPan.toUpperCase() : undefined,
          isAnonymous,
          purposeId: selectedPurpose?.id,
          purposeName: selectedPurpose?.name || 'General Support',
          requires80g,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to initiate donation order');
      }

      // If Razorpay live keys are configured and SDK loaded:
      if (!data.isSimulation && window.Razorpay) {
        const options = {
          key: data.keyId,
          amount: data.amount,
          currency: data.currency,
          name: ngo.name,
          description: `Donation: ${selectedPurpose?.name || 'General Support'}`,
          image: ngo.logo_url || '/images/brand/logo.jpg',
          order_id: data.orderId,
          prefill: {
            name: donorName,
            email: donorEmail,
            contact: donorPhone,
          },
          theme: {
            color: '#087FC1',
          },
          handler: async function (response: any) {
            await verifyAndFinalizeDonation({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
          },
          modal: {
            ondismiss: function () {
              setLoading(false);
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        // Realistic Payment Gateway Simulator
        setPendingOrderData(data);
        setSimulationModalOpen(true);
        setLoading(false);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  const verifyAndFinalizeDonation = async ({
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    paymentMethod = 'UPI / Netbanking',
  }: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    paymentMethod?: string;
  }) => {
    setLoading(true);
    try {
      const res = await fetch('/api/donations/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature,
          ngoId: ngo.id,
          paymentMethod,
        }),
      });

      const verifyData = await res.json();

      if (!res.ok || !verifyData.success) {
        throw new Error(verifyData.error || 'Server signature verification failed');
      }

      // Confetti celebration
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {}

      // Redirect to official receipt page
      router.push(`/donation-success?id=${verifyData.donationId}&receipt=${verifyData.receiptNumber}&ngo=${ngo.slug}`);
    } catch (err: any) {
      setErrorMessage(err.message || 'Payment verification failed on the server.');
      setLoading(false);
      setSimulationModalOpen(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E8E5DE] shadow-subtle overflow-hidden">
      {/* Header Banner: Deep Navy with Clean Title */}
      <div className="bg-[#172B4D] text-[#FCFBF8] p-6 sm:p-8 border-b border-[#172B4D]">
        <div className="flex items-center space-x-3 mb-2">
          <span className="p-2 rounded-lg bg-white/10 text-[#087FC1]">
            <Heart className="w-5 h-5 fill-[#087FC1]" />
          </span>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-heading">
              Support {ngo.name}
            </h2>
            <p className="text-xs text-[#F5F2EA]/85 mt-0.5 font-body">
              100% of your gift directly supports verified charitable activities in Dehradun.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleDonationSubmit} className="p-6 sm:p-8 space-y-8">
        {/* Error Alert */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start space-x-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* STEP 1: SELECT DONATION AMOUNT */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-[#172B4D] flex items-center">
              <span className="w-5 h-5 rounded-md bg-[#F5F2EA] text-[#172B4D] text-xs font-bold flex items-center justify-center mr-2 border border-[#E8E5DE]">
                1
              </span>
              Select Donation Amount (₹ INR)
            </label>
            <span className="text-xs text-[#73777D]">Minimum ₹100</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {predefinedAmounts.map((amt) => {
              const selected = !isCustom && amount === amt;
              return (
                <button
                  key={amt}
                  type="button"
                  onClick={() => handleAmountSelect(amt)}
                  className={`py-3.5 px-4 rounded-xl text-center border-2 transition-all duration-200 ${
                    selected
                      ? 'border-[#087FC1] bg-[#087FC1]/10 text-[#087FC1] font-extrabold shadow-subtle'
                      : 'border-[#E8E5DE] hover:border-[#087FC1] bg-white text-[#292D32] font-semibold hover:bg-[#F5F2EA]/40'
                  }`}
                >
                  <span className="text-[11px] text-[#73777D] block font-normal">INR</span>
                  <span className="text-lg font-heading">₹{amt.toLocaleString('en-IN')}</span>
                </button>
              );
            })}
          </div>

          {/* Custom Amount Input */}
          <div className="relative mt-2">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#73777D] font-bold">
              ₹
            </div>
            <input
              type="text"
              value={customAmount}
              onChange={handleCustomAmountChange}
              placeholder="Or enter any custom amount (e.g. 15000)"
              className={`w-full pl-9 pr-4 py-3 rounded-xl border text-sm font-medium focus:outline-none transition ${
                isCustom
                  ? 'border-[#087FC1] ring-2 ring-[#087FC1]/20 bg-[#087FC1]/5 font-bold text-[#172B4D]'
                  : 'border-[#E8E5DE] focus:border-[#087FC1] text-[#292D32]'
              }`}
            />
          </div>

          <div className="p-3 rounded-lg bg-[#F5F2EA] border border-[#E8E5DE] text-xs text-[#73777D]">
            Selected contribution: <strong className="text-[#172B4D]">₹{amount.toLocaleString('en-IN')}</strong> directly assists children and families in Dehradun.
          </div>
        </div>

        {/* STEP 2: SELECT DONATION PURPOSE */}
        <div className="space-y-4">
          <label className="text-xs font-bold uppercase tracking-wider text-[#172B4D] flex items-center">
            <span className="w-5 h-5 rounded-md bg-[#F5F2EA] text-[#172B4D] text-xs font-bold flex items-center justify-center mr-2 border border-[#E8E5DE]">
              2
            </span>
            Choose Donation Purpose
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {purposes.map((p) => {
              const selected = selectedPurposeId === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedPurposeId(p.id)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 flex items-start space-x-3 ${
                    selected
                      ? 'border-[#087FC1] bg-[#087FC1]/5 shadow-subtle'
                      : 'border-[#E8E5DE] hover:border-[#087FC1] bg-white'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border mt-0.5 flex items-center justify-center ${
                    selected ? 'border-[#087FC1] bg-[#087FC1] text-white' : 'border-[#E8E5DE]'
                  }`}>
                    {selected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#172B4D] font-heading">{p.name}</h4>
                    <p className="text-[11px] text-[#73777D] mt-0.5 leading-snug font-body">{p.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* STEP 3: DONOR DETAILS */}
        <div className="space-y-4">
          <label className="text-xs font-bold uppercase tracking-wider text-[#172B4D] flex items-center">
            <span className="w-5 h-5 rounded-md bg-[#F5F2EA] text-[#172B4D] text-xs font-bold flex items-center justify-center mr-2 border border-[#E8E5DE]">
              3
            </span>
            Donor Details
          </label>

          {/* Anonymous toggle */}
          {settings.allow_anonymous_donations && (
            <label className="flex items-center space-x-2 text-xs text-[#292D32] cursor-pointer p-3 bg-[#F5F2EA] rounded-xl border border-[#E8E5DE]">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="w-4 h-4 rounded text-[#087FC1] focus:ring-[#087FC1] border-[#E8E5DE]"
              />
              <span className="font-semibold">Make this donation anonymous on public impact reports</span>
            </label>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {!isAnonymous && (
              <div>
                <label className="block text-xs font-semibold text-[#172B4D] mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required={!isAnonymous}
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E5DE] text-xs text-[#292D32] focus:outline-none focus:border-[#087FC1]"
                />
              </div>
            )}

            <div className={isAnonymous ? 'sm:col-span-2' : ''}>
              <label className="block text-xs font-semibold text-[#172B4D] mb-1">
                Email Address * (For official digital receipt)
              </label>
              <input
                type="email"
                required
                value={donorEmail}
                onChange={(e) => setDonorEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E5DE] text-xs text-[#292D32] focus:outline-none focus:border-[#087FC1]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172B4D] mb-1">
                Mobile Number (Optional)
              </label>
              <input
                type="tel"
                value={donorPhone}
                onChange={(e) => setDonorPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E5DE] text-xs text-[#292D32] focus:outline-none focus:border-[#087FC1]"
              />
            </div>

            {/* 80G Tax Exemption Toggle */}
            <div className="flex flex-col justify-end">
              <label className="flex items-center space-x-2 text-xs text-[#292D32] cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={requires80g}
                  onChange={(e) => setRequires80g(e.target.checked)}
                  className="w-4 h-4 rounded text-[#087FC1] focus:ring-[#087FC1] border-[#E8E5DE]"
                />
                <span className="font-semibold text-[#172B4D]">
                  Request 80G Tax Exemption Receipt
                </span>
              </label>
              <span className="text-[10px] text-[#73777D] mt-0.5 ml-6">
                Requires PAN under Income Tax Department rules.
              </span>
            </div>

            {requires80g && (
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#172B4D] mb-1">
                  Permanent Account Number (PAN) *
                </label>
                <input
                  type="text"
                  required
                  maxLength={10}
                  value={donorPan}
                  onChange={(e) => setDonorPan(e.target.value.toUpperCase())}
                  placeholder="ABCDE1234F"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E5DE] font-mono text-xs uppercase text-[#292D32] focus:outline-none focus:border-[#087FC1]"
                />
                <p className="text-[10px] text-[#73777D] mt-1">
                  Provisional Section 80G approval URN: <strong className="text-[#172B4D]">AAVFT8621RF20251</strong> (AY 2026-27 to AY 2028-29).
                </p>
              </div>
            )}
          </div>
        </div>

        {/* STEP 4: PAYMENT BUTTON (Ocean Blue: #087FC1, ~52px Height, Medium Rounded Corners) */}
        <div className="pt-4 border-t border-[#E8E5DE] space-y-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full h-[52px] rounded-xl font-bold text-sm text-white bg-[#087FC1] hover:bg-[#076ea7] shadow-subtle hover:shadow-warm transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {loading ? (
              <span className="inline-flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                Securing Payment Gateway...
              </span>
            ) : (
              <>
                <CreditCard className="w-4 h-4 mr-1" />
                <span>Proceed to Pay ₹{amount.toLocaleString('en-IN')} Securely</span>
              </>
            )}
          </button>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-center text-[11px] text-[#73777D] pt-2">
            <div className="flex items-center justify-center space-x-1">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              <span>256-Bit SSL Encryption</span>
            </div>
            <div className="flex items-center justify-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#087FC1]" />
              <span>Razorpay Verified</span>
            </div>
            <div className="flex items-center justify-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Instant Digital Receipt</span>
            </div>
          </div>
        </div>
      </form>

      {/* RAZORPAY TEST SIMULATOR MODAL (Guarantees testing without live credentials) */}
      {simulationModalOpen && pendingOrderData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#172B4D]/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-[#E8E5DE] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-[#172B4D] text-white p-5 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CreditCard className="w-5 h-5 text-[#10C9D4]" />
                <span className="font-bold text-sm font-heading">Razorpay Checkout Sandbox</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-[#10C9D4]/20 text-[#10C9D4] px-2 py-0.5 rounded border border-[#10C9D4]/30">
                Sandbox Mode
              </span>
            </div>

            <div className="p-6 space-y-4">
              <div className="p-4 rounded-xl bg-[#F5F2EA] border border-[#E8E5DE] text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#73777D]">Organisation:</span>
                  <strong className="text-[#172B4D]">{ngo.name}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#73777D]">Order ID:</span>
                  <span className="font-mono text-[#292D32]">{pendingOrderData.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#73777D]">Donation Amount:</span>
                  <strong className="text-[#087FC1] text-sm">₹{amount.toLocaleString('en-IN')}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#73777D]">Receipt Ref:</span>
                  <span className="font-mono text-[#292D32]">{pendingOrderData.receiptNumber}</span>
                </div>
              </div>

              <p className="text-xs text-[#73777D] leading-relaxed">
                Click below to simulate a confirmed transaction via Razorpay. The backend verifies cryptographic signatures and issues your official receipt.
              </p>

              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={() =>
                    verifyAndFinalizeDonation({
                      razorpay_order_id: pendingOrderData.orderId,
                      razorpay_payment_id: `pay_sim_${Math.random().toString(36).substring(2, 10)}`,
                      razorpay_signature: `sim_sig_${Math.random().toString(36).substring(2, 16)}`,
                      paymentMethod: 'UPI (Google Pay / PhonePe)',
                    })
                  }
                  className="w-full h-[44px] rounded-xl font-bold text-xs text-white bg-emerald-600 hover:bg-emerald-700 shadow-subtle transition"
                >
                  Confirm Successful Payment (UPI)
                </button>

                <button
                  type="button"
                  onClick={() =>
                    verifyAndFinalizeDonation({
                      razorpay_order_id: pendingOrderData.orderId,
                      razorpay_payment_id: `pay_sim_card_${Math.random().toString(36).substring(2, 10)}`,
                      razorpay_signature: `sim_sig_${Math.random().toString(36).substring(2, 16)}`,
                      paymentMethod: 'Debit / Credit Card',
                    })
                  }
                  className="w-full h-[44px] rounded-xl font-bold text-xs text-[#172B4D] bg-[#F5F2EA] hover:bg-[#E8E5DE] transition"
                >
                  Confirm Successful Payment (Card / Netbanking)
                </button>

                <button
                  type="button"
                  onClick={() => setSimulationModalOpen(false)}
                  className="w-full py-2 text-xs text-[#73777D] hover:text-[#172B4D] transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
