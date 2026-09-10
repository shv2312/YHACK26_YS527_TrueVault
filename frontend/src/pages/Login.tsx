import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { institutions, type Institution, type Role } from '../config/institutions';
import { Shield, Fingerprint, Wallet, ChevronRight, ArrowLeft, Landmark, GraduationCap, Building2, Scale } from 'lucide-react';
import { authService } from '../services/api';

const iconMap: Record<string, React.ElementType> = {
  Landmark, GraduationCap, Building2, Scale
};

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [step, setStep] = useState(1);
  const [selectedInst, setSelectedInst] = useState<Institution | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [credId, setCredId] = useState('');
  const [password, setPassword] = useState('');
  const [wallet, setWallet] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleBack = () => {
    setError('');
    setStep(s => Math.max(1, s - 1));
  };

  const handleInstSelect = (inst: Institution) => {
    setSelectedInst(inst);
    setSelectedRole(null);
    setStep(2);
  };

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    setStep(3);
  };

  const handleCredsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!credId || !password) {
      setError('Both fields are required');
      return;
    }
    setError('');
    setStep(4);
  };

  const handleWalletConnect = () => {
    setLoading(true);
    setTimeout(() => {
      setWallet('0x71C...976F');
      setLoading(false);
    }, 1000);
  };

  const handleWalletNext = () => {
    if (!wallet) return;
    setStep(5);
  };

  const handleBiometric = () => {
    setLoading(true);
    setTimeout(async () => {
      try {
        await authService.login(wallet || '0xDemo', password);
        login(selectedInst?.name || 'Unknown', selectedRole || 'VERIFIER', wallet || '0xDemo');
        navigate('/');
      } catch (err) {
        setError('Login failed during biometric verification');
        setLoading(false);
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary rounded-full mix-blend-screen filter blur-[120px] opacity-20"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-accent rounded-full mix-blend-screen filter blur-[120px] opacity-20"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center mb-8">
        <Shield className="w-16 h-16 text-primary mx-auto drop-shadow-[0_0_15px_rgba(0,229,255,0.5)]" />
        <h2 className="mt-6 text-3xl font-extrabold text-white tracking-tight">
          TrueVault
        </h2>
        <p className="mt-2 text-sm text-[var(--color-primary-light)]">
          Secure Decentralized Identity and Digital Asset Protection
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-xl relative z-10">
        <div className="glass-panel py-8 px-6 shadow-2xl sm:rounded-xl sm:px-10">
          
          {step > 1 && (
            <button onClick={handleBack} className="flex items-center text-sm text-gray-400 hover:text-white transition-colors mb-6">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back
            </button>
          )}

          {error && (
            <div className="mb-4 p-3 rounded bg-red-500/20 border border-red-500/50 text-red-200 text-sm">
              {error}
            </div>
          )}

          {/* STEP 1: Institution Selection */}
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-lg font-medium text-white mb-4">Select Institution</h3>
              <div className="space-y-3">
                {institutions.map(inst => {
                  const Icon = iconMap[inst.icon] || Shield;
                  return (
                    <button
                      key={inst.id}
                      onClick={() => handleInstSelect(inst)}
                      className="w-full text-left glass-card p-4 rounded-lg flex items-center group cursor-pointer"
                    >
                      <div className="p-2 bg-primary/10 rounded border border-primary/20 group-hover:bg-primary/20 transition-colors mr-4">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="text-white font-medium">{inst.name}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{inst.description}</div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-primary transition-colors" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: Role Selection */}
          {step === 2 && selectedInst && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="mb-6 pb-4 border-b border-white/10">
                <span className="text-xs text-gray-400 uppercase tracking-wider">Institution</span>
                <div className="text-white font-medium mt-1">{selectedInst.name}</div>
              </div>
              <h3 className="text-lg font-medium text-white mb-4">Select Role</h3>
              <div className="grid grid-cols-2 gap-3">
                {selectedInst.allowedRoles.map(role => (
                  <button
                    key={role}
                    onClick={() => handleRoleSelect(role)}
                    className="glass-card p-4 rounded-lg text-center hover:border-primary transition-colors"
                  >
                    <div className="text-primary font-bold tracking-wider mb-1">{role}</div>
                    <div className="text-xs text-gray-400">Access Level</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: Credentials */}
          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="mb-6 pb-4 border-b border-white/10 flex justify-between">
                <div>
                  <span className="text-xs text-gray-400 uppercase tracking-wider">Institution</span>
                  <div className="text-white font-medium mt-1 text-sm">{selectedInst?.name}</div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-400 uppercase tracking-wider">Role</span>
                  <div className="text-primary font-medium mt-1 text-sm">{selectedRole}</div>
                </div>
              </div>
              <h3 className="text-lg font-medium text-white mb-4">Enter Credentials</h3>
              <form onSubmit={handleCredsSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Institution ID or Official Email</label>
                  <input
                    type="text"
                    value={credId}
                    onChange={e => setCredId(e.target.value)}
                    className="w-full glass-input px-3 py-2 rounded-md"
                    placeholder="Enter ID"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full glass-input px-3 py-2 rounded-md"
                    placeholder="••••••••"
                  />
                </div>
                <button type="submit" className="w-full glass-button text-white font-medium py-2.5 rounded-md mt-6">
                  Verify Credentials
                </button>
              </form>
            </div>
          )}

          {/* STEP 4: Wallet Verification */}
          {step === 4 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 text-center">
              <Wallet className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">Wallet Connection</h3>
              <p className="text-sm text-gray-400 mb-6">Connect your Web3 wallet to verify cryptographic identity.</p>
              
              {!wallet ? (
                <button 
                  onClick={handleWalletConnect} 
                  disabled={loading}
                  className="w-full glass-button text-white font-medium py-3 rounded-md mb-4 flex items-center justify-center"
                >
                  {loading ? 'Connecting...' : 'Demo Wallet Connection'}
                </button>
              ) : (
                <div className="mb-6 p-4 glass-card rounded-md border-green-500/30 flex items-center justify-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 shadow-[0_0_8px_#10b981]"></div>
                  <span className="text-white font-mono">{wallet}</span>
                </div>
              )}
              
              <button 
                onClick={handleWalletNext} 
                disabled={!wallet}
                className="w-full glass-button text-white font-medium py-2.5 rounded-md mt-2 disabled:opacity-50"
              >
                Continue Verification
              </button>
            </div>
          )}

          {/* STEP 5: Biometric Verification */}
          {step === 5 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 text-center py-4">
              <div className="relative inline-block mb-6">
                <Fingerprint className={`w-20 h-20 mx-auto transition-colors duration-1000 ${loading ? 'text-primary animate-pulse' : 'text-gray-500'}`} />
                {loading && <div className="absolute top-0 left-0 w-full h-1 bg-primary/50 blur-[2px] animate-[scan_1.5s_ease-in-out_infinite]"></div>}
              </div>
              
              <h3 className="text-lg font-medium text-white mb-2">Biometric Authorization</h3>
              <p className="text-xs text-yellow-400 mb-8 border border-yellow-500/20 bg-yellow-500/10 p-2 rounded">
                Biometric verification is simulated for prototype demonstration and does not represent real biometric authentication.
              </p>

              <button 
                onClick={handleBiometric} 
                disabled={loading}
                className="w-full glass-button text-white font-medium py-3 rounded-md flex items-center justify-center"
              >
                {loading ? 'Verifying Identity...' : 'Initiate Demo Biometric Scan'}
              </button>
            </div>
          )}

        </div>
      </div>
      
      {/* CSS Animation for scanner */}
      <style>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
}
