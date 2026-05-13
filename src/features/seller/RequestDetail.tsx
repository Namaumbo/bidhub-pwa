import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, CheckCircle } from 'lucide-react';
import { MOCK_REQUESTS } from '../../services/mockData';
import styles from './RequestDetail.module.css';

function timeAgo(ts: number) {
  const diff = Date.now() - ts;
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

const RequestDetail = () => {
  const { t } = useTranslation();
  const { requestId } = useParams<{ requestId: string }>();
  const navigate = useNavigate();

  const request = MOCK_REQUESTS.find((r) => r.id === requestId);
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!request) {
    return (
      <div className={styles.container}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}><ArrowLeft size={20} /></button>
        <p>Request not found.</p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setSuccess(true);
  };

  if (success) {
    return (
      <div className={styles.success}>
        <div className={styles.successIcon}>
          <CheckCircle size={56} color="var(--success)" />
        </div>
        <h2>{t('success_bid')}</h2>
        <button className={styles.btnPrimary} onClick={() => navigate('/')}>
          Back to Browse
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <button className={styles.backBtn} onClick={() => navigate(-1)}>
        <ArrowLeft size={20} />
      </button>

      {/* Request detail */}
      {request.images?.[0] && (
        <img src={request.images[0]} alt={request.title} className={styles.heroImg} />
      )}

      <div className={styles.requestInfo}>
        <h2 className={styles.requestTitle}>{request.title}</h2>
        <p className={styles.requestDesc}>{request.description}</p>
        <div className={styles.requestMeta}>
          <div className={styles.metaItem}><MapPin size={13} /><span>{request.location}</span></div>
          <div className={styles.metaItem}><Clock size={13} /><span>{timeAgo(request.createdAt)}</span></div>
        </div>
        <div className={styles.budgetRow}>
          <span className={styles.budgetLabel}>Buyer's Budget</span>
          <span className={styles.budgetValue}>MK {request.budget.toLocaleString()}</span>
        </div>
      </div>

      {/* Bid form */}
      <div className={styles.bidForm}>
        <h3 className={styles.formTitle}>{t('submit_bid')}</h3>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>{t('bid_price_label')} *</label>
            <input
              type="number"
              placeholder="Your price"
              className={styles.input}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>{t('bid_desc_label')} *</label>
            <textarea
              placeholder={t('bid_desc_ph')}
              className={styles.textarea}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <button type="submit" className={styles.btnPrimary} disabled={loading}>
            {loading ? 'Submitting...' : t('submit_bid_btn')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RequestDetail;
