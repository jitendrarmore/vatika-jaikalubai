'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { getDonationsByUser, type Donation } from '@/lib/firebase/donations';
import { TreePine, Plus, Clock, CheckCircle, Leaf } from 'lucide-react';
import styles from './page.module.css';

const statusConfig = {
  scheduled: { label: 'Scheduled', color: '#94A3B8', icon: '📋' },
  planted:   { label: 'Planted',   color: '#2D6A4F', icon: '🌱' },
  growing:   { label: 'Growing',   color: '#52B788', icon: '🌿' },
  thriving:  { label: 'Thriving',  color: '#D4A017', icon: '🌳' },
};

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const data = await getDonationsByUser(user.uid);
        setDonations(data);
      } catch {
        // Firebase not configured — show empty state
        setDonations([]);
      } finally {
        setFetching(false);
      }
    })();
  }, [user]);

  if (loading || fetching) {
    return (
      <div className={styles.loadingScreen}>
        <div className={styles.spinner} />
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  if (!user) return null;

  const totalTrees = donations.length;
  const growingTrees = donations.filter(d => ['growing', 'thriving'].includes(d.status)).length;
  const totalDonated = donations.reduce((sum, d) => sum + (d.cost || 0), 0);

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div className="container">
          <div className={styles.headerInner}>
            <div className={styles.welcome}>
              <div className={styles.avatar}>
                {user.photoURL
                  ? <img src={user.photoURL} alt={user.displayName || ''} className={styles.avatarImg} />
                  : <div className={styles.avatarFallback}>{(user.displayName || user.email || 'U')[0].toUpperCase()}</div>
                }
              </div>
              <div>
                <h1 className={styles.welcomeTitle}>
                  Namaste, {user.displayName?.split(' ')[0] || 'Friend'} 🙏
                </h1>
                <p className={styles.welcomeSubtitle}>आई कलुबाईचा आशीर्वाद नेहमी असो</p>
              </div>
            </div>
            <Link href="/donate" className="btn btn-primary" id="dashboard-donate-btn">
              <Plus size={18} /> Donate a Tree
            </Link>
          </div>

          {/* Stats row */}
          <div className={styles.statsRow}>
            <div className={styles.stat}>
              <span className={styles.statNum}>{totalTrees}</span>
              <span className={styles.statLabel}>Trees Donated</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNum}>{growingTrees}</span>
              <span className={styles.statLabel}>Growing Now</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNum}>₹{totalDonated.toLocaleString('en-IN')}</span>
              <span className={styles.statLabel}>Total Donated</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNum}>{Math.round(totalTrees * 21.7)}kg</span>
              <span className={styles.statLabel}>CO₂ Offset (est.)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container" style={{ padding: '2.5rem 1.5rem 4rem' }}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>My Trees</h2>
          <Link href="/donate" className="btn btn-secondary btn-sm">+ Plant Another</Link>
        </div>

        {donations.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🌱</div>
            <h3>No trees yet!</h3>
            <p>Start your green journey by donating your first tree.</p>
            <Link href="/donate" className="btn btn-forest" id="dashboard-first-tree-btn">
              Plant Your First Tree 🌳
            </Link>
          </div>
        ) : (
          <div className={styles.treeGrid}>
            {donations.map((donation) => {
              const sc = statusConfig[donation.status];
              return (
                <div key={donation.id} className={styles.treeCard}>
                  <div className={styles.treeCardHeader}>
                    <div className={styles.treeEmoji}>🌳</div>
                    <div className={styles.treeCardStatus} style={{ color: sc.color }}>
                      <span>{sc.icon}</span> {sc.label}
                    </div>
                  </div>
                  <h3 className={styles.treeCardName}>{donation.treeName}</h3>
                  <div className={styles.treeCardMeta}>
                    <span>🌿 {donation.plantName}</span>
                    <span>🎉 {donation.occasion}</span>
                  </div>
                  <div className={styles.treeCardId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--forest-50)', padding: '0.5rem', borderRadius: '4px', marginTop: '0.5rem' }}>
                    <span style={{ fontSize: '0.85rem' }}>ID: <strong style={{ letterSpacing: '1px' }}>{donation.trackingId}</strong></span>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(donation.trackingId);
                        alert('Tracking ID copied!');
                      }}
                      style={{ background: 'none', border: 'none', color: 'var(--forest-600)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
                      title="Copy Tracking ID"
                    >
                      Copy
                    </button>
                  </div>
                  <div className={styles.treeCardDate}>
                    <Clock size={13} /> {new Date(donation.plantationDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                  <Link href={`/track?id=${donation.trackingId}`} className="btn btn-forest btn-sm" style={{ width: '100%', marginTop: '1rem', justifyContent: 'center' }}>
                    <TreePine size={15} /> Track This Tree
                  </Link>
                </div>
              );
            })}
          </div>
        )}

        {/* Tips section */}
        <div className={styles.tipsSection}>
          <h3 className={styles.tipsTitle}>🌿 Green Tips</h3>
          <div className={styles.tipsGrid}>
            <div className={styles.tip}>
              <span>💧</span>
              <div>
                <strong>Water Conservation</strong>
                <p>Young trees need 1–2 liters of water every 2 days during their first year.</p>
              </div>
            </div>
            <div className={styles.tip}>
              <span>🌍</span>
              <div>
                <strong>Share Your Impact</strong>
                <p>Tell friends about your tree! Each share inspires another donation.</p>
              </div>
            </div>
            <div className={styles.tip}>
              <span>📸</span>
              <div>
                <strong>Capture Growth</strong>
                <p>Watch progress photos as your tree marks seasons and milestones.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
