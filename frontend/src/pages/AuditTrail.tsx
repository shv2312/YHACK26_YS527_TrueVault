import { useState, useEffect } from 'react';
import { assetService } from '../services/api';
import { Clock } from 'lucide-react';

export default function AuditTrail() {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    assetService.getAuditLogs().then(setLogs);
  }, []);

  const getStatusColor = (action: string) => {
    const lower = action.toLowerCase();
    if (lower.includes('denied') || lower.includes('revoked') || lower.includes('failed')) return 'border-red-500 bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]';
    if (lower.includes('pending')) return 'border-yellow-400 bg-yellow-400 shadow-[0_0_8px_rgba(245,158,11,0.5)]';
    return 'border-green-400 bg-green-400 shadow-[0_0_8px_rgba(16,185,129,0.5)]';
  };

  return (
    <div className="max-w-3xl mx-auto glass-panel rounded-xl p-8">
      <h2 className="text-xl font-bold mb-8 text-white border-b border-white/10 pb-4 tracking-wide">Audit Trail & Activity Log</h2>
      
      <div className="relative border-l-2 border-white/20 ml-4 space-y-10">
        {logs.map((log) => (
          <div key={log.id} className="relative pl-8 group">
            <div className={`absolute -left-[11px] top-1.5 w-5 h-5 rounded-full border-4 border-[var(--color-bg-navy)] ${getStatusColor(log.action)}`}></div>
            <div className="glass-card p-5 rounded-lg group-hover:border-primary/40 transition-colors">
              <div className="flex items-center text-xs font-mono text-gray-400 mb-2">
                <Clock className="w-3.5 h-3.5 mr-1.5 text-primary" />
                {new Date(log.timestamp).toLocaleString()}
              </div>
              <p className="text-white font-medium tracking-wide">{log.action}</p>
              {log.assetId && (
                <span className="inline-block mt-3 text-xs font-mono bg-black/40 border border-white/10 px-2 py-1 rounded text-primary drop-shadow-[0_0_3px_rgba(0,229,255,0.3)]">
                  Ref: {log.assetId}
                </span>
              )}
            </div>
          </div>
        ))}
        {logs.length === 0 && (
          <p className="text-gray-500 pl-8 font-medium">No recent activity.</p>
        )}
      </div>
    </div>
  );
}
