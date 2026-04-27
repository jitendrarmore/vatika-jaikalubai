'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import {
  getDonationsByMaintainer, getTreeProgress,
  addTreeProgress, updateDonationStatus,
  type Donation, type TreeProgress,
} from '@/lib/firebase/donations';
import { uploadMedia } from '@/lib/firebase/storage';
import { getAllDonations } from '@/lib/firebase/donations';
import {
  MapPin, UploadCloud, Leaf, CheckCircle, AlertTriangle,
  Clock, Camera, ChevronDown, ChevronUp, X, Layers
} from 'lucide-react';
import styles from './page.module.css';

/* ─── constants ─────────────────────────────── */
const STAGES = ['scheduled', 'planted', 'growing', 'thriving'] as const;
type Stage = typeof STAGES[number];

const STAGE_META: Record<Stage, { label: string; icon: string; color: string; next?: Stage }> = {
  scheduled: { label: 'Scheduled', icon: '📋', color: '#94A3B8', next: 'planted' },
  planted:   { label: 'Planted',   icon: '🌱', color: '#2D6A4F', next: 'growing' },
  growing:   { label: 'Growing',   icon: '🌿', color: '#52B788', next: 'thriving' },
  thriving:  { label: 'Thriving',  icon: '🌳', color: '#D4A017' },
};

const ACTION_TYPES = [
  { value: 'general',       label: '📝 General Update' },
  { value: 'purchased',     label: '🛒 Nursery Pickup / Purchase' },
  { value: 'planted',       label: '🌱 Tree Planted' },
  { value: 'tagged',        label: '🏷️ Name Tag / Geo Tag Added' },
  { value: 'watered',       label: '💧 Watering & Care' },
  { value: 'milestone',     label: '🏆 Milestone Reached' },
  { value: 'health_check',  label: '🩺 Health Check' },
];

const ACTION_ICONS: Record<string, string> = {
  purchased: '🛒', planted: '🌱', tagged: '🏷️',
  watered: '💧', milestone: '🏆', health_check: '🩺', general: '📝',
};

function daysSince(iso: string) {
  return Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
}

/* ─── tree row card ─────────────────────────── */
interface TreeRowProps {
  donation: Donation;
  isSelected: boolean;
  onSelect: (d: Donation) => void;
}

function TreeRow({ donation, isSelected, onSelect }: TreeRowProps) {
  const [progress, setProgress] = useState<TreeProgress[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    if (!donation.id) return;
    getTreeProgress(donation.id).then(setProgress).catch(() => {});
  }, [donation.id]);

  const lastUpdate = progress[0];
  const daysSinceUpdate = lastUpdate ? daysSince(lastUpdate.date) : null;
  const isOverdue = daysSinceUpdate === null || daysSinceUpdate > 7;
  const stage = STAGE_META[donation.status as Stage] || STAGE_META.scheduled;
  const latestPhoto = progress.find(p => p.imageUrl)?.imageUrl;

  return (
    <div className={`${styles.treeRow} ${isSelected ? styles.treeRowSelected : ''}`}>
      <div className={styles.treeRowMain} onClick={() => onSelect(donation)}>
        {/* photo thumb */}
        <div className={styles.treeRowThumb}>
          {latestPhoto
            ? <img src={latestPhoto} alt={donation.treeName} className={styles.treeRowThumbImg} />
            : <div className={styles.treeRowThumbPlaceholder}><Leaf size={20} /></div>
          }
        </div>

        {/* info */}
        <div className={styles.treeRowInfo}>
          <div className={styles.treeRowTop}>
            <h3 className={styles.treeRowName}>{donation.treeName}</h3>
            <div className={styles.stagePill} style={{ background: stage.color + '20', color: stage.color, borderColor: stage.color + '44' }}>
              {stage.icon} {stage.label}
            </div>
          </div>
          <div className={styles.treeRowMeta}>
            <span>🌿 {donation.plantName}</span>
            <span>👤 {donation.userName}</span>
            <span>🔑 {donation.trackingId}</span>
          </div>
          <div className={styles.treeRowFooter}>
            {isOverdue ? (
              <div className={styles.overdueChip}>
                <AlertTriangle size={12} />
                {daysSinceUpdate === null ? 'No updates yet' : `${daysSinceUpdate}d since last update — overdue`}
              </div>
            ) : (
              <div className={styles.freshChip}>
                <CheckCircle size={12} />
                Updated {daysSinceUpdate}d ago
              </div>
            )}
            <button
              className={styles.historyToggle}
              onClick={e => { e.stopPropagation(); setShowHistory(h => !h); }}
            >
              {showHistory ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              {progress.length} update{progress.length !== 1 ? 's' : ''}
            </button>
          </div>
        </div>
      </div>

      {/* mini history */}
      {showHistory && (
        <div className={styles.miniHistory}>
          {progress.length === 0 ? (
            <p className={styles.miniHistoryEmpty}>No updates posted yet.</p>
          ) : progress.slice(0, 5).map((entry, i) => (
            <div key={entry.id || i} className={styles.miniEntry}>
              <span className={styles.miniEntryIcon}>{ACTION_ICONS[entry.actionType || 'general']}</span>
              <div className={styles.miniEntryBody}>
                <div className={styles.miniEntryTop}>
                  <strong>{entry.actionType?.replace(/_/g, ' ') || entry.status}</strong>
                  <span>{new Date(entry.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                </div>
                <p>{entry.note.slice(0, 80)}{entry.note.length > 80 ? '…' : ''}</p>
                {entry.imageUrl && <img src={entry.imageUrl} alt="" className={styles.miniEntryImg} />}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── main page ─────────────────────────────── */
export default function MaintainerPage() {
  const { user, loading, isMaintainer, isAdmin } = useAuth();
  const router = useRouter();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
  const [dragOver, setDragOver] = useState(false);

  // form state
  const [actionType, setActionType] = useState('general');
  const [note, setNote] = useState('');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [geoLoc, setGeoLoc] = useState<{ lat: number; lng: number } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [upgrading, setUpgrading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadDonations = useCallback(async () => {
    if (!user) return;
    try {
      // Admins see all; maintainers see their assigned trees
      const data = isAdmin
        ? await getAllDonations()
        : await getDonationsByMaintainer(user.email || '');
      setDonations(data);
    } catch { setDonations([]); }
  }, [user, isAdmin]);

  useEffect(() => {
    if (!loading) {
      if (!user) router.push('/login');
      else if (!isMaintainer) router.push('/dashboard');
      else loadDonations();
    }
  }, [user, loading, isMaintainer, router, loadDonations]);

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className={styles.spinner} />
    </div>
  );
  if (!user || !isMaintainer) return null;

  const handleGetLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      pos => setGeoLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => alert('Allow location access in your browser to geo-tag.')
    );
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) setMediaFile(file);
  };

  const handleStageUpgrade = async () => {
    if (!selectedDonation) return;
    const current = selectedDonation.status as Stage;
    const next = STAGE_META[current]?.next;
    if (!next) return;
    if (!confirm(`Mark "${selectedDonation.treeName}" as ${STAGE_META[next].label}?`)) return;
    setUpgrading(true);
    try {
      await updateDonationStatus(selectedDonation.id!, next);
      await addTreeProgress({
        donationId: selectedDonation.id!,
        date: new Date().toISOString(),
        status: STAGE_META[next].label,
        note: `Tree status upgraded to ${STAGE_META[next].label}.`,
        actionType: next === 'planted' ? 'planted' : 'general',
      });
      setSuccessMsg(`✅ Tree advanced to ${STAGE_META[next].label}!`);
      await loadDonations();
      setSelectedDonation(prev => prev ? { ...prev, status: next } : null);
    } catch { alert('Failed to update stage.'); }
    finally { setUpgrading(false); }
  };

  const handleSubmit = async () => {
    if (!selectedDonation || !note.trim()) {
      alert('Please add notes before posting.');
      return;
    }
    setSubmitting(true);
    setSuccessMsg('');
    try {
      let imageUrl = '', videoUrl = '';
      if (mediaFile) {
        const path = `progress/${selectedDonation.id}/${Date.now()}_${mediaFile.name}`;
        const url = await uploadMedia(mediaFile, path);
        if (mediaFile.type.startsWith('video/')) videoUrl = url;
        else imageUrl = url;
      }

      const newStatus =
        actionType === 'planted' ? 'planted' :
        actionType === 'watered' ? 'growing' :
        selectedDonation.status;

      await addTreeProgress({
        donationId: selectedDonation.id!,
        date: new Date().toISOString(),
        status: newStatus.charAt(0).toUpperCase() + newStatus.slice(1),
        note,
        imageUrl: imageUrl || undefined,
        videoUrl: videoUrl || undefined,
        actionType: actionType as any,
        geoLocation: geoLoc || undefined,
      });

      if (newStatus !== selectedDonation.status) {
        await updateDonationStatus(selectedDonation.id!, newStatus);
      }

      setSuccessMsg('✅ Update posted successfully!');
      setNote('');
      setMediaFile(null);
      setGeoLoc(null);
      setActionType('general');
      await loadDonations();
    } catch (e) {
      console.error(e);
      alert('Error posting update.');
    } finally {
      setSubmitting(false);
    }
  };

  const currentStage = selectedDonation ? (STAGE_META[selectedDonation.status as Stage] || STAGE_META.scheduled) : null;
  const nextStage = selectedDonation ? STAGE_META[selectedDonation.status as Stage]?.next : undefined;
  const overdueTrees = donations.filter(d => {
    // simplified: we can't easily check per-tree here — done in TreeRow
    return d.status === 'scheduled';
  }).length;

  return (
    <div className={styles.page}>
      {/* ── header ── */}
      <div className={styles.header}>
        <div className="container">
          <div className={styles.headerInner}>
            <div>
              <h1 className={styles.title}>Maintainer Portal 🌿</h1>
              <p className={styles.subtitle}>
                {isAdmin ? 'Admin view — all trees' : `Assigned trees · ${user.email}`}
              </p>
            </div>
            <div className={styles.headerStats}>
              <div className={styles.headerStat}>
                <span>{donations.length}</span>Trees Assigned
              </div>
              <div className={styles.headerStat}>
                <span>{donations.filter(d => d.status === 'planted' || d.status === 'growing').length}</span>Active
              </div>
              <div className={styles.headerStat}>
                <span>{donations.filter(d => d.status === 'thriving').length}</span>Thriving
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── two-column workspace ── */}
      <div className={`container ${styles.workspace}`}>

        {/* LEFT: tree list */}
        <div className={styles.treeListPanel}>
          <div className={styles.panelHeader}>
            <Layers size={16} />
            <span>Trees ({donations.length})</span>
          </div>
          {donations.length === 0 ? (
            <div className={styles.emptyList}>
              <Leaf size={32} color="var(--text-muted)" />
              <p>No trees assigned to you yet.</p>
            </div>
          ) : donations.map(d => (
            <TreeRow
              key={d.id}
              donation={d}
              isSelected={selectedDonation?.id === d.id}
              onSelect={setSelectedDonation}
            />
          ))}
        </div>

        {/* RIGHT: update form */}
        <div className={styles.updatePanel}>
          {!selectedDonation ? (
            <div className={styles.noSelection}>
              <div className={styles.noSelectionIcon}>🌳</div>
              <h3>Select a tree</h3>
              <p>Click any tree on the left to post an update.</p>
            </div>
          ) : (
            <div className={styles.updateForm}>
              {/* selected tree header */}
              <div className={styles.selectedTreeHeader}>
                <div>
                  <div className={styles.stagePill} style={{ background: currentStage!.color + '20', color: currentStage!.color, borderColor: currentStage!.color + '44', marginBottom: '0.5rem' }}>
                    {currentStage!.icon} {currentStage!.label}
                  </div>
                  <h2 className={styles.selectedTreeName}>{selectedDonation.treeName}</h2>
                  <p className={styles.selectedTreeMeta}>{selectedDonation.plantName} · {selectedDonation.userName}</p>
                </div>
                <button className={styles.closeBtn} onClick={() => { setSelectedDonation(null); setSuccessMsg(''); }}>
                  <X size={18} />
                </button>
              </div>

              {/* stage upgrade banner */}
              {nextStage && (
                <div className={styles.stageBanner}>
                  <div className={styles.stageBannerText}>
                    <Layers size={15} />
                    Ready to advance? Mark as <strong>{STAGE_META[nextStage].icon} {STAGE_META[nextStage].label}</strong>
                  </div>
                  <button
                    className={styles.stageUpgradeBtn}
                    onClick={handleStageUpgrade}
                    disabled={upgrading}
                    style={{ background: STAGE_META[nextStage].color }}
                  >
                    {upgrading ? 'Updating…' : `Mark ${STAGE_META[nextStage].label} ↑`}
                  </button>
                </div>
              )}

              {successMsg && <div className={styles.successMsg}>{successMsg}</div>}

              {/* form fields */}
              <div className={styles.formFields}>
                <div className="form-group">
                  <label className="form-label">Action Type</label>
                  <select className="form-input" value={actionType} onChange={e => setActionType(e.target.value)}>
                    {ACTION_TYPES.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Update Notes <span style={{ color: 'red' }}>*</span></label>
                  <textarea
                    className="form-input"
                    rows={4}
                    placeholder="Describe what you did today — watered, photographed, added tag, etc."
                    value={note}
                    onChange={e => setNote(e.target.value)}
                  />
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{note.length} chars</span>
                </div>

                {/* drag-drop upload */}
                <div className="form-group">
                  <label className="form-label">Photo / Video</label>
                  <input
                    type="file"
                    accept="image/*,video/*"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={e => setMediaFile(e.target.files?.[0] || null)}
                  />
                  <div
                    className={`${styles.dropZone} ${dragOver ? styles.dropZoneOver : ''} ${mediaFile ? styles.dropZoneHasFile : ''}`}
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                  >
                    {mediaFile ? (
                      <div className={styles.dropZoneFile}>
                        {mediaFile.type.startsWith('image/') ? <Camera size={22} /> : <UploadCloud size={22} />}
                        <div>
                          <p className={styles.dropZoneFileName}>{mediaFile.name}</p>
                          <p className={styles.dropZoneFileSize}>{(mediaFile.size / 1024).toFixed(0)} KB</p>
                        </div>
                        <button className={styles.dropZoneClear} onClick={e => { e.stopPropagation(); setMediaFile(null); }}>
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <UploadCloud size={28} color="var(--text-muted)" />
                        <p className={styles.dropZoneHint}>Drag & drop or <strong>click to upload</strong></p>
                        <p className={styles.dropZoneTypes}>JPG, PNG, MP4 · Max 50 MB</p>
                      </>
                    )}
                  </div>
                  {/* preview */}
                  {mediaFile && mediaFile.type.startsWith('image/') && (
                    <img src={URL.createObjectURL(mediaFile)} alt="preview" className={styles.previewImg} />
                  )}
                </div>

                {/* geo location */}
                <div className="form-group">
                  <label className="form-label">GPS Location</label>
                  <button
                    className={`btn ${geoLoc ? 'btn-forest' : 'btn-secondary'}`}
                    style={{ width: '100%' }}
                    onClick={handleGetLocation}
                    type="button"
                  >
                    <MapPin size={16} />
                    {geoLoc
                      ? `📍 Tagged: ${geoLoc.lat.toFixed(5)}, ${geoLoc.lng.toFixed(5)}`
                      : 'Capture Current Location'}
                  </button>
                  {geoLoc && (
                    <button className={styles.clearGeo} onClick={() => setGeoLoc(null)}>
                      <X size={12} /> Clear geo tag
                    </button>
                  )}
                </div>
              </div>

              <button
                className="btn btn-forest"
                style={{ width: '100%', marginTop: '0.5rem' }}
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? '⏳ Uploading…' : '📤 Post Update'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
