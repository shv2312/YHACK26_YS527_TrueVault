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
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md flex items-start">
        <ShieldAlert className="w-5 h-5 text-yellow-500 mr-3 mt-0.5" />
        <div>
          <h3 className="text-sm font-medium text-yellow-800">Role-Based Access Control Active</h3>
          <p className="text-sm text-yellow-700 mt-1">
            Roles (ADMIN, OWNER, OFFICIAL, VERIFIER) are strictly enforced by the backend using secure session tokens. The frontend UI does not authorize access.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Grant Access</h3>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">User Wallet</label>
              <input type="text" placeholder="0x..." className="w-full px-3 py-2 border border-gray-300 rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Assign Role</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                {mockRoles.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            <button className="w-full flex justify-center items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-light">
               <UserCheck className="w-4 h-4 mr-2" /> Grant Permission
            </button>
          </form>
        </div>

        <div className="md:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Current Permissions</h3>
          </div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User Wallet</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {permissions.map((p) => (
                <tr key={p.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{p.user}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-700">{p.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">{p.status}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <button onClick={() => revokeAccess(p.id)} className="text-red-500 hover:text-red-700 flex items-center justify-end w-full">
                      <UserX className="w-4 h-4 mr-1" /> Revoke
                    </button>
                  </td>
                </tr>
              ))}
              {permissions.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">No external permissions granted.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
