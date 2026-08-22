import { Mail, CheckCircle2, Clock } from 'lucide-react';

export default function ThankYouPage() {
  return (
    <div className="relative max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 text-center">
      <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto mb-6">
        <CheckCircle2 size={40} className="text-green-500" />
      </div>

      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">Thanks for your purchase!</h1>

      <p className="text-lg text-neutral-300 leading-relaxed mb-2">
        Check your email — your download link is there.
      </p>

      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium mb-8 mt-4">
        <Clock size={16} /> Your download link expires in 48 hours
      </div>

      <div className="bg-neutral-900/60 border border-white/5 rounded-xl p-6 text-left mt-6">
        <h2 className="font-semibold text-white mb-2">Didn't get the email?</h2>
        <p className="text-sm text-neutral-400 leading-relaxed">
          Check your spam folder first. If you still can't find it, contact us at{' '}
          <a href="mailto:support@lutlab.com" className="text-amber-500 hover:underline inline-flex items-center gap-1">
            <Mail size={14} /> support@lutlab.com
          </a>{' '}
          and we'll resend your download link.
        </p>
      </div>

      <a
        href="/"
        className="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-lg bg-white/5 border border-white/10 text-white font-semibold text-sm hover:bg-white/10 transition-colors"
      >
        Back to Store
      </a>
    </div>
  );
}
