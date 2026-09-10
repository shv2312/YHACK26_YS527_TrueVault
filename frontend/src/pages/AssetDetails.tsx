import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { assetService } from '../services/api';
import { Download, Shield, Key, Eye, Ban, CheckCircle2, FileText, ArrowLeft, Clock, Search } from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { StatusBadge } from '../components/ui/StatusBadge';
import { useAuth } from '../context/AuthContext';

export default function AssetDetails() {
  const { id } = useParams();
  const { role } = useAuth();
  const [asset, setAsset] = useState<any>(null);

  useEffect(() => {
    assetService.getAssets().then(data => {
      setAsset(data.find((a: any) => a.id === id));
    });
  }, [id]);

  if (!asset) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-400 max-w-4xl mx-auto">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        Loading asset details...
      </div>
    );
  }

  const isOwner = asset.accessStatus === 'OWNER';
  const hasAccess = asset.accessStatus === 'OWNER' || asset.accessStatus === 'SHARED';

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      <Link to="/dashboard" className="flex items-center text-sm text-gray-400 hover:text-white transition-colors mb-6 w-fit">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Vault
      </Link>

      <GlassCard className="overflow-hidden">
        {/* Header */}
        <div className="px-8 py-6 border-b border-white/10 bg-black/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white tracking-wide">{asset.name}</h2>
              <div className="flex items-center space-x-3 mt-1">
                <span className="text-sm text-gray-400 capitalize">{asset.type} Asset</span>
                <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                <span className="text-xs text-gray-500 font-mono">ID: {asset.id}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {hasAccess ? (
              <Button className="py-2.5 px-5">
                <Download className="w-4 h-4 mr-2" /> Download File
              </Button>
            ) : (
              <Button disabled variant="secondary" className="py-2.5 px-5 opacity-50">
                <Ban className="w-4 h-4 mr-2" /> Access Denied
              </Button>
            )}
          </div>
        </div>
        
        {/* Content */}
        <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          {/* Left Column: Metadata */}
          <div className="space-y-8">
            <div>
              <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider border-b border-white/10 pb-3 mb-4">Cryptographic Metadata</h3>
              
              <div className="space-y-5">
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 flex items-center">
                    <Shield className="w-3.5 h-3.5 mr-1.5 text-primary" /> Owner Wallet
                  </p>
                  <p className="text-white font-mono text-sm break-all">{asset.ownerWallet}</p>
                </div>
                
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 flex items-center">
                    <Key className="w-3.5 h-3.5 mr-1.5 text-accent" /> NFT Token ID
                  </p>
                  <p className="text-accent-light font-mono text-sm border border-accent/20 bg-accent/5 inline-block px-2 py-1 rounded">
                    #{asset.nftTokenId}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 flex items-center">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-green-400" /> SHA-256 Hash
                  </p>
                  <p className="text-gray-300 font-mono text-xs break-all bg-black/40 p-3 rounded border border-white/5">
                    {asset.fileHash}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider border-b border-white/10 pb-3 mb-4">Network Status</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-black/20 border border-white/5">
                  <span className="text-sm text-gray-400">Access Rights</span>
                  <StatusBadge 
                    status={asset.accessStatus === 'OWNER' ? 'success' : (asset.accessStatus === 'SHARED' ? 'info' : 'danger')} 
                    text={asset.accessStatus} 
                  />
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-black/20 border border-white/5">
                  <span className="text-sm text-gray-400">Blockchain Confirmation</span>
                  <StatusBadge 
                    status={asset.blockchainStatus === 'CONFIRMED' ? 'success' : 'warning'} 
                    text={asset.blockchainStatus} 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Actions & History */}
          <div className="space-y-8">
            
            {/* Role Aware Actions */}
            <div>
               <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider border-b border-white/10 pb-3 mb-4">Administrative Actions</h3>
               
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <Button variant="secondary" className="justify-start">
                   <Eye className="w-4 h-4 mr-3 text-gray-400" /> View Metadata
                 </Button>
                 
                 <Button variant="secondary" className="justify-start">
                   <Search className="w-4 h-4 mr-3 text-primary" /> Verify Integrity
                 </Button>

                 {(isOwner || role === 'ADMIN') && (
                   <>
                     <Button variant="secondary" className="justify-start border-blue-500/30 hover:bg-blue-500/10">
                       <Shield className="w-4 h-4 mr-3 text-blue-400" /> Grant Access
                     </Button>
                     <Button variant="secondary" className="justify-start border-red-500/30 hover:bg-red-500/10">
                       <Ban className="w-4 h-4 mr-3 text-red-400" /> Revoke Access
                     </Button>
                   </>
                 )}
               </div>
            </div>

            {/* Audit Preview */}
            <div>
               <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider border-b border-white/10 pb-3 mb-4">Recent Audit Activity</h3>
               
               <div className="relative border-l-2 border-white/10 ml-3 space-y-6">
                 {[
                   { action: 'Asset Uploaded and Encrypted', time: '2 hours ago', status: 'success' },
                   { action: 'NFT Minted on Blockchain', time: '2 hours ago', status: 'success' },
                   { action: 'Integrity Verified by ' + asset.ownerWallet.substring(0,6) + '...', time: '1 hour ago', status: 'info' }
                 ].map((log, i) => (
                   <div key={i} className="relative pl-6">
                     <div className={`absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-4 border-black ${
                       log.status === 'success' ? 'bg-green-400' : 'bg-blue-400'
                     }`}></div>
                     <div>
                       <p className="text-sm font-medium text-white">{log.action}</p>
                       <p className="text-xs text-gray-500 mt-1 flex items-center">
                         <Clock className="w-3 h-3 mr-1" /> {log.time}
                       </p>
                     </div>
                   </div>
                 ))}
               </div>
               
               <div className="mt-6 text-center">
                 <Link to="/audit" className="text-xs text-primary hover:text-primary-light uppercase tracking-wider font-bold">
                   View Full Audit Trail &rarr;
                 </Link>
               </div>
            </div>

          </div>
        </div>
      </GlassCard>
    </div>
  );
}
