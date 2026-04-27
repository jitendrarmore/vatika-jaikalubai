'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { mockPlants, occasions, generateTrackingId } from '@/lib/mockData';
import { createDonation } from '@/lib/firebase/donations';
import type { Plant } from '@/lib/firebase/plants';
import { Check, ArrowLeft, ArrowRight, Calendar, CreditCard, TreePine, Eye, EyeOff, Smartphone, User, Mail, Lock, Leaf } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import Link from 'next/link';
import styles from './page.module.css';

interface WizardState {
  occasion: string;
  plant: Plant | null;
  date: string;
  treeName: string;
  dedication: string;
  trackingId: string;
  // Guest account fields
  guestName: string;
  guestEmail: string;
  guestPassword: string;
  guestMobile: string;
}

function DonateWizard() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, signUpGuest } = useAuth();

  // For logged-in users: 5 steps (skip account step). For guests: 6 steps.
  const isGuest = !user;
  const totalSteps = isGuest ? 6 : 5;

  // Map wizard step → label step (for progress bar, which always shows 5 dots)
  // Guests:  1=Occasion 2=Tree 3=Date 4=Name 5=Account 6=Payment → Success
  // Members: 1=Occasion 2=Tree 3=Date 4=Name 5=Payment → Success

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [accountError, setAccountError] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [state, setState] = useState<WizardState>({
    occasion: searchParams.get('occasion') || '',
    plant: mockPlants.find(p => p.id === searchParams.get('plant')) || null,
    date: '',
    treeName: '',
    dedication: '',
    trackingId: '',
    guestName: '',
    guestEmail: '',
    guestPassword: '',
    guestMobile: '',
  });
  const [paymentStep, setPaymentStep] = useState<'summary' | 'processing' | 'done'>('summary');

  // Re-evaluate guest state if user signs in mid-flow
  useEffect(() => {
    if (user && isGuest) {
      // User just signed in (e.g. via step 5), advance past account step automatically
    }
  }, [user, isGuest]);

  const updateState = (updates: Partial<WizardState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const next = () => setStep(s => Math.min(s + 1, totalSteps + 1));
  const prev = () => setStep(s => Math.max(s - 1, 1));

  // Step numbers with guest awareness
  // Guest steps: 1 Occasion | 2 Tree | 3 Date | 4 Name | 5 Account | 6 Payment | 7 Success
  // Auth  steps: 1 Occasion | 2 Tree | 3 Date | 4 Name |            5 Payment | 6 Success
  const STEP_PAYMENT = isGuest ? 6 : 5;
  const STEP_SUCCESS = isGuest ? 7 : 6;
  const STEP_ACCOUNT = 5; // only relevant for guests

  // Progress bar shows 5 dots always (occasion/tree/date/name+account/payment)
  const progressStep = isGuest
    ? (step <= 4 ? step : step === 5 ? 4 : step === 6 ? 5 : 5)
    : step;

  const handleGuestAccount = async () => {
    setAccountError('');
    setLoading(true);
    try {
      await signUpGuest(
        state.guestEmail,
        state.guestPassword,
        state.guestName,
        state.guestMobile
      );
      // Firebase onAuthStateChanged will update `user`, but we can proceed immediately
      next();
    } catch (e: unknown) {
      const msg = (e as Error).message || '';
      if (msg.includes('email-already-in-use')) {
        setAccountError('An account with this email already exists. Please sign in first.');
      } else if (msg.includes('weak-password')) {
        setAccountError('Password must be at least 6 characters.');
      } else if (msg.includes('invalid-email')) {
        setAccountError('Please enter a valid email address.');
      } else {
        setAccountError(msg || 'Failed to create account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    setPaymentStep('processing');
    await new Promise(r => setTimeout(r, 2500));

    const trackingId = generateTrackingId();
    updateState({ trackingId });

    // At this point, `user` is either the pre-existing user or the newly created guest account
    const currentUser = user;
    if (currentUser && state.plant) {
      try {
        await createDonation({
          uid: currentUser.uid,
          userEmail: currentUser.email || state.guestEmail,
          userName: currentUser.displayName || state.guestName || 'Anonymous',
          mobile: state.guestMobile || undefined,
          plantId: state.plant.id || '',
          plantName: state.plant.name,
          occasion: state.occasion,
          treeName: state.treeName,
          dedication: state.dedication,
          plantationDate: state.date,
          trackingId,
          status: 'scheduled',
          cost: state.plant.cost,
          location: { lat: 16.7048, lng: 74.2433, address: 'Kolhapur, Maharashtra' },
        });
      } catch (e) {
        console.error('Failed to save donation', e);
      }
    }

    setPaymentStep('done');
    setStep(STEP_SUCCESS);
  };

  const displayEmail = user?.email || state.guestEmail;

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div className="container">
          <h1 className={styles.pageTitle}>Donate a Tree 🌱</h1>
          <p className={styles.pageSubtitle}>Plant a living tribute with Aai Kalubai&apos;s blessing</p>

          {/* Progress bar — always 5 dots */}
          {step < STEP_SUCCESS && (
            <div className={styles.progress}>
              {[1, 2, 3, 4, 5].map((s) => (
                <div key={s} className={styles.progressItem}>
                  <div className={`${styles.progressDot} ${progressStep > s ? styles.done : ''} ${progressStep === s ? styles.active : ''}`}>
                    {progressStep > s ? <Check size={14} /> : s}
                  </div>
                  {s < 5 && <div className={`${styles.progressLine} ${progressStep > s ? styles.lineDone : ''}`} />}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="container">
        <div className={styles.wizardContainer}>

          {/* === STEP 1: OCCASION === */}
          {step === 1 && (
            <div className={styles.step}>
              <div className={styles.stepHeader}>
                <h2 className={styles.stepTitle}>Choose Your Occasion</h2>
                <p className={styles.stepDesc}>What special moment are you celebrating today?</p>
              </div>
              <div className={styles.occasionGrid}>
                {occasions.map((occ) => (
                  <button
                    key={occ.id}
                    className={`${styles.occasionCard} ${state.occasion === occ.id ? styles.selected : ''}`}
                    onClick={() => updateState({ occasion: occ.id })}
                    id={`occasion-${occ.id}`}
                  >
                    <span className={styles.occasionIcon}>{occ.icon}</span>
                    <span className={styles.occasionLabel}>{occ.label}</span>
                    <span className={styles.occasionDesc}>{occ.description}</span>
                    {state.occasion === occ.id && (
                      <div className={styles.selectedCheck}><Check size={16} /></div>
                    )}
                  </button>
                ))}
              </div>
              <div className={styles.stepActions}>
                <div />
                <button
                  className="btn btn-forest btn-lg"
                  onClick={next}
                  disabled={!state.occasion}
                  id="step1-next"
                >
                  Continue <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* === STEP 2: PLANT === */}
          {step === 2 && (
            <div className={styles.step}>
              <div className={styles.stepHeader}>
                <h2 className={styles.stepTitle}>Select Your Tree</h2>
                <p className={styles.stepDesc}>Each tree carries unique blessings and benefits</p>
              </div>
              <div className={styles.plantsGrid}>
                {mockPlants.map((plant) => (
                  <button
                    key={plant.id}
                    className={`${styles.plantCard} ${state.plant?.id === plant.id ? styles.selected : ''}`}
                    onClick={() => updateState({ plant })}
                    id={`plant-${plant.id}`}
                  >
                    {state.plant?.id === plant.id && (
                      <div className={styles.selectedCheck}><Check size={16} /></div>
                    )}
                    <div className={styles.plantEmoji}>
                      {plant.id === 'peepal' ? '🌳' : plant.id === 'neem' ? '🌿' :
                       plant.id === 'mango' ? '🥭' : plant.id === 'banyan' ? '🌲' :
                       plant.id === 'amla' ? '🍈' : '🌱'}
                    </div>
                    <div className={styles.plantInfo}>
                      <div className={styles.plantNameRow}>
                        <h3 className={styles.plantName}>{plant.name}</h3>
                        <span className={styles.plantMarathi}>{plant.marathiName}</span>
                      </div>
                      <p className={styles.plantDesc}>{plant.description.slice(0, 90)}...</p>
                      <div className={styles.plantBenefits}>
                        {plant.benefits.slice(0, 3).map((b) => (
                          <span key={b} className="badge badge-sage">{b}</span>
                        ))}
                      </div>
                      <div className={styles.plantMeta}>
                        <span className={styles.plantTimeline}>⏱ {plant.growthTimeline}</span>
                        <span className={styles.plantCost}>₹{plant.cost}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <div className={styles.stepActions}>
                <button className="btn btn-secondary" onClick={prev}><ArrowLeft size={18} /> Back</button>
                <button className="btn btn-forest btn-lg" onClick={next} disabled={!state.plant} id="step2-next">
                  Continue <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* === STEP 3: DATE === */}
          {step === 3 && (
            <div className={styles.step}>
              <div className={styles.stepHeader}>
                <h2 className={styles.stepTitle}>Choose Plantation Date</h2>
                <p className={styles.stepDesc}>When would you like your tree to be planted?</p>
              </div>
              <div className={styles.dateSection}>
                <div className={styles.dateCard}>
                  <Calendar size={40} color="var(--forest)" />
                  <h3>Choose a Date</h3>
                  <input
                    type="date"
                    className={`form-input ${styles.dateInput}`}
                    value={state.date}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => updateState({ date: e.target.value })}
                    id="plantation-date"
                  />
                </div>
                <div className={styles.orDivider}>— OR —</div>
                <button
                  className={`${styles.immediateBtn} ${state.date === new Date().toISOString().split('T')[0] ? styles.selected : ''}`}
                  onClick={() => updateState({ date: new Date().toISOString().split('T')[0] })}
                  id="date-immediate"
                >
                  🌱 Plant Immediately
                  <span>We&apos;ll plant within 2–3 working days</span>
                </button>
              </div>
              <div className={styles.stepActions}>
                <button className="btn btn-secondary" onClick={prev}><ArrowLeft size={18} /> Back</button>
                <button className="btn btn-forest btn-lg" onClick={next} disabled={!state.date} id="step3-next">
                  Continue <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* === STEP 4: NAMING === */}
          {step === 4 && (
            <div className={styles.step}>
              <div className={styles.stepHeader}>
                <h2 className={styles.stepTitle}>Name Your Tree</h2>
                <p className={styles.stepDesc}>Give your tree a name and a message it will carry forever</p>
              </div>
              <div className={styles.namingForm}>
                <div className="form-group">
                  <label className="form-label" htmlFor="tree-name">
                    🌳 Tree Name <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input
                    id="tree-name"
                    className="form-input"
                    type="text"
                    placeholder="e.g., Aai chya smruti cha Vriksha (Mom's Memory Tree)"
                    value={state.treeName}
                    onChange={(e) => updateState({ treeName: e.target.value })}
                    maxLength={60}
                  />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {state.treeName.length}/60 characters
                  </span>
                </div>
                <div className="form-group" style={{ marginTop: '1.5rem' }}>
                  <label className="form-label" htmlFor="dedication">
                    🙏 Dedication Message (optional)
                  </label>
                  <textarea
                    id="dedication"
                    className="form-input"
                    placeholder="Write a heartfelt message for this tree..."
                    value={state.dedication}
                    onChange={(e) => updateState({ dedication: e.target.value })}
                    rows={4}
                    maxLength={200}
                    style={{ resize: 'vertical' }}
                  />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {state.dedication.length}/200 characters
                  </span>
                </div>
                <div className={styles.namingPreview}>
                  <div className={styles.previewLabel}>Preview</div>
                  <div className={styles.previewCard}>
                    <div className={styles.previewTree}>🌳</div>
                    <div className={styles.previewName}>{state.treeName || 'Your Tree Name'}</div>
                    {state.dedication && <div className={styles.previewDedication}>&ldquo;{state.dedication}&rdquo;</div>}
                    <div className={styles.previewPlant}>{state.plant?.name} • {state.occasion}</div>
                  </div>
                </div>
              </div>
              <div className={styles.stepActions}>
                <button className="btn btn-secondary" onClick={prev}><ArrowLeft size={18} /> Back</button>
                <button className="btn btn-forest btn-lg" onClick={next} disabled={!state.treeName} id="step4-next">
                  {isGuest ? 'Continue' : 'Continue to Payment'} <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* === STEP 5: GUEST ACCOUNT (guests only) === */}
          {step === STEP_ACCOUNT && isGuest && (
            <div className={styles.step}>
              <div className={styles.stepHeader}>
                <h2 className={styles.stepTitle}>Almost There! 🌱</h2>
                <p className={styles.stepDesc}>
                  Create a free account to track your tree and receive updates
                </p>
              </div>

              <div className={styles.accountStep}>
                <div className={styles.accountBadge}>
                  <Leaf size={16} />
                  Free account · No spam · Track your tree forever
                </div>

                <div className={styles.accountForm}>
                  {/* Full Name */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="guest-name">
                      <User size={15} style={{ display: 'inline', marginRight: '0.4rem' }} />
                      Full Name <span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                      id="guest-name"
                      className="form-input"
                      type="text"
                      placeholder="Your full name"
                      value={state.guestName}
                      onChange={(e) => updateState({ guestName: e.target.value })}
                      required
                    />
                  </div>

                  {/* Email */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="guest-email">
                      <Mail size={15} style={{ display: 'inline', marginRight: '0.4rem' }} />
                      Email Address <span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                      id="guest-email"
                      className="form-input"
                      type="email"
                      placeholder="your@email.com"
                      value={state.guestEmail}
                      onChange={(e) => updateState({ guestEmail: e.target.value })}
                      required
                    />
                  </div>

                  {/* Password */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="guest-password">
                      <Lock size={15} style={{ display: 'inline', marginRight: '0.4rem' }} />
                      Password <span style={{ color: 'red' }}>*</span>
                    </label>
                    <div className={styles.passwordField}>
                      <input
                        id="guest-password"
                        className="form-input"
                        type={showPw ? 'text' : 'password'}
                        placeholder="Min 6 characters"
                        value={state.guestPassword}
                        onChange={(e) => updateState({ guestPassword: e.target.value })}
                        required
                        minLength={6}
                        style={{ paddingRight: '3rem' }}
                      />
                      <button
                        type="button"
                        className={styles.showPwBtn}
                        onClick={() => setShowPw(!showPw)}
                        tabIndex={-1}
                        aria-label="Toggle password visibility"
                      >
                        {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  {/* Mobile */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="guest-mobile">
                      <Smartphone size={15} style={{ display: 'inline', marginRight: '0.4rem' }} />
                      Mobile Number <span style={{ color: 'red' }}>*</span>
                    </label>
                    <div className={styles.mobileField}>
                      <span className={styles.mobilePrefix}>🇮🇳 +91</span>
                      <input
                        id="guest-mobile"
                        className={`form-input ${styles.mobileInput}`}
                        type="tel"
                        placeholder="9876543210"
                        value={state.guestMobile}
                        onChange={(e) => {
                          const v = e.target.value.replace(/\D/g, '').slice(0, 10);
                          updateState({ guestMobile: v });
                        }}
                        pattern="[0-9]{10}"
                        required
                      />
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Used only for tree update notifications
                    </span>
                  </div>

                  {/* Error */}
                  {accountError && (
                    <div className={styles.accountError}>
                      <span>{accountError}</span>
                      {accountError.includes('already exists') && (
                        <Link href={`/login`} className={styles.accountErrorLink}>
                          Sign in instead →
                        </Link>
                      )}
                    </div>
                  )}

                  <div className={styles.accountNote}>
                    🔒 Your details are securely stored. We&apos;ll send your tree tracking ID and plantation updates to your email and mobile.
                  </div>
                </div>

                <div className={styles.accountDivider}>
                  <span>Already have an account?</span>
                  <Link href="/login" className={styles.accountSignInLink}>Sign in</Link>
                </div>
              </div>

              <div className={styles.stepActions}>
                <button className="btn btn-secondary" onClick={prev}><ArrowLeft size={18} /> Back</button>
                <button
                  className="btn btn-forest btn-lg"
                  onClick={handleGuestAccount}
                  disabled={
                    loading ||
                    !state.guestName ||
                    !state.guestEmail ||
                    state.guestPassword.length < 6 ||
                    state.guestMobile.length !== 10
                  }
                  id="guest-account-next"
                >
                  {loading ? 'Creating account...' : 'Continue to Payment'} <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* === PAYMENT STEP === */}
          {step === STEP_PAYMENT && (
            <div className={styles.step}>
              <div className={styles.stepHeader}>
                <h2 className={styles.stepTitle}>Confirm &amp; Donate</h2>
                <p className={styles.stepDesc}>Review your tree donation and complete payment</p>
              </div>

              {paymentStep === 'summary' && (
                <>
                  <div className={styles.summaryCard}>
                    <h3 className={styles.summaryTitle}>Donation Summary</h3>
                    <div className={styles.summaryRow}>
                      <span>🎉 Occasion</span>
                      <span className={styles.summaryValue}>
                        {occasions.find(o => o.id === state.occasion)?.label}
                      </span>
                    </div>
                    <div className={styles.summaryRow}>
                      <span>🌳 Tree</span>
                      <span className={styles.summaryValue}>{state.plant?.name}</span>
                    </div>
                    <div className={styles.summaryRow}>
                      <span>✏️ Name</span>
                      <span className={styles.summaryValue}>{state.treeName}</span>
                    </div>
                    <div className={styles.summaryRow}>
                      <span>📅 Date</span>
                      <span className={styles.summaryValue}>
                        {new Date(state.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                    </div>
                    {state.dedication && (
                      <div className={styles.summaryRow}>
                        <span>🙏 Dedication</span>
                        <span className={styles.summaryValue}>{state.dedication}</span>
                      </div>
                    )}
                    {(state.guestEmail || user?.email) && (
                      <div className={styles.summaryRow}>
                        <span>📧 Receipt to</span>
                        <span className={styles.summaryValue}>{displayEmail}</span>
                      </div>
                    )}
                    <div className={styles.summaryDivider} />
                    <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
                      <span>Total Donation</span>
                      <span className={styles.totalAmount}>₹{state.plant?.cost}</span>
                    </div>
                  </div>

                  <div className={styles.paymentMethods}>
                    <h3>Select Payment Method</h3>
                    <div className={styles.paymentGrid}>
                      <div className={`${styles.paymentMethod} ${styles.paymentSelected}`}>
                        💳 UPI / Cards (Razorpay)
                      </div>
                    </div>
                    <p className={styles.secureNote}>
                      🔒 100% Secure Payment · 80G Tax Benefits · Donation Receipt via Email
                    </p>
                  </div>

                  <div className={styles.stepActions}>
                    <button className="btn btn-secondary" onClick={prev}><ArrowLeft size={18} /> Back</button>
                    <button
                      className="btn btn-primary btn-lg"
                      onClick={handlePayment}
                      id="pay-now-btn"
                    >
                      <CreditCard size={18} /> Donate ₹{state.plant?.cost} Now
                    </button>
                  </div>
                </>
              )}

              {paymentStep === 'processing' && (
                <div className={styles.processingState}>
                  <div className={styles.spinner} />
                  <h3>Processing Your Donation...</h3>
                  <p>Connecting to payment gateway 🔒</p>
                  <div className={styles.processingSteps}>
                    <div className={styles.processingStep}>✓ Validating donation details</div>
                    <div className={styles.processingStep}>✓ Securing payment channel</div>
                    <div className={styles.processingStep} style={{ opacity: 0.5 }}>⟳ Processing payment...</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* === SUCCESS === */}
          {step === STEP_SUCCESS && (
            <div className={styles.successPage}>
              <div className={styles.successCard}>
                <div className={styles.successIcon}>🙏</div>
                <h2 className={styles.successBlessing}>
                  आई कलुबाईचा आशीर्वाद नेहमी असो
                </h2>
                <p className={styles.successMessage}>
                  Your tree has been registered! May it grow tall with Aai Kalubai&apos;s divine grace.
                </p>

                <div className={styles.trackingBox}>
                  <div className={styles.trackingLabel}>Your Tracking ID</div>
                  <div className={styles.trackingId}>{state.trackingId}</div>
                  <div className={styles.qrCode}>
                    <QRCodeSVG
                      value={`https://vatika.jaikalubai.in/track/${state.trackingId}`}
                      size={140}
                      fgColor="#1B4332"
                      bgColor="transparent"
                    />
                  </div>
                  <p className={styles.qrLabel}>Scan to track your tree anytime</p>
                </div>

                <div className={styles.successDetails}>
                  <div className={styles.detailRow}>
                    <span>🌳 Tree</span><span>{state.plant?.name}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span>✏️ Name</span><span>{state.treeName}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span>📅 Plantation</span>
                    <span>{new Date(state.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span>💰 Donated</span><span>₹{state.plant?.cost}</span>
                  </div>
                  {(state.guestMobile) && (
                    <div className={styles.detailRow}>
                      <span>📱 Updates to</span><span>+91 {state.guestMobile}</span>
                    </div>
                  )}
                </div>

                {isGuest && (
                  <div className={styles.successAccountNote}>
                    🎉 Your account has been created! <Link href="/dashboard" className={styles.successDashboardLink}>Go to Dashboard</Link> to see your tree.
                  </div>
                )}

                <div className={styles.successActions}>
                  <a
                    href={`/track/${state.trackingId}`}
                    className="btn btn-forest btn-lg"
                    id="track-tree-btn"
                  >
                    <TreePine size={18} /> Track Your Tree
                  </a>
                  <button
                    className="btn btn-secondary"
                    onClick={() => {
                      const msg = `🌳 I just donated a ${state.plant?.name} through Vatika – Jai Kalubai!\nMy tree: "${state.treeName}"\nTrack it here: https://vatika.jaikalubai.in/track/${state.trackingId}\n🙏 आई कलुबाईचा आशीर्वाद नेहमी असो`;
                      window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
                    }}
                    id="share-whatsapp-btn"
                  >
                    💬 Share on WhatsApp
                  </button>
                </div>

                <p className={styles.successNote}>
                  📧 A confirmation email has been sent to {displayEmail || 'your email'}
                </p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default function DonatePage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner" />
      </div>
    }>
      <DonateWizard />
    </Suspense>
  );
}
