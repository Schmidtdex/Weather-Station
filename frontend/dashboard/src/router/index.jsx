import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Dashboard from "../pages/Dashboard";
import History from "../pages/History";


export const AppRouter = () => {
    return (
        <BrowserRouter>
        <div style={{ background: 'var(--surface)', minHeight: '100vh' }}>
            <Sidebar />
        <main style={{ paddingLeft: '240px', paddingTop: '72px', paddingBottom: '40px', paddingRight: '32px', minHeight: '100vh' }}>
          <div style={{ padding: '24px 0' }}>
            <Routes>
                <Route path="/" element={<Dashboard />}/>
                <Route path="/historico" element={<History />}/>
            </Routes>
            </div>
            </main>
            </div>
        </BrowserRouter>
    );
}