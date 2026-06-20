/**
 * Slow-moving gradient mesh of blurred color blobs. Purely decorative; sits
 * behind content to give sections atmospheric depth.
 */
export function Aurora({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      <div className="absolute -top-32 -left-24 h-[36rem] w-[36rem] rounded-full bg-wellness-600/25 blur-[120px] animate-aurora" />
      <div className="absolute top-1/3 -right-24 h-[32rem] w-[32rem] rounded-full bg-secondary/20 blur-[120px] animate-aurora animation-delay-1000" />
      <div className="absolute -bottom-40 left-1/3 h-[34rem] w-[34rem] rounded-full bg-growth-500/15 blur-[130px] animate-aurora animation-delay-500" />
    </div>
  );
}
