export const GlassCard = ({ children, className = '', hover = true, ...props }: any) => {
  return (
    <div
      className={`rounded-xl ${hover ? 'glass-card' : 'glass-panel'} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
