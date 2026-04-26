import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Profiles from './pages/Profiles';
import ProfileDetail from './pages/ProfileDetail';
import Search from './pages/Search';
import Account from './pages/Account';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profiles" element={<Profiles />} />
        <Route path="/profiles/:id" element={<ProfileDetail />} />
        <Route path="/search" element={<Search />} />
        <Route path="/account" element={<Account />} />
      </Routes>
    </BrowserRouter>
  );
}
