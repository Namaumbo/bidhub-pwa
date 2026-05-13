import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { MOCK_PRODUCTS } from '../../services/mockData';
import ProductCard from '../../components/ProductCard';
import styles from './Home.module.css';
import { Smartphone, Shirt, Tv, Car, Sprout, Home as HomeIcon, Sparkles, Search, Bell } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const CATEGORIES = [
  { id: 'phones', icon: Smartphone, label: 'category_phones', color: '#FF6B35', bg: 'rgba(255,107,53,0.1)' },
  { id: 'fashion', icon: Shirt, label: 'category_fashion', color: '#9B59B6', bg: 'rgba(155,89,182,0.1)' },
  { id: 'electronics', icon: Tv, label: 'category_electronics', color: '#2980B9', bg: 'rgba(41,128,185,0.1)' },
  { id: 'cars', icon: Car, label: 'category_cars', color: '#E74C3C', bg: 'rgba(231,76,60,0.1)' },
  { id: 'farming', icon: Sprout, label: 'category_farming', color: '#27AE60', bg: 'rgba(39,174,96,0.1)' },
  { id: 'household', icon: HomeIcon, label: 'category_household', color: '#F39C12', bg: 'rgba(243,156,18,0.1)' },
  { id: 'beauty', icon: Sparkles, label: 'category_beauty', color: '#E91E8C', bg: 'rgba(233,30,140,0.1)' },
];

const Home = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const firstName = user?.displayName?.split(' ')[0] || user?.phoneNumber?.slice(-4) || 'there';

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <div>
            <p className={styles.greeting}>Good day, <strong>{firstName}</strong> 👋</p>
            <div className={styles.location}>
              <span className={styles.locationDot} />
              <span>Lilongwe, MW</span>
            </div>
          </div>
          <button className={styles.notifBtn}>
            <Bell size={20} />
            <span className={styles.notifDot} />
          </button>
        </div>
        <button className={styles.searchBar} onClick={() => navigate('/search')}>
          <Search size={18} />
          <span>{t('search_placeholder')}</span>
        </button>
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{t('categories')}</h2>
        <div className={styles.categoryScroll}>
          {CATEGORIES.map((cat) => (
            <div key={cat.id} className={styles.categoryCard}>
              <div className={styles.categoryIcon} style={{ backgroundColor: cat.bg, color: cat.color }}>
                <cat.icon size={22} />
              </div>
              <span>{t(cat.label)}</span>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>{t('featured')}</h2>
          <button className={styles.seeAll}>See all</button>
        </div>
        <div className={styles.productGrid}>
          {MOCK_PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>{t('nearby')}</h2>
          <button className={styles.seeAll}>See all</button>
        </div>
        <div className={styles.productGrid}>
          {[...MOCK_PRODUCTS].reverse().map((product) => (
            <ProductCard key={`nearby-${product.id}`} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
