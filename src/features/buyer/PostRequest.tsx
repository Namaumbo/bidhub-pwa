import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Camera, X, CheckCircle } from 'lucide-react';
import { compressImage } from '../../services/imageUtils';
import styles from './PostRequest.module.css';
import type { Category } from '../../models/Request';

const CATEGORIES: { id: Category; label: string }[] = [
  { id: 'phones', label: 'category_phones' },
  { id: 'fashion', label: 'category_fashion' },
  { id: 'electronics', label: 'category_electronics' },
  { id: 'cars', label: 'category_cars' },
  { id: 'farming', label: 'category_farming' },
  { id: 'household', label: 'category_household' },
  { id: 'beauty', label: 'category_beauty' },
];

const PostRequest = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [category, setCategory] = useState<Category | ''>('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      const compressed = await compressImage(file);
      setImages([...images, compressed as File]);
      setPreviews([...previews, URL.createObjectURL(compressed)]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate upload
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
        <h2>{t('success_request')}</h2>
        <button className={styles.btnPrimary} onClick={() => navigate('/')}>
          {t('continue')}
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{t('post_request_title')}</h1>

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Optional photos */}
        <div className={styles.imageGrid}>
          {previews.map((src, i) => (
            <div key={i} className={styles.imagePreview}>
              <img src={src} alt="preview" />
              <button type="button" onClick={() => removeImage(i)} className={styles.removeBtn}>
                <X size={14} />
              </button>
            </div>
          ))}
          {images.length < 3 && (
            <label className={styles.addBtn}>
              <Camera size={22} />
              <span>{t('add_photos')}</span>
              <input type="file" accept="image/*" onChange={handleImageChange} hidden />
            </label>
          )}
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>{t('request_title_label')} *</label>
          <input
            type="text"
            placeholder={t('request_title_ph')}
            className={styles.input}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>{t('request_desc_label')} *</label>
          <textarea
            placeholder={t('request_desc_ph')}
            className={styles.textarea}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className={styles.row}>
          <div className={styles.fieldGroup} style={{ flex: 1 }}>
            <label className={styles.label}>{t('request_budget_label')} *</label>
            <input
              type="number"
              placeholder="0"
              className={styles.input}
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              required
            />
          </div>
          <div className={styles.fieldGroup} style={{ flex: 1 }}>
            <label className={styles.label}>{t('request_location_label')} *</label>
            <input
              type="text"
              placeholder="e.g. Lilongwe"
              className={styles.input}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>{t('select_category')} *</label>
          <select
            className={styles.select}
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            required
          >
            <option value="">{t('select_category')}</option>
            {CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>{t(cat.label)}</option>
            ))}
          </select>
        </div>

        <button type="submit" className={styles.btnPrimary} disabled={loading}>
          {loading ? t('uploading') : t('post_request_btn')}
        </button>
      </form>
    </div>
  );
};

export default PostRequest;
