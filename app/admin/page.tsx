'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { mockPlants } from '@/lib/mockData';
import { Plus, Edit2, Trash2, RefreshCw, Settings, Users, TreePine, Package } from 'lucide-react';
import styles from './page.module.css';

type Tab = 'plants' | 'donations' | 'users';

export default function AdminPage() {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('plants');
  const [plants, setPlants] = useState(mockPlants);
  const [showAddPlant, setShowAddPlant] = useState(false);
  const [newPlant, setNewPlant] = useState({ name: '', marathiName: '', cost: 500, description: '', growthTimeline: '', category: 'Sacred' });

  useEffect(() => {
    if (!loading) {
      if (!user) router.push('/login');
      else if (!isAdmin) router.push('/dashboard');
    }
  }, [user, loading, isAdmin, router]);

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className={styles.spinner} />
    </div>
  );

  if (!user || !isAdmin) return null;

  const mockDonations = [
    { id: '1', trackingId: 'VJK8X2KQ4R', userName: 'Demo User', plantName: 'Peepal Tree', treeName: 'Shivaji', status: 'growing', date: '2024-01-15', cost: 500 },
    { id: '2', trackingId: 'VJKAB34XYZ', userName: 'Priya Deshmukh', plantName: 'Neem Tree', treeName: 'Aai Chi Smruti', status: 'planted', date: '2024-02-10', cost: 300 },
    { id: '3', trackingId: 'VJKCD78PQR', userName: 'Ramesh Patil', plantName: 'Mango Tree', treeName: 'Aamrapali', status: 'scheduled', date: '2024-03-05', cost: 700 },
  ];

  const statusBadge = (s: string) => {
    const colors: Record<string, string> = {
      scheduled: '#94A3B8', planted: '#2D6A4F', growing: '#52B788', thriving: '#D4A017'
    };
    return (
      <span style={{
        background: `${colors[s] || '#999'}20`,
        color: colors[s] || '#999',
        padding: '3px 10px',
        borderRadius: '9999px',
        fontSize: '0.75rem',
        fontWeight: 700,
        textTransform: 'capitalize',
      }}>{s}</span>
    );
  };

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div className="container">
          <div className={styles.headerTop}>
            <div>
              <div className={styles.adminBadge}><Settings size={14} /> Admin Panel</div>
              <h1 className={styles.title}>Vatika Dashboard</h1>
              <p className={styles.subtitle}>Manage plants, donations, and users</p>
            </div>
          </div>

          {/* Quick stats */}
          <div className={styles.quickStats}>
            <div className={styles.qs}><TreePine size={18} /><div><strong>{plants.length}</strong><span>Plant Types</span></div></div>
            <div className={styles.qs}><Package size={18} /><div><strong>{mockDonations.length}</strong><span>Donations</span></div></div>
            <div className={styles.qs}><Users size={18} /><div><strong>24</strong><span>Users</span></div></div>
            <div className={styles.qs}><RefreshCw size={18} /><div><strong>3</strong><span>In Progress</span></div></div>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '2rem 1.5rem 4rem' }}>
        {/* Tabs */}
        <div className={styles.tabs}>
          {(['plants', 'donations', 'users'] as Tab[]).map((t) => (
            <button
              key={t}
              className={`${styles.tab} ${tab === t ? styles.tabActive : ''}`}
              onClick={() => setTab(t)}
              id={`admin-tab-${t}`}
            >
              {t === 'plants' ? <Package size={16} /> : t === 'donations' ? <TreePine size={16} /> : <Users size={16} />}
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* === PLANTS TAB === */}
        {tab === 'plants' && (
          <div>
            <div className={styles.tableHeader}>
              <h2 className={styles.tableTitle}>Plant Catalog</h2>
              <button
                className="btn btn-forest btn-sm"
                onClick={() => setShowAddPlant(!showAddPlant)}
                id="add-plant-btn"
              >
                <Plus size={16} /> Add Plant
              </button>
            </div>

            {showAddPlant && (
              <div className={styles.addForm}>
                <h3>Add New Plant</h3>
                <div className={styles.formGrid}>
                  <div className="form-group">
                    <label className="form-label">Plant Name (English)</label>
                    <input className="form-input" value={newPlant.name}
                      onChange={(e) => setNewPlant(p => ({ ...p, name: e.target.value }))}
                      placeholder="e.g., Peepal Tree" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Plant Name (Marathi)</label>
                    <input className="form-input" value={newPlant.marathiName}
                      onChange={(e) => setNewPlant(p => ({ ...p, marathiName: e.target.value }))}
                      placeholder="e.g., पिंपळ" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Cost (₹)</label>
                    <input className="form-input" type="number" value={newPlant.cost}
                      onChange={(e) => setNewPlant(p => ({ ...p, cost: +e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select className="form-input" value={newPlant.category}
                      onChange={(e) => setNewPlant(p => ({ ...p, category: e.target.value }))}>
                      <option>Sacred</option><option>Medicinal</option><option>Fruit</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">Description</label>
                    <textarea className="form-input" rows={3} value={newPlant.description}
                      onChange={(e) => setNewPlant(p => ({ ...p, description: e.target.value }))} />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                  <button
                    className="btn btn-forest"
                    onClick={() => {
                      if (newPlant.name) {
                        setPlants(prev => [...prev, {
                          ...newPlant,
                          id: Date.now().toString(),
                          image: '',
                          benefits: ['To be updated'],
                        }]);
                        setShowAddPlant(false);
                        setNewPlant({ name: '', marathiName: '', cost: 500, description: '', growthTimeline: '', category: 'Sacred' });
                      }
                    }}
                    id="save-plant-btn"
                  >
                    Save Plant
                  </button>
                  <button className="btn btn-secondary" onClick={() => setShowAddPlant(false)}>Cancel</button>
                </div>
              </div>
            )}

            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Plant</th>
                    <th>Marathi Name</th>
                    <th>Category</th>
                    <th>Cost</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {plants.map((plant) => (
                    <tr key={plant.id}>
                      <td>
                        <div className={styles.plantCell}>
                          <span className={styles.plantCellEmoji}>
                            {plant.id === 'peepal' ? '🌳' : plant.id === 'neem' ? '🌿' :
                             plant.id === 'mango' ? '🥭' : plant.id === 'banyan' ? '🌲' :
                             plant.id === 'amla' ? '🍈' : '🌱'}
                          </span>
                          <div>
                            <strong>{plant.name}</strong>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{plant.description?.slice(0, 50)}...</div>
                          </div>
                        </div>
                      </td>
                      <td>{plant.marathiName}</td>
                      <td><span className={`badge badge-forest`}>{plant.category}</span></td>
                      <td><strong>₹{plant.cost}</strong></td>
                      <td>
                        <div className={styles.actionBtns}>
                          <button className={styles.iconBtn} title="Edit"><Edit2 size={15} /></button>
                          <button
                            className={`${styles.iconBtn} ${styles.iconBtnDanger}`}
                            title="Delete"
                            onClick={() => setPlants(prev => prev.filter(p => p.id !== plant.id))}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* === DONATIONS TAB === */}
        {tab === 'donations' && (
          <div>
            <div className={styles.tableHeader}>
              <h2 className={styles.tableTitle}>All Donations</h2>
            </div>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Tracking ID</th>
                    <th>Donor</th>
                    <th>Tree</th>
                    <th>Plant</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Amount</th>
                    <th>Update</th>
                  </tr>
                </thead>
                <tbody>
                  {mockDonations.map((d) => (
                    <tr key={d.id}>
                      <td><code style={{ fontSize: '0.8rem' }}>{d.trackingId}</code></td>
                      <td>{d.userName}</td>
                      <td><strong>{d.treeName}</strong></td>
                      <td>{d.plantName}</td>
                      <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        {new Date(d.date).toLocaleDateString('en-IN')}
                      </td>
                      <td>{statusBadge(d.status)}</td>
                      <td><strong>₹{d.cost}</strong></td>
                      <td>
                        <select className="form-input" style={{ padding: '0.3rem 0.5rem', fontSize: '0.8rem' }}
                          defaultValue={d.status}>
                          <option value="scheduled">Scheduled</option>
                          <option value="planted">Planted</option>
                          <option value="growing">Growing</option>
                          <option value="thriving">Thriving</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* === USERS TAB === */}
        {tab === 'users' && (
          <div>
            <div className={styles.tableHeader}>
              <h2 className={styles.tableTitle}>Registered Users</h2>
            </div>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Trees Donated</th>
                    <th>Joined</th>
                    <th>Role</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Admin User</strong></td>
                    <td>{user.email}</td>
                    <td>0</td>
                    <td>—</td>
                    <td><span className="badge badge-gold">Admin</span></td>
                  </tr>
                  <tr>
                    <td><strong>Priya Deshmukh</strong></td>
                    <td>priya@example.com</td>
                    <td>2</td>
                    <td>Jan 2024</td>
                    <td><span className="badge badge-forest">User</span></td>
                  </tr>
                  <tr>
                    <td><strong>Ramesh Patil</strong></td>
                    <td>ramesh@example.com</td>
                    <td>1</td>
                    <td>Feb 2024</td>
                    <td><span className="badge badge-forest">User</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
