import { Link } from 'react-router-dom';
import { Shield, Lock, FileCheck, Building2, Fingerprint, Search } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { GlassCard } from '../components/ui/GlassCard';

export default function Landing() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      
      {/* Navbar */}
      <nav className="glass-panel sticky top-0 z-50 px-6 py-4 flex justify-between items-center border-b-0">
        <div className="flex items-center space-x-3">
          <Shield className="w-8 h-8 text-primary drop-shadow-[0_0_8px_rgba(0,229,255,0.8)]" />
          <span className="text-xl font-bold tracking-tight text-white">TrueVault</span>
        </div>
        <div className="hidden md:flex space-x-8 text-sm font-medium text-gray-300">
          <a href="#how-it-works" className="hover:text-primary transition-colors">How It Works</a>
          <a href="#security" className="hover:text-primary transition-colors">Security</a>
          <a href="#use-cases" className="hover:text-primary transition-colors">Use Cases</a>
        </div>
        <div className="flex space-x-4">
          <Link to="/verify">
            <Button variant="secondary" className="hidden sm:flex text-sm py-2 px-4">
              <Search className="w-4 h-4 mr-2" /> Verify Asset
            </Button>
          </Link>
          <Link to="/login">
            <Button className="text-sm py-2 px-4">Access Vault</Button>
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Hero Section */}
        <section className="py-24 md:py-32 flex flex-col items-center text-center">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider mb-8">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span>Hackathon Prototype v1.0</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-tight max-w-4xl mb-6">
            Secure ownership. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Controlled access.</span> <br />
            Verifiable trust.
          </h1>
          
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mb-10 leading-relaxed">
            TrueVault protects sensitive digital assets using encrypted storage, blockchain-backed ownership, role-based access control and tamper-evident verification.
          </p>

          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
            <Link to="/login">
              <Button className="w-full sm:w-auto text-lg px-8 py-4">Access TrueVault</Button>
            </Link>
            <Link to="/verify">
              <Button variant="secondary" className="w-full sm:w-auto text-lg px-8 py-4">Verify an Asset</Button>
            </Link>
          </div>
        </section>

        {/* Security Lifecycle */}
        <section id="how-it-works" className="py-20 border-t border-white/10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">The TrueVault Security Lifecycle</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">An end-to-end verifiable process ensuring absolute control over your digital identity and critical documents.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { num: '1', title: 'Verify Identity', desc: 'Secure authentication using institutional credentials and cryptographic wallets.', icon: Fingerprint },
              { num: '2', title: 'Upload & Encrypt', desc: 'Files are client-side encrypted before ever touching our secure storage.', icon: Lock },
              { num: '3', title: 'Generate SHA-256 Hash', desc: 'A unique digital fingerprint is created to prove file integrity over time.', icon: FileCheck },
              { num: '4', title: 'Mint Ownership Proof', desc: 'An NFT representing access rights is minted on the blockchain.', icon: Shield },
              { num: '5', title: 'Grant or Revoke Access', desc: 'Smart-contract enforced permissions dictate exactly who can decrypt the asset.', icon: Building2 },
              { num: '6', title: 'Verify Integrity', desc: 'Anyone can verify the asset’s hash against the blockchain without accessing the file.', icon: Search }
            ].map(step => (
              <GlassCard key={step.num} className="p-8 text-center relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 text-6xl font-black text-white/5 group-hover:text-primary/10 transition-colors pointer-events-none select-none">
                  {step.num}
                </div>
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white/5 border border-white/10 mb-6 group-hover:bg-primary/10 group-hover:border-primary/30 transition-colors">
                  <step.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{step.desc}</p>
              </GlassCard>
            ))}
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/50 py-10 px-6 mt-20 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Shield className="w-5 h-5 text-gray-500" />
            <span className="text-sm font-bold text-gray-500">TrueVault Prototype</span>
          </div>
          <p className="text-xs text-yellow-500/80 max-w-2xl text-center md:text-right">
            Disclaimer: TrueVault is a hackathon prototype. Biometric verification and selected blockchain interactions may operate in clearly labelled demonstration mode. Not affiliated with Dock, Trinsic, or government identity services.
          </p>
        </div>
      </footer>
      
    </div>
  );
}
