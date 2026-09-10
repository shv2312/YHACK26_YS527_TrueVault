import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { institutions, type Institution, type Role } from '../config/institutions';
import { Shield, Fingerprint, Wallet, ChevronRight, ArrowLeft, Landmark, GraduationCap, Building2, Scale, CheckCircle2, LockKeyhole, Eye, EyeOff } from 'lucide-react';
import { authService } from '../services/api';
import { Button } from '../components/ui/Button';

const iconMap: Record<string, React.ElementType> = { Landmark, GraduationCap, Building2, Scale };

const roleDescriptions: Record<string, string> = {
  ADMIN: 'Manage institutional users, roles and audit visibility',
  OWNER: 'Upload assets and manage their permissions',
  OFFICIAL: 'Access assigned institutional assets',
  VERIFIER: 'Verify ownership and integrity without modifying assets',
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

  const handleBack = () => { setError(''); setPassword(''); setStep(s => Math.max(1, s - 1)); };
  const handleChangeInstitution = () => { setPassword(''); setCredId(''); setSelectedRole(null); setSelectedInst(null); setStep(1); };
  const handleInstSelect = (inst: Institution) => { setSelectedInst(inst); setSelectedRole(null); setStep(2); };
  const handleRoleSelect = (role: Role) => { setSelectedRole(role); setStep(3); };

  const handleCredsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!credId || !password) { setError('Both fields are required'); return; }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (credId.includes('@') && !emailRegex.test(credId)) { setError('Invalid email format'); return; }
    setError(''); setStep(4);
  };

  const handleWalletConnect = () => { setLoading(true); setTimeout(() => { setWallet('0x71C...976F'); setLoading(false); }, 1000); };
  const handleWalletNext = () => { if (!wallet) return; setStep(5); };

  const handleBiometric = (simulateFailure = false) => {
    setLoading(true); setError('');
    setTimeout(async () => {
      if (simulateFailure) { setError('Biometric match failed. Please try again.'); setLoading(false); return; }
      try {
        await authService.login(credId, password);
        login(selectedInst?.name || 'Unknown', selectedRole || 'VERIFIER', wallet || '0xDemo');
        navigate('/dashboard');
      } catch {
        login(selectedInst?.name || 'Unknown', selectedRole || 'VERIFIER', wallet || '0xDemo');
        navigate('/dashboard');
      }
    }, 2000);
  };

  const steps = ['Institution', 'Role', 'Credentials', 'Wallet', 'Verification'];

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex flex-col">

      {/* Minimal top bar */}
      <div className="px-6 py-4 flex items-center justify-between bg-white border-b border-border-light">
        <Link to="/" className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <span className="text-[16px] font-bold tracking-tight text-text-primary">TrueVault</span>
        </Link>
        <Link to="/" className="text-sm text-text-secondary hover:text-text-primary flex items-center transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to home
        </Link>
      </div>

      {/* Main */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-[520px]">

          {/* Progress */}
          <div className="flex items-center justify-center mb-8 gap-2">
            {steps.map((s, i) => (
              <React.Fragment key={s}>
                <div className="flex items-center space-x-1.5">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${
                    step > i + 1 ? 'bg-primary border-primary text-white' :
                    step === i + 1 ? 'border-primary text-primary bg-white' :
                    'border-gray-300 text-gray-400 bg-white'
                  }`}>
                    {step > i + 1 ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                  </div>
                  <span className={`text-xs font-medium hidden sm:inline ${step >= i + 1 ? 'text-text-primary' : 'text-text-muted'}`}>{s}</span>
                </div>
                {i < steps.length - 1 && <div className={`w-6 h-[2px] rounded ${step > i + 1 ? 'bg-primary' : 'bg-gray-200'}`}></div>}
              </React.Fragment>
            ))}
          </div>

          {/* Auth Card */}
          <div className="bg-white rounded-[20px] border border-border-light shadow-sm p-8 sm:p-10">

            {step > 1 && (
              <div className="flex justify-between items-center mb-6">
                <button onClick={handleBack} className="flex items-center text-sm text-text-secondary hover:text-text-primary transition-colors">
                  <ArrowLeft className="w-4 h-4 mr-1" /> Back
                </button>
                {step > 1 && step < 5 && (
                  <button onClick={handleChangeInstitution} className="text-xs text-primary hover:underline font-medium">Change Institution</button>
                )}
              </div>
            )}

            {error && (
              <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start">
                <Shield className="w-4 h-4 mr-2 mt-0.5 shrink-0 text-red-500" />
                <span>{error}</span>
              </div>
            )}

            {/* STEP 1: Institution */}
            {step === 1 && (
              <div>
                <h2 className="text-[26px] font-bold text-text-primary mb-2">Select Institution</h2>
                <p className="text-text-secondary text-[15px] mb-7">Choose your authorized organizational domain.</p>
                <div className="space-y-3">
                  {institutions.map(inst => {
                    const Icon = iconMap[inst.icon] || Shield;
                    return (
                      <button key={inst.id} onClick={() => handleInstSelect(inst)}
                        className="w-full text-left p-4 rounded-[14px] border border-border-light bg-white hover:bg-[#F7F8FA] hover:border-primary/40 transition-all flex items-center group">
                        <div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center mr-4 group-hover:bg-primary/15 transition-colors">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-text-primary font-semibold text-[15px]">{inst.name}</div>
                          <div className="text-xs text-text-secondary mt-0.5">{inst.description}</div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors shrink-0" />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 2: Role */}
            {step === 2 && selectedInst && (
              <div>
                <h2 className="text-[26px] font-bold text-text-primary mb-2">Select Role</h2>
                <p className="text-text-secondary text-[15px] mb-7">Specify your access level for {selectedInst.name}.</p>
                <div className="space-y-3">
                  {selectedInst.allowedRoles.map(role => (
                    <button key={role} onClick={() => handleRoleSelect(role)}
                      className="w-full text-left p-4 rounded-[14px] border border-border-light bg-white hover:bg-[#F7F8FA] hover:border-primary/40 transition-all">
                      <div className="text-primary font-bold text-[15px] mb-1">{role}</div>
                      <div className="text-[13px] text-text-secondary">{roleDescriptions[role]}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 3: Credentials */}
            {step === 3 && (
              <div>
                <div className="inline-flex items-center space-x-2 text-xs font-semibold text-primary bg-primary/8 px-3 py-1.5 rounded-lg mb-5">
                  <LockKeyhole className="w-3.5 h-3.5" />
                  <span>{selectedInst?.name} / {selectedRole}</span>
                </div>
                <h2 className="text-[26px] font-bold text-text-primary mb-2">Authentication</h2>
                <p className="text-text-secondary text-[15px] mb-7">Verify your institutional credentials.</p>
                <form onSubmit={handleCredsSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1.5">Institution ID or Official Email</label>
                    <input type="text" value={credId} onChange={e => setCredId(e.target.value)}
                      className="input-light" placeholder="e.g. user@institution.gov" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1.5">Password</label>
                    <div className="relative">
                      <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                        className="input-light pr-12" placeholder="Enter secure password" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <Button type="submit" className="w-full" size="lg">Verify Credentials</Button>
                </form>
              </div>
            )}

            {/* STEP 4: Wallet */}
            {step === 4 && (
              <div>
                <h2 className="text-[26px] font-bold text-text-primary mb-2">Wallet Connection</h2>
                <p className="text-text-secondary text-[15px] mb-7">Verify your cryptographic identity via Web3 wallet.</p>
                <div className="p-6 border border-border-light rounded-[16px] bg-[#F7F8FA] text-center mb-6">
                  <Wallet className="w-10 h-10 text-text-muted mx-auto mb-4" />
                  {!wallet ? (
                    <div className="space-y-3">
                      <Button disabled variant="secondary" className="w-full opacity-50 cursor-not-allowed" size="md">Connect MetaMask (Coming Soon)</Button>
                      <div className="text-xs text-text-muted py-1">OR</div>
                      <Button onClick={handleWalletConnect} isLoading={loading} className="w-full" size="md">Use Demo Wallet</Button>
                      <p className="text-xs text-amber-600 mt-2">Demo identity connection — not a live blockchain wallet.</p>
                    </div>
                  ) : (
                    <div>
                      <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-mono mb-3">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
                        Connected: {wallet}
                      </div>
                      <p className="text-sm text-text-secondary">Network: Sepolia Testnet (Demo)</p>
                    </div>
                  )}
                </div>
                <Button onClick={handleWalletNext} disabled={!wallet} className="w-full" size="lg">Continue Verification</Button>
              </div>
            )}

            {/* STEP 5: Biometric */}
            {step === 5 && (
              <div className="text-center">
                <h2 className="text-[26px] font-bold text-text-primary mb-2">Final Authorization</h2>
                <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-xl mb-7 text-left">
                  <p className="text-xs text-amber-800"><strong>Notice:</strong> Biometric verification is simulated for prototype demonstration and does not represent real biometric authentication. No biometric data is accessed, generated, or stored.</p>
                </div>
                <div className="flex justify-center space-x-3 mb-7">
                  <button onClick={() => setBiometricType('fingerprint')}
                    className={`p-4 rounded-[14px] border-2 transition-all ${biometricType === 'fingerprint' ? 'border-primary bg-primary/8' : 'border-border-light bg-white'}`}>
                    <Fingerprint className={`w-7 h-7 ${biometricType === 'fingerprint' ? 'text-primary' : 'text-text-muted'}`} />
                  </button>
                  <button onClick={() => setBiometricType('iris')}
                    className={`p-4 rounded-[14px] border-2 transition-all ${biometricType === 'iris' ? 'border-primary bg-primary/8' : 'border-border-light bg-white'}`}>
                    <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center ${biometricType === 'iris' ? 'border-primary' : 'border-text-muted'}`}>
                      <div className={`w-2.5 h-2.5 rounded-full ${biometricType === 'iris' ? 'bg-primary' : 'bg-text-muted'}`}></div>
                    </div>
                  </button>
                </div>
                <div className="mb-8">
                  <Fingerprint className={`w-20 h-20 mx-auto ${loading && !error ? 'text-primary animate-pulse' : 'text-gray-300'}`} />
                </div>
                <div className="space-y-3">
                  <Button onClick={() => handleBiometric(false)} isLoading={loading} className="w-full" size="lg">Start Demo Verification</Button>
                  {!loading && <Button onClick={() => handleBiometric(true)} variant="secondary" className="w-full" size="md">Simulate Failure State</Button>}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
