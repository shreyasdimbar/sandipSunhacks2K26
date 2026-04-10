import { cn } from '../utils/cn';

export default function Card({ children, className, glow = false, ...props }) {
  return (
    <div
      className={cn(
        "bg-surface/80 border border-white/[0.06] rounded-2xl overflow-hidden transition-all duration-300 shadow-card",
        "hover:border-white/[0.1] hover:shadow-elevated",
        glow && "glow-primary",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
