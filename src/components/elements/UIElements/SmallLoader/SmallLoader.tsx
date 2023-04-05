export function SmallLoader({ className, border = "border-primary" }: any) {
  return (
    <div className={`flex  flex-grow items-center justify-center ${className}`}>
      <div
        className={`h-6 w-6 animate-spin rounded-full border-4 ${border} border-solid border-t-transparent`}
      ></div>
    </div>
  );
}
