import PageWrapper from '@/components/PageWrapper';

export default function LicensePage() {
  return (
    <PageWrapper title="License Agreement" subtitle="Last updated: August 6, 2026">
      <p>By purchasing and downloading any COCESKI LUTLab preset, you agree to the terms of this license agreement.</p>

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">1. Grant of License</h2>
      <p>
        COCESKI LUTLab grants you a non-exclusive, non-transferable, revocable license to use the
        purchased LUT presets for both personal and commercial projects, including but not limited to
        films, videos, photographs, social media content, and client work.
      </p>

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">2. Permitted Use</h2>
      <ul className="list-disc list-inside space-y-2">
        <li>Use the presets in unlimited personal and commercial projects.</li>
        <li>Apply the LUTs to your own footage and deliver graded content to clients.</li>
        <li>Install the presets on your own devices for your own use.</li>
      </ul>

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">3. Restrictions</h2>
      <ul className="list-disc list-inside space-y-2">
        <li>You may <strong className="text-white">not</strong> resell, redistribute, or sublicense the LUT files.</li>
        <li>You may <strong className="text-white">not</strong> share, give away, or distribute the presets to others.</li>
        <li>You may <strong className="text-white">not</strong> include the raw LUT files in products you sell (e.g., as part of a preset pack of your own).</li>
        <li>This license is for <strong className="text-white">1 user</strong>. Multiple users in a team or organization must purchase separate licenses.</li>
        <li>You may <strong className="text-white">not</strong> reverse engineer, modify, or repackage the presets for distribution.</li>
      </ul>

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">4. Ownership</h2>
      <p>
        All LUT presets remain the intellectual property of COCESKI LUTLab. This license grants you
        usage rights only — ownership of the presets is not transferred.
      </p>

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">5. Limitation of Liability</h2>
      <p>
        COCESKI LUTLab is not liable for any damages arising from the use or inability to use the
        presets. The presets are provided "as is" without warranty of any kind.
      </p>

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">6. Termination</h2>
      <p>
        Violation of any term in this agreement will result in automatic termination of your license.
        Upon termination, you must cease using the presets and delete all copies in your possession.
      </p>

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">7. Contact</h2>
      <p>
        Questions about this license? Email <a href="mailto:support@lutlab.com" className="text-amber-500 hover:underline">support@lutlab.com</a>.
      </p>
    </PageWrapper>
  );
}
