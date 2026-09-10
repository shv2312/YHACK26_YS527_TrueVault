import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import DashboardLayout from './layouts/DashboardLayout';
import Landing from './pages/Landing';
import PublicVerify from './pages/PublicVerify';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import UploadAsset from './pages/UploadAsset';
import AssetDetails from './pages/AssetDetails';
import RoleAccess from './pages/RoleAccess';
import AuditTrail from './pages/AuditTrail';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/verify" element={<PublicVerify />} />
          <Route path="/login" element={<Login />} />
          
          {/* Protected Dashboard Routes */}
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/upload" element={<UploadAsset />} />
            <Route path="/asset/:id" element={<AssetDetails />} />
            <Route path="/roles" element={<RoleAccess />} />
            <Route path="/audit" element={<AuditTrail />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
