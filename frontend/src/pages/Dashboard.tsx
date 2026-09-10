import { useEffect, useState } from 'react';
import { assetService } from '../services/api';
import { Link } from 'react-router-dom';
import { FileText, Share2, Activity, ShieldCheck, Search, Filter, Fingerprint, LockKeyhole, Cpu } from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
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
      setAssets(data);
      setLoading(false);
    }).catch(() => {
      setError('Failed to fetch assets');
      setLoading(false);
    });
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
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Identity Summary Card */}
      <GlassCard className="p-6 border-primary/20">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-black/40 border border-primary/30 flex items-center justify-center shrink-0">
              <Fingerprint className="w-8 h-8 text-primary drop-shadow-[0_0_8px_rgba(0,229,255,0.5)]" />
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <h2 className="text-xl font-bold text-white tracking-wide">{institutionName}</h2>
                <StatusBadge status="success" text="Verified Identity" />
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400">
                <span className="flex items-center"><LockKeyhole className="w-4 h-4 mr-1 text-accent" /> Role: <strong className="text-white ml-1">{role}</strong></span>
                <span className="hidden md:inline">•</span>
                <span className="font-mono bg-black/30 px-2 py-0.5 rounded border border-white/10">{walletAddress}</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="bg-black/30 p-3 rounded-lg border border-white/5">
              <span className="text-gray-500 uppercase tracking-wider block mb-1">Biometric Mode</span>
              <span className="text-yellow-400 font-medium">Simulated</span>
            </div>
            <div className="bg-black/30 p-3 rounded-lg border border-white/5">
              <span className="text-gray-500 uppercase tracking-wider block mb-1">Blockchain Mode</span>
              <span className="text-primary font-medium">Demo / Local</span>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Assets', value: assets.length, icon: FileText, color: 'text-primary', bg: 'bg-primary/10 border-primary/20' },
          { label: 'Owned Assets', value: ownedCount, icon: ShieldCheck, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
          { label: 'Shared Assets', value: sharedCount, icon: Share2, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
          { label: 'Pending Tx', value: pendingCount, icon: Cpu, color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' }
        ].map(stat => (
          <GlassCard key={stat.label} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">{stat.label}</p>
                <p className="text-3xl font-bold text-white mt-1">{loading ? '-' : stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg border shadow-lg ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Assets Table */}
      <GlassCard className="overflow-hidden">
        <div className="px-6 py-5 border-b border-white/10 bg-black/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-lg font-bold text-white tracking-wide">Secure Asset Vault</h3>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input 
                type="text" 
                placeholder="Search assets..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="glass-input pl-9 pr-4 py-2 text-sm rounded-md w-full sm:w-64"
              />
            </div>
            <div className="relative">
              <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <select 
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="glass-input pl-9 pr-8 py-2 text-sm rounded-md appearance-none [&>option]:text-black w-full sm:w-auto"
              >
                <option value="ALL">All Status</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="PENDING">Pending</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto min-h-[300px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
              Loading secure vault...
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-64 text-red-400">
              <Activity className="w-12 h-12 mb-4 opacity-50" />
              {error}
            </div>
          ) : filteredAssets.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <FileText className="w-12 h-12 mb-4 opacity-30" />
              <p>No assets found matching your criteria.</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-white/5">
              <thead className="bg-black/40">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Asset Name</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Access Level</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Blockchain Status</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredAssets.map((asset) => (
                  <tr key={asset.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-white">{asset.name}</div>
                      <div className="text-xs text-gray-500 font-mono mt-0.5" title={asset.fileHash}>
                        {asset.fileHash.substring(0, 16)}...
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 capitalize">{asset.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge 
                        status={asset.accessStatus === 'OWNER' ? 'success' : 'info'} 
                        text={asset.accessStatus} 
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge 
                        status={asset.blockchainStatus === 'CONFIRMED' ? 'success' : 'warning'} 
                        text={asset.blockchainStatus} 
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link to={`/asset/${asset.id}`} className="text-primary hover:text-primary-light transition-colors px-3 py-1.5 rounded bg-primary/10 hover:bg-primary/20 border border-primary/20">
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </GlassCard>
    </div>
  );
}
