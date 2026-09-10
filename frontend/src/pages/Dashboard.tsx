import { useEffect, useState } from 'react';
import { assetService } from '../services/api';
import { Link } from 'react-router-dom';
import { FileText, Share2, Activity, ShieldCheck } from 'lucide-react';

export default function Dashboard() {
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    assetService.getAssets().then(data => {
      setAssets(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="text-gray-400">Loading dashboard...</div>;

  const ownedCount = assets.filter(a => a.accessStatus === 'OWNER').length;
  const sharedCount = assets.filter(a => a.accessStatus === 'SHARED').length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="glass-card p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Total Assets</p>
              <p className="text-3xl font-bold text-white mt-1">{assets.length}</p>
            </div>
            <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg shadow-[0_0_15px_rgba(0,229,255,0.2)]">
              <FileText className="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>
        
        <div className="glass-card p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Owned Assets</p>
              <p className="text-3xl font-bold text-white mt-1">{ownedCount}</p>
            </div>
            <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <ShieldCheck className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </div>

        <div className="glass-card p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Shared Assets</p>
              <p className="text-3xl font-bold text-white mt-1">{sharedCount}</p>
            </div>
            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg shadow-[0_0_15px_rgba(59,130,246,0.2)]">
              <Share2 className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </div>

        <div className="glass-card p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Recent Activity</p>
              <p className="text-3xl font-bold text-white mt-1">4</p>
            </div>
            <div className="p-3 bg-accent/10 border border-accent/20 rounded-lg shadow-[0_0_15px_rgba(176,92,255,0.2)]">
              <Activity className="w-6 h-6 text-accent-light" />
            </div>
          </div>
        </div>
      </div>

      <div className="glass-panel rounded-xl overflow-hidden mt-8">
        <div className="px-6 py-4 border-b border-white/10 bg-white/5">
          <h2 className="text-lg font-medium text-white">Your Assets</h2>
        </div>
        <div className="overflow-x-auto">
          {assets.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No assets found. Upload an asset to get started.
            </div>
          ) : (
            <table className="min-w-full divide-y divide-white/10">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Asset Name</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Access</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {assets.map((asset) => (
                  <tr key={asset.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{asset.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 capitalize">{asset.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded bg-opacity-20 border ${
                        asset.accessStatus === 'OWNER' 
                          ? 'bg-green-500/20 text-green-400 border-green-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]' 
                          : 'bg-blue-500/20 text-blue-400 border-blue-500/30 shadow-[0_0_10px_rgba(59,130,246,0.2)]'
                      }`}>
                        {asset.accessStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded bg-opacity-20 border ${
                        asset.blockchainStatus === 'CONFIRMED' 
                          ? 'bg-primary/20 text-primary border-primary/30 shadow-[0_0_10px_rgba(0,229,255,0.2)]' 
                          : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                      }`}>
                        {asset.blockchainStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link to={`/asset/${asset.id}`} className="text-accent hover:text-accent-light transition-colors shadow-accent/50 drop-shadow-[0_0_5px_rgba(176,92,255,0.5)]">
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
