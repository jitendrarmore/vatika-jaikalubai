'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { Leaf, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import styles from './page.module.css';

export default function LoginPage() {
  const { user, loading, signInWithGoogle, signInWithFacebook, signInWithEmail, signUpWithEmail } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && user) router.push('/dashboard');
  }, [user, loading, router]);

  const handleGoogle = async () => {
    setError('');
    setSubmitting(true);
    try {
      await signInWithGoogle();
      router.push('/dashboard');
    } catch (e: unknown) {
      setError((e as Error).message || 'Google sign-in failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFacebook = async () => {
    setError('');
    setSubmitting(true);
    try {
      await signInWithFacebook();
      router.push('/dashboard');
    } catch (e: unknown) {
      setError((e as Error).message || 'Facebook sign-in failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      if (mode === 'signup') {
        await signUpWithEmail(email, password, name);
      } else {
        await signInWithEmail(email, password);
      }
      router.push('/dashboard');
    } catch (e: unknown) {
      const msg = (e as Error).message || '';
      if (msg.includes('user-not-found')) setError('No account found. Please sign up.');
      else if (msg.includes('wrong-password')) setError('Incorrect password.');
      else if (msg.includes('email-already-in-use')) setError('Email already registered. Please sign in.');
      else setError(msg || 'Authentication failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className={styles.loadingScreen}>
      <div className={styles.spinner} />
    </div>
  );

  return (
    <div className={styles.page}>
      {/* Left panel */}
      <div className={styles.leftPanel}>
        <div className={styles.leftContent}>
          <div className={styles.logoMark}>
            <Leaf size={24} />
          </div>
          <h1 className={styles.leftTitle}>Vatika<br />Jai Kalubai</h1>
          <p className={styles.leftTagline}>
            &ldquo;Rooted in Faith,<br />Growing for Future 🌳&rdquo;
          </p>
          <div className={styles.leftFeatures}>
            <div className={styles.feature}><span>🌱</span> Plant trees for life&apos;s milestones</div>
            <div className={styles.feature}><span>📍</span> Track your tree on Mapbox</div>
            <div className={styles.feature}><span>🏅</span> Get a personalized certificate</div>
            <div className={styles.feature}><span>🙏</span> Earn Aai Kalubai&apos;s blessings</div>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className={styles.rightPanel}>
        <div className={styles.formCard}>
          <div className={styles.formHeader}>
            <h2 className={styles.formTitle}>
              {mode === 'login' ? 'Welcome Back 🙏' : 'Join Vatika 🌱'}
            </h2>
            <p className={styles.formSubtitle}>
              {mode === 'login'
                ? 'Sign in to track your trees and view your impact'
                : 'Create an account to start your green journey'}
            </p>
          </div>

          {/* Social buttons */}
          <div className={styles.socialButtons}>
            <button
              className={styles.socialBtn}
              onClick={handleGoogle}
              disabled={submitting}
              id="google-signin-btn"
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>

            <button
              className={`${styles.socialBtn} ${styles.facebookBtn}`}
              onClick={handleFacebook}
              disabled={submitting}
              id="facebook-signin-btn"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#FFFFFF">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Continue with Facebook
            </button>
          </div>

          <div className={styles.orDivider}>
            <span>or continue with email</span>
          </div>

          {/* Email form */}
          <form onSubmit={handleEmailSubmit} className={styles.emailForm}>
            {mode === 'signup' && (
              <div className="form-group">
                <label className="form-label" htmlFor="login-name">Full Name</label>
                <input
                  id="login-name"
                  className="form-input"
                  type="text"
                  placeholder="Your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}
            <div className="form-group">
              <label className="form-label" htmlFor="login-email">Email Address</label>
              <input
                id="login-email"
                className="form-input"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="login-password">Password</label>
              <div className={styles.passwordField}>
                <input
                  id="login-password"
                  className="form-input"
                  type={showPw ? 'text' : 'password'}
                  placeholder={mode === 'signup' ? 'Min 6 characters' : 'Your password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  style={{ paddingRight: '3rem' }}
                />
                <button
                  type="button"
                  className={styles.showPwBtn}
                  onClick={() => setShowPw(!showPw)}
                >
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && <div className={styles.errorMsg}>{error}</div>}

            <button
              type="submit"
              className="btn btn-forest btn-lg"
              style={{ width: '100%', marginTop: '0.5rem' }}
              disabled={submitting}
              id="email-submit-btn"
            >
              {submitting ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <p className={styles.switchMode}>
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              className={styles.switchBtn}
              onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); }}
            >
              {mode === 'login' ? 'Sign Up' : 'Sign In'}
            </button>
          </p>

          <p className={styles.terms}>
            By signing in, you agree to our{' '}
            <Link href="/privacy">Privacy Policy</Link> and{' '}
            <Link href="/terms">Terms of Service</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
