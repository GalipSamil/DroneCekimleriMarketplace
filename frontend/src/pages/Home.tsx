import { useNavigate } from 'react-router-dom';
import { HeroSection } from '../components/home/HeroSection';
import { FeaturesSection } from '../components/home/FeaturesSection';
import { PilotsSection } from '../components/home/PilotsSection';
import { CTASection } from '../components/home/CTASection';
import { usePreferences } from '../context/preferences';

export default function Home() {
    const { theme } = usePreferences();
    const navigate = useNavigate();
    const isLight = theme === 'light';

    const handleSearch = (query: string) => {
        navigate(`/browse-services?search=${encodeURIComponent(query)}`);
    };

    return (
        <div className={`min-h-screen relative overflow-x-hidden ${isLight ? 'bg-slate-50 text-slate-950' : 'bg-[#020617] text-slate-50'}`}>

            <HeroSection onSearch={handleSearch} />
            <FeaturesSection />
            <PilotsSection />
            <CTASection />
        </div>
    );
}
