import HeroSlider from '@/components/home/HeroSlider';
import IntroSection from '@/components/home/IntroSection';
import Announcements from '@/components/home/Announcements';
import RoomsSlider from '@/components/home/RoomsSlider';
import DiningSlider from '@/components/home/DiningSlider';
import AmenitiesGrid from '@/components/home/AmenitiesGrid';

export default function Home() {
  return (
    <div className="bg-white">
      {/* 1. Hero with Booking Widget */}
      <HeroSlider />
      
      {/* 2. Intro Text / Video */}
      <IntroSection />
      
      {/* 3. Slider for Events & Announcements */}
      <Announcements />
      
      {/* 4. Rooms Highlight */}
      <RoomsSlider />
      
      {/* 5. A La Carte Restaurants Highlight */}
      <DiningSlider />
      
      {/* 6. Facilities Masonry Grid */}
      <AmenitiesGrid />
    </div>
  );
}
