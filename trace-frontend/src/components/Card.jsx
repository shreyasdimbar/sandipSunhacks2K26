import { cn } from '../utils/cn';

export default function Card({ children, className, ...props }) {
  return (
    <div 
      className={cn(
        "bg-surface border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-colors shadow-sm",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
