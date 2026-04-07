'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ArrowRight, TreePine, Users, MapPin, Leaf, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { mockPlants, mockTestimonials, impactStats, occasions } from '@/lib/mockData';
import styles from './page.module.css';

export default function HomePage() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [counts, setCounts] = useState(impactStats.map(() => 0));
  const statsRef = useRef<HTMLDivElement>(null);
  const counted = useRef(false);

  // Animate counters when stats section is visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !counted.current) {
          counted.current = true;
          impactStats.forEach((stat, i) => {
            let start = 0;
            const end = stat.value;
            const duration = 2000;
            const step = (end / duration) * 16;
            const timer = setInterval(() => {
              start += step;
              if (start >= end) {
                start = end;
                clearInterval(timer);
              }
              setCounts((prev) => {
                const next = [...prev];
                next[i] = Math.floor(start);
                return next;
              });
            }, 16);
          });
        }
      },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  const howItWorks = [
    { step: 1, icon: '🎉', title: 'Choose Occasion', desc: 'Birthday, anniversary, memorial, or any special day' },
    { step: 2, icon: '🌿', title: 'Select Plant', desc: 'Pick from sacred, medicinal, or fruit trees' },
    { step: 3, icon: '📅', title: 'Pick Date', desc: 'Schedule planting or choose immediate planting' },
    { step: 4, icon: '✏️', title: 'Name Your Tree', desc: 'Give it a personal name and dedication message' },
    { step: 5, icon: '💳', title: 'Make Payment', desc: 'Secure, transparent donation with receipt' },
    { step: 6, icon: '📍', title: 'Track Growth', desc: 'Monitor your tree\'s progress with photos & map' },
  ];

  return (
    <div className={styles.page}>
      {/* ===== HERO ===== */}
      <section className={styles.hero}>
        {/* Animated leaves */}
        <div className={styles.leaves} aria-hidden>
          {[...Array(8)].map((_, i) => (
            <span key={i} className={styles.leaf} style={{ '--i': i } as React.CSSProperties}>🍃</span>
          ))}
        </div>

        <div className={`container ${styles.heroContent}`}>
          <div className={styles.heroBadge}>
            <Leaf size={14} /> Jai Kalubai Initiative
          </div>
          <h1 className={styles.heroTitle}>
            Plant a Tree,<br />
            <span className={styles.heroHighlight}>Celebrate Life</span> 🌱
          </h1>
          <p className={styles.heroSubtitle}>
            Honor your loved ones with a living tribute. Every donation plants a tree that breathes, grows, and gives back to the earth — with Aai Kalubai&apos;s blessing. 🙏
          </p>
          <div className={styles.heroActions}>
            <Link href="/donate" className="btn btn-primary btn-lg" id="hero-donate-btn">
              Donate a Tree <ArrowRight size={18} />
            </Link>
            <Link href="/track" className="btn btn-ghost btn-lg" id="hero-track-btn">
              Track My Tree
            </Link>
          </div>
          <div className={styles.heroBlessings}>
            <span>🌺 आई कलुबाईचा आशीर्वाद 🌺</span>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className={styles.scrollIndicator}>
          <div className={styles.scrollDot} />
        </div>
      </section>

      {/* ===== IMPACT STATS ===== */}
      <section className={styles.stats} ref={statsRef}>
        <div className="container">
          <div className={styles.statsGrid}>
            {impactStats.map((stat, i) => (
              <div key={stat.label} className={styles.statCard}>
                <div className={styles.statValue}>
                  {counts[i].toLocaleString('en-IN')}{stat.suffix}
                </div>
                <div className={styles.statLabel}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ABOUT ===== */}
      <section className={`section ${styles.about}`} id="about">
        <div className="container">
          <div className={styles.aboutGrid}>
            <div className={styles.aboutImage}>
              <div className={styles.aboutIllustration}>
                <div className={styles.treeIllustration}>🌳</div>
                <div className={styles.aboutBadge}>
                  <span>Est. 2024</span>
                </div>
              </div>
            </div>
            <div className={styles.aboutText}>
              <div className="section-tag">🙏 Our Story</div>
              <h2 className="section-title">About Vatika &amp; Jai Kalubai</h2>
              <p className={styles.aboutPara}>
                <strong>Vatika</strong> is a sacred initiative born from the devotion to <strong>Aai Kalubai</strong> — the revered deity of Maharashtra, worshipped for her divine blessings and protective grace.
              </p>
              <p className={styles.aboutPara}>
                Just as Aai Kalubai nurtures her devotees, we nurture the earth by planting trees. Each tree is a living prayer — rooted in faith, growing with hope, giving back to the community and the environment.
              </p>
              <p className={styles.aboutPara}>
                Our mission is simple: make tree donation accessible, transparent, and deeply meaningful — so every celebration, every memory, every life milestone becomes an act of environmental service.
              </p>
              <div className={styles.aboutStats}>
                <div className={styles.aboutStat}>
                  <span className={styles.aboutStatNum}>100%</span>
                  <span className={styles.aboutStatLabel}>Non-Profit</span>
                </div>
                <div className={styles.aboutStat}>
                  <span className={styles.aboutStatNum}>5+</span>
                  <span className={styles.aboutStatLabel}>Districts Covered</span>
                </div>
                <div className={styles.aboutStat}>
                  <span className={styles.aboutStatNum}>6</span>
                  <span className={styles.aboutStatLabel}>Plant Varieties</span>
                </div>
              </div>
              <Link href="/donate" className="btn btn-forest" id="about-donate-btn">
                Be Part of This Mission <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className={`section ${styles.howSection}`} id="how-it-works">
        <div className="container">
          <div className="section-header">
            <div className="section-tag">🌿 Simple Process</div>
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">From choosing a plant to watching it grow — six easy steps to make a lasting impact</p>
          </div>

          <div className={styles.howGrid}>
            {howItWorks.map((item) => (
              <div key={item.step} className={styles.howCard}>
                <div className={styles.howStep}>{item.step}</div>
                <div className={styles.howIcon}>{item.icon}</div>
                <h3 className={styles.howTitle}>{item.title}</h3>
                <p className={styles.howDesc}>{item.desc}</p>
              </div>
            ))}
          </div>

          <div className={styles.howCta}>
            <Link href="/donate" className="btn btn-primary btn-lg" id="how-donate-btn">
              Start Your Journey <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== PLANTS PREVIEW ===== */}
      <section className={`section ${styles.plantsSection}`} id="plants">
        <div className="container">
          <div className="section-header">
            <div className="section-tag">🌱 Our Trees</div>
            <h2 className="section-title">Choose Your Sacred Tree</h2>
            <p className="section-subtitle">Each tree carries a unique spiritual significance, medicinal value, and environmental benefit</p>
          </div>

          <div className={styles.plantsGrid}>
            {mockPlants.slice(0, 6).map((plant) => (
              <div key={plant.id} className={styles.plantCard}>
                <div className={styles.plantEmoji}>
                  {plant.id === 'peepal' ? '🌳' :
                   plant.id === 'neem' ? '🌿' :
                   plant.id === 'mango' ? '🥭' :
                   plant.id === 'banyan' ? '🌲' :
                   plant.id === 'amla' ? '🍈' : '🌱'}
                </div>
                <div className={styles.plantCategory}>
                  <span className={`badge badge-forest`}>{plant.category}</span>
                </div>
                <h3 className={styles.plantName}>{plant.name}</h3>
                <p className={styles.plantMarathi}>{plant.marathiName}</p>
                <p className={styles.plantDesc}>{plant.description.slice(0, 80)}...</p>
                <div className={styles.plantBenefits}>
                  {plant.benefits.slice(0, 2).map((b) => (
                    <span key={b} className={`badge badge-sage`}>{b}</span>
                  ))}
                </div>
                <div className={styles.plantFooter}>
                  <span className={styles.plantCost}>₹{plant.cost}</span>
                  <Link href={`/donate?plant=${plant.id}`} className="btn btn-forest btn-sm">
                    Plant This 🌱
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== OCCASIONS ===== */}
      <section className={`section ${styles.occasionsSection}`}>
        <div className="container">
          <div className="section-header">
            <div className="section-tag">🎉 For Every Moment</div>
            <h2 className="section-title">Plant for Every Occasion</h2>
          </div>
          <div className={styles.occasionGrid}>
            {occasions.map((occ) => (
              <Link key={occ.id} href={`/donate?occasion=${occ.id}`} className={styles.occasionCard}>
                <span className={styles.occasionIcon}>{occ.icon}</span>
                <h3 className={styles.occasionLabel}>{occ.label}</h3>
                <p className={styles.occasionDesc}>{occ.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className={`section ${styles.testimonialsSection}`}>
        <div className="container-narrow">
          <div className="section-header">
            <div className="section-tag">❤️ Community Stories</div>
            <h2 className="section-title">What Our Donors Say</h2>
          </div>

          <div className={styles.testimonialCarousel}>
            <div className={styles.testimonialCard}>
              <div className={styles.testimonialQuote}>&ldquo;</div>
              <p className={styles.testimonialText}>{mockTestimonials[activeTestimonial].text}</p>
              <div className={styles.testimonialStars}>
                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="#D4A017" color="#D4A017" />)}
              </div>
              <div className={styles.testimonialAuthor}>
                <div className={styles.testimonialAvatar}>
                  {mockTestimonials[activeTestimonial].name[0]}
                </div>
                <div>
                  <div className={styles.testimonialName}>{mockTestimonials[activeTestimonial].name}</div>
                  <div className={styles.testimonialLocation}>
                    <MapPin size={12} /> {mockTestimonials[activeTestimonial].location}
                  </div>
                  <div className={styles.testimonialTree}>
                    🌳 {mockTestimonials[activeTestimonial].treeType}
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.testimonialNav}>
              <button
                onClick={() => setActiveTestimonial((p) => (p - 1 + mockTestimonials.length) % mockTestimonials.length)}
                className={styles.navBtn}
                aria-label="Previous testimonial"
              >
                <ChevronLeft size={20} />
              </button>
              <div className={styles.dots}>
                {mockTestimonials.map((_, i) => (
                  <button
                    key={i}
                    className={`${styles.dot} ${i === activeTestimonial ? styles.dotActive : ''}`}
                    onClick={() => setActiveTestimonial(i)}
                    aria-label={`Testimonial ${i + 1}`}
                  />
                ))}
              </div>
              <button
                onClick={() => setActiveTestimonial((p) => (p + 1) % mockTestimonials.length)}
                className={styles.navBtn}
                aria-label="Next testimonial"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className={styles.ctaSection}>
        <div className="container">
          <div className={styles.ctaCard}>
            <div className={styles.ctaEmoji}>🌳</div>
            <h2 className={styles.ctaTitle}>Ready to Plant Your Tree?</h2>
            <p className={styles.ctaSubtitle}>
              Join thousands who have already made the earth a little greener.<br />
              Every tree is a blessing from Aai Kalubai. 🙏
            </p>
            <div className={styles.ctaActions}>
              <Link href="/donate" className="btn btn-primary btn-lg" id="footer-cta-btn">
                Donate a Tree Now <ArrowRight size={18} />
              </Link>
              <Link href="/track" className="btn btn-ghost btn-lg">
                Track Existing Tree
              </Link>
            </div>
            <p className={styles.ctaBlessing}>
              आई कलुबाईचा आशीर्वाद नेहमी असो 🙏
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
