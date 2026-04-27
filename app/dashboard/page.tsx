'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { getDonationsByUser, getTreeProgress, type Donation, type TreeProgress } from '@/lib/firebase/donations';
import { TreePine, Plus, MapPin, Camera, Clock, Leaf, Award, ChevronRight } from 'lucide-react';
import styles from './page.module.css';

/* ─── constants ─────────────────────────────── */
const LIFECYCLE_STAGES = [
  { key: 'scheduled', label: 'Scheduled', icon: '📋', color: '#94A3B8' },
  { key: 'planted',   label: 'Planted',   icon: '🌱', color: '#2D6A4F' },
  { key: 'growing',   label: 'Growing',   icon: '🌿', color: '#52B788' },
  { key: 'thriving',  label: 'Thriving',  icon: '🌳', color: '#D4A017' },
];

const ACTION_ICONS: Record<string, string> = {
  purchased: '🛒', planted: '🌱', tagged: '🏷️',
  watered: '💧', milestone: '🏆', health_check: '🩺', general: '📝',
};

/* ─── helpers ────────────────────────────────── */
function daysAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const d = Math.floor(diff / 86400000);
  return d === 0 ? 'Today' : d === 1 ? 'Yesterday' : `${d} days ago`;
}

function lifecyclePercent(plantationDate: string) {
  const planted = new Date(plantationDate).getTime();
  const threeYears = 3 * 365 * 24 * 3600 * 1000;
  const elapsed = Date.now() - planted;
  return Math.min(100, Math.max(0, Math.round((elapsed / threeYears) * 100)));
}

function isSelfSustainable(plantationDate: string) {
  const planted = new Date(plantationDate).getTime();
  return Date.now() - planted >= 3 * 365 * 24 * 3600 * 1000;
}

function monthsElapsed(plantationDate: string) {
  const diff = Date.now() - new Date(plantationDate).getTime();
  return Math.floor(diff / (30 * 24 * 3600 * 1000));
}

/* ─── per-tree card ──────────────────────────── */
interface TreeCardProps { donation: Donation; }

function TreeCard({ donation }: TreeCardProps) {
  const [progress, setProgress] = useState<TreeProgress[]>([]);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!donation.id) return;
    getTreeProgress(donation.id)
      .then(setProgress)
      .catch(() => setProgress([]));
  }, [donation.id]);

  const latestPhoto = progress.find(p => p.imageUrl)?.imageUrl;
  const latestUpdate = progress[0];
  const stageIdx = LIFECYCLE_STAGES.findIndex(s => s.key === donation.status);
  const pct = lifecyclePercent(donation.plantationDate);
  const months = monthsElapsed(donation.plantationDate);
  const sustainable = isSelfSustainable(donation.plantationDate);

  return (
    <div className={`${styles.treeCard} ${expanded ? styles.treeCardExpanded : ''}`}>

      {/* ── top: photo + title ── */}
      <div className={styles.treeCardTop}>
        <div className={styles.treePhotoWrap}>
          {latestPhoto ? (
            <img src={latestPhoto} alt={donation.treeName} className={styles.treePhoto} />
          ) : (
            <div className={styles.treePhotoPlaceholder}>
              <span>🌳</span>
              <p>No photo yet</p>
            </div>
          )}
          {sustainable && (
            <div className={styles.sustainableBadge}>
              <Award size={12} /> Self Sustainable
            </div>
          )}
        </div>

        <div className={styles.treeCardBody}>
          <div className={styles.treeCardHeader}>
            <div>
              <h3 className={styles.treeCardName}>{donation.treeName}</h3>
              <div className={styles.treeCardMeta}>
                <span><Leaf size={12} /> {donation.plantName}</span>
                <span>🎉 {donation.occasion}</span>
              </div>
            </div>
            <div className={styles.statusPill} style={{ background: LIFECYCLE_STAGES[stageIdx]?.color + '22', color: LIFECYCLE_STAGES[stageIdx]?.color, borderColor: LIFECYCLE_STAGES[stageIdx]?.color + '44' }}>
              {LIFECYCLE_STAGES[stageIdx]?.icon} {LIFECYCLE_STAGES[stageIdx]?.label}
            </div>
          </div>

          {/* ── 4-stage timeline strip ── */}
          <div className={styles.timelineStrip}>
            {LIFECYCLE_STAGES.map((stage, i) => {
              const isDone = i < stageIdx;
              const isCurrent = i === stageIdx;
              return (
                <div key={stage.key} className={styles.timelineStage}>
                  <div
                    className={`${styles.timelineDot} ${isDone ? styles.timelineDotDone : ''} ${isCurrent ? styles.timelineDotCurrent : ''}`}
                    style={isDone || isCurrent ? { background: stage.color, borderColor: stage.color } : {}}
                  >
                    <span className={styles.timelineDotIcon}>{stage.icon}</span>
                    {isCurrent && <span className={styles.timelinePulse} style={{ borderColor: stage.color }} />}
                  </div>
                  <span className={`${styles.timelineLabel} ${isCurrent ? styles.timelineLabelActive : ''}`} style={isCurrent ? { color: stage.color } : {}}>
                    {stage.label}
                  </span>
                  {i < LIFECYCLE_STAGES.length - 1 && (
                    <div className={`${styles.timelineConnector} ${isDone ? styles.timelineConnectorDone : ''}`}
                      style={isDone ? { background: LIFECYCLE_STAGES[i].color } : {}} />
                  )}
                </div>
              );
            })}
          </div>

          {/* ── 3-year lifecycle bar ── */}
          <div className={styles.lifecycleBarWrap}>
            <div className={styles.lifecycleBarLabel}>
              <Clock size={12} />
              {sustainable ? '🏆 Self Sustainable — 3 Years Complete!' : `Month ${months} of 36 · ${pct}% of lifecycle`}
            </div>
            <div className={styles.lifecycleBarTrack}>
              <div className={`${styles.lifecycleBarFill} ${sustainable ? styles.lifecycleBarSustainable : ''}`}
                style={{ width: `${pct}%` }} />
              {/* Milestone markers at 12m, 24m, 36m */}
              {[33, 66, 100].map(m => (
                <div key={m} className={styles.lifecycleMilestone} style={{ left: `${m}%` }} />
              ))}
            </div>
            <div className={styles.lifecycleBarTicks}>
              <span>Planted</span><span>Year 1</span><span>Year 2</span><span>Year 3</span>
            </div>
          </div>

          {/* ── latest update chip ── */}
          {latestUpdate && (
            <div className={styles.lastUpdateChip}>
              <span>{ACTION_ICONS[latestUpdate.actionType || 'general']}</span>
              <span className={styles.lastUpdateText}>
                {latestUpdate.actionType ? latestUpdate.actionType.charAt(0).toUpperCase() + latestUpdate.actionType.slice(1) : 'Update'}
                {' — '}{latestUpdate.note.slice(0, 55)}{latestUpdate.note.length > 55 ? '…' : ''}
              </span>
              <span className={styles.lastUpdateDate}>{daysAgo(latestUpdate.date)}</span>
            </div>
          )}

          {/* ── actions ── */}
          <div className={styles.treeCardActions}>
            <div className={styles.treeCardId}>
              ID: <strong>{donation.trackingId}</strong>
              <button
                onClick={() => { navigator.clipboard.writeText(donation.trackingId); }}
                className={styles.copyBtn}
                title="Copy tracking ID"
              >Copy</button>
            </div>
            <div className={styles.treeCardBtns}>
              <button
                className={`btn btn-secondary btn-sm ${styles.expandBtn}`}
                onClick={() => setExpanded(e => !e)}
              >
                {expanded ? 'Hide' : 'History'} <ChevronRight size={14} className={expanded ? styles.chevronUp : ''} />
              </button>
              <Link href={`/track?id=${donation.trackingId}`} className="btn btn-forest btn-sm">
                <TreePine size={14} /> Track
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── expanded: full progress history ── */}
      {expanded && (
        <div className={styles.progressHistory}>
          <h4 className={styles.progressHistoryTitle}>Growth Timeline</h4>
          {progress.length === 0 ? (
            <div className={styles.progressEmpty}>
              <Camera size={24} />
              <p>No updates posted yet. Your maintainer will add photos and notes once planting begins.</p>
            </div>
          ) : (
            <div className={styles.progressList}>
              {progress.map((entry, i) => (
                <div key={entry.id || i} className={styles.progressEntry}>
                  <div className={styles.progressEntryDot}>
                    <span>{ACTION_ICONS[entry.actionType || 'general']}</span>
                  </div>
                  <div className={styles.progressEntryLine} />
                  <div className={styles.progressEntryContent}>
                    <div className={styles.progressEntryHeader}>
                      <span className={styles.progressEntryType}>
                        {entry.actionType ? entry.actionType.charAt(0).toUpperCase() + entry.actionType.slice(1).replace(/_/g, ' ') : entry.status}
                      </span>
                      <span className={styles.progressEntryDate}>
                        {new Date(entry.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    <p className={styles.progressEntryNote}>{entry.note}</p>
                    {entry.geoLocation && (
                      <div className={styles.progressGeo}>
                        <MapPin size={12} />
                        {entry.geoLocation.lat.toFixed(5)}, {entry.geoLocation.lng.toFixed(5)}
                      </div>
                    )}
                    {entry.imageUrl && (
                      <img src={entry.imageUrl} alt="Tree progress" className={styles.progressEntryPhoto} />
                    )}
                    {entry.videoUrl && (
                      <video src={entry.videoUrl} controls className={styles.progressEntryPhoto} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          <Link href={`/track?id=${donation.trackingId}`} className={`btn btn-secondary btn-sm ${styles.fullTrackBtn}`}>
            View on Map & Full Timeline <ChevronRight size={14} />
          </Link>
        </div>
      )}
    </div>
  );
}

/* ─── dashboard page ─────────────────────────── */
export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [fetching, setFetching] = useState(true);
  const [filter, setFilter] = useState<'all' | 'scheduled' | 'planted' | 'growing' | 'thriving'>('all');

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    getDonationsByUser(user.uid)
      .then(setDonations)
      .catch(() => setDonations([]))
      .finally(() => setFetching(false));
  }, [user]);

  if (loading || fetching) return (
    <div className={styles.loadingScreen}>
      <div className={styles.spinner} />
      <p>Loading your forest...</p>
    </div>
  );
  if (!user) return null;

  const totalTrees = donations.length;
  const growingTrees = donations.filter(d => ['growing', 'thriving'].includes(d.status)).length;
  const totalDonated = donations.reduce((sum, d) => sum + (d.cost || 0), 0);
  const co2 = Math.round(totalTrees * 21.7);

  const filtered = filter === 'all' ? donations : donations.filter(d => d.status === filter);

  return (
    <div className={styles.page}>
      {/* ── header ── */}
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
                <h1 className={styles.welcomeTitle}>Namaste, {user.displayName?.split(' ')[0] || 'Friend'} 🙏</h1>
                <p className={styles.welcomeSubtitle}>आई कलुबाईचा आशीर्वाद नेहमी असो</p>
              </div>
            </div>
            <Link href="/donate" className="btn btn-primary" id="dashboard-donate-btn">
              <Plus size={18} /> Donate a Tree
            </Link>
          </div>

          {/* stats */}
          <div className={styles.statsRow}>
            {[
              { num: totalTrees,                          label: 'Trees Donated',  sub: 'click to view' },
              { num: growingTrees,                        label: 'Growing Now',    sub: 'active trees' },
              { num: `₹${totalDonated.toLocaleString('en-IN')}`, label: 'Total Donated', sub: 'lifetime' },
              { num: `${co2}kg`,                          label: 'CO₂ Offset',     sub: 'estimated' },
            ].map(({ num, label, sub }) => (
              <div key={label} className={styles.stat}
                onClick={() => document.getElementById('my-trees-list')?.scrollIntoView({ behavior: 'smooth' })}
                style={{ cursor: 'pointer' }}
              >
                <span className={styles.statNum}>{num}</span>
                <span className={styles.statLabel}>{label}</span>
                <span className={styles.statSub}>{sub}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── content ── */}
      <div className="container" style={{ padding: '2.5rem 1.5rem 4rem' }}>

        <div className={styles.sectionHeader} id="my-trees-list">
          <h2 className={styles.sectionTitle}>My Trees</h2>
          <div className={styles.filterRow}>
            {(['all', 'scheduled', 'planted', 'growing', 'thriving'] as const).map(f => (
              <button
                key={f}
                className={`${styles.filterBtn} ${filter === f ? styles.filterBtnActive : ''}`}
                onClick={() => setFilter(f)}
              >
                {f === 'all' ? '🌍 All' : LIFECYCLE_STAGES.find(s => s.key === f)?.icon + ' ' + f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 && donations.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🌱</div>
            <h3>No trees yet!</h3>
            <p>Start your green journey by donating your first tree.</p>
            <Link href="/donate" className="btn btn-forest" id="dashboard-first-tree-btn">
              Plant Your First Tree 🌳
            </Link>
          </div>
        ) : filtered.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🔍</div>
            <h3>No {filter} trees</h3>
            <p>You have no trees in the <strong>{filter}</strong> stage yet.</p>
            <button className="btn btn-secondary" onClick={() => setFilter('all')}>Show All Trees</button>
          </div>
        ) : (
          <div className={styles.treeList}>
            {filtered.map(d => <TreeCard key={d.id} donation={d} />)}
          </div>
        )}

        {/* tips */}
        <div className={styles.tipsSection}>
          <h3 className={styles.tipsTitle}>🌿 Green Tips</h3>
          <div className={styles.tipsGrid}>
            {[
              { icon: '💧', title: 'Water Conservation', body: 'Young trees need 1–2 litres every 2 days during their first year.' },
              { icon: '🌍', title: 'Share Your Impact',  body: 'Tell friends about your tree! Each share inspires another donation.' },
              { icon: '📸', title: 'Capture Growth',     body: 'Watch progress photos as your tree marks seasons and milestones.' },
            ].map(({ icon, title, body }) => (
              <div key={title} className={styles.tip}>
                <span>{icon}</span>
                <div><strong>{title}</strong><p>{body}</p></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
