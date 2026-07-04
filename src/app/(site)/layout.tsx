import Header from '../components/Header';
import Footer from '../components/Footer';

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={styles.layoutWrapper}>
      <Header />
      <main style={styles.mainContent}>
        {children}
      </main>
      <Footer />
    </div>
  );
}

const styles = {
  layoutWrapper: {
    display: 'flex',
    flexDirection: 'column' as const,
    minHeight: '100vh',
    width: '100%',
  },
  mainContent: {
    flex: '1 0 auto',
    display: 'flex',
    flexDirection: 'column' as const,
    width: '100%',
  },
};
