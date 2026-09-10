import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, File, CheckCircle, Database, Lock, ShieldCheck, Cpu, X, AlertTriangle } from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';

export default function UploadAsset() {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [type, setType] = useState('document');
  const [uploadState, setUploadState] = useState(0); // 0: init, 1: hash, 2: encrypt, 3: mint, 4: confirm, 5: success
  const [hash, setHash] = useState('');
  const [error, setError] = useState('');

  const generateFakeHash = () => {
    const chars = '0123456789abcdef';
    let result = '';
    for (let i = 0; i < 64; i++) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (selected.size > 50 * 1024 * 1024) {
        setError('File size exceeds the 50MB limit.');
        return;
      }
      setFile(selected);
      setName(selected.name.split('.')[0]); // Default name without extension
    }
  };

  const removeFile = () => {
    if (uploadState > 0) return;
    setFile(null);
    setName('');
    setError('');
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }
    if (!name) {
      setError('Asset name is required.');
      return;
    }
    
    setUploadState(1);
    setHash(generateFakeHash());
    
    // Simulate pipeline
    setTimeout(() => setUploadState(2), 1500); // Encryption
    setTimeout(() => setUploadState(3), 3000); // Storage / Minting
    setTimeout(() => setUploadState(4), 4500); // Blockchain Conf
    setTimeout(() => {
      setUploadState(5); // Success
      setTimeout(() => navigate('/dashboard'), 2500);
    }, 6000);
  };

  const getStepStatus = (step: number) => {
    if (uploadState > step) return { color: 'text-green-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]', label: 'Completed' };
    if (uploadState === step) return { color: 'text-primary animate-pulse drop-shadow-[0_0_8px_rgba(0,229,255,0.5)]', label: 'Processing...' };
    return { color: 'text-gray-600', label: 'Waiting' };
  };

  return (
    <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <GlassCard className="p-8">
          <div className="border-b border-white/10 pb-4 mb-6">
            <h2 className="text-xl font-bold text-white tracking-wide">Secure Asset Upload</h2>
            <p className="text-sm text-gray-400 mt-1">Upload and encrypt sensitive files before recording ownership on the TrueVault blockchain.</p>
          </div>
          
          {uploadState === 5 ? (
            <div className="text-center py-16 animate-in zoom-in duration-500">
              <CheckCircle className="w-24 h-24 text-green-400 mx-auto mb-6 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
              <h3 className="text-3xl font-bold text-white mb-3">Asset Secured</h3>
              <p className="text-gray-400 max-w-sm mx-auto">Your asset has been successfully encrypted and its ownership proof is recorded on the blockchain.</p>
              <div className="mt-6 inline-block bg-black/40 border border-white/10 px-4 py-2 rounded font-mono text-sm text-primary break-all max-w-full">
                {hash}
              </div>
              <p className="text-sm text-primary mt-8 animate-pulse">Redirecting to secure vault...</p>
            </div>
          ) : (
            <form onSubmit={handleUpload} className="space-y-6">
              
              {error && (
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 flex items-start text-red-400 text-sm">
                  <AlertTriangle className="w-5 h-5 mr-3 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="border-2 border-dashed border-white/20 bg-black/20 rounded-xl p-10 text-center hover:bg-white/5 hover:border-primary/50 transition-all cursor-pointer relative group">
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={uploadState > 0}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
                <label htmlFor="file-upload" className={`block w-full h-full ${uploadState > 0 ? "cursor-default" : "cursor-pointer"}`}>
                  {file ? (
                    <div className="flex flex-col items-center">
                      <File className="w-16 h-16 text-primary mb-4 drop-shadow-[0_0_10px_rgba(0,229,255,0.3)]" />
                      <span className="text-white font-bold text-lg">{file.name}</span>
                      <span className="text-gray-400 text-sm mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB • {file.type || 'Unknown type'}</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <UploadCloud className="w-16 h-16 text-gray-500 mb-4 group-hover:text-primary transition-colors" />
                      <span className="text-gray-300 font-bold text-lg mb-1">Click to select asset or drag and drop</span>
                      <span className="text-gray-500 text-sm">Supported formats: PDF, DOC, JPG, PNG (Max 50MB)</span>
                    </div>
                  )}
                </label>
                
                {file && uploadState === 0 && (
                  <button 
                    type="button" 
                    onClick={(e) => { e.preventDefault(); removeFile(); }}
                    className="absolute top-4 right-4 p-2 rounded-full bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {hash && (
                <div className="bg-black/40 p-5 rounded-lg border border-primary/20 animate-in fade-in">
                  <p className="text-xs text-primary uppercase font-bold mb-2 tracking-wider flex items-center">
                    <Database className="w-4 h-4 mr-2" /> Generated SHA-256 Hash
                  </p>
                  <code className="text-sm text-gray-300 break-all font-mono">{hash}</code>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Asset Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    disabled={uploadState > 0}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full glass-input px-4 py-3 rounded-md font-medium"
                    placeholder="Enter descriptive name..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Classification Type</label>
                  <select
                    value={type}
                    disabled={uploadState > 0}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full glass-input px-4 py-3 rounded-md font-medium [&>option]:text-black appearance-none"
                  >
                    <option value="document">Legal Document</option>
                    <option value="identity">Identity Proof</option>
                    <option value="financial">Financial Record</option>
                    <option value="medical">Medical Record</option>
                    <option value="intellectual">Intellectual Property</option>
                  </select>
                </div>
              </div>

              <Button
                type="submit"
                disabled={!file || uploadState > 0}
                className="w-full py-4 mt-6 text-lg"
              >
                {uploadState > 0 ? 'Processing...' : 'Secure Upload & Mint NFT'}
              </Button>
            </form>
          )}
        </GlassCard>
      </div>

      {/* Visual Process Preview Pipeline */}
      <div className="lg:col-span-1">
        <GlassCard className="p-6 h-full flex flex-col">
          <div className="border-b border-white/10 pb-4 mb-6">
            <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider">Processing Pipeline</h3>
          </div>
          
          <div className="space-y-8 relative before:absolute before:inset-0 before:ml-[1.1rem] before:-translate-x-px before:h-full before:w-0.5 before:bg-white/10 flex-1">
            
            {[
              { step: 1, title: 'Hash Generation', icon: Database },
              { step: 2, title: 'AES-256 Encryption', icon: Lock },
              { step: 3, title: 'NFT Minting', icon: Cpu },
              { step: 4, title: 'Blockchain Confirm', icon: ShieldCheck }
            ].map((item) => {
              const status = getStepStatus(item.step);
              return (
                <div key={item.step} className="relative flex items-center group">
                  <div className={`flex items-center justify-center w-9 h-9 rounded-full border-2 border-black bg-black z-10 shrink-0 ${status.color}`}>
                    <item.icon className="w-4 h-4" />
                  </div>
                  <div className="ml-4">
                    <div className={`font-bold text-sm ${uploadState >= item.step ? 'text-white' : 'text-gray-500'}`}>
                      {item.title}
                    </div>
                    <div className={`text-xs ${uploadState === item.step ? 'text-primary' : 'text-gray-600'} font-mono uppercase tracking-wider mt-0.5`}>
                      {status.label}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 pt-4 border-t border-white/10 text-center">
            <span className="inline-flex items-center text-[10px] text-yellow-500/80 uppercase font-bold tracking-widest border border-yellow-500/20 px-3 py-1.5 rounded-full bg-yellow-500/5">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 mr-2"></span> Demo Mode Active
            </span>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
