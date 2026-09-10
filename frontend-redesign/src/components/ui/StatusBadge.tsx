type StatusType = 'success' | 'warning' | 'danger' | 'info' | 'default';

export const StatusBadge = ({ status, text, className = '' }: { status: StatusType; text: string; className?: string }) => {
  const styles: Record<StatusType, string> = {
    success: "bg-emerald-50 text-emerald-700 border-emerald-200",
    warning: "bg-amber-50 text-amber-700 border-amber-200",
    danger: "bg-red-50 text-red-700 border-red-200",
    info: "bg-blue-50 text-blue-700 border-blue-200",
    default: "bg-gray-50 text-gray-600 border-gray-200",
  };

  return (
    <span className={`px-2.5 py-1 inline-flex text-xs leading-4 font-semibold rounded-md border ${styles[status]} ${className}`}>
      {text}
    </span>
  );
};
