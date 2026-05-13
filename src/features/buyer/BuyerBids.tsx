import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Star, CheckCircle, XCircle } from 'lucide-react';
import { MOCK_REQUESTS, MOCK_BIDS } from '../../services/mockData';
import type { Bid } from '../../models/Bid';
import styles from './BuyerBids.module.css';

const BuyerBids = () => {
  const { t } = useTranslation();
  const { requestId } = useParams<{ requestId: string }>();
  const navigate = useNavigate();

  const request = MOCK_REQUESTS.find((r) => r.id === requestId);
  const [bids, setBids] = useState<Bid[]>(MOCK_BIDS.filter((b) => b.requestId === requestId));
  const [accepted, setAccepted] = useState<string | null>(null);

  const handleAccept = (bidId: string) => {
    setAccepted(bidId);
    setBids((prev) =>
      prev.map((b) => ({
        ...b,
        status: b.id === bidId ? 'accepted' : 'declined',
      }))
    );
  };

  const handleDecline = (bidId: string) => {
    setBids((prev) =>
      prev.map((b) => b.id === bidId ? { ...b, status: 'declined' } : b)
    );
  };

  if (!request) {
    return (
      <div className={styles.container}>
        <p>Request not found</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <button className={styles.backBtn} onClick={() => navigate(-1)}>
        <ArrowLeft size={20} />
      </button>

      {/* Request summary */}
      <div className={styles.requestCard}>
        {request.images?.[0] && (
          <img src={request.images[0]} alt={request.title} className={styles.requestImg} />
        )}
        <div className={styles.requestInfo}>
          <h2 className={styles.requestTitle}>{request.title}</h2>
          <p className={styles.requestDesc}>{request.description}</p>
          <div className={styles.requestMeta}>
            <div className={styles.metaItem}>
              <MapPin size={12} />
              <span>{request.location}</span>
            </div>
            <span className={styles.budget}>Budget: MK {request.budget.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Bids */}
      <div className={styles.bidsSection}>
        <h3 className={styles.bidsTitle}>
          {bids.length} {bids.length === 1 ? t('bid_count_singular') : t('bids_count')} received
        </h3>

        {accepted && (
          <div className={styles.acceptedBanner}>
            <CheckCircle size={18} />
            You've accepted a bid! Contact the seller to proceed.
          </div>
        )}

        {bids.length === 0 ? (
          <div className={styles.emptyBids}>
            <p>{t('no_bids')}</p>
            <p className={styles.emptyBidsSub}>{t('no_bids_sub')}</p>
          </div>
        ) : (
          <div className={styles.bidList}>
            {bids.map((bid) => (
              <div
                key={bid.id}
                className={`${styles.bidCard} ${bid.status === 'accepted' ? styles.bidAccepted : ''} ${bid.status === 'declined' ? styles.bidDeclined : ''}`}
              >
                <div className={styles.bidHeader}>
                  <div className={styles.sellerInfo}>
                    <div className={styles.sellerAvatar}>
                      {bid.sellerName[0]}
                    </div>
                    <div>
                      <p className={styles.sellerName}>{bid.sellerName}</p>
                      <div className={styles.rating}>
                        <Star size={11} fill="#F59E0B" color="#F59E0B" />
                        <span>{bid.sellerRating}</span>
                      </div>
                    </div>
                  </div>
                  <div className={styles.bidPrice}>MK {bid.price.toLocaleString()}</div>
                </div>

                <p className={styles.bidDesc}>{bid.description}</p>

                {bid.status === 'pending' && !accepted && (
                  <div className={styles.bidActions}>
                    <button
                      className={styles.acceptBtn}
                      onClick={() => handleAccept(bid.id)}
                    >
                      <CheckCircle size={16} />
                      {t('accept_bid')}
                    </button>
                    <button
                      className={styles.declineBtn}
                      onClick={() => handleDecline(bid.id)}
                    >
                      <XCircle size={16} />
                      {t('decline_bid')}
                    </button>
                  </div>
                )}

                {bid.status === 'accepted' && (
                  <div className={styles.statusTag} style={{ color: '#27AE60', background: 'rgba(39,174,96,0.1)' }}>
                    <CheckCircle size={13} /> {t('bid_accepted')}
                  </div>
                )}

                {bid.status === 'declined' && (
                  <div className={styles.statusTag} style={{ color: 'var(--error)', background: 'rgba(211,47,47,0.08)' }}>
                    <XCircle size={13} /> {t('bid_declined')}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BuyerBids;
