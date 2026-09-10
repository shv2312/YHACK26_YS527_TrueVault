import { Link } from 'react-router-dom';
import { Shield, Lock, FileCheck, Building2, Fingerprint, Search, Users, History, Landmark, GraduationCap, Scale, LinkIcon } from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function Landing() {
  return (
    <div className="min-h-screen bg-bg-dark overflow-hidden">

      {/* ===== FLOATING NAVBAR ===== */}
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-3.5">
        <nav className="w-full max-w-[1180px] bg-[rgba(10,14,22,0.58)] backdrop-blur-[18px] backdrop-saturate-[140%] border border-[rgba(255,255,255,0.10)] shadow-[0_8px_30px_rgba(0,0,0,0.18)] rounded-[20px] px-6 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-[17px] font-bold tracking-tight text-white">TrueVault</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8 text-[14px] font-medium text-gray-400">
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#security" className="hover:text-white transition-colors">Security</a>
            <a href="#use-cases" className="hover:text-white transition-colors">Use Cases</a>
          </div>

          <div className="flex items-center space-x-3">
            <Link to="/verify">
              <Button variant="secondary" size="sm" pill className="border-white/20 text-white hover:bg-white/10 hover:text-white text-[13px]">
                Verify Asset
              </Button>
            </Link>
            <Link to="/login">
              <Button size="sm" pill className="text-[13px]">Access Vault</Button>
            </Link>
          </div>
        </nav>
      </div>

      {/* ===== HERO SECTION ===== */}
      <section className="relative pt-40 pb-28 flex flex-col items-center text-center px-6 overflow-hidden">
        {/* Atmospheric background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-primary/8 rounded-full blur-[150px]"></div>
          <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-accent/6 rounded-full blur-[120px]"></div>
        </div>

        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/60 text-xs font-semibold uppercase tracking-widest mb-10">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
            <span>Hackathon Prototype v1.0</span>
          </div>

          <h1 className="text-[56px] md:text-[72px] font-extrabold text-white tracking-tight leading-[1.05] mb-6">
            Secure ownership.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3B82F6] to-[#7C3AED]">Controlled access.</span><br />
            Verifiable trust.
          </h1>

          <p className="text-[17px] text-gray-400 max-w-xl mx-auto leading-relaxed mb-12">
            TrueVault protects sensitive digital assets using encrypted storage, blockchain-backed ownership, role-based access control and tamper-evident verification.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/login">
              <Button size="lg" pill>Access TrueVault</Button>
            </Link>
            <Link to="/verify">
              <Button variant="secondary" size="lg" pill className="border-white/20 text-white hover:bg-white/10 hover:text-white">
                Verify an Asset
              </Button>
            </Link>
          </div>
        </div>

        {/* Architecture Flow Cards */}
        <div className="relative z-10 mt-24 w-full max-w-[900px] mx-auto grid grid-cols-2 sm:grid-cols-5 gap-4">
          {[
            { icon: Landmark, title: 'Institution', desc: 'Verified identity' },
            { icon: Shield, title: 'TrueVault', desc: 'Encrypted layer' },
            { icon: Lock, title: 'Secure Asset', desc: 'Client-side encrypted' },
            { icon: LinkIcon, title: 'Blockchain Proof', desc: 'Tamper-evident' },
            { icon: Users, title: 'Authorized User', desc: 'Role-based access' },
          ].map((item, i) => (
            <div key={i} className="bg-[#11151D]/80 border border-white/10 rounded-2xl p-5 text-left hover:border-white/20 transition-all">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <item.icon className="w-5 h-5 text-primary" />
              </div>
              <h4 className="text-white font-semibold text-[15px] mb-1">{item.title}</h4>
              <p className="text-gray-500 text-[13px]">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== HOW IT WORKS — LIGHT SECTION ===== */}
      <section id="how-it-works" className="bg-[#F7F8FA] py-24 px-6">
        <div className="max-w-[1100px] mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-text-secondary mb-4">How It Works</p>
            <h2 className="text-[42px] font-bold text-text-primary tracking-tight">The TrueVault Security Lifecycle</h2>
            <p className="text-text-secondary text-[17px] mt-4 max-w-2xl mx-auto">An end-to-end verifiable process ensuring absolute control over your digital identity and critical documents.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { num: '01', title: 'Verify Identity', desc: 'Secure authentication using institutional credentials and cryptographic wallets.', icon: Fingerprint },
              { num: '02', title: 'Upload & Encrypt', desc: 'Files are client-side encrypted before ever touching secure storage.', icon: Lock },
              { num: '03', title: 'Generate SHA-256 Hash', desc: 'A unique digital fingerprint is created to prove file integrity over time.', icon: FileCheck },
              { num: '04', title: 'Mint Ownership Proof', desc: 'A blockchain-backed ownership proof represents access rights to the asset.', icon: Shield },
              { num: '05', title: 'Grant or Revoke Access', desc: 'Role-based permissions dictate exactly who can access the asset.', icon: Users },
              { num: '06', title: 'Verify Integrity', desc: "Users can verify an asset's integrity without exposing the protected content.", icon: Search },
            ].map((step) => (
              <div key={step.num} className="bg-white border border-border-light rounded-[20px] p-8 hover:shadow-md transition-shadow relative group">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-primary/8 flex items-center justify-center">
                    <step.icon className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-sm font-bold text-text-muted">{step.num}</span>
                </div>
                <h3 className="text-[19px] font-bold text-text-primary mb-3">{step.title}</h3>
                <p className="text-[15px] text-text-secondary leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== LIGHT TRUST SECTION ===== */}
      <section className="bg-white py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/5 rounded-full blur-[120px]"></div>
        </div>
        <div className="max-w-[800px] mx-auto text-center relative z-10">
          <h2 className="text-[38px] md:text-[44px] font-bold text-text-primary tracking-tight leading-tight mb-6">
            Ownership that can be proven.<br />Access that can be controlled.
          </h2>
          <p className="text-text-secondary text-[17px] max-w-xl mx-auto leading-relaxed mb-10">
            TrueVault combines encryption, institutional identity, cryptographic verification and tamper-evident records into one secure ownership workflow.
          </p>
          <Link to="/login">
            <Button size="lg" pill>Explore Security</Button>
          </Link>
        </div>
      </section>

      {/* ===== SECURITY FEATURES — LIGHT SECTION ===== */}
      <section id="security" className="bg-white py-24 px-6">
        <div className="max-w-[1100px] mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-text-secondary mb-4">Security</p>
            <h2 className="text-[42px] font-bold text-text-primary tracking-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3B82F6] to-[#7C3AED]">Security</span> without<br />compromising usability
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { icon: Lock, title: 'Encrypted Storage', desc: 'Sensitive digital assets remain protected through secure encryption.' },
              { icon: Shield, title: 'Blockchain Ownership Proof', desc: 'Create tamper-evident records demonstrating digital ownership.' },
              { icon: Users, title: 'Role-Based Access', desc: 'Define exactly who can view or interact with protected assets.' },
              { icon: History, title: 'Tamper-Evident Audit Trail', desc: 'Maintain a transparent history of important asset actions.' },
            ].map((feat, i) => (
              <div key={i} className="bg-[#F7F8FA] border border-border-light rounded-[20px] p-10 hover:shadow-sm transition-shadow">
                <div className="w-12 h-12 rounded-2xl bg-primary/8 flex items-center justify-center mb-6">
                  <feat.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-[19px] font-bold text-text-primary mb-3">{feat.title}</h3>
                <p className="text-[15px] text-text-secondary leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== USE CASES — LIGHT SECTION ===== */}
      <section id="use-cases" className="bg-[#F7F8FA] py-24 px-6">
        <div className="max-w-[1100px] mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-text-secondary mb-4">Use Cases</p>
            <h2 className="text-[42px] font-bold text-text-primary tracking-tight">Built for high-trust digital assets</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Landmark, title: 'Government Records', desc: 'Registry documents and official records held under controlled access.' },
              { icon: GraduationCap, title: 'Educational Credentials', desc: 'Degrees and transcripts that recipients can present for verification.' },
              { icon: Building2, title: 'Financial Documents', desc: 'Statements and agreements shared only with authorized parties.' },
              { icon: Building2, title: 'Corporate Documents', desc: 'Internal filings and contracts with a clear ownership record.' },
              { icon: Scale, title: 'Legal & Verification Records', desc: 'Case files and audit material with tamper-evident history.' },
            ].map((uc, i) => (
              <div key={i} className="bg-white border border-border-light rounded-[20px] p-8 hover:shadow-sm transition-shadow">
                <div className="w-12 h-12 rounded-2xl bg-primary/8 flex items-center justify-center mb-6">
                  <uc.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-[18px] font-bold text-text-primary mb-2">{uc.title}</h3>
                <p className="text-[15px] text-text-secondary leading-relaxed">{uc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="bg-bg-dark py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 left-1/4 w-[500px] h-[250px] bg-primary/8 rounded-full blur-[120px]"></div>
          <div className="absolute top-0 right-1/4 w-[300px] h-[200px] bg-accent/6 rounded-full blur-[100px]"></div>
        </div>
        <div className="max-w-[700px] mx-auto text-center relative z-10">
          <h2 className="text-[42px] font-bold text-white tracking-tight mb-5">Take control of your digital assets.</h2>
          <p className="text-gray-400 text-[17px] mb-10">Secure, manage and verify ownership through TrueVault.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/login">
              <Button size="lg" pill>Access TrueVault</Button>
            </Link>
            <Link to="/verify">
              <Button variant="secondary" size="lg" pill className="border-white/20 text-white hover:bg-white/10 hover:text-white">
                Verify Asset
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-bg-dark border-t border-white/5 py-8 px-6">
        <div className="max-w-[1100px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-600 font-medium">TrueVault Prototype</span>
          </div>
          <p className="text-xs text-gray-500 max-w-xl text-center md:text-right leading-relaxed">
            TrueVault is a hackathon prototype. Biometric verification and selected blockchain interactions may operate in clearly labelled demonstration mode. Not affiliated with Dock, Trinsic, or government identity services.
          </p>
        </div>
      </footer>
    </div>
  );
}
