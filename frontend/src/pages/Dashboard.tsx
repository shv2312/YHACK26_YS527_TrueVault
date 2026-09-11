import { useEffect, useState } from 'react';
import { assetService } from '../services/api';
import { Link } from 'react-router-dom';
import { FileText, Share2, Activity, ShieldCheck, Search, Filter, Fingerprint, LockKeyhole, Cpu } from 'lucide-react';
import { StatusBadge } from '../components/ui/StatusBadge';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { institutionName, role, walletAddress } = useAuth();
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    assetService.getAssets().then(data => {
      setAssets(data); setLoading(false);
    }).catch(() => { setError('Failed to fetch assets'); setLoading(false); });
  }, []);

  const ownedCount = assets.filter(a => a.accessStatus === 'OWNER').length;
  const sharedCount = assets.filter(a => a.accessStatus === 'SHARED').length;
  const pendingCount = assets.filter(a => a.blockchainStatus === 'PENDING').length;

  const filteredAssets = assets.filter(a => {
    const matchesSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || a.blockchainStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 max-w-6xl">

      {/* Identity Summary Card */}
      <div className="bg-white rounded-[18px] border border-border-light p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-primary/8 flex items-center justify-center shrink-0">
            <Fingerprint className="w-7 h-7 text-primary" />
          </div>
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <h2 className="text-lg font-bold text-text-primary">{institutionName}</h2>
              <StatusBadge status="success" text="Verified Identity" />
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm text-text-secondary">
              <span className="flex items-center"><LockKeyhole className="w-3.5 h-3.5 mr-1 text-primary" /> Role: <strong className="text-text-primary ml-1">{role}</strong></span>
              <span className="font-mono bg-[#F4F6F8] px-2 py-0.5 rounded text-xs border border-border-light">{walletAddress}</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="bg-[#F7F8FA] p-3 rounded-xl border border-border-light">
            <span className="text-text-muted uppercase tracking-wider block mb-0.5 text-[10px] font-bold">Biometric</span>
            <span className="text-amber-600 font-semibold">Simulated</span>
          </div>
          <div className="bg-[#F7F8FA] p-3 rounded-xl border border-border-light">
            <span className="text-text-muted uppercase tracking-wider block mb-0.5 text-[10px] font-bold">Blockchain</span>
            <span className="text-emerald-600 font-semibold">Live Network</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: 'Total Assets', value: assets.length, icon: FileText, color: 'text-primary', bg: 'bg-primary/8' },
          { label: 'Owned Assets', value: ownedCount, icon: ShieldCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Shared Assets', value: sharedCount, icon: Share2, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Pending Tx', value: pendingCount, icon: Cpu, color: 'text-amber-600', bg: 'bg-amber-50' }
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-[16px] border border-border-light p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-text-primary">{loading ? '-' : stat.value}</p>
              </div>
              <div className={`p-3 rounded-2xl ${stat.bg}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Asset Table */}
      <div className="bg-white rounded-[18px] border border-border-light overflow-hidden">
        <div className="px-6 py-5 border-b border-border-light flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-lg font-bold text-text-primary">Secure Asset Vault</h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input type="text" placeholder="Search assets..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                className="input-light pl-9 pr-4 py-2 text-sm w-full sm:w-56" />
            </div>
            <div className="relative">
              <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                className="input-light pl-9 pr-8 py-2 text-sm appearance-none w-full sm:w-auto">
                <option value="ALL">All Status</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="PENDING">Pending</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto min-h-[280px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 text-text-muted">
              <div className="w-7 h-7 border-2 border-primary border-t-transparent rounded-full animate-spin mb-3"></div>
              Loading assets...
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-64 text-red-500">
              <Activity className="w-10 h-10 mb-3 opacity-40" /> {error}
            </div>
          ) : filteredAssets.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-text-muted">
              <FileText className="w-10 h-10 mb-3 opacity-30" />
              <p>No assets found.</p>
            </div>
          ) : (
            <table className="min-w-full">
              <thead className="bg-[#F7F8FA] border-b border-border-light">
                <tr>
                  <th className="px-6 py-3.5 text-left text-xs font-bold text-text-muted uppercase tracking-wider">Asset Name</th>
                  <th className="px-6 py-3.5 text-left text-xs font-bold text-text-muted uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3.5 text-left text-xs font-bold text-text-muted uppercase tracking-wider">Access Level</th>
                  <th className="px-6 py-3.5 text-left text-xs font-bold text-text-muted uppercase tracking-wider">Blockchain Status</th>
                  <th className="px-6 py-3.5 text-right text-xs font-bold text-text-muted uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light">
                {filteredAssets.map((asset) => (
                  <tr key={asset.id} className="hover:bg-[#F7F8FA] transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-text-primary">{asset.name}</div>
                      <div className="text-xs text-text-muted font-mono mt-0.5">{asset.fileHash.substring(0, 16)}...</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary capitalize">{asset.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={asset.accessStatus === 'OWNER' ? 'success' : 'info'} text={asset.accessStatus} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={asset.blockchainStatus === 'CONFIRMED' ? 'success' : 'warning'} text={asset.blockchainStatus} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <Link to={`/asset/${asset.id}`} className="text-sm font-semibold text-primary hover:text-primary-dark transition-colors px-3 py-1.5 rounded-lg bg-primary/8 hover:bg-primary/15">
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
