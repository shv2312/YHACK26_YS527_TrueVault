import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { institutions, type Institution, type Role } from '../config/institutions';
import { Shield, Fingerprint, Wallet, ChevronRight, ArrowLeft, Landmark, GraduationCap, Building2, Scale, CheckCircle2, LockKeyhole } from 'lucide-react';
import { authService } from '../services/api';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';

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
  const [biometricType, setBiometricType] = useState<'fingerprint' | 'iris'>('fingerprint');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleBack = () => {
    setError('');
    setPassword(''); // Never retain password
    setStep(s => Math.max(1, s - 1));
  };

  const handleChangeInstitution = () => {
    setPassword('');
    setCredId('');
    setSelectedRole(null);
    setSelectedInst(null);
    setStep(1);
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
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (credId.includes('@') && !emailRegex.test(credId)) {
      setError('Invalid email format');
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

  const handleBiometric = (simulateFailure = false) => {
    setLoading(true);
    setError('');
    setTimeout(async () => {
      if (simulateFailure) {
        setError('Biometric match failed. Please try again.');
        setLoading(false);
        return;
      }
      try {
        await authService.login(credId, password);
        login(selectedInst?.name || 'Unknown', selectedRole || 'VERIFIER', wallet || '0xDemo');
        navigate('/dashboard');
      } catch (err) {
        setError('Login failed. Demo authentication used.');
        // If backend fails, use demo fallback as requested
        login(selectedInst?.name || 'Unknown', selectedRole || 'VERIFIER', wallet || '0xDemo');
        navigate('/dashboard');
      }
    }, 2000);
  };

  const steps = [
    { id: 1, name: 'Institution' },
    { id: 2, name: 'Role' },
    { id: 3, name: 'Credentials' },
    { id: 4, name: 'Wallet' },
    { id: 5, name: 'Verification' },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[var(--color-bg-navy)]">
      
      {/* Left Column - Information & Progress */}
      <div className="w-full md:w-5/12 lg:w-1/3 p-8 lg:p-12 flex flex-col border-b md:border-b-0 md:border-r border-white/10 bg-black/20">
        <div className="flex items-center space-x-3 mb-16">
          <Shield className="w-8 h-8 text-primary" />
          <span className="text-xl font-bold tracking-tight text-white">TrueVault</span>
        </div>

        <div className="flex-1">
          <h1 className="text-3xl font-bold text-white mb-4">Secure Access Protocol</h1>
          <p className="text-gray-400 mb-12 leading-relaxed text-sm">
            TrueVault protects institutional assets through strict multi-factor authentication, cryptographic wallets, and role-based access control. Follow the verification steps to access your vault.
          </p>

          <div className="space-y-6">
            {steps.map((s) => (
              <div key={s.id} className="flex items-center group">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 mr-4 transition-colors ${
                  step > s.id 
                    ? 'bg-primary border-primary text-black' 
                    : step === s.id 
                      ? 'border-primary text-primary' 
                      : 'border-gray-600 text-gray-600'
                }`}>
                  {step > s.id ? <CheckCircle2 className="w-5 h-5" /> : <span className="text-xs font-bold">{s.id}</span>}
                </div>
                <span className={`font-medium ${step >= s.id ? 'text-white' : 'text-gray-500'}`}>{s.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-auto pt-8">
          <Link to="/" className="text-sm text-gray-500 hover:text-white flex items-center">
            <ArrowLeft className="w-4 h-4 mr-2" /> Return to Homepage
          </Link>
        </div>
      </div>

      {/* Right Column - Active Card */}
      <div className="w-full md:w-7/12 lg:w-2/3 flex items-center justify-center p-6 lg:p-12 relative overflow-hidden">
        
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="w-full max-w-xl relative z-10">
          <GlassCard className="p-8 sm:p-10">
            
            {step > 1 && (
              <div className="flex justify-between items-center mb-6">
                <button onClick={handleBack} className="flex items-center text-sm text-gray-400 hover:text-white transition-colors">
                  <ArrowLeft className="w-4 h-4 mr-1" /> Back
                </button>
                {step > 1 && step < 5 && (
                  <button onClick={handleChangeInstitution} className="text-xs text-primary hover:text-primary-light">
                    Change Institution
                  </button>
                )}
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-start">
                <Shield className="w-4 h-4 mr-2 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* STEP 1: Institution Selection */}
            {step === 1 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <h2 className="text-2xl font-bold text-white mb-2">Select Institution</h2>
                <p className="text-gray-400 text-sm mb-6">Choose your authorized organizational domain.</p>
                
                <div className="space-y-3">
                  {institutions.map(inst => {
                    const Icon = iconMap[inst.icon] || Shield;
                    return (
                      <button
                        key={inst.id}
                        onClick={() => handleInstSelect(inst)}
                        className="w-full text-left p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-primary/50 transition-all flex items-center group"
                      >
                        <div className="p-2.5 bg-black/30 rounded-lg mr-4 group-hover:text-primary transition-colors">
                          <Icon className="w-6 h-6 text-gray-300 group-hover:text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="text-white font-medium">{inst.name}</div>
                          <div className="text-xs text-gray-400 mt-0.5">{inst.description}</div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-primary transition-colors" />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 2: Role Selection */}
            {step === 2 && selectedInst && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <h2 className="text-2xl font-bold text-white mb-2">Select Role</h2>
                <p className="text-gray-400 text-sm mb-6">Specify your access level for {selectedInst.name}.</p>
                
                <div className="space-y-3">
                  {selectedInst.allowedRoles.map(role => (
                    <button
                      key={role}
                      onClick={() => handleRoleSelect(role)}
                      className="w-full text-left p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-primary/50 transition-all"
                    >
                      <div className="text-primary font-bold tracking-wide mb-1">{role}</div>
                      <div className="text-xs text-gray-400">
                        {role === 'ADMIN' && 'Manage institutional users, roles and audit visibility'}
                        {role === 'OWNER' && 'Upload assets and manage their permissions'}
                        {role === 'OFFICIAL' && 'Access assigned institutional assets'}
                        {role === 'VERIFIER' && 'Verify ownership and integrity without modifying assets'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 3: Credentials */}
            {step === 3 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex items-center space-x-2 text-xs font-mono text-primary mb-4 p-2 bg-primary/10 rounded border border-primary/20">
                  <LockKeyhole className="w-4 h-4" />
                  <span>{selectedInst?.name} // {selectedRole}</span>
                </div>
                
                <h2 className="text-2xl font-bold text-white mb-6">Authentication</h2>
                
                <form onSubmit={handleCredsSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Institution ID or Official Email</label>
                    <input
                      type="text"
                      value={credId}
                      onChange={e => setCredId(e.target.value)}
                      className="w-full glass-input px-4 py-3 rounded-lg"
                      placeholder="e.g. user@institution.gov"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="w-full glass-input px-4 py-3 rounded-lg pr-12"
                        placeholder="Enter secure password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 hover:text-white"
                      >
                        {showPassword ? 'Hide' : 'Show'}
                      </button>
                    </div>
                  </div>
                  <Button type="submit" className="w-full py-3.5 mt-4">Verify Credentials</Button>
                </form>
              </div>
            )}

            {/* STEP 4: Wallet Verification */}
            {step === 4 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <h2 className="text-2xl font-bold text-white mb-2">Wallet Connection</h2>
                <p className="text-gray-400 text-sm mb-8">Verify your cryptographic identity via Web3 wallet.</p>
                
                <div className="p-6 border border-white/10 rounded-xl bg-black/20 text-center mb-6">
                  <Wallet className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  
                  {!wallet ? (
                    <div className="space-y-4">
                      <Button onClick={() => {}} disabled variant="secondary" className="w-full py-3 opacity-50 cursor-not-allowed">
                        Connect MetaMask (Coming Soon)
                      </Button>
                      <div className="text-xs text-gray-500 my-2">OR</div>
                      <Button onClick={handleWalletConnect} isLoading={loading} className="w-full py-3">
                        Use Demo Wallet
                      </Button>
                      <p className="text-xs text-yellow-500 mt-2">Demo identity connection—not a live blockchain wallet.</p>
                    </div>
                  ) : (
                    <div>
                      <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-mono mb-4">
                        <span className="w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse"></span>
                        Connected: {wallet}
                      </div>
                      <p className="text-sm text-gray-400">Network: Sepolia Testnet (Demo)</p>
                    </div>
                  )}
                </div>
                
                <Button 
                  onClick={handleWalletNext} 
                  disabled={!wallet}
                  className="w-full py-3"
                >
                  Continue Verification
                </Button>
              </div>
            )}

            {/* STEP 5: Biometric Verification */}
            {step === 5 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300 text-center">
                <h2 className="text-2xl font-bold text-white mb-2">Final Authorization</h2>
                
                <div className="bg-yellow-500/10 border border-yellow-500/30 p-3 rounded-lg mb-8 text-left">
                  <p className="text-xs text-yellow-400">
                    <strong>Notice:</strong> Biometric verification is simulated for prototype demonstration and does not represent real biometric authentication. No biometric data is accessed, generated, or stored.
                  </p>
                </div>

                <div className="flex justify-center space-x-4 mb-8">
                  <button 
                    onClick={() => setBiometricType('fingerprint')}
                    className={`p-4 rounded-xl border ${biometricType === 'fingerprint' ? 'border-primary bg-primary/10' : 'border-white/10 bg-white/5'} transition-all`}
                  >
                    <Fingerprint className={`w-8 h-8 ${biometricType === 'fingerprint' ? 'text-primary' : 'text-gray-500'}`} />
                  </button>
                  <button 
                    onClick={() => setBiometricType('iris')}
                    className={`p-4 rounded-xl border ${biometricType === 'iris' ? 'border-primary bg-primary/10' : 'border-white/10 bg-white/5'} transition-all`}
                  >
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${biometricType === 'iris' ? 'border-primary' : 'border-gray-500'}`}>
                      <div className={`w-3 h-3 rounded-full ${biometricType === 'iris' ? 'bg-primary' : 'bg-gray-500'}`}></div>
                    </div>
                  </button>
                </div>
                
                <div className="relative inline-block mb-8">
                  {biometricType === 'fingerprint' ? (
                    <Fingerprint className={`w-24 h-24 mx-auto ${loading && !error ? 'text-primary animate-pulse' : 'text-gray-600'}`} />
                  ) : (
                    <div className={`w-24 h-24 mx-auto rounded-full border-4 flex items-center justify-center ${loading && !error ? 'border-primary animate-pulse' : 'border-gray-600'}`}>
                      <div className={`w-8 h-8 rounded-full ${loading && !error ? 'bg-primary' : 'bg-gray-600'}`}></div>
                    </div>
                  )}
                  {loading && !error && <div className="absolute top-0 left-0 w-full h-1 bg-primary/80 blur-[2px] animate-[scan_1.5s_ease-in-out_infinite]"></div>}
                </div>

                <div className="space-y-3">
                  <Button 
                    onClick={() => handleBiometric(false)} 
                    isLoading={loading}
                    className="w-full py-3"
                  >
                    Start Demo Verification
                  </Button>
                  {!loading && (
                    <Button 
                      onClick={() => handleBiometric(true)} 
                      variant="secondary"
                      className="w-full py-2 text-sm text-gray-400"
                    >
                      Simulate Failure State
                    </Button>
                  )}
                </div>
              </div>
            )}

          </GlassCard>
        </div>
      </div>
      
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
