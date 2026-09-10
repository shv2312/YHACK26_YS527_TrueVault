import { useState, useEffect } from 'react';
import { assetService } from '../services/api';
import { Clock, Search, Filter, ShieldCheck, Fingerprint, UploadCloud, UserCheck, Ban } from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { StatusBadge } from '../components/ui/StatusBadge';

export default function AuditTrail() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('ALL');

  useEffect(() => {
    // Add additional mock events for the demonstration
    const extendedMockLogs = [
      { id: 'ext1', action: 'Identity verified', timestamp: new Date(Date.now() - 5 * 60000).toISOString(), actor: '0xabc...def1', status: 'SUCCESS' },
      { id: 'ext2', action: 'Wallet connected', timestamp: new Date(Date.now() - 15 * 60000).toISOString(), actor: '0xabc...def1', status: 'SUCCESS' },
      { id: 'ext3', action: 'Login failed (Invalid Creds)', timestamp: new Date(Date.now() - 3600000).toISOString(), actor: 'user@institution.gov', status: 'FAILED' },
      { id: 'ext4', action: 'Unauthorized access denied', timestamp: new Date(Date.now() - 86400000).toISOString(), actor: '0x999...8882', status: 'DENIED', assetId: 'doc-123' },
    ];

    assetService.getAuditLogs().then(data => {
      // Map existing logs and combine with new ones
      const mapped = data.map((l: any) => ({
        ...l,
        actor: '0xabc...def1',
        status: l.action.toLowerCase().includes('denied') || l.action.toLowerCase().includes('failed') ? 'FAILED' : 'SUCCESS'
      }));
      
      const allLogs = [...mapped, ...extendedMockLogs].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setLogs(allLogs);
      setLoading(false);
    });
  }, []);



  const getIcon = (action: string) => {
    const lower = action.toLowerCase();
    if (lower.includes('identit') || lower.includes('login') || lower.includes('wallet')) return <Fingerprint className="w-5 h-5" />;
    if (lower.includes('upload') || lower.includes('encrypt') || lower.includes('hash')) return <UploadCloud className="w-5 h-5" />;
    if (lower.includes('grant') || lower.includes('revok') || lower.includes('access')) return <UserCheck className="w-5 h-5" />;
    if (lower.includes('denied') || lower.includes('fail') || lower.includes('tamper')) return <Ban className="w-5 h-5 text-red-400" />;
    return <ShieldCheck className="w-5 h-5" />;
  };

  const filteredLogs = logs.filter(l => {
    const matchesSearch = l.action.toLowerCase().includes(searchQuery.toLowerCase()) || l.actor?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'ALL' || l.status === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      <GlassCard className="p-6 flex flex-col md:flex-row justify-between items-center gap-4 border-primary/20">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-wide">Immutable Audit Trail</h2>
          <p className="text-sm text-gray-400 mt-1">Tamper-evident log of all identity verifications, access controls, and asset modifications.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search events or wallets..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="glass-input pl-9 pr-4 py-2.5 text-sm rounded-lg w-full sm:w-64 font-medium"
            />
          </div>
          <div className="relative">
            <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <select 
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
              className="glass-input pl-9 pr-8 py-2.5 text-sm rounded-lg appearance-none [&>option]:text-black w-full sm:w-36 font-medium"
            >
              <option value="ALL">All Events</option>
              <option value="SUCCESS">Success</option>
              <option value="FAILED">Failed / Denied</option>
            </select>
          </div>
        </div>
      </GlassCard>

      <GlassCard className="p-0 overflow-hidden">
        {loading ? (
           <div className="flex flex-col items-center justify-center h-64 text-gray-400">
             <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
             Loading immutable records...
           </div>
        ) : filteredLogs.length === 0 ? (
           <div className="flex flex-col items-center justify-center h-64 text-gray-500">
             <Search className="w-12 h-12 mb-4 opacity-30" />
             <p>No audit events found matching your criteria.</p>
           </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/5">
              <thead className="bg-black/40">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Event Details</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Actor / Wallet</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Timestamp</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">Reference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`p-2 rounded-lg bg-black/40 border border-white/5 mr-4 ${
                          log.status === 'FAILED' || log.status === 'DENIED' ? 'text-red-400' : 'text-primary'
                        }`}>
                          {getIcon(log.action)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white tracking-wide">{log.action}</p>
                          {log.assetId && (
                            <p className="text-xs text-gray-500 mt-1 font-mono">Asset ID: {log.assetId}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-mono text-gray-300 bg-black/30 px-2 py-1 rounded border border-white/5">{log.actor}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-400 font-mono">
                        <Clock className="w-3.5 h-3.5 mr-2 text-gray-500" />
                        {new Date(log.timestamp).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge 
                        status={log.status === 'SUCCESS' ? 'success' : (log.status === 'PENDING' ? 'warning' : 'danger')} 
                        text={log.status} 
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <span className="inline-block px-2 py-1 rounded bg-accent/10 border border-accent/20 text-accent text-xs font-mono">
                        DEMO-NET
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>
    </div>
  );
}
