import { motion } from 'framer-motion';

export default function Loader() {
  return (
    <div className="flex items-center gap-1.5 p-2">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 bg-primary rounded-full"
          animate={{
            y: ['0%', '-50%', '0%']
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.15,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
}
