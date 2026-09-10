

type StatusType = 'success' | 'warning' | 'danger' | 'info' | 'default';

export const StatusBadge = ({ status, text, className = '' }: { status: StatusType, text: string, className?: string }) => {
  const styles = {
    success: "bg-green-500/10 text-green-400 border-green-500/30 shadow-[0_0_8px_rgba(16,185,129,0.2)]",
    warning: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30 shadow-[0_0_8px_rgba(245,158,11,0.2)]",
    danger: "bg-red-500/10 text-red-400 border-red-500/30 shadow-[0_0_8px_rgba(239,68,68,0.2)]",
    info: "bg-blue-500/10 text-blue-400 border-blue-500/30 shadow-[0_0_8px_rgba(59,130,246,0.2)]",
    default: "bg-gray-500/10 text-gray-400 border-gray-500/30"
  };

  return (
    <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-md border ${styles[status]} ${className}`}>
      {text}
    </span>
  );
};
