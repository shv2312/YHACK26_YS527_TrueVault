import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Shield, CheckCircle, AlertTriangle, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { StatusBadge } from '../components/ui/StatusBadge';
import { assetService } from '../services/api';

export default function PublicVerify() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault(); if (!query) return;
    setLoading(true); setError(''); setResult(null);
    try {
      const verifyRes = await assetService.verifyAsset(query);
      setResult({
        verified: verifyRes.verified,
        blockchainStatus: verifyRes.status,
        fileHash: query
      });
      setLoading(false);
    } catch { 
      setError('No asset found matching this hash or verification service unavailable.'); 
      setLoading(false); 
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      {/* Top bar */}
      <div className="px-6 py-4 flex items-center justify-between bg-white border-b border-border-light">
        <Link to="/" className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center"><Shield className="w-4 h-4 text-white" /></div>
          <span className="text-[16px] font-bold tracking-tight text-text-primary">TrueVault</span>
        </Link>
        <Link to="/" className="text-sm text-text-secondary hover:text-text-primary flex items-center transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to home
        </Link>
      </div>

      <div className="flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-[620px]">
          <div className="bg-white rounded-[20px] border border-border-light shadow-sm p-8 md:p-10 mb-6">
            <h2 className="text-2xl font-bold text-text-primary mb-2">Verify Asset Integrity</h2>
            <p className="text-text-secondary text-[15px] mb-8">Check blockchain-backed ownership and integrity without accessing confidential contents.</p>
            <form onSubmit={handleVerify} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">Asset SHA-256 Hash</label>
                <input type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder="Enter Hash..." className="input-light text-lg" required />
              </div>
              <Button type="submit" isLoading={loading} className="w-full" size="lg"><Search className="w-4 h-4 mr-2" /> Verify Hash</Button>
            </form>
          </div>

          {error && (
            <div className="bg-white rounded-[18px] border border-red-200 p-6 flex items-center">
              <AlertTriangle className="w-6 h-6 text-red-500 mr-4 shrink-0" />
              <div><h4 className="text-red-700 font-bold">Verification Failed</h4><p className="text-sm text-red-600 mt-1">{error}</p></div>
            </div>
          )}

          {result && (
            <div className="bg-white rounded-[18px] border border-border-light shadow-sm p-8">
              <div className="flex items-center justify-between border-b border-border-light pb-5 mb-5">
                <div className="flex items-center">
                  <CheckCircle className="w-7 h-7 text-emerald-500 mr-3" />
                  <div><h3 className="text-lg font-bold text-text-primary">Asset Found</h3><p className="text-sm text-text-secondary mt-0.5">Record exists on TrueVault ledger</p></div>
                </div>
                <StatusBadge status="success" text="Live Network" />
              </div>
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div><p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1">Blockchain Status</p><StatusBadge status={result.blockchainStatus === 'CONFIRMED' ? 'success' : 'warning'} text={result.blockchainStatus} /></div>
                  <div><p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1">Integrity Verified</p><p className="text-sm font-mono text-text-secondary">{result.verified ? 'PASSED' : 'FAILED'}</p></div>
                </div>
                <div><p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1">Registered SHA-256 Hash</p><p className="text-sm font-mono text-primary bg-[#F4F6F8] p-3 rounded-xl border border-border-light break-all">{result.fileHash}</p></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
