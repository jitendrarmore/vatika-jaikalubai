import Link from 'next/link';
import { Leaf, Heart, Mail, Phone, MapPin, ExternalLink } from 'lucide-react';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      {/* Wave top */}
      <div className={styles.wave}>
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 40 C360 80 720 0 1080 40 C1260 60 1380 30 1440 40 L1440 80 L0 80 Z" fill="#1B4332" />
        </svg>
      </div>

      <div className={styles.body}>
        <div className="container">
          <div className={styles.grid}>
            {/* Brand */}
            <div className={styles.brand}>
              <div className={styles.logo}>
                <div className={styles.logoIcon}><Leaf size={18} /></div>
                <div>
                  <div className={styles.logoMain}>Vatika</div>
                  <div className={styles.logoSub}>Jai Kalubai</div>
                </div>
              </div>
              <p className={styles.tagline}>
                &ldquo;Rooted in Faith, Growing for Future 🌳&rdquo;
              </p>
              <p className={styles.desc}>
                A non-profit initiative inspired by Jai Kalubai — planting trees of hope, faith, and love across Maharashtra.
              </p>
              <div className={styles.social}>
                <a href="#" aria-label="Facebook" className={styles.socialIcon}>f</a>
                <a href="#" aria-label="Instagram" className={styles.socialIcon}>in</a>
                <a href="#" aria-label="YouTube" className={styles.socialIcon}>▶</a>
              </div>
            </div>

            {/* Quick Links */}
            <div className={styles.col}>
              <h4 className={styles.colTitle}>Quick Links</h4>
              <ul className={styles.links}>
                <li><Link href="/">Home</Link></li>
                <li><Link href="/donate">Donate a Tree</Link></li>
                <li><Link href="/track">Track My Tree</Link></li>
                <li><Link href="/dashboard">My Dashboard</Link></li>
                <li><Link href="/about">About Vatika</Link></li>
              </ul>
            </div>

            {/* Occasions */}
            <div className={styles.col}>
              <h4 className={styles.colTitle}>Plant for Occasions</h4>
              <ul className={styles.links}>
                <li><Link href="/donate?occasion=birthday">🎂 Birthday</Link></li>
                <li><Link href="/donate?occasion=anniversary">💑 Anniversary</Link></li>
                <li><Link href="/donate?occasion=marriage">💍 Marriage</Link></li>
                <li><Link href="/donate?occasion=memorial">🙏 Memorial</Link></li>
                <li><Link href="/donate?occasion=custom">✨ Any Occasion</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div className={styles.col}>
              <h4 className={styles.colTitle}>Contact Us</h4>
              <ul className={styles.contact}>
                <li>
                  <MapPin size={16} />
                  <span>
                    At Kude Kh., Post Kude Budruk,<br />
                    Tal. Khed, Dist. Pune,<br />
                    Maharashtra, India
                  </span>
                </li>
                <li>
                  <Mail size={16} />
                  <a href="mailto:info@jaikalubai.in">info@jaikalubai.in</a>
                </li>
                <li>
                  <Phone size={16} />
                  <a href="tel:+919833550438">+91 98335 50438</a>
                </li>
              </ul>
              <div className={styles.whatsapp}>
                <a
                  href="https://wa.me/919833550438?text=Hi%20Vatika%2C%20I%20want%20to%20plant%20a%20tree!"
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-sm"
                  style={{ background: '#25D366', color: '#fff' }}
                >
                  💬 WhatsApp Us
                </a>
              </div>
            </div>
          </div>

          <div className={styles.bottom}>
            <p>© {new Date().getFullYear()} Vatika – Jai Kalubai. All rights reserved.</p>
            <p>Made with <Heart size={14} className={styles.heart} /> for nature &amp; community</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
