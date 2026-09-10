import { useState } from 'react';
import { UserCheck, UserX, ShieldAlert, AlertTriangle } from 'lucide-react';
import { mockRoles } from '../data/mockData';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { StatusBadge } from '../components/ui/StatusBadge';

export default function RoleAccess() {
  const [permissions, setPermissions] = useState([
    { id: 1, user: '0xabc...def1', role: 'VERIFIER', status: 'Active', date: '2026-09-08', by: 'ADMIN' },
    { id: 2, user: '0x999...8882', role: 'OFFICIAL', status: 'Active', date: '2026-09-09', by: 'OWNER' },
  ]);

  const [wallet, setWallet] = useState('');
  const [role, setRole] = useState(mockRoles[0]);
  const [loading, setLoading] = useState(false);
  const [showRevokeConfirm, setShowRevokeConfirm] = useState<number | null>(null);

  const handleGrant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wallet) return;
    setLoading(true);
    setTimeout(() => {
      setPermissions([...permissions, { 
        id: Date.now(), 
        user: wallet, 
        role: role, 
        status: 'Active',
        date: new Date().toISOString().split('T')[0],
        by: 'Current Session'
      }]);
      setWallet('');
      setLoading(false);
    }, 1000);
  };

  const executeRevoke = (id: number) => {
    setPermissions(permissions.filter(p => p.id !== id));
    setShowRevokeConfirm(null);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      <div className="bg-yellow-500/10 border border-yellow-500/30 p-5 rounded-xl flex items-start backdrop-blur-md">
        <ShieldAlert className="w-6 h-6 text-yellow-400 mr-4 mt-0.5 shrink-0" />
        <div>
          <h3 className="text-base font-bold text-yellow-400 tracking-wide">Role-Based Access Control Active</h3>
          <p className="text-sm text-yellow-200/80 mt-1.5 leading-relaxed">
            Final authorization is enforced by the backend and smart contract. The frontend UI does not authorize access on its own. Only administrative actions appropriate to your current session role are displayed here. Hiding a button does not provide security.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Grant Form */}
        <div className="lg:col-span-1">
          <GlassCard className="p-6">
            <h3 className="text-lg font-bold text-white mb-6 border-b border-white/10 pb-4">Grant Access</h3>
            
            <form className="space-y-6" onSubmit={handleGrant}>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">User Wallet Address</label>
                <input 
                  type="text" 
                  value={wallet}
                  onChange={e => setWallet(e.target.value)}
                  placeholder="0x..." 
                  className="w-full glass-input px-4 py-3 rounded-lg font-mono text-sm" 
                  required
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Assign Role</label>
                <select 
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  className="w-full glass-input px-4 py-3 rounded-lg [&>option]:text-black appearance-none font-medium"
                >
                  {mockRoles.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
                <div className="mt-3 p-3 bg-black/30 rounded border border-white/5">
                  <p className="text-xs text-gray-400 leading-relaxed">
                    {role === 'ADMIN' && 'Full administrative rights. Can modify permissions.'}
                    {role === 'OWNER' && 'Full control over their own uploaded assets.'}
                    {role === 'OFFICIAL' && 'Read-only access to encrypted assets and audits.'}
                    {role === 'VERIFIER' && 'Can only verify hashes. Cannot access files.'}
                  </p>
                </div>
              </div>
              
              <Button type="submit" isLoading={loading} className="w-full py-4 mt-2">
                 <UserCheck className="w-5 h-5 mr-2" /> Issue Permission
              </Button>
            </form>
          </GlassCard>
        </div>

        {/* Permissions Table */}
        <div className="lg:col-span-2">
          <GlassCard className="overflow-hidden h-full flex flex-col">
            <div className="px-6 py-5 border-b border-white/10 bg-black/20">
              <h3 className="text-lg font-bold text-white tracking-wide">Granted Permissions</h3>
            </div>
            
            <div className="overflow-x-auto flex-1">
              <table className="min-w-full divide-y divide-white/5">
                <thead className="bg-black/40">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">User Wallet</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Role & Details</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {permissions.map((p) => (
                    <tr key={p.id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-6 py-5 whitespace-nowrap text-sm font-mono text-gray-300">{p.user}</td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="text-sm font-bold text-primary mb-1">{p.role}</div>
                        <div className="text-xs text-gray-500">By: {p.by} on {p.date}</div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <StatusBadge status="success" text={p.status} />
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-right text-sm relative">
                        {showRevokeConfirm === p.id ? (
                          <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center bg-black/90 p-2 rounded-lg border border-red-500/30 shadow-lg">
                            <span className="text-xs text-red-400 mr-3 flex items-center"><AlertTriangle className="w-3 h-3 mr-1"/> Confirm?</span>
                            <button onClick={() => executeRevoke(p.id)} className="px-3 py-1 bg-red-500 text-white rounded text-xs font-bold mr-2 hover:bg-red-600 transition-colors">Yes</button>
                            <button onClick={() => setShowRevokeConfirm(null)} className="px-3 py-1 bg-gray-700 text-white rounded text-xs hover:bg-gray-600 transition-colors">Cancel</button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => setShowRevokeConfirm(p.id)} 
                            className="text-red-400 hover:text-red-300 flex items-center justify-end w-full transition-colors font-medium px-3 py-2 rounded hover:bg-red-500/10"
                          >
                            <UserX className="w-4 h-4 mr-2" /> Revoke
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {permissions.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-16 text-center">
                        <div className="flex flex-col items-center justify-center text-gray-500">
                          <UserX className="w-10 h-10 mb-3 opacity-30" />
                          <p>No external permissions have been granted.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
