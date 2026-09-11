import { useState } from 'react';
import { UserCheck, UserX, ShieldAlert, AlertTriangle } from 'lucide-react';
import { mockRoles } from '../data/mockData';
import { Button } from '../components/ui/Button';
import { StatusBadge } from '../components/ui/StatusBadge';

export default function RoleAccess() {
  const [permissions] = useState<any[]>([]);
  const [wallet, setWallet] = useState('');
  const [role, setRole] = useState(mockRoles[0]);
  const [showRevokeConfirm, setShowRevokeConfirm] = useState<number | null>(null);

  const handleGrant = (e: React.FormEvent) => {
    e.preventDefault(); 
    alert("Role assignment is temporarily disabled pending smart contract upgrade.");
  };

  const executeRevoke = () => { 
    alert("Role revocation is temporarily disabled pending smart contract upgrade.");
    setShowRevokeConfirm(null); 
  };

  const roleDescs: Record<string, string> = { ADMIN: 'Full administrative rights.', OWNER: 'Full control over uploaded assets.', OFFICIAL: 'Read-only access to assets.', VERIFIER: 'Verify hashes only.' };

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="bg-amber-50 border border-amber-200 p-5 rounded-[16px] flex items-start">
        <ShieldAlert className="w-5 h-5 text-amber-600 mr-3 mt-0.5 shrink-0" />
        <div>
          <h3 className="text-sm font-bold text-amber-800">Role-Based Access Control Active</h3>
          <p className="text-sm text-amber-700 mt-1 leading-relaxed">Final authorization is enforced by the backend and smart contract. The frontend does not authorize access independently.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-[18px] border border-border-light p-6">
            <h3 className="text-lg font-bold text-text-primary mb-5 border-b border-border-light pb-4">Grant Access</h3>
            <form className="space-y-5" onSubmit={handleGrant}>
              <div><label className="block text-sm font-medium text-text-primary mb-1.5">Wallet Address</label><input type="text" value={wallet} onChange={e => setWallet(e.target.value)} placeholder="0x..." className="input-light font-mono text-sm" required /></div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">Assign Role</label>
                <select value={role} onChange={e => setRole(e.target.value)} className="input-light appearance-none">{mockRoles.map(r => <option key={r} value={r}>{r}</option>)}</select>
                <div className="mt-2 p-3 bg-[#F7F8FA] rounded-xl border border-border-light"><p className="text-xs text-text-secondary">{roleDescs[role]}</p></div>
              </div>
              <Button type="submit" disabled={true} className="w-full" size="lg"><UserCheck className="w-4 h-4 mr-2" /> Issue Permission (Disabled)</Button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-[18px] border border-border-light overflow-hidden h-full flex flex-col">
            <div className="px-6 py-5 border-b border-border-light"><h3 className="text-lg font-bold text-text-primary">Granted Permissions</h3></div>
            <div className="overflow-x-auto flex-1">
              <table className="min-w-full">
                <thead className="bg-[#F7F8FA] border-b border-border-light">
                  <tr>
                    <th className="px-6 py-3.5 text-left text-xs font-bold text-text-muted uppercase tracking-wider">Wallet</th>
                    <th className="px-6 py-3.5 text-left text-xs font-bold text-text-muted uppercase tracking-wider">Role & Details</th>
                    <th className="px-6 py-3.5 text-left text-xs font-bold text-text-muted uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3.5 text-right text-xs font-bold text-text-muted uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-light">
                  {permissions.map((p) => (
                    <tr key={p.id} className="hover:bg-[#F7F8FA] transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-text-secondary">{p.user}</td>
                      <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-bold text-primary mb-0.5">{p.role}</div><div className="text-xs text-text-muted">By: {p.by} on {p.date}</div></td>
                      <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status="success" text={p.status} /></td>
                      <td className="px-6 py-4 whitespace-nowrap text-right relative">
                        {showRevokeConfirm === p.id ? (
                          <div className="inline-flex items-center bg-white p-2 rounded-xl border border-red-200 shadow-lg">
                            <span className="text-xs text-red-600 mr-2 flex items-center"><AlertTriangle className="w-3 h-3 mr-1" /> Confirm?</span>
                            <button onClick={() => executeRevoke()} className="px-3 py-1 bg-red-500 text-white rounded-lg text-xs font-bold mr-1.5 hover:bg-red-600">Yes</button>
                            <button onClick={() => setShowRevokeConfirm(null)} className="px-3 py-1 bg-gray-100 text-text-primary rounded-lg text-xs hover:bg-gray-200">Cancel</button>
                          </div>
                        ) : (
                          <button onClick={() => setShowRevokeConfirm(p.id)} disabled className="opacity-50 cursor-not-allowed text-red-500 flex items-center justify-end w-full font-medium text-sm px-3 py-1.5 rounded-lg transition-colors">
                            <UserX className="w-4 h-4 mr-1.5" /> Revoke
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {permissions.length === 0 && <tr><td colSpan={4} className="px-6 py-14 text-center text-text-muted"><UserX className="w-8 h-8 mx-auto mb-2 opacity-30" />No external permissions.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
