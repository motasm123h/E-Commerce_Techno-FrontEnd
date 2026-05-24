import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

export default function PublicLayout() {
    return (
        <div className="flex flex-col min-h-screen bg-black">
            <Header />
            
            {/* Main Yield Processing Content Window Frame */}
            <main className="flex-1 bg-white">
                <Outlet />
            </main>

            {/* Structured Multi-Column Corporate Directory Footer */}
            <Footer />
        </div>
    );
}