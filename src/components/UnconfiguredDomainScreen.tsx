import React from 'react';
import { Globe, AlertTriangle } from 'lucide-react';

interface Props {
  domain?: string;
}

export default function UnconfiguredDomainScreen({ domain }: Props) {
  return (
    <div className="min-h-screen bg-[#FCFBF8] text-[#292D32] flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
          <Globe className="w-7 h-7" />
        </div>
        <h1 className="text-xl font-black text-slate-900 tracking-tight">
          Domain Not Configured
        </h1>
        <p className="text-xs text-slate-500 leading-relaxed">
          {domain ? (
            <>
              The domain <strong className="font-mono text-slate-800">{domain}</strong> is not yet connected or verified on this platform.
            </>
          ) : (
            'This domain has not been configured or verified for an active organization.'
          )}
        </p>
        <div className="pt-2">
          <p className="text-[11px] text-slate-400">
            If you are the administrator of this domain, please verify your DNS CNAME and TXT challenge records in your domain settings.
          </p>
        </div>
      </div>
    </div>
  );
}
