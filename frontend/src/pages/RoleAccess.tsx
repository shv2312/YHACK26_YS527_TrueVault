import { useState } from 'react';
import { UserCheck, UserX, ShieldAlert } from 'lucide-react';
import { mockRoles } from '../data/mockData';

export default function RoleAccess() {
  const [permissions, setPermissions] = useState([
    { id: 1, user: '0xabc...def1', role: 'VERIFIER', status: 'Active' },
    { id: 2, user: '0x999...8882', role: 'OFFICIAL', status: 'Active' },
  ]);

  const revokeAccess = (id: number) => {
    setPermissions(permissions.filter(p => p.id !== id));
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-lg flex items-start backdrop-blur-md shadow-[0_0_15px_rgba(245,158,11,0.1)]">
        <ShieldAlert className="w-5 h-5 text-yellow-400 mr-3 mt-0.5 drop-shadow-[0_0_5px_rgba(245,158,11,0.5)]" />
        <div>
          <h3 className="text-sm font-bold text-yellow-400 tracking-wide">Role-Based Access Control Active</h3>
          <p className="text-sm text-yellow-200/70 mt-1">
            Roles (ADMIN, OWNER, OFFICIAL, VERIFIER) are strictly enforced by the backend using secure session tokens. The frontend UI does not authorize access. Final authorization is enforced by the backend and smart contract.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 glass-panel p-6 rounded-xl">
          <h3 className="text-lg font-bold text-white mb-6 border-b border-white/10 pb-3">Grant Access</h3>
          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">User Wallet</label>
              <input type="text" placeholder="0x..." className="w-full glass-input px-4 py-2.5 rounded-md" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Assign Role</label>
              <select className="w-full glass-input px-4 py-2.5 rounded-md [&>option]:text-black">
                {mockRoles.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            <button className="w-full flex justify-center items-center px-4 py-3 glass-button text-white font-bold tracking-wide rounded-md mt-4">
               <UserCheck className="w-5 h-5 mr-2" /> Grant Permission
            </button>
          </form>
        </div>

        <div className="md:col-span-2 glass-panel rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/10 bg-white/5">
            <h3 className="text-lg font-bold text-white tracking-wide">Current Permissions</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/10">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">User Wallet</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Assigned Role</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {permissions.map((p) => (
                  <tr key={p.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-5 whitespace-nowrap text-sm font-mono text-gray-300">{p.user}</td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm font-bold text-primary drop-shadow-[0_0_5px_rgba(0,229,255,0.3)]">{p.role}</td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm text-green-400 font-medium">{p.status}</td>
                    <td className="px-6 py-5 whitespace-nowrap text-right text-sm">
                      <button onClick={() => revokeAccess(p.id)} className="text-red-400 hover:text-red-300 flex items-center justify-end w-full transition-colors font-medium">
                        <UserX className="w-4 h-4 mr-1" /> Revoke
                      </button>
                    </td>
                  </tr>
                ))}
                {permissions.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-gray-500">No external permissions granted.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
