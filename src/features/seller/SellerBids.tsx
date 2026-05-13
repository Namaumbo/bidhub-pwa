import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Gavel, CheckCircle, XCircle, Clock } from 'lucide-react';
import { MY_BIDS } from '../../services/mockData';
import styles from './SellerBids.module.css';

const statusIcon = {
  pending: <Clock size={14} />,
  accepted: <CheckCircle size={14} />,
  declined: <XCircle size={14} />,
};

const statusStyle = {
  pending: { color: '#F59E0B', background: 'rgba(245,158,11,0.1)' },
  accepted: { color: '#27AE60', background: 'rgba(39,174,96,0.1)' },
  declined: { color: 'var(--error)', background: 'rgba(211,47,47,0.08)' },
};

const SellerBids = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{t('my_bids')}</h1>

      {MY_BIDS.length === 0 ? (
        <div className={styles.emptyState}>
          <Gavel size={48} color="var(--primary)" strokeWidth={1.5} />
          <p className={styles.emptyTitle}>{t('no_seller_bids')}</p>
          <p className={styles.emptySub}>{t('no_seller_bids_sub')}</p>
          <button className={styles.browseBtn} onClick={() => navigate('/')}>
            {t('go_browse')}
          </button>
        </div>
      ) : (
        <div className={styles.bidList}>
          {MY_BIDS.map((bid) => (
            <div key={bid.id} className={styles.bidCard}>
              <div className={styles.bidHeader}>
                <h3 className={styles.bidTitle}>{bid.requestTitle}</h3>
                <div className={styles.statusTag} style={statusStyle[bid.status]}>
                  {statusIcon[bid.status]}
                  <span>{t(`bid_${bid.status}`)}</span>
                </div>
              </div>
              <p className={styles.bidDesc}>{bid.description}</p>
              <div className={styles.bidFooter}>
                <span className={styles.bidPrice}>MK {bid.price.toLocaleString()}</span>
                <span className={styles.bidTime}>
                  {new Date(bid.createdAt).toLocaleDateString()}
                </span>
              </div>
              {bid.status === 'accepted' && (
                <div className={styles.acceptedNote}>
                  🎉 Your bid was accepted! Contact the buyer to proceed.
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SellerBids;
