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

  if (!asset) return <div>Loading details...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{asset.name}</h2>
            <p className="text-sm text-gray-500 capitalize">{asset.type} Asset</p>
          </div>
          <button className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-light transition-colors">
            <Download className="w-4 h-4 mr-2" />
            Secure Download
          </button>
        </div>
        
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Owner Wallet</h3>
              <p className="text-gray-900 font-mono text-sm bg-gray-100 p-2 rounded">{asset.ownerWallet}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">NFT Token ID</h3>
              <div className="flex items-center text-gray-900 font-mono text-sm bg-gray-100 p-2 rounded">
                <Key className="w-4 h-4 mr-2 text-gray-400" />
                #{asset.nftTokenId}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">SHA-256 File Hash</h3>
              <p className="text-gray-900 font-mono text-xs bg-gray-100 p-2 rounded break-all">{asset.fileHash}</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Access Status</h3>
              <div className="flex items-center">
                <Shield className={`w-5 h-5 mr-2 ${asset.accessStatus === 'OWNER' ? 'text-green-500' : 'text-blue-500'}`} />
                <span className="font-semibold">{asset.accessStatus}</span>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Blockchain Proof</h3>
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-2 ${asset.blockchainStatus === 'CONFIRMED' ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'}`}></div>
                <span className="font-semibold">{asset.blockchainStatus}</span>
                {asset.blockchainStatus === 'PENDING' && (
                  <span className="ml-2 text-xs text-gray-500">Waiting for network confirmation...</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
