import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, File, CheckCircle, Database, Lock, ShieldCheck, Cpu, X, AlertTriangle } from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function UploadAsset() {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [type, setType] = useState('document');
  const [uploadState, setUploadState] = useState(0);
  const [hash, setHash] = useState('');
  const [error, setError] = useState('');

  const generateFakeHash = () => { const c = '0123456789abcdef'; let r = ''; for (let i = 0; i < 64; i++) r += c[Math.floor(Math.random() * c.length)]; return r; };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (selected.size > 50 * 1024 * 1024) { setError('File size exceeds the 50MB limit.'); return; }
      setFile(selected); setName(selected.name.split('.')[0]);
    }
  };

  const removeFile = () => { if (uploadState > 0) return; setFile(null); setName(''); setError(''); };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) { setError('Please select a file.'); return; }
    if (!name) { setError('Asset name is required.'); return; }
    setUploadState(1); setHash(generateFakeHash());
    setTimeout(() => setUploadState(2), 1500);
    setTimeout(() => setUploadState(3), 3000);
    setTimeout(() => setUploadState(4), 4500);
    setTimeout(() => { setUploadState(5); setTimeout(() => navigate('/dashboard'), 2500); }, 6000);
  };

  const getStepStatus = (step: number) => {
    if (uploadState > step) return { color: 'text-emerald-600', label: 'Completed' };
    if (uploadState === step) return { color: 'text-primary animate-pulse', label: 'Processing...' };
    return { color: 'text-gray-300', label: 'Waiting' };
  };

  return (
    <div className="max-w-5xl grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <div className="bg-white rounded-[18px] border border-border-light p-8">
          <div className="border-b border-border-light pb-4 mb-6">
            <h2 className="text-xl font-bold text-text-primary">Secure Asset Upload</h2>
            <p className="text-sm text-text-secondary mt-1">Upload and encrypt sensitive files before recording ownership.</p>
          </div>

          {uploadState === 5 ? (
            <div className="text-center py-14">
              <CheckCircle className="w-20 h-20 text-emerald-500 mx-auto mb-5" />
              <h3 className="text-2xl font-bold text-text-primary mb-2">Asset Secured</h3>
              <p className="text-text-secondary max-w-sm mx-auto">Ownership proof recorded on the blockchain.</p>
              <div className="mt-5 inline-block bg-[#F4F6F8] border border-border-light px-4 py-2 rounded-xl font-mono text-sm text-text-secondary break-all max-w-full">{hash}</div>
              <p className="text-sm text-primary mt-6 animate-pulse">Redirecting to vault...</p>
            </div>
          ) : (
            <form onSubmit={handleUpload} className="space-y-6">
              {error && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start text-red-700 text-sm">
                  <AlertTriangle className="w-4 h-4 mr-2.5 shrink-0 mt-0.5" /><span>{error}</span>
                </div>
              )}
              <div className="border-2 border-dashed border-border-light bg-[#F7F8FA] rounded-[16px] p-10 text-center hover:border-primary/40 transition-all cursor-pointer relative group">
                <input type="file" id="file-upload" className="hidden" onChange={handleFileChange} disabled={uploadState > 0} accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" />
                <label htmlFor="file-upload" className={`block w-full ${uploadState > 0 ? 'cursor-default' : 'cursor-pointer'}`}>
                  {file ? (
                    <div className="flex flex-col items-center">
                      <File className="w-14 h-14 text-primary mb-3" />
                      <span className="text-text-primary font-bold text-lg">{file.name}</span>
                      <span className="text-text-secondary text-sm mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB • {file.type || 'Unknown type'}</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <UploadCloud className="w-14 h-14 text-gray-300 mb-3 group-hover:text-primary transition-colors" />
                      <span className="text-text-primary font-bold text-lg mb-1">Click to select or drag and drop</span>
                      <span className="text-text-muted text-sm">PDF, DOC, JPG, PNG (Max 50MB)</span>
                    </div>
                  )}
                </label>
                {file && uploadState === 0 && (
                  <button type="button" onClick={(e) => { e.preventDefault(); removeFile(); }}
                    className="absolute top-3 right-3 p-2 rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {hash && (
                <div className="bg-[#F4F6F8] p-4 rounded-xl border border-border-light">
                  <p className="text-xs text-primary uppercase font-bold mb-1.5 flex items-center"><Database className="w-3.5 h-3.5 mr-1.5" /> SHA-256 Hash</p>
                  <code className="text-sm text-text-secondary break-all font-mono">{hash}</code>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">Asset Name</label>
                  <input type="text" required value={name} disabled={uploadState > 0} onChange={(e) => setName(e.target.value)} className="input-light" placeholder="Name..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">Classification</label>
                  <select value={type} disabled={uploadState > 0} onChange={(e) => setType(e.target.value)} className="input-light appearance-none">
                    <option value="document">Legal Document</option>
                    <option value="identity">Identity Proof</option>
                    <option value="financial">Financial Record</option>
                    <option value="medical">Medical Record</option>
                    <option value="intellectual">Intellectual Property</option>
                  </select>
                </div>
              </div>
              <Button type="submit" disabled={!file || uploadState > 0} className="w-full" size="lg">
                {uploadState > 0 ? 'Processing...' : 'Secure Upload & Mint NFT'}
              </Button>
            </form>
          )}
        </div>
      </div>

      {/* Pipeline */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-[18px] border border-border-light p-6 h-full flex flex-col">
          <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider pb-4 border-b border-border-light mb-6">Processing Pipeline</h3>
          <div className="space-y-7 flex-1">
            {[
              { step: 1, title: 'Hash Generation', icon: Database },
              { step: 2, title: 'AES-256 Encryption', icon: Lock },
              { step: 3, title: 'NFT Minting', icon: Cpu },
              { step: 4, title: 'Blockchain Confirm', icon: ShieldCheck }
            ].map((item) => {
              const status = getStepStatus(item.step);
              return (
                <div key={item.step} className="flex items-center">
                  <div className={`w-9 h-9 rounded-full border-2 border-border-light flex items-center justify-center shrink-0 ${status.color}`}>
                    <item.icon className="w-4 h-4" />
                  </div>
                  <div className="ml-4">
                    <div className={`font-semibold text-sm ${uploadState >= item.step ? 'text-text-primary' : 'text-text-muted'}`}>{item.title}</div>
                    <div className="text-xs text-text-muted font-mono uppercase tracking-wider mt-0.5">{status.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-6 pt-4 border-t border-border-light text-center">
            <span className="text-[10px] text-amber-600 uppercase font-bold tracking-widest bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">Demo Mode</span>
          </div>
        </div>
      </div>
    </div>
  );
}
