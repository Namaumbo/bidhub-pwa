import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Clock } from 'lucide-react';
import { MOCK_REQUESTS } from '../../services/mockData';
import type { BuyerRequest } from '../../models/Request';
import styles from './SellerBrowse.module.css';

const CATEGORY_LABELS: Record<string, string> = {
  phones: 'Phones', fashion: 'Fashion', electronics: 'Electronics',
  cars: 'Cars', farming: 'Farming', household: 'Household', beauty: 'Beauty',
};

function timeAgo(ts: number) {
  const diff = Date.now() - ts;
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

const SellerBrowse = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(MOCK_REQUESTS.map((r) => r.category)))];

  const filtered = MOCK_REQUESTS.filter((r) => {
    const matchQuery =
      r.title.toLowerCase().includes(query.toLowerCase()) ||
      r.description.toLowerCase().includes(query.toLowerCase());
    const matchCat = activeCategory === 'all' || r.category === activeCategory;
    return matchQuery && matchCat && r.status === 'open';
  });

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>{t('seller_browse_title')}</h1>

      <div className={styles.searchWrapper}>
        <Search size={18} className={styles.searchIcon} />
        <input
          type="text"
          placeholder={t('search_placeholder')}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.categoryTabs}>
        {categories.map((cat) => (
          <button
            key={cat}
            className={`${styles.tab} ${activeCategory === cat ? styles.tabActive : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat === 'all' ? 'All' : CATEGORY_LABELS[cat] || cat}
          </button>
        ))}
      </div>

      <div className={styles.list}>
        {filtered.length === 0 && (
          <div className={styles.empty}>No open requests found</div>
        )}
        {filtered.map((req) => (
          <RequestRow key={req.id} req={req} onBid={() => navigate(`/request/${req.id}`)} />
        ))}
      </div>
    </div>
  );
};

const RequestRow = ({ req, onBid }: { req: BuyerRequest; onBid: () => void }) => (
  <div className={styles.card} onClick={onBid}>
    <div className={styles.cardLeft}>
      {req.images?.[0] ? (
        <img src={req.images[0]} alt={req.title} className={styles.cardImg} />
      ) : (
        <div className={styles.cardImgPlaceholder}>
          {req.category[0].toUpperCase()}
        </div>
      )}
    </div>
    <div className={styles.cardBody}>
      <div className={styles.cardTop}>
        <span className={styles.categoryPill}>{CATEGORY_LABELS[req.category]}</span>
        <span className={styles.time}><Clock size={11} /> {timeAgo(req.createdAt)}</span>
      </div>
      <h3 className={styles.cardTitle}>{req.title}</h3>
      <p className={styles.cardDesc}>{req.description}</p>
      <div className={styles.cardBottom}>
        <div className={styles.metaItem}>
          <MapPin size={11} />
          <span>{req.location}</span>
        </div>
        <span className={styles.budget}>MK {req.budget.toLocaleString()}</span>
      </div>
      <div className={styles.bidBadge}>
        {req.bidCount} {req.bidCount === 1 ? 'bid' : 'bids'} · Tap to bid
      </div>
    </div>
  </div>
);

export default SellerBrowse;
