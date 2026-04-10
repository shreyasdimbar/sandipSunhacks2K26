import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

export default function Layout() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <Navbar />
        <main className="flex-1 overflow-auto bg-background/50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
