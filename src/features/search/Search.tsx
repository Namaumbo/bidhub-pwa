import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search as SearchIcon, Filter } from 'lucide-react';
import { MOCK_PRODUCTS } from '../../services/mockData';
import ProductCard from '../../components/ProductCard';
import styles from './Search.module.css';

const Search = () => {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');

  const filteredProducts = MOCK_PRODUCTS.filter((p) =>
    p.title.toLowerCase().includes(query.toLowerCase()) ||
    p.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <div className={styles.searchBar}>
        <div className={styles.inputWrapper}>
          <SearchIcon size={20} className={styles.searchIcon} />
          <input
            type="text"
            placeholder={t('search_placeholder')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <button className={styles.filterBtn}>
          <Filter size={20} />
        </button>
      </div>

      <div className={styles.results}>
        <div className={styles.productGrid}>
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        {filteredProducts.length === 0 && (
          <div className={styles.noResults}>
            No items found for "<span>{query}</span>"
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
