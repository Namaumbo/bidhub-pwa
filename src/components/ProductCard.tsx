import { useState } from 'react';
import styles from './ProductCard.module.css';
import type { Product } from '../models/Product';
import { MapPin, Heart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [liked, setLiked] = useState(false);

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <img src={product.images[0]} alt={product.title} loading="lazy" />
        <div className={styles.gradient} />
        <button
          className={`${styles.heartBtn} ${liked ? styles.heartActive : ''}`}
          onClick={(e) => { e.stopPropagation(); setLiked(!liked); }}
        >
          <Heart size={15} fill={liked ? 'currentColor' : 'none'} />
        </button>
        <div className={styles.price}>MK {product.price.toLocaleString()}</div>
      </div>
      <div className={styles.info}>
        <h3 className={styles.title}>{product.title}</h3>
        <div className={styles.meta}>
          <div className={styles.location}>
            <MapPin size={11} />
            <span>{product.location}</span>
          </div>
          <span className={styles.rating}>★ {product.sellerRating}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
