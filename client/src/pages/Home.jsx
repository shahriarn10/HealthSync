import HeroSection from "../components/home/HeroSection";
import FeatureCards from "../components/home/FeatureCards";
import HowItWorks from "../components/home/HowItWorks";
import KeyFeatures from "../components/home/KeyFeatures";
import Testimonials from "../components/home/Testimonials";
import Footer from "../components/home/Footer";

export default function Home() {
    return (
        <div className="w-full min-h-screen bg-slate-50">
            {/* The global background gradient is applied in index.css, 
                but we can also put a wrapper here if needed. 
                Using standard wrappers applied in App.jsx but making Home full width */}
            <HeroSection />
            <FeatureCards />
            <HowItWorks />
            <KeyFeatures />
            <Testimonials />
            <Footer />
        </div>
    );
}
