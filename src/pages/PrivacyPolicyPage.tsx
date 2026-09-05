import PageWrapper from '@/components/PageWrapper';

export default function PrivacyPolicyPage() {
  return (
    <PageWrapper title="Privacy Policy" subtitle="Last updated: August 6, 2026">
      <p>
        This Privacy Policy describes how COCESKI LUTLab ("we", "us", or "our") collects, uses, and
        shares your information when you visit or purchase products from our website.
      </p>

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">1. Information We Collect</h2>
      <p>When you visit our website or make a purchase, we may collect:</p>
      <ul className="list-disc list-inside space-y-2 mt-3">
        <li><strong className="text-white">Contact information:</strong> name, email address (collected by our payment processor, Lemon Squeezy, at checkout).</li>
        <li><strong className="text-white">Order information:</strong> product purchased, transaction ID, purchase date.</li>
        <li><strong className="text-white">Technical data:</strong> IP address, browser type, device information, and pages visited.</li>
      </ul>

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">2. How We Use Your Information</h2>
      <ul className="list-disc list-inside space-y-2">
        <li>To process and fulfill your orders and deliver digital products.</li>
        <li>To send you download links and order confirmations via email.</li>
        <li>To respond to customer support inquiries.</li>
        <li>To improve our website and products through analytics.</li>
        <li>To comply with legal obligations.</li>
      </ul>

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">3. Payment Processing</h2>
      <p>
        We do not store your credit card or payment details. All payments are processed securely by
        our payment processor, Lemon Squeezy. Your payment information is handled in accordance with
        Lemon Squeezy's privacy policy and PCI-DSS compliance standards.
      </p>

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">4. Sharing Your Information</h2>
      <p>
        We do not sell, trade, or rent your personal information to third parties. We share
        information only with service providers who help us operate our business (e.g., Lemon Squeezy
        for payment processing) and when required by law.
      </p>

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">5. Cookies</h2>
      <p>
        Our website may use cookies and similar technologies to improve your browsing experience and
        analyze website traffic. You can disable cookies in your browser settings, though some
        features may not function properly.
      </p>

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">6. Data Retention</h2>
      <p>
        We retain your order information for as long as necessary to provide our services and comply
        with legal obligations. Download links expire 48 hours after purchase.
      </p>

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">7. Your Rights</h2>
      <p>
        Depending on your location, you may have the right to access, correct, or delete your personal
        information. To exercise these rights, contact us at <a href="mailto:support@lutlab.com" className="text-amber-500 hover:underline">support@lutlab.com</a>.
      </p>

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">8. Children's Privacy</h2>
      <p>
        Our website is not intended for individuals under the age of 16. We do not knowingly collect
        personal information from children.
      </p>

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">9. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. Changes will be posted on this page with
        an updated revision date.
      </p>

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">10. Contact</h2>
      <p>
        Questions about this Privacy Policy? Email <a href="mailto:support@lutlab.com" className="text-amber-500 hover:underline">support@lutlab.com</a>.
      </p>
    </PageWrapper>
  );
}
