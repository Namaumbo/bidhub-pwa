import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ArrowLeft, MapPin, Star, Phone, MessageCircle, X, Users } from 'lucide-react';
import { MOCK_REQUESTS, MOCK_SELLERS } from '../../services/mockData';
import type { SellerProfile } from '../../models/Seller';
import styles from './SellerMapView.module.css';

// Fix Leaflet default icon paths broken by Vite's asset handling
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({ iconUrl: markerIcon, iconRetinaUrl: markerIcon2x, shadowUrl: markerShadow });

const CITY_COORDS: Record<string, [number, number]> = {
  Lilongwe: [-13.9626, 33.7741],
  Blantyre: [-15.7861, 35.0058],
  Mzuzu: [-11.4657, 34.0207],
  Zomba: [-15.3833, 35.3167],
};

const createSellerIcon = (name: string, highlighted: boolean) => {
  const initial = name.charAt(0).toUpperCase();
  const bg = highlighted ? '#CC5500' : '#4F7942';
  const size = highlighted ? 44 : 38;
  return L.divIcon({
    html: `<div style="
      width:${size}px;height:${size}px;border-radius:50%;
      background:${bg};border:3px solid white;
      box-shadow:0 2px 8px rgba(0,0,0,0.25);
      display:flex;align-items:center;justify-content:center;
      color:white;font-weight:800;font-size:${highlighted ? 16 : 14}px;
      font-family:Inter,system-ui,sans-serif;
    ">${initial}</div>`,
    className: '',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

const FitBounds = ({ sellers }: { sellers: SellerProfile[] }) => {
  const map = useMap();
  useEffect(() => {
    if (sellers.length === 0) return;
    const bounds = L.latLngBounds(sellers.map((s) => [s.lat, s.lng]));
    map.fitBounds(bounds, { padding: [60, 60] });
  }, [map, sellers]);
  return null;
};

const SellerMapView = () => {
  const { requestId } = useParams<{ requestId: string }>();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<SellerProfile | null>(null);

  const request = MOCK_REQUESTS.find((r) => r.id === requestId);
  const center: [number, number] = request
    ? (CITY_COORDS[request.location] ?? [-13.9626, 33.7741])
    : [-13.9626, 33.7741];

  const sellers = MOCK_SELLERS.filter((s) =>
    request ? s.categories.includes(request.category) : true
  );

  if (!request) {
    return (
      <div className={styles.container}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>
        <p className={styles.notFound}>Request not found.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>
        <div className={styles.headerText}>
          <h1 className={styles.title}>Nearby Sellers</h1>
          <p className={styles.sub}>
            <MapPin size={11} /> {request.location} &middot; {request.category}
          </p>
        </div>
        <div className={styles.countBadge}>
          <Users size={13} />
          {sellers.length}
        </div>
      </div>

      <div className={styles.mapWrapper}>
        <MapContainer
          center={center}
          zoom={13}
          className={styles.map}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <FitBounds sellers={sellers} />
          {sellers.map((seller) => (
            <Marker
              key={seller.id}
              position={[seller.lat, seller.lng]}
              icon={createSellerIcon(seller.name, selected?.id === seller.id)}
              eventHandlers={{ click: () => setSelected(seller) }}
            />
          ))}
        </MapContainer>

        {sellers.length === 0 && (
          <div className={styles.noSellers}>
            <MapPin size={32} color="var(--primary)" strokeWidth={1.5} />
            <p>No sellers found for <strong>{request.category}</strong> in this area.</p>
          </div>
        )}
      </div>

      {/* Bottom sheet */}
      <div className={`${styles.sheet} ${selected ? styles.sheetOpen : ''}`}>
        {selected && (
          <>
            <div className={styles.sheetHandle} />
            <button className={styles.sheetClose} onClick={() => setSelected(null)}>
              <X size={18} />
            </button>

            <div className={styles.sellerRow}>
              <div className={styles.avatar}>{selected.name.charAt(0)}</div>
              <div className={styles.sellerInfo}>
                <h2 className={styles.sellerName}>{selected.name}</h2>
                <div className={styles.ratingRow}>
                  <Star size={12} fill="#F59E0B" color="#F59E0B" />
                  <span className={styles.ratingVal}>{selected.rating}</span>
                  <span className={styles.salesVal}>&middot; {selected.totalSales} sales</span>
                </div>
              </div>
            </div>

            {selected.bio && <p className={styles.bio}>{selected.bio}</p>}

            <div className={styles.metaGrid}>
              <div className={styles.metaChip}>
                <MapPin size={12} />
                {selected.location}
              </div>
              {selected.categories.map((cat) => (
                <div key={cat} className={styles.catChip}>{cat}</div>
              ))}
            </div>

            <div className={styles.actions}>
              <a
                href={`tel:${selected.phone.replace(/\s/g, '')}`}
                className={styles.callBtn}
              >
                <Phone size={16} />
                Call
              </a>
              <a
                href={`https://wa.me/${selected.phone.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className={styles.whatsappBtn}
              >
                <MessageCircle size={16} />
                WhatsApp
              </a>
            </div>
          </>
        )}
      </div>

      {selected && (
        <div className={styles.sheetBackdrop} onClick={() => setSelected(null)} />
      )}
    </div>
  );
};

export default SellerMapView;
