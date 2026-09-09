import PageWrapper from '@/components/PageWrapper';

export default function RefundPolicyPage() {
  return (
    <PageWrapper title="Refund Policy" subtitle="Last updated: August 6, 2026">
      <h2 className="text-xl font-semibold text-white mt-4 mb-3">No Refunds After Download</h2>
      <p>
        Due to the digital nature of COCESKI LUTLab products, all sales are final. Once a LUT preset
        has been downloaded, we cannot offer a refund, exchange, or cancellation.
      </p>

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">Why No Refunds?</h2>
      <p>
        Our products are downloadable digital goods. Once the files are delivered, there is no way to
        "return" them. We provide detailed before/after previews on every product page so you can
        evaluate the look before purchasing.
      </p>

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">File Corrupted or Damaged?</h2>
      <p>
        If you experience issues with a downloaded file — it is corrupted, incomplete, or will not open
        in your software — please contact us within <strong className="text-white">14 days</strong> of
        purchase and we will send you a replacement file at no cost.
      </p>

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">How to Contact</h2>
      <p>
        Email <a href="mailto:support@lutlab.com" className="text-amber-500 hover:underline">support@lutlab.com</a> with
        your order number and a description of the issue. We respond within 48 hours.
      </p>

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">Before You Buy</h2>
      <p>
        We encourage you to use the before/after slider on each product page to preview the grade
        before purchasing. Make sure the preset is compatible with your software (Premiere Pro,
        DaVinci Resolve, Final Cut Pro, Photoshop, or Lightroom).
      </p>
    </PageWrapper>
  );
}
