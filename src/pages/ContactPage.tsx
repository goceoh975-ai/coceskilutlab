import PageWrapper from '@/components/PageWrapper';
import { Mail, Clock, MessageCircle } from 'lucide-react';

export default function ContactPage() {
  return (
    <PageWrapper title="Contact" subtitle="We're here to help">
      <p>
        Have a question about a preset, a download issue, or anything else? We'd love to hear from you.
      </p>

      <div className="grid sm:grid-cols-3 gap-4 mt-8">
        <div className="bg-white/5 border border-white/10 rounded-xl p-5 text-center">
          <div className="w-11 h-11 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-3 mx-auto">
            <Mail size={20} className="text-amber-500" />
          </div>
          <h3 className="font-semibold text-white mb-1">Email</h3>
          <a href="mailto:support@lutlab.com" className="text-sm text-amber-500 hover:underline">
            support@lutlab.com
          </a>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-5 text-center">
          <div className="w-11 h-11 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-3 mx-auto">
            <Clock size={20} className="text-amber-500" />
          </div>
          <h3 className="font-semibold text-white mb-1">Response Time</h3>
          <p className="text-sm text-neutral-400">Within 48 hours</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-5 text-center">
          <div className="w-11 h-11 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-3 mx-auto">
            <MessageCircle size={20} className="text-amber-500" />
          </div>
          <h3 className="font-semibold text-white mb-1">Support</h3>
          <p className="text-sm text-neutral-400">Order issues, file problems, license questions</p>
        </div>
      </div>

      <div className="mt-10 p-5 rounded-xl bg-neutral-900/60 border border-white/5">
        <h2 className="text-lg font-semibold text-white mb-3">Before You Email</h2>
        <ul className="list-disc list-inside space-y-2 text-sm text-neutral-400">
          <li>Include your order number if your question is about a purchase.</li>
          <li>For corrupted files, let us know which preset and what software you're using.</li>
          <li>For license questions, see our <a href="/license" className="text-amber-500 hover:underline">License Agreement</a> page first.</li>
        </ul>
      </div>
    </PageWrapper>
  );
}
