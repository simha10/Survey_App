// web-portal/src/app/mis-reports/property-list/full-table/layout.tsx
export default function FullTableLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="bg-black min-h-screen w-full">{children}</div>;
}
