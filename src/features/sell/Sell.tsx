import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Camera, X, CheckCircle } from 'lucide-react';
import { compressImage } from '../../services/imageUtils';
import { storage, db, auth } from '../../services/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import styles from './Sell.module.css';
import type { Category } from '../../models/Product';

const CATEGORIES: { id: Category; label: string }[] = [
  { id: 'phones', label: 'category_phones' },
  { id: 'fashion', label: 'category_fashion' },
  { id: 'electronics', label: 'category_electronics' },
  { id: 'cars', label: 'category_cars' },
  { id: 'farming', label: 'category_farming' },
  { id: 'household', label: 'category_household' },
  { id: 'beauty', label: 'category_beauty' },
];

const Sell = () => {
  const { t } = useTranslation();
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState<Category | ''>('');
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
    if (!auth.currentUser || images.length === 0 || !category) return;

    setLoading(true);
    try {
      const imageUrls = await Promise.all(
        images.map(async (img) => {
          const storageRef = ref(storage, `products/${Date.now()}-${img.name}`);
          const snapshot = await uploadBytes(storageRef, img);
          return getDownloadURL(snapshot.ref);
        })
      );

      await addDoc(collection(db, 'products'), {
        sellerId: auth.currentUser.uid,
        sellerName: auth.currentUser.displayName || 'Anonymous',
        sellerRating: 5.0,
        title,
        description,
        price: Number(price),
        category,
        images: imageUrls,
        location: 'Lilongwe',
        status: 'available',
        createdAt: Date.now(),
      });

      setSuccess(true);
    } catch (error) {
      console.error('Error posting item:', error);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className={styles.success}>
        <CheckCircle size={72} color="var(--success)" />
        <h2>{t('success_post')}</h2>
        <button className={styles.btnPrimary} onClick={() => window.location.reload()}>
          {t('continue')}
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{t('sell_title')}</h1>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.imageGrid}>
          {previews.map((src, i) => (
            <div key={i} className={styles.imagePreview}>
              <img src={src} alt="preview" />
              <button type="button" onClick={() => removeImage(i)} className={styles.removeBtn}>
                <X size={14} />
              </button>
            </div>
          ))}
          {images.length < 5 && (
            <label className={styles.addBtn}>
              <Camera size={22} />
              <span>{t('add_photos')}</span>
              <input type="file" accept="image/*" onChange={handleImageChange} hidden />
            </label>
          )}
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>{t('item_title')}</label>
          <input
            type="text"
            placeholder="e.g. iPhone 13 Pro Max"
            className={styles.input}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>{t('item_description')}</label>
          <textarea
            placeholder="Describe your item..."
            className={styles.textarea}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>{t('item_price')} (MWK)</label>
          <input
            type="number"
            placeholder="0"
            className={styles.input}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>{t('select_category')}</label>
          <select
            className={styles.select}
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            required
          >
            <option value="">{t('select_category')}</option>
            {CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {t(cat.label)}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className={styles.btnPrimary} disabled={loading || images.length === 0}>
          {loading ? t('uploading') : t('post_item')}
        </button>
      </form>
    </div>
  );
};

export default Sell;
