import { User, Zap, MessageSquare, AlertCircle, ArrowRight, Network } from 'lucide-react';
import { motion } from 'framer-motion';

const nodes = [
  {
    id: 'person',
    label: 'Dr. Ananya Rao',
    sublabel: 'Lead Formulation Scientist',
    icon: User,
    color: 'blue',
    bgClass: 'bg-blue-500/15 border-blue-500/25',
    iconClass: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  },
  {
    id: 'decision1',
    label: 'Use Cellulose Binder',
    sublabel: 'Decision',
    icon: Zap,
    color: 'primary',
    bgClass: 'bg-primary/10 border-primary/30 shadow-glow-sm',
    iconClass: 'bg-primary/20 text-primary border-primary/30',
    highlight: true,
  },
  {
    id: 'reason',
    label: 'Lactose unstable >75% RH',
    sublabel: 'Reasoning',
    icon: MessageSquare,
    color: 'secondary',
    bgClass: 'bg-secondary/8 border-secondary/20',
    iconClass: 'bg-secondary/20 text-secondary border-secondary/30',
  },
  {
    id: 'person2',
    label: 'Vikram Malhotra',
    sublabel: 'VP Operations',
    icon: User,
    color: 'blue',
    bgClass: 'bg-blue-500/15 border-blue-500/25',
    iconClass: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  },
  {
    id: 'decision2',
    label: 'Switch to Lactose',
    sublabel: 'Override Decision',
    icon: Zap,
    color: 'amber',
    bgClass: 'bg-amber-500/10 border-amber-500/25',
    iconClass: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  },
  {
    id: 'event',
    label: 'Tablet Disintegration',
    sublabel: 'Downstream Event',
    icon: AlertCircle,
    color: 'red',
    bgClass: 'bg-red-500/10 border-red-500/25',
    iconClass: 'bg-red-500/20 text-red-400 border-red-500/30',
  },
];

const edges = [
  { from: 'person', to: 'decision1', label: 'MADE' },
  { from: 'decision1', to: 'reason', label: 'BASED_ON' },
  { from: 'person2', to: 'decision2', label: 'MADE' },
  { from: 'decision2', to: 'event', label: 'CAUSED' },
];

function NodeCard({ node, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`flex flex-col items-center rounded-2xl p-5 w-44 border backdrop-blur-sm transition-all hover:scale-[1.03] cursor-default ${node.bgClass}`}
    >
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 border ${node.iconClass}`}>
        <node.icon className="w-5 h-5" />
      </div>
      <h3 className="font-semibold text-[13px] text-center text-gray-100 mb-1 leading-snug">{node.label}</h3>
      <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md ${
        node.highlight ? 'text-primary bg-primary/15' : 'text-gray-500'
      }`}>
        {node.sublabel}
      </span>
    </motion.div>
  );
}

function EdgeConnector({ delay, color = 'gray' }) {
  const gradients = {
    gray: 'from-gray-700/60 to-gray-600/40',
    primary: 'from-primary/50 to-secondary/40',
    amber: 'from-amber-500/40 to-red-500/40',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scaleX: 0 }}
      animate={{ opacity: 1, scaleX: 1 }}
      transition={{ delay, duration: 0.4 }}
      className="flex items-center"
    >
      <div className={`hidden md:block w-10 h-[2px] bg-gradient-to-r ${gradients[color]} relative`}>
        <div className={`absolute inset-0 bg-gradient-to-r ${gradients[color]} animate-pulse-glow`} />
      </div>
      <div className={`md:hidden h-8 w-[2px] bg-gradient-to-b ${gradients[color]}`} />
      <ArrowRight className="w-3 h-3 text-gray-600 hidden md:block -ml-1" />
    </motion.div>
  );
}

export default function GraphView() {
  return (
    <div className="h-full flex flex-col p-6 md:p-10 relative overflow-hidden">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 z-10"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center border border-primary/15 shadow-glow-sm">
            <Network className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-100">Decision Graph</h1>
            <p className="text-sm text-gray-500">Visualizing causal chains of organizational decisions</p>
          </div>
        </div>
      </motion.div>

      {/* Graph visualization */}
      <div className="flex-1 flex items-center justify-center relative z-10 w-full max-w-6xl mx-auto">

        {/* Top Row: Person → Decision → Reason */}
        <div className="flex flex-col gap-10 w-full">
          {/* Chain 1 */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-0">
            <NodeCard node={nodes[0]} delay={0.1} />
            <EdgeConnector delay={0.25} color="gray" />
            <NodeCard node={nodes[1]} delay={0.35} />
            <EdgeConnector delay={0.5} color="primary" />
            <NodeCard node={nodes[2]} delay={0.6} />
          </div>

          {/* Connection line between chains */}
          <div className="hidden md:flex justify-center">
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 32 }}
              transition={{ delay: 0.7, duration: 0.3 }}
              className="w-[2px] bg-gradient-to-b from-primary/20 via-amber-500/30 to-amber-500/20"
            />
          </div>

          {/* Chain 2 */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-0">
            <NodeCard node={nodes[3]} delay={0.8} />
            <EdgeConnector delay={0.9} color="gray" />
            <NodeCard node={nodes[4]} delay={1.0} />
            <EdgeConnector delay={1.1} color="amber" />
            <NodeCard node={nodes[5]} delay={1.2} />
          </div>
        </div>
      </div>

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="mt-8 flex flex-wrap items-center justify-center gap-4 text-[11px] font-medium text-gray-500 z-10"
      >
        {[
          { color: 'bg-blue-400', label: 'Person' },
          { color: 'bg-primary', label: 'Decision' },
          { color: 'bg-secondary', label: 'Reason' },
          { color: 'bg-amber-400', label: 'Override' },
          { color: 'bg-red-400', label: 'Event' },
        ].map((item) => (
          <span key={item.label} className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${item.color}`} />
            {item.label}
          </span>
        ))}
      </motion.div>

      {/* Background grid */}
      <div className="absolute inset-0 pointer-events-none z-0" style={{
        backgroundImage: `radial-gradient(circle at 1.5px 1.5px, rgba(255,255,255,0.03) 1px, transparent 0)`,
        backgroundSize: '32px 32px'
      }} />

      {/* Ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/[0.02] rounded-full blur-[150px] pointer-events-none z-0" />
    </div>
  );
}
