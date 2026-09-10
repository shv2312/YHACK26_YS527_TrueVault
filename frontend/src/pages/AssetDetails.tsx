import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { assetService } from '../services/api';
import { Download, Shield, Key } from 'lucide-react';

export default function AssetDetails() {
  const { id } = useParams();
  const [asset, setAsset] = useState<any>(null);

  useEffect(() => {
    assetService.getAssets().then(data => {
      setAsset(data.find((a: any) => a.id === id));
    });
  }, [id]);

  if (!asset) return <div className="text-gray-400">Loading details...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="glass-panel rounded-xl overflow-hidden">
        <div className="px-6 py-5 border-b border-white/10 flex justify-between items-center bg-white/5">
          <div>
            <h2 className="text-xl font-bold text-white tracking-wide">{asset.name}</h2>
            <p className="text-sm text-gray-400 capitalize mt-0.5">{asset.type} Asset</p>
          </div>
          <button className="flex items-center px-5 py-2.5 glass-button text-white rounded-md font-medium">
            <Download className="w-4 h-4 mr-2" />
            Secure Download
          </button>
        </div>
        
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="glass-card p-4 rounded-lg">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Owner Wallet</h3>
              <p className="text-primary font-mono text-sm break-all drop-shadow-[0_0_5px_rgba(0,229,255,0.3)]">{asset.ownerWallet}</p>
            </div>
            
            <div className="glass-card p-4 rounded-lg">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">NFT Token ID</h3>
              <div className="flex items-center text-accent-light font-mono text-sm drop-shadow-[0_0_5px_rgba(176,92,255,0.3)]">
                <Key className="w-4 h-4 mr-2 text-accent" />
                #{asset.nftTokenId}
              </div>
            </div>

            <div className="glass-card p-4 rounded-lg">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">SHA-256 File Hash</h3>
              <p className="text-gray-300 font-mono text-xs break-all">{asset.fileHash}</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass-card p-4 rounded-lg">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Access Status</h3>
              <div className="flex items-center">
                <Shield className={`w-6 h-6 mr-3 ${asset.accessStatus === 'OWNER' ? 'text-green-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]'}`} />
                <span className="font-bold text-white tracking-wide">{asset.accessStatus}</span>
              </div>
            </div>

            <div className="glass-card p-4 rounded-lg">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Blockchain Proof</h3>
              <div className="flex items-center">
                <div className={`w-4 h-4 rounded-full mr-3 border-2 border-black/50 ${asset.blockchainStatus === 'CONFIRMED' ? 'bg-primary shadow-[0_0_10px_rgba(0,229,255,0.8)]' : 'bg-yellow-400 animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.8)]'}`}></div>
                <span className="font-bold text-white tracking-wide">{asset.blockchainStatus}</span>
                {asset.blockchainStatus === 'PENDING' && (
                  <span className="ml-3 text-xs text-yellow-400">Waiting for network confirmation...</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
