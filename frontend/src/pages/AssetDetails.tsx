import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { assetService } from '../services/api';
import { Download, Shield, Key, Eye, Ban, CheckCircle2, FileText, ArrowLeft, Clock, Search } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { StatusBadge } from '../components/ui/StatusBadge';
import { useAuth } from '../context/AuthContext';

export default function AssetDetails() {
  const { id } = useParams();
  const { role } = useAuth();
  const [asset, setAsset] = useState<any>(null);

  useEffect(() => { assetService.getAssets().then(data => { setAsset(data.find((a: any) => a.id === id)); }); }, [id]);

  if (!asset) return (
    <div className="flex flex-col items-center justify-center h-64 text-text-muted">
      <div className="w-7 h-7 border-2 border-primary border-t-transparent rounded-full animate-spin mb-3"></div>
      Loading details...
    </div>
  );

  const isOwner = asset.accessStatus === 'OWNER';
  const hasAccess = asset.accessStatus === 'OWNER' || asset.accessStatus === 'SHARED';

  const handleDownload = async () => {
    try {
      const blob = await assetService.downloadAsset(asset.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = asset.name || 'document';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      alert('Failed to download asset');
    }
  };

  const handleVerify = async () => {
    try {
      const result = await assetService.verifyAsset(asset.fileHash);
      if (result.verified) {
        alert('Asset verified successfully on blockchain!');
      } else {
        alert('Asset verification failed. Data may be tampered.');
      }
    } catch (e) {
      alert('Error during verification');
    }
  };

  return (
    <div className="max-w-5xl space-y-6">
      <Link to="/dashboard" className="flex items-center text-sm text-text-secondary hover:text-text-primary transition-colors w-fit">
        <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Vault
      </Link>

      <div className="bg-white rounded-[18px] border border-border-light overflow-hidden">
        <div className="px-8 py-6 border-b border-border-light flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/8 flex items-center justify-center">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-text-primary">{asset.name}</h2>
              <div className="flex items-center space-x-3 mt-1">
                <span className="text-sm text-text-secondary capitalize">{asset.type}</span>
                <span className="text-xs text-text-muted font-mono">ID: {asset.id}</span>
              </div>
            </div>
          </div>
          {hasAccess ? (
            <Button size="md" onClick={handleDownload}><Download className="w-4 h-4 mr-2" /> Download</Button>
          ) : (
            <Button disabled variant="secondary"><Ban className="w-4 h-4 mr-2" /> Access Denied</Button>
          )}
        </div>

        <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider border-b border-border-light pb-3">Cryptographic Metadata</h3>
            <div className="space-y-5">
              <div><p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1 flex items-center"><Shield className="w-3.5 h-3.5 mr-1.5 text-primary" /> Owner Wallet</p><p className="text-sm font-mono text-text-primary break-all">{asset.ownerWallet}</p></div>
              <div><p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1 flex items-center"><Key className="w-3.5 h-3.5 mr-1.5 text-accent" /> NFT Token ID</p><p className="text-sm font-mono text-accent bg-accent/8 inline-block px-2.5 py-1 rounded-lg border border-accent/20">#{asset.nftTokenId}</p></div>
              <div><p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1 flex items-center"><CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-emerald-600" /> SHA-256 Hash</p><p className="text-xs font-mono text-text-secondary break-all bg-[#F4F6F8] p-3 rounded-xl border border-border-light">{asset.fileHash}</p></div>
            </div>
            <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider border-b border-border-light pb-3 pt-4">Network Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 rounded-xl bg-[#F7F8FA] border border-border-light">
                <span className="text-sm text-text-secondary">Access Rights</span>
                <StatusBadge status={asset.accessStatus === 'OWNER' ? 'success' : 'info'} text={asset.accessStatus} />
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-[#F7F8FA] border border-border-light">
                <span className="text-sm text-text-secondary">Blockchain</span>
                <StatusBadge status={asset.blockchainStatus === 'CONFIRMED' ? 'success' : 'warning'} text={asset.blockchainStatus} />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider border-b border-border-light pb-3">Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button variant="secondary" className="justify-start"><Eye className="w-4 h-4 mr-2 text-text-muted" /> View Metadata</Button>
              <Button variant="secondary" className="justify-start" onClick={handleVerify}><Search className="w-4 h-4 mr-2 text-primary" /> Verify Integrity</Button>
              {(isOwner || role === 'ADMIN') && (
                <>
                  <Button variant="secondary" className="justify-start"><Shield className="w-4 h-4 mr-2 text-blue-500" /> Grant Access</Button>
                  <Button variant="secondary" className="justify-start border-red-200 hover:bg-red-50"><Ban className="w-4 h-4 mr-2 text-red-500" /> Revoke Access</Button>
                </>
              )}
            </div>

            <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider border-b border-border-light pb-3 pt-4">Recent Activity</h3>
            <div className="relative border-l-2 border-border-light ml-3 space-y-5">
              {[
                { action: 'Asset Uploaded and Encrypted', time: '2 hours ago', status: 'success' },
                { action: 'NFT Minted on Blockchain', time: '2 hours ago', status: 'success' },
                { action: `Verified by ${asset.ownerWallet.substring(0,6)}...`, time: '1 hour ago', status: 'info' }
              ].map((log, i) => (
                <div key={i} className="relative pl-5">
                  <div className={`absolute -left-[7px] top-1.5 w-3 h-3 rounded-full border-2 border-white ${log.status === 'success' ? 'bg-emerald-500' : 'bg-blue-500'}`}></div>
                  <p className="text-sm font-medium text-text-primary">{log.action}</p>
                  <p className="text-xs text-text-muted mt-0.5 flex items-center"><Clock className="w-3 h-3 mr-1" /> {log.time}</p>
                </div>
              ))}
            </div>
            <div className="text-center pt-2"><Link to="/audit" className="text-xs text-primary hover:underline uppercase tracking-wider font-bold">View Full Audit Trail →</Link></div>
          </div>
        </div>
      </div>
    </div>
  );
}
