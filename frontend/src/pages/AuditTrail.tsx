import { useState, useEffect } from 'react';
import { assetService } from '../services/api';
import { Clock } from 'lucide-react';

export default function AuditTrail() {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    assetService.getAuditLogs().then(setLogs);
  }, []);

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-6 text-gray-900 border-b border-gray-100 pb-4">Audit Trail & Activity Log</h2>
      
      <div className="relative border-l-2 border-gray-200 ml-3 space-y-8">
        {logs.map((log) => (
          <div key={log.id} className="relative pl-6">
            <div className="absolute -left-2 top-1.5 w-4 h-4 bg-primary rounded-full border-4 border-white shadow-sm"></div>
            <div>
              <div className="flex items-center text-sm text-gray-500 mb-1">
                <Clock className="w-4 h-4 mr-1" />
                {new Date(log.timestamp).toLocaleString()}
              </div>
              <p className="text-gray-900 font-medium">{log.action}</p>
              {log.assetId && (
                <span className="inline-block mt-1 text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-600">
                  Ref: {log.assetId}
                </span>
              )}
            </div>
          </div>
        ))}
        {logs.length === 0 && (
          <p className="text-gray-500 pl-6">No recent activity.</p>
        )}
      </div>
    </div>
  );
}
