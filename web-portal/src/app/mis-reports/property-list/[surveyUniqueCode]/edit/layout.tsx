export default function FullTableLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="bg-black min-h-screen w-full">{children}</div>;
}
