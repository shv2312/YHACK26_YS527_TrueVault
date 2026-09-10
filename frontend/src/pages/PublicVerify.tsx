import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Shield, CheckCircle, AlertTriangle, ArrowLeft } from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { StatusBadge } from '../components/ui/StatusBadge';
import { assetService } from '../services/api';

export default function PublicVerify() {
  const [query, setQuery] = useState('');
  const [hashQuery, setHashQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    
    setLoading(true);
    setError('');
    setResult(null);

    try {
      // For demonstration, use existing asset fetch and filter
      const assets = await assetService.getAssets();
      const found = assets.find((a: any) => a.id === query || a.nftTokenId === query);
      
      setTimeout(() => {
        if (found) {
          setResult(found);
        } else {
          setError('No asset found matching this ID or Token.');
        }
        setLoading(false);
      }, 1500);
    } catch (err) {
      setError('Verification service unavailable.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-6 flex flex-col items-center">
      <div className="w-full max-w-3xl mb-8 flex items-center justify-between">
        <Link to="/" className="flex items-center text-gray-400 hover:text-white transition-colors text-sm">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to TrueVault
        </Link>
        <div className="flex items-center space-x-2">
          <Shield className="w-5 h-5 text-primary" />
          <span className="font-bold tracking-tight text-white">Public Verification</span>
        </div>
      </div>

      <div className="w-full max-w-3xl">
        <GlassCard className="p-8 md:p-10 mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Verify Asset Integrity</h2>
          <p className="text-gray-400 text-sm mb-8">
            Check the blockchain-backed ownership and integrity of any TrueVault asset without accessing its confidential contents.
          </p>

          <form onSubmit={handleVerify} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-300 uppercase tracking-wider mb-2">Asset ID or Token ID</label>
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Enter ID..."
                className="w-full glass-input px-4 py-3 rounded-lg text-lg"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-300 uppercase tracking-wider mb-2">
                Expected SHA-256 Hash <span className="text-gray-500 font-normal normal-case">(Optional)</span>
              </label>
              <input
                type="text"
                value={hashQuery}
                onChange={e => setHashQuery(e.target.value)}
                placeholder="e.g., 8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92"
                className="w-full glass-input px-4 py-3 rounded-lg font-mono text-sm"
              />
            </div>

            <Button type="submit" isLoading={loading} className="w-full py-4 text-lg mt-4">
              <Search className="w-5 h-5 mr-2" /> Verify Now
            </Button>
          </form>
        </GlassCard>

        {error && (
          <div className="animate-in fade-in slide-in-from-bottom-4">
            <GlassCard className="p-6 border-red-500/30 bg-red-500/10 flex items-center">
              <AlertTriangle className="w-6 h-6 text-red-400 mr-4 shrink-0" />
              <div>
                <h4 className="text-red-400 font-bold">Verification Failed</h4>
                <p className="text-sm text-red-200 mt-1">{error}</p>
              </div>
            </GlassCard>
          </div>
        )}

        {result && (
          <div className="animate-in fade-in slide-in-from-bottom-4">
            <GlassCard className="p-8 border-primary/30">
              <div className="flex items-center justify-between border-b border-white/10 pb-6 mb-6">
                <div className="flex items-center">
                  <CheckCircle className="w-8 h-8 text-green-400 mr-4 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  <div>
                    <h3 className="text-xl font-bold text-white">Asset Verified</h3>
                    <p className="text-sm text-gray-400 mt-1">Record found on TrueVault ledger</p>
                  </div>
                </div>
                <StatusBadge status="info" text="UI Demonstration" />
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Blockchain Status</p>
                    <StatusBadge status={result.blockchainStatus === 'CONFIRMED' ? 'success' : 'warning'} text={result.blockchainStatus} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Issuer / Owner Wallet</p>
                    <p className="text-sm font-mono text-gray-300 break-all">{result.ownerWallet}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Registered SHA-256 Hash</p>
                  <p className="text-sm font-mono text-primary bg-black/40 p-3 rounded border border-white/5 break-all">
                    {result.fileHash}
                  </p>
                </div>

                {hashQuery && (
                  <div className={`p-4 rounded-lg border ${hashQuery === result.fileHash ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                    <h4 className={`text-sm font-bold mb-1 ${hashQuery === result.fileHash ? 'text-green-400' : 'text-red-400'}`}>
                      Integrity Match: {hashQuery === result.fileHash ? 'PASSED' : 'FAILED'}
                    </h4>
                    <p className="text-xs text-gray-400">
                      {hashQuery === result.fileHash 
                        ? 'The provided hash matches the blockchain record exactly. The file has not been tampered with.' 
                        : 'The provided hash DOES NOT MATCH the blockchain record. The file may have been tampered with or is incorrect.'}
                    </p>
                  </div>
                )}
              </div>
            </GlassCard>
          </div>
        )}
      </div>
    </div>
  );
}
