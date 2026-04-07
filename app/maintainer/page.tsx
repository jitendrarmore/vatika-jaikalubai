'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { getDonationsByMaintainer, Donation, addTreeProgress, updateDonationStatus } from '@/lib/firebase/donations';
import { uploadMedia } from '@/lib/firebase/storage';
import { MapPin, UploadCloud, Leaf } from 'lucide-react';
import styles from './page.module.css';

export default function MaintainerPage() {
  const { user, loading, isMaintainer } = useAuth();
  const router = useRouter();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);

  // Form State
  const [actionType, setActionType] = useState('general');
  const [note, setNote] = useState('');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [geoLoc, setGeoLoc] = useState<{lat: number, lng: number} | null>(null);
  const [submitting, setSubmitting] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!loading) {
      if (!user) router.push('/login');
      else if (!isMaintainer) router.push('/dashboard');
      else {
        getDonationsByMaintainer(user.email || '').then(setDonations);
      }
    }
  }, [user, loading, isMaintainer, router]);

  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div className={styles.spinner} /></div>;
  if (!user || !isMaintainer) return null;

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setGeoLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      }, (err) => {
        alert('Could not get location. Please allow location access in your browser.');
      }, { enableHighAccuracy: true });
    }
  };

  const handleSubmit = async () => {
    if (!selectedDonation) return;
    if (!note) {
      alert("Please add some notes.");
      return;
    }
    setSubmitting(true);
    try {
      let imageUrl = '';
      let videoUrl = '';
      
      if (mediaFile) {
        const path = `progress/${selectedDonation.id}/${Date.now()}_${mediaFile.name}`;
        const url = await uploadMedia(mediaFile, path);
        if (mediaFile.type.startsWith('video/')) videoUrl = url;
        else imageUrl = url;
      }

      const newStatus = actionType === 'planted' ? 'planted' : actionType === 'watered' ? 'growing' : selectedDonation.status;

      await addTreeProgress({
        donationId: selectedDonation.id!,
        date: new Date().toISOString(),
        status: newStatus.charAt(0).toUpperCase() + newStatus.slice(1),
        note,
        imageUrl: imageUrl || undefined,
        videoUrl: videoUrl || undefined,
        actionType: actionType as any,
        geoLocation: geoLoc || undefined
      });

      if (newStatus !== selectedDonation.status) {
        await updateDonationStatus(selectedDonation.id!, newStatus);
      }

      alert('Update posted successfully!');
      setSelectedDonation(null);
      setNote('');
      setMediaFile(null);
      setGeoLoc(null);
      setActionType('general');
      getDonationsByMaintainer(user.email || '').then(setDonations); // refresh
    } catch (e) {
      console.error(e);
      alert('Error updating progress.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className="container">
          <h1 className={styles.title}>Maintainer Portal</h1>
          <p className={styles.subtitle}>Update progress for your assigned trees</p>
        </div>
      </div>

      <div className="container">
        <div className={styles.grid}>
          {donations.length === 0 ? (
            <p style={{ padding: '2rem 0' }}>No trees actively assigned to you right now.</p>
          ) : donations.map(d => (
            <div key={d.id} className={styles.card}>
              <h3 style={{ marginBottom: '0.5rem', color: 'var(--forest-900)' }}>{d.treeName}</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                <Leaf size={14} style={{ display: 'inline', marginRight: '4px' }}/> {d.plantName}
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.8rem', background: 'var(--forest-50)', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem' }}>
                <div><strong>Donor:</strong><br/>{d.userName}</div>
                <div><strong>Tracking ID:</strong><br/><code style={{ fontSize: '0.7rem' }}>{d.trackingId}</code></div>
                <div><strong>Tree Status:</strong><br/>{d.status}</div>
                <div><strong>Date Planned:</strong><br/>{d.createdAt?.toDate().toLocaleDateString('en-IN') || 'N/A'}</div>
              </div>
              <button className="btn btn-forest" style={{ width: '100%' }} onClick={() => setSelectedDonation(d)}>
                Update Progress
              </button>
            </div>
          ))}
        </div>
      </div>

      {selectedDonation && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>Update Progress: {selectedDonation.treeName}</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Add a new timeline event for the donor. 
            </p>

            <div className="form-group">
              <label className="form-label">Action Type</label>
              <select className="form-input" value={actionType} onChange={e => setActionType(e.target.value)}>
                <option value="general">📝 General Update</option>
                <option value="purchased">🛒 Purchasing / Nursery Pickup</option>
                <option value="planted">🌱 Planting Tree</option>
                <option value="tagged">🏷️ Attached Name/JIO Geo Tag</option>
                <option value="watered">💧 Watering & Care (Daily/Weekly/Monthly)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Notes / Tag Details</label>
              <textarea 
                className="form-input" 
                rows={3} 
                placeholder="E.g., Added JIO Tag #12938, tree is healthy and watered." 
                value={note} 
                onChange={e => setNote(e.target.value)} 
              />
            </div>

            <div className="form-group">
              <label className="form-label">Attach Photo or Video</label>
              <input 
                type="file" 
                accept="image/*,video/*" 
                className="form-input" 
                ref={fileInputRef}
                onChange={(e) => setMediaFile(e.target.files?.[0] || null)}
                style={{ display: 'none' }}
              />
              <div 
                style={{ border: '2px dashed #ccc', padding: '1rem', textAlign: 'center', borderRadius: '8px', cursor: 'pointer', background: '#fafafa' }}
                onClick={() => fileInputRef.current?.click()}
              >
                {mediaFile ? (
                  <div style={{ color: 'var(--forest-600)', fontWeight: 600 }}>✅ {mediaFile.name} attached</div>
                ) : (
                  <div><UploadCloud size={24} style={{ marginBottom: '0.5rem', color: '#888' }} /><br/><span style={{ fontSize: '0.9rem', color: '#666' }}>Click to upload Image / Video</span></div>
                )}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Location (Geo Tag)</label>
              <button 
                className="btn btn-secondary" 
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyItems: 'center', gap: '8px', background: geoLoc ? 'var(--forest-100)' : '', borderColor: geoLoc ? 'var(--forest-500)' : '#ccc' }}
                onClick={handleGetLocation}
              >
                <MapPin size={16} style={{margin:'0 auto'}}/> 
                <span style={{margin:'0 auto'}}>{geoLoc ? `Tagged: ${geoLoc.lat.toFixed(4)}, ${geoLoc.lng.toFixed(4)}` : 'Click to add Current Geo Location'}</span>
              </button>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button className="btn btn-forest" style={{ flex: 1 }} onClick={handleSubmit} disabled={submitting}>
                {submitting ? 'Uploading...' : 'Post Update'}
              </button>
              <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setSelectedDonation(null)} disabled={submitting}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
