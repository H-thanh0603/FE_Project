import HeroSection from '../components/home/HeroSection';
import CategorySection from '../components/home/CategorySection';
import FlashDropSection from '../components/home/FlashDropSection';
import FeaturedProducts from '../components/home/FeaturedProducts';
import TechSection from '../components/home/TechSection';
import TrustBadges from '../components/home/TrustBadges';
import CommunitySection from '../components/home/CommunitySection';
import NewsletterSection from '../components/home/NewsletterSection';
import RecentlyViewed from '../components/product/RecentlyViewed';
import useDocumentTitle from '../hooks/useDocumentTitle';
import '../components/home/home.css';

export default function Home() {
  useDocumentTitle('Trang chủ — Giày Thể Thao Cao Cấp');

  return (
    <div className="page-home">
      <HeroSection />
      <CategorySection />
      <FlashDropSection />
      <FeaturedProducts />
      <RecentlyViewed />
      <TechSection />
      <TrustBadges />
      <CommunitySection />
      <NewsletterSection />
    </div>
  );
}
