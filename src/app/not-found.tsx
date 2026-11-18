import React from 'react';
import Link from 'next/link';
import { SearchX, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FCFBF8] text-[#292D32] flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center mx-auto">
          <SearchX className="w-8 h-8 text-slate-500" />
        </div>
        
        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Error 404
          </span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Organization Website Not Found
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            The requested NGO website or page does not exist or may currently be inactive.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#087FC1] hover:bg-[#076ba3] text-white text-xs font-bold transition shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            <span>Return to Homepage</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
