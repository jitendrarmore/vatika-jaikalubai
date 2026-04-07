'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { Menu, X, Leaf, User, LogOut, LayoutDashboard, Shield } from 'lucide-react';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut, isAdmin } = useAuth();
  const isHome = pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/donate', label: 'Donate a Tree' },
    { href: '/track', label: 'Track My Tree' },
    { href: '/about', label: 'About' },
  ];

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
    setProfileOpen(false);
  };

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''} ${!isHome ? styles.solidNav : ''}`}>
      <div className={`container ${styles.inner}`}>
        {/* Logo */}
        <Link href="/" className={styles.logo}>
          <div className={styles.logoIcon}>
            <Leaf size={20} />
          </div>
          <div className={styles.logoText}>
            <span className={styles.logoMain}>Vatika</span>
            <span className={styles.logoSub}>Jai Kalubai</span>
          </div>
        </Link>

        {/* Desktop nav links */}
        <div className={styles.links}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.link} ${pathname === link.href ? styles.active : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className={styles.actions}>
          {user ? (
            <div className={styles.profileWrapper}>
              <button
                className={styles.profileBtn}
                onClick={() => setProfileOpen(!profileOpen)}
                id="nav-profile-btn"
              >
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || 'User'} className={styles.avatar} />
                ) : (
                  <div className={styles.avatarFallback}>
                    {(user.displayName || user.email || 'U')[0].toUpperCase()}
                  </div>
                )}
                <span className={styles.profileName}>{user.displayName?.split(' ')[0] || 'Account'}</span>
              </button>
              {profileOpen && (
                <div className={styles.dropdown}>
                  <div className={styles.dropdownHeader}>
                    <p className={styles.dropdownName}>{user.displayName || 'User'}</p>
                    <p className={styles.dropdownEmail}>{user.email}</p>
                  </div>
                  <Link href="/dashboard" className={styles.dropdownItem} onClick={() => setProfileOpen(false)}>
                    <LayoutDashboard size={16} /> My Dashboard
                  </Link>
                  {isAdmin && (
                    <Link href="/admin" className={styles.dropdownItem} onClick={() => setProfileOpen(false)}>
                      <Shield size={16} /> Admin Panel
                    </Link>
                  )}
                  <button onClick={handleSignOut} className={`${styles.dropdownItem} ${styles.dropdownLogout}`}>
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/login" className="btn btn-ghost btn-sm">Sign In</Link>
              <Link href="/donate" className="btn btn-primary btn-sm">Donate a Tree 🌱</Link>
            </>
          )}

          {/* Mobile menu button */}
          <button className={styles.menuBtn} onClick={() => setMenuOpen(!menuOpen)} id="nav-hamburger">
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className={styles.mobileMenu}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.mobileLink} ${pathname === link.href ? styles.mobileActive : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className={styles.mobileCta}>
            {user ? (
              <>
                <Link href="/dashboard" className="btn btn-secondary btn-sm" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                <button onClick={handleSignOut} className="btn btn-ghost btn-sm">Sign Out</button>
              </>
            ) : (
              <>
                <Link href="/login" className="btn btn-secondary btn-sm" onClick={() => setMenuOpen(false)}>Sign In</Link>
                <Link href="/donate" className="btn btn-primary btn-sm" onClick={() => setMenuOpen(false)}>Donate 🌱</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
