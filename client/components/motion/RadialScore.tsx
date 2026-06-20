import { useEffect, useRef, useState } from "react";
import { motion, animate, useInView } from "framer-motion";

interface RadialScoreProps {
  /** 0-100 */
  value: number;
  size?: number;
  stroke?: number;
  label?: string;
  className?: string;
}

/**
 * Animated circular wellness gauge with an indigo→cyan→emerald sweep.
 * The ring fills and the number counts up when it enters the viewport.
 */
export function RadialScore({
  value,
  size = 220,
  stroke = 14,
  label,
  className,
}: RadialScoreProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState(0);

  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.max(0, Math.min(100, value)) / 100;

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 1.6,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(v),
    });
    return () => controls.stop();
  }, [inView, value]);

  const gradId = `mfi-grad-${size}`;

  return (
    <div
      ref={ref}
      className={className}
      style={{ width: size, height: size, position: "relative" }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(243 82% 66%)" />
            <stop offset="55%" stopColor="hsl(187 92% 56%)" />
            <stop offset="100%" stopColor="hsl(160 84% 52%)" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(235 18% 16%)"
          strokeWidth={stroke}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${gradId})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={
            inView
              ? { strokeDashoffset: circumference * (1 - pct) }
              : { strokeDashoffset: circumference }
          }
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
          style={{
            filter: "drop-shadow(0 0 8px hsl(243 82% 63% / 0.5))",
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-5xl font-bold font-display tabular-nums text-foreground">
          {Math.round(display)}
        </span>
        <span className="text-xs uppercase tracking-widest text-muted-foreground mt-1">
          {label ?? "MFI"}
        </span>
      </div>
    </div>
  );
}
