import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, File, CheckCircle } from 'lucide-react';

export default function UploadAsset() {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [type, setType] = useState('document');
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
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
      setHash(generateFakeHash());
    }
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    
    // Simulate upload delay
    setTimeout(() => {
      setUploading(false);
      setSuccess(true);
      setTimeout(() => navigate('/'), 2000);
    }, 2000);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
        <h2 className="text-xl font-semibold mb-6 text-gray-900">Secure File Upload</h2>
        
        {success ? (
          <div className="text-center py-12">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Upload Successful</h3>
            <p className="text-gray-500">Your asset has been securely encrypted and submitted to the TrueVault network.</p>
            <p className="text-sm text-gray-400 mt-4">Redirecting to dashboard...</p>
          </div>
        ) : (
          <form onSubmit={handleUpload} className="space-y-6">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:bg-gray-50 transition-colors">
              <input
                type="file"
                id="file-upload"
                className="hidden"
                onChange={handleFileChange}
                required
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                {file ? (
                  <div className="flex flex-col items-center">
                    <File className="w-12 h-12 text-primary mb-3" />
                    <span className="text-gray-900 font-medium">{file.name}</span>
                    <span className="text-gray-500 text-sm mt-1">{(file.size / 1024).toFixed(2)} KB</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <UploadCloud className="w-12 h-12 text-gray-400 mb-3" />
                    <span className="text-gray-600">Click to upload or drag and drop</span>
                    <span className="text-gray-400 text-sm mt-1">PDF, DOC, JPG up to 10MB</span>
                  </div>
                )}
              </label>
            </div>

            {hash && (
              <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Generated SHA-256 Hash (Demo)</p>
                <code className="text-xs text-gray-800 break-all">{hash}</code>
              </div>
            )}

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Asset Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Asset Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                >
                  <option value="document">Legal Document</option>
                  <option value="identity">Identity Proof</option>
                  <option value="financial">Financial Record</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={!file || uploading}
              className="w-full py-3 px-4 bg-primary text-white font-medium rounded-md hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 transition-colors"
            >
              {uploading ? 'Encrypting & Uploading...' : 'Secure Upload & Mint NFT'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
