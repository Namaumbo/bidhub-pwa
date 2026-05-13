import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, ChevronRight, MapPin, Bell } from 'lucide-react';
import { MOCK_REQUESTS } from '../../services/mockData';
import { useAuthStore } from '../../store/authStore';
import type { BuyerRequest } from '../../models/Request';
import styles from './BuyerHome.module.css';

const StatusBadge = ({ status }: { status: BuyerRequest['status'] }) => {
  const labels = { open: 'Open', accepted: 'Accepted', closed: 'Closed' };
  return <span className={`${styles.badge} ${styles[`badge_${status}`]}`}>{labels[status]}</span>;
};

const BuyerHome = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const firstName = user?.displayName?.split(' ')[0] || 'there';

  // In real app this would filter by buyerId === user.uid
  const [requests] = useState(MOCK_REQUESTS.slice(0, 2));

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <p className={styles.greeting}>Hello, <strong>{firstName}</strong> 👋</p>
          <p className={styles.sub}>Track your requests & bids</p>
        </div>
        <button className={styles.notifBtn}>
          <Bell size={20} />
          <span className={styles.notifDot} />
        </button>
      </header>

      <div className={styles.summaryRow}>
        <div className={styles.summaryCard}>
          <span className={styles.summaryValue}>{requests.length}</span>
          <span className={styles.summaryLabel}>Active Requests</span>
        </div>
        <div className={styles.summaryCard}>
          <span className={styles.summaryValue} style={{ color: '#27AE60' }}>
            {requests.reduce((acc, r) => acc + r.bidCount, 0)}
          </span>
          <span className={styles.summaryLabel}>Total Bids</span>
        </div>
      </div>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>{t('my_requests')}</h2>
        </div>

        {requests.length === 0 ? (
          <div className={styles.emptyState}>
            <ClipboardList size={48} color="var(--primary)" strokeWidth={1.5} />
            <p className={styles.emptyTitle}>{t('no_requests')}</p>
            <p className={styles.emptySub}>{t('no_requests_sub')}</p>
          </div>
        ) : (
          <div className={styles.requestList}>
            {requests.map((req) => (
              <div
                key={req.id}
                className={styles.requestCard}
                onClick={() => navigate(`/bids/${req.id}`)}
              >
                {req.images?.[0] && (
                  <img src={req.images[0]} alt={req.title} className={styles.requestImg} />
                )}
                <div className={styles.requestBody}>
                  <div className={styles.requestTop}>
                    <h3 className={styles.requestTitle}>{req.title}</h3>
                    <StatusBadge status={req.status} />
                  </div>
                  <p className={styles.requestDesc}>{req.description}</p>
                  <div className={styles.requestMeta}>
                    <div className={styles.metaItem}>
                      <MapPin size={12} />
                      <span>{req.location}</span>
                    </div>
                    <span className={styles.budget}>MK {req.budget.toLocaleString()}</span>
                  </div>
                  <div className={styles.bidRow}>
                    <span className={styles.bidCount}>
                      {req.bidCount} {req.bidCount === 1 ? t('bid_count_singular') : t('bids_count')} received
                    </span>
                    <div className={styles.viewBids}>
                      View bids <ChevronRight size={14} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default BuyerHome;
