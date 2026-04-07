'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Search, Share2, MapPin, Calendar, CheckCircle, Clock } from 'lucide-react';
import { getTreeByTrackingId, getTreeProgress, type Donation, type TreeProgress } from '@/lib/firebase/donations';
import { sampleTrees } from '@/lib/mockData';
import styles from './page.module.css';

const MapView = dynamic(() => import('@/components/MapView'), { ssr: false });

const statusConfig = {
  scheduled: { label: 'Scheduled', color: '#94A3B8', icon: '📋', description: 'Your tree is scheduled for planting' },
  planted:   { label: 'Planted',   color: '#2D6A4F', icon: '🌱', description: 'Your tree has been planted in the ground' },
  growing:   { label: 'Growing',   color: '#52B788', icon: '🌿', description: 'Your tree is growing strong' },
  thriving:  { label: 'Thriving',  color: '#D4A017', icon: '🌳', description: 'Your tree is thriving and flourishing' },
};

function TrackContent() {
  const searchParams = useSearchParams();
  const [trackingId, setTrackingId] = useState(searchParams.get('id') || '');
  const [inputId, setInputId] = useState(searchParams.get('id') || '');
  const [donation, setDonation] = useState<Donation | null>(null);
  const [progress, setProgress] = useState<TreeProgress[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (searchParams.get('id')) {
      handleTrack(searchParams.get('id')!);
    }
  }, []);

  const handleTrack = async (idToTrack?: string) => {
    const id = idToTrack || inputId.trim().toUpperCase();
    if (!id) return;
    setLoading(true);
    setError('');
    setSearched(true);

    try {
      // Try Firestore first; fall back to mock data
      let found: Donation | null = null;
      try {
        found = await getTreeByTrackingId(id);
      } catch {
        // Firestore not configured yet — use mock
      }

      if (!found) {
        // Check mock data
        const mock = sampleTrees.find(t => t.trackingId === id);
        if (mock) {
          found = {
            uid: 'mock',
            userEmail: 'demo@vatika.in',
            userName: 'Demo User',
            plantId: 'peepal',
            plantName: mock.plantName,
            occasion: mock.occasion,
            treeName: mock.treeName,
            dedication: 'A gift to nature',
            plantationDate: mock.plantationDate,
            trackingId: mock.trackingId,
            status: mock.status,
            location: mock.location,
            cost: 500,
          } as Donation;
          setProgress(mock.progress.map((p, i) => ({
            id: String(i),
            donationId: mock.trackingId,
            date: p.date,
            status: p.status,
            note: p.note,
          })));
        }
      } else {
        try {
          const prog = await getTreeProgress(found.id || '');
          setProgress(prog);
        } catch { setProgress([]); }
      }

      if (found) {
        setDonation(found);
        setTrackingId(id);
      } else {
        setError('No tree found with this tracking ID. Please check and try again.');
        setDonation(null);
      }
    } catch (e) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const shareTree = () => {
    const url = `https://vatika.jaikalubai.in/track/${trackingId}`;
    if (navigator.share) {
      navigator.share({ title: `${donation?.treeName} — Vatika`, url });
    } else {
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  const status = donation ? statusConfig[donation.status] : null;
  const statusKeys = Object.keys(statusConfig) as (keyof typeof statusConfig)[];

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div className="container">
          <h1 className={styles.title}>Track My Tree 🌳</h1>
          <p className={styles.subtitle}>Enter your Tracking ID to see your tree&apos;s journey</p>
          <div className={styles.searchBox}>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Enter Tracking ID (e.g. VJK8X2KQ4R)"
              value={inputId}
              onChange={(e) => setInputId(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === 'Enter' && handleTrack()}
              id="tracking-id-input"
            />
            <button
              className={styles.searchBtn}
              onClick={() => handleTrack()}
              disabled={loading}
              id="track-search-btn"
            >
              {loading ? '...' : <><Search size={18} /> Track</>}
            </button>
          </div>
          <p className={styles.demo}>
            Try demo ID: <button className={styles.demoBtn} onClick={() => { setInputId('VJK8X2KQ4R'); handleTrack('VJK8X2KQ4R'); }}>VJK8X2KQ4R</button>
          </p>
        </div>
      </div>

      <div className="container">
        {loading && (
          <div className={styles.loadingState}>
            <div className={styles.spinner} />
            <p>Finding your tree...</p>
          </div>
        )}

        {error && searched && !loading && (
          <div className={styles.errorState}>
            <span>🌿</span>
            <h3>Tree Not Found</h3>
            <p>{error}</p>
          </div>
        )}

        {donation && !loading && (
          <div className={styles.result}>
            {/* Tree header card */}
            <div className={styles.treeCard}>
              <div className={styles.treeEmoji}>🌳</div>
              <div className={styles.treeInfo}>
                <div className={styles.treeStatus} style={{ color: status?.color }}>
                  <span style={{ background: status?.color }} className={styles.statusDot} />
                  {status?.label}
                </div>
                <h2 className={styles.treeName}>{donation.treeName}</h2>
                <div className={styles.treeMeta}>
                  <span><span>🌿</span> {donation.plantName}</span>
                  <span><span>🎉</span> {donation.occasion}</span>
                  <span><Calendar size={14} /> {new Date(donation.plantationDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  {donation.location && <span><MapPin size={14} /> {donation.location.address}</span>}
                </div>
                <div className={styles.trackingIdBadge}>
                  ID: <strong>{donation.trackingId}</strong>
                </div>
              </div>
              <button className={styles.shareBtn} onClick={shareTree} title="Share">
                <Share2 size={18} />
              </button>
            </div>

            {/* Status timeline */}
            <div className={styles.statusCard}>
              <h3 className={styles.cardTitle}>Growth Status</h3>
              <p className={styles.statusDesc}>{status?.description}</p>
              <div className={styles.statusTimeline}>
                {statusKeys.map((key, i) => {
                  const cfg = statusConfig[key];
                  const currentIdx = statusKeys.indexOf(donation.status);
                  const isDone = i <= currentIdx;
                  return (
                    <div key={key} className={styles.statusStep}>
                      <div className={`${styles.statusIcon} ${isDone ? styles.statusDone : ''}`}
                           style={isDone ? { background: cfg.color } : {}}>
                        {isDone ? <CheckCircle size={16} /> : <Clock size={16} />}
                      </div>
                      <div className={styles.statusLabel}>{cfg.label}</div>
                      {i < statusKeys.length - 1 && (
                        <div className={`${styles.statusLine} ${isDone && i < currentIdx ? styles.statusLineDone : ''}`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Progress log */}
            {progress.length > 0 && (
              <div className={styles.progressCard}>
                <h3 className={styles.cardTitle}>Growth Updates</h3>
                <div className={styles.progressList}>
                  {progress.map((entry, i) => (
                    <div key={entry.id || i} className={styles.progressEntry}>
                      <div className={styles.progressDate}>
                        {new Date(entry.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                      <div className={styles.progressDot2} />
                      <div className={styles.progressContent}>
                        <div className={styles.progressStatus}>{entry.status}</div>
                        <div className={styles.progressNote}>{entry.note}</div>
                        {entry.imageUrl && (
                          <img src={entry.imageUrl} alt="Tree progress" className={styles.progressImage} />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Map */}
            {donation.location && (
              <div className={styles.mapCard}>
                <h3 className={styles.cardTitle}>Plantation Location</h3>
                <div className={styles.mapContainer}>
                  <MapView
                    lat={donation.location.lat}
                    lng={donation.location.lng}
                    treeName={donation.treeName}
                    plantName={donation.plantName}
                  />
                </div>
                <div className={styles.mapAddress}>
                  <MapPin size={16} color="var(--forest)" />
                  {donation.location.address}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner" />
      </div>
    }>
      <TrackContent />
    </Suspense>
  );
}
