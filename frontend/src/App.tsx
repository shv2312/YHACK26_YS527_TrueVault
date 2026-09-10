import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import UploadAsset from './pages/UploadAsset';
import AssetDetails from './pages/AssetDetails';
import RoleAccess from './pages/RoleAccess';
import AuditTrail from './pages/AuditTrail';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Protected Dashboard Routes */}
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/upload" element={<UploadAsset />} />
          <Route path="/asset/:id" element={<AssetDetails />} />
          <Route path="/roles" element={<RoleAccess />} />
          <Route path="/audit" element={<AuditTrail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
