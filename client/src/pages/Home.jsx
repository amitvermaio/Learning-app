import HomeNavbar from '../components/home/HomeNavbar'
import HeroSection from '../components/home/HeroSection';
import FeaturesSection from '../components/home/FeatureSection';
import StepsSection from '../components/home/StepsSection';
import Footer from '../components/home/Footer';

const Home = () => {
  return (
    <div className='min-h-screen bg-slate-50 font-home'>
      <HomeNavbar />
      <HeroSection />
      <FeaturesSection />
      <StepsSection />
      <Footer />
    </div>
  );
};

export default Home;