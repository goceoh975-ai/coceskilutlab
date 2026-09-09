interface PageWrapperProps {
  title: string;
  children: React.ReactNode;
  subtitle?: string;
}

export default function PageWrapper({ title, subtitle, children }: PageWrapperProps) {
  return (
    <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">{title}</h1>
      {subtitle && <p className="text-neutral-500 text-sm mb-10">{subtitle}</p>}
      {!subtitle && <div className="mb-10" />}
      <div className="prose-invert space-y-6 text-neutral-300 leading-relaxed">
        {children}
      </div>
    </div>
  );
}
