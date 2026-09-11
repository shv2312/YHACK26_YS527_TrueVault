import { useState, useEffect } from 'react';
import { assetService } from '../services/api';
import { Clock, Search, Filter, ShieldCheck, Fingerprint, UploadCloud, UserCheck, Ban } from 'lucide-react';
import { StatusBadge } from '../components/ui/StatusBadge';

export default function AuditTrail() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('ALL');

  useEffect(() => {
    assetService.getAuditLogs().then(data => {
      const mapped = data.map((l: any) => ({ 
        ...l, 
        actor: '0xabc...def1', // Backend doesn't return actor wallet currently, using standard placeholder
        status: l.action.toLowerCase().includes('denied') || l.action.toLowerCase().includes('failed') ? 'FAILED' : 'SUCCESS' 
      }));
      setLogs(mapped); setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, []);

  const getIcon = (action: string) => {
    const l = action.toLowerCase();
    if (l.includes('identit') || l.includes('login') || l.includes('wallet')) return <Fingerprint className="w-4 h-4" />;
    if (l.includes('upload') || l.includes('encrypt') || l.includes('hash') || l.includes('mint')) return <UploadCloud className="w-4 h-4" />;
    if (l.includes('grant') || l.includes('revok') || l.includes('access')) return <UserCheck className="w-4 h-4" />;
    if (l.includes('denied') || l.includes('fail') || l.includes('tamper')) return <Ban className="w-4 h-4" />;
    return <ShieldCheck className="w-4 h-4" />;
  };

  const filtered = logs.filter(l => {
    const matchesSearch = l.action.toLowerCase().includes(searchQuery.toLowerCase()) || l.actor?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'ALL' || l.status === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="max-w-6xl space-y-6">
      <div className="bg-white rounded-[18px] border border-border-light p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-text-primary">Immutable Audit Trail</h2>
          <p className="text-sm text-text-secondary mt-1">Tamper-evident log of all verifications, access controls, and modifications.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input type="text" placeholder="Search events..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="input-light pl-9 pr-4 py-2 text-sm w-full sm:w-56" />
          </div>
          <div className="relative">
            <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <select value={filterType} onChange={e => setFilterType(e.target.value)} className="input-light pl-9 pr-8 py-2 text-sm appearance-none w-full sm:w-36">
              <option value="ALL">All Events</option>
              <option value="SUCCESS">Success</option>
              <option value="FAILED">Failed / Denied</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[18px] border border-border-light overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 text-text-muted">
            <div className="w-7 h-7 border-2 border-primary border-t-transparent rounded-full animate-spin mb-3"></div>Loading records...
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-text-muted"><Search className="w-10 h-10 mb-3 opacity-30" /><p>No events found.</p></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-[#F7F8FA] border-b border-border-light">
                <tr>
                  <th className="px-6 py-3.5 text-left text-xs font-bold text-text-muted uppercase tracking-wider">Event</th>
                  <th className="px-6 py-3.5 text-left text-xs font-bold text-text-muted uppercase tracking-wider">Actor</th>
                  <th className="px-6 py-3.5 text-left text-xs font-bold text-text-muted uppercase tracking-wider">Timestamp</th>
                  <th className="px-6 py-3.5 text-left text-xs font-bold text-text-muted uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3.5 text-right text-xs font-bold text-text-muted uppercase tracking-wider">Network</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light">
                {filtered.map((log) => (
                  <tr key={log.id} className="hover:bg-[#F7F8FA] transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`p-2 rounded-xl bg-[#F4F6F8] border border-border-light mr-3 ${log.status === 'FAILED' || log.status === 'DENIED' ? 'text-red-500' : 'text-primary'}`}>
                          {getIcon(log.action)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-text-primary">{log.action}</p>
                          {log.assetId && <p className="text-xs text-text-muted font-mono mt-0.5">Asset: {log.assetId}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap"><span className="text-sm font-mono text-text-secondary bg-[#F4F6F8] px-2 py-1 rounded border border-border-light">{log.actor}</span></td>
                    <td className="px-6 py-4 whitespace-nowrap"><div className="flex items-center text-sm text-text-secondary"><Clock className="w-3.5 h-3.5 mr-1.5 text-text-muted" />{new Date(log.timestamp).toLocaleString()}</div></td>
                    <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={log.status === 'SUCCESS' ? 'success' : (log.status === 'PENDING' ? 'warning' : 'danger')} text={log.status} /></td>
                    <td className="px-6 py-4 whitespace-nowrap text-right"><span className="text-xs font-mono bg-emerald-50 border border-emerald-200 text-emerald-600 px-2 py-1 rounded-md">LIVE-NET</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
