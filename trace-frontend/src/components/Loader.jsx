import { motion } from 'framer-motion';

export default function Loader({ size = 'md' }) {
  const dotSize = size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2';

  return (
    <div className="flex items-center gap-1.5 py-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className={`${dotSize} rounded-full bg-gradient-to-r from-primary to-secondary`}
          animate={{
            y: ['0%', '-60%', '0%'],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 0.7,
            repeat: Infinity,
            delay: i * 0.12,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}
