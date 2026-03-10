import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PromoModal from '@/components/ui/PromoModal';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      <PromoModal />
    </>
  );
}
