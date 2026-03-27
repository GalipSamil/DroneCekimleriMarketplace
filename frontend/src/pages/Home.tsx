import { useNavigate } from 'react-router-dom';
import { HeroSection } from '../components/home/HeroSection';
import { FeaturesSection } from '../components/home/FeaturesSection';
import { PilotsSection } from '../components/home/PilotsSection';
import { CTASection } from '../components/home/CTASection';

export default function Home() {
    const navigate = useNavigate();

    const handleSearch = (query: string) => {
        navigate(`/browse-services?search=${encodeURIComponent(query)}`);
    };

    return (
        <div className="min-h-screen bg-[#020617] text-slate-50 relative overflow-x-hidden">
            {/* Ambient Background */}
            <div className="fixed top-0 left-1/4 w-[700px] h-[700px] bg-blue-600/8 rounded-full blur-[150px] -z-10 animate-pulse-slow pointer-events-none" />
            <div className="fixed bottom-[-10%] right-[-5%] w-[700px] h-[700px] bg-emerald-500/8 rounded-full blur-[150px] -z-10 animate-pulse-slow delay-1000 pointer-events-none" />

            <HeroSection onSearch={handleSearch} />
            <FeaturesSection />
            <PilotsSection />
            <CTASection />
        </div>
    );
}
