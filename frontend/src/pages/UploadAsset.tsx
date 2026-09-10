import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, File, CheckCircle, Database, Lock, ShieldCheck, Cpu } from 'lucide-react';

export default function UploadAsset() {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [type, setType] = useState('document');
  const [uploadState, setUploadState] = useState(0); // 0: init, 1: hash, 2: encrypt, 3: mint, 4: confirm, 5: success
  const [hash, setHash] = useState('');

  const generateFakeHash = () => {
    const chars = '0123456789abcdef';
    let result = '';
    for (let i = 0; i < 64; i++) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setName(e.target.files[0].name);
    }
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    
    setUploadState(1);
    setHash(generateFakeHash());
    
    // Simulate pipeline
    setTimeout(() => setUploadState(2), 1500); // Encryption
    setTimeout(() => setUploadState(3), 3000); // NFT Minting
    setTimeout(() => setUploadState(4), 4500); // Blockchain Conf
    setTimeout(() => {
      setUploadState(5); // Success
      setTimeout(() => navigate('/'), 2000);
    }, 6000);
  };

  const getStepStatus = (step: number) => {
    if (uploadState > step) return 'text-green-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]';
    if (uploadState === step) return 'text-primary animate-pulse drop-shadow-[0_0_8px_rgba(0,229,255,0.5)]';
    return 'text-gray-600';
  };

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2">
        <div className="glass-panel rounded-xl p-8">
          <h2 className="text-xl font-semibold mb-6 text-white border-b border-white/10 pb-4">Secure File Upload</h2>
          
          {uploadState === 5 ? (
            <div className="text-center py-12 animate-in zoom-in duration-500">
              <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-6 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
              <h3 className="text-2xl font-bold text-white mb-2">Asset Secured</h3>
              <p className="text-gray-400">Your asset has been securely encrypted and submitted to the TrueVault network.</p>
              <p className="text-sm text-primary mt-4">Redirecting to dashboard...</p>
            </div>
          ) : (
            <form onSubmit={handleUpload} className="space-y-6">
              <div className="border-2 border-dashed border-white/20 rounded-xl p-10 text-center hover:bg-white/5 hover:border-primary/50 transition-all cursor-pointer">
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={uploadState > 0}
                  required
                />
                <label htmlFor="file-upload" className={uploadState > 0 ? "cursor-default" : "cursor-pointer"}>
                  {file ? (
                    <div className="flex flex-col items-center">
                      <File className="w-16 h-16 text-primary mb-4 drop-shadow-[0_0_10px_rgba(0,229,255,0.3)]" />
                      <span className="text-white font-medium text-lg">{file.name}</span>
                      <span className="text-gray-400 text-sm mt-1">{(file.size / 1024).toFixed(2)} KB</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <UploadCloud className="w-16 h-16 text-gray-500 mb-4" />
                      <span className="text-gray-300 font-medium">Click to select asset or drag and drop</span>
                      <span className="text-gray-500 text-sm mt-2">Maximum file size: 50MB</span>
                    </div>
                  )}
                </label>
              </div>

              {hash && (
                <div className="bg-black/30 p-4 rounded-md border border-white/10 animate-in fade-in">
                  <p className="text-xs text-primary uppercase font-bold mb-1 tracking-wider">Generated SHA-256 Hash (Demo)</p>
                  <code className="text-xs text-gray-300 break-all">{hash}</code>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Asset Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    disabled={uploadState > 0}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full glass-input px-4 py-2.5 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Asset Type</label>
                  <select
                    value={type}
                    disabled={uploadState > 0}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full glass-input px-4 py-2.5 rounded-md [&>option]:text-black"
                  >
                    <option value="document">Legal Document</option>
                    <option value="identity">Identity Proof</option>
                    <option value="financial">Financial Record</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={!file || uploadState > 0}
                className="w-full py-3.5 px-4 glass-button text-white font-bold tracking-wide rounded-md disabled:opacity-50 mt-4"
              >
                {uploadState > 0 ? 'Processing...' : 'Secure Upload & Mint NFT'}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Visual Process Preview Pipeline */}
      <div className="md:col-span-1">
        <div className="glass-card rounded-xl p-6 h-full">
          <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-6 border-b border-white/10 pb-3">Processing Pipeline</h3>
          
          <div className="space-y-8 relative before:absolute before:inset-0 before:ml-[1.1rem] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-white/20 before:to-transparent">
            
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className={`flex items-center justify-center w-9 h-9 rounded-full border-2 border-white/20 bg-black shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 ${getStepStatus(1)}`}>
                <Database className="w-4 h-4" />
              </div>
              <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] ml-4 md:ml-0 md:group-odd:pr-8 md:group-even:pl-8">
                <div className="flex items-center justify-between space-x-2 mb-1">
                  <div className={`font-bold text-sm ${uploadState >= 1 ? 'text-white' : 'text-gray-500'}`}>1. Hash Generate</div>
                </div>
              </div>
            </div>

            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className={`flex items-center justify-center w-9 h-9 rounded-full border-2 border-white/20 bg-black shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 ${getStepStatus(2)}`}>
                <Lock className="w-4 h-4" />
              </div>
              <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] ml-4 md:ml-0 md:group-odd:pr-8 md:group-even:pl-8">
                <div className="flex items-center justify-between space-x-2 mb-1">
                  <div className={`font-bold text-sm ${uploadState >= 2 ? 'text-white' : 'text-gray-500'}`}>2. AES Encryption</div>
                </div>
              </div>
            </div>

            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className={`flex items-center justify-center w-9 h-9 rounded-full border-2 border-white/20 bg-black shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 ${getStepStatus(3)}`}>
                <Cpu className="w-4 h-4" />
              </div>
              <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] ml-4 md:ml-0 md:group-odd:pr-8 md:group-even:pl-8">
                <div className="flex items-center justify-between space-x-2 mb-1">
                  <div className={`font-bold text-sm ${uploadState >= 3 ? 'text-white' : 'text-gray-500'}`}>3. NFT Minting</div>
                </div>
              </div>
            </div>

            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className={`flex items-center justify-center w-9 h-9 rounded-full border-2 border-white/20 bg-black shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 ${getStepStatus(4)}`}>
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] ml-4 md:ml-0 md:group-odd:pr-8 md:group-even:pl-8">
                <div className="flex items-center justify-between space-x-2 mb-1">
                  <div className={`font-bold text-sm ${uploadState >= 4 ? 'text-white' : 'text-gray-500'}`}>4. Blockchain Confirm</div>
                </div>
              </div>
            </div>

          </div>

          <div className="mt-8 text-center">
            <span className="text-[10px] text-gray-500 uppercase font-mono tracking-widest border border-white/10 px-2 py-1 rounded bg-black/50">Demo Mode Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}
