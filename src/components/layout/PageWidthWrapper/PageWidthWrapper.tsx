export function PageWidthWrapper({ children, className }: any) {
  return (
    <div className={` mx-auto max-w-4xl px-4 ${className}`}>{children}</div>
  );
}
