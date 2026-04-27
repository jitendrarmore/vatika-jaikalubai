import type { Metadata } from 'next';
import Link from 'next/link';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'About | Vatika – Jai Kalubai',
  description: 'Learn about Vatika – Jai Kalubai, a sacred tree-planting initiative inspired by Shree Mandhardevi Kalubai Devsthan in partnership with The Aaradhya Foundation.',
};

export default function AboutPage() {
  return (
    <main className={styles.page}>

      {/* ── HERO ── */}
      <section className={styles.hero}>
        <div className={styles.heroGlow} />
        <div className="container">
          <div className={styles.heroPill}>🙏 आई कलुबाईचा आशीर्वाद</div>
          <h1 className={styles.heroTitle}>
            Rooted in Faith.<br />
            <span className={styles.heroAccent}>Growing for the Future.</span>
          </h1>
          <p className={styles.heroDesc}>
            Vatika is a sacred green initiative born from the divine blessings of
            Shree Mandhardevi Kalubai Devsthan — where devotion meets ecology, and
            every tree planted is a living prayer for generations to come.
          </p>
          <div className={styles.heroStats}>
            <div className={styles.heroStat}>
              <span className={styles.heroStatNum}>🌳</span>
              <span className={styles.heroStatLabel}>Trees Donated</span>
            </div>
            <div className={styles.heroStatDivider} />
            <div className={styles.heroStat}>
              <span className={styles.heroStatNum}>🏅</span>
              <span className={styles.heroStatLabel}>Certificates Issued</span>
            </div>
            <div className={styles.heroStatDivider} />
            <div className={styles.heroStat}>
              <span className={styles.heroStatNum}>🤝</span>
              <span className={styles.heroStatLabel}>Community Impact</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── ORIGIN STORY ── */}
      <section className={`${styles.section} ${styles.originSection}`}>
        <div className="container">
          <div className={styles.twoCol}>
            <div className={styles.originText}>
              <div className={styles.sectionTag}>Our Sacred Origin</div>
              <h2 className={styles.sectionTitle}>
                Inspired by Shree Mandhardevi<br />Kalubai Devsthan
              </h2>
              <p className={styles.bodyText}>
                Nestled in the Satara district of Maharashtra, Shree Mandhardevi Kalubai Devsthan
                is one of the most revered pilgrimage sites in the Deccan — a place where millions
                of devotees come each year seeking the blessings of Aai Kalubai, the mother goddess
                of the land and its people.
              </p>
              <p className={styles.bodyText}>
                It is from this sacred ground that <strong>Vatika</strong> was born. Drawing on
                the timeless belief that nature is an extension of the divine, we channel the
                devotion of our community into something that breathes, grows, and gives back —
                a living tree in Aai Kalubai&apos;s name.
              </p>
              <p className={styles.bodyText}>
                Every tree planted through Vatika carries the blessing of the Devsthan, tied
                forever to the occasion it was donated for — a birth, a marriage, a memorial,
                or simply gratitude for life itself.
              </p>
              <div className={styles.quoteBlock}>
                <span className={styles.quoteMarks}>&ldquo;</span>
                <p className={styles.quoteText}>
                  वृक्षवल्ली आम्हां सोयरे वनचरे —<br />
                  <em>Trees and vines are our companions in the forest.</em>
                </p>
                <span className={styles.quoteAuthor}>— Sant Tukaram Maharaj</span>
              </div>
            </div>
            <div className={styles.originVisual}>
              <div className={styles.templeCard}>
                <div className={styles.templeImageWrap}>
                  <img
                    src="/aai-kalubai.jpg"
                    alt="Aai Kalubai — Shree Mandhardevi Kalubai Devsthan, Satara"
                    className={styles.templeImage}
                  />
                  <div className={styles.templeImageGlow} />
                </div>
                <div className={styles.templeCaption}>
                  <div className={styles.templeCaptionDivider} />
                  <h3>आई कलुबाई</h3>
                  <p>Shree Mandhardevi Kalubai Devsthan</p>
                  <span>Satara, Maharashtra</span>
                </div>
                <div className={styles.templeDetails}>
                  <div className={styles.templeDetail}><span>📍</span> Mandhardevi, Satara District</div>
                  <div className={styles.templeDetail}><span>🙏</span> Goddess Kalubai — Protector of Nature</div>
                  <div className={styles.templeDetail}><span>🌿</span> Hub of Vatika&apos;s Green Mission</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PARTNERSHIP ── */}
      <section className={`${styles.section} ${styles.partnerSection}`}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTag}>Strategic Partnership</div>
            <h2 className={styles.sectionTitle}>
              Powered by The Aaradhya Foundation
            </h2>
            <p className={styles.sectionSubtitle}>
              Every tree donated through Vatika is planted, nurtured, and tracked
              by The Aaradhya Foundation — a registered, government-recognised
              public trust dedicated to social service and environmental stewardship.
            </p>
          </div>

          <div className={styles.partnerGrid}>
            <div className={styles.partnerCard}>
              <div className={styles.partnerIcon}>🌱</div>
              <h3>Tree Planting</h3>
              <p>Expert teams source saplings, prepare soil, and plant your dedicated tree at our certified plantation sites.</p>
            </div>
            <div className={styles.partnerCard}>
              <div className={styles.partnerIcon}>💧</div>
              <h3>Care & Nurturing</h3>
              <p>Regular watering, health checks, and seasonal maintenance ensure every tree thrives for decades.</p>
            </div>
            <div className={styles.partnerCard}>
              <div className={styles.partnerIcon}>📸</div>
              <h3>Photo Updates</h3>
              <p>Geotagged progress photos uploaded regularly so you can watch your tree grow from anywhere in the world.</p>
            </div>
            <div className={styles.partnerCard}>
              <div className={styles.partnerIcon}>🏅</div>
              <h3>Certificates & Badges</h3>
              <p>Every donor receives an official Aaradhya Foundation certificate and a digital badge as proof of their green contribution.</p>
            </div>
          </div>

          {/* Certificates */}
          <div className={styles.certsSection}>
            <h3 className={styles.certsTitle}>Proof of Authenticity</h3>
            <p className={styles.certsSubtitle}>
              The Aaradhya Foundation is a fully registered public trust under the Mumbai Public Trust Act, 1950
              and has been recognised by the Government of Maharashtra.
            </p>
            <div className={styles.certsGrid}>
              {/* Certificate 1 — Deputy CM Letter */}
              <div className={styles.certCard}>
                <div className={styles.certBadge}>🏛️ Government Recognition</div>
                <div className={styles.certImageWrap}>
                  <img
                    src="/certificates/aaradhya-dcm-letter.jpg"
                    alt="Letter of recognition from Maharashtra Deputy CM Shri Eknath Sambhaji Shinde — 16 Sep 2025"
                    className={styles.certImage}
                    loading="lazy"
                  />
                  <div className={styles.certOverlay}>
                    <a
                      href="/certificates/aaradhya-dcm-letter.jpg"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.certViewBtn}
                    >
                      🔍 View Full Document
                    </a>
                  </div>
                </div>
                <div className={styles.certMeta}>
                  <h4>Letter of Appreciation</h4>
                  <p>Shri. Eknath Sambhaji Shinde<br />Deputy Chief Minister, Maharashtra</p>
                  <span className={styles.certDate}>16 September 2025</span>
                </div>
              </div>

              {/* Certificate 2 — Registration */}
              <div className={styles.certCard}>
                <div className={styles.certBadge}>📜 Official Registration</div>
                <div className={styles.certImageWrap}>
                  <img
                    src="/certificates/aaradhya-registration.jpg"
                    alt="Aaradhya Foundation — Charity Commissioner Registration Certificate E-36709(m)"
                    className={styles.certImage}
                    loading="lazy"
                  />
                  <div className={styles.certOverlay}>
                    <a
                      href="/certificates/aaradhya-registration.jpg"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.certViewBtn}
                    >
                      🔍 View Full Document
                    </a>
                  </div>
                </div>
                <div className={styles.certMeta}>
                  <h4>नोंदणीचे प्रमाणपत्र</h4>
                  <p>Registration No. <strong>E-36709(m)</strong><br />
                  Asstt. Charity Commissioner, Greater Mumbai Region</p>
                  <span className={styles.certDate}>12 February 2022</span>
                </div>
              </div>
            </div>

            <div className={styles.regHighlight}>
              <div className={styles.regItem}>
                <span className={styles.regIcon}>✅</span>
                <div>
                  <strong>Registered Public Trust</strong>
                  <p>Mumbai Public Trust Act, 1950 — Reg. No. E-36709(m)</p>
                </div>
              </div>
              <div className={styles.regItem}>
                <span className={styles.regIcon}>🏛️</span>
                <div>
                  <strong>Government Recognised</strong>
                  <p>Commended by the Deputy Chief Minister of Maharashtra</p>
                </div>
              </div>
              <div className={styles.regItem}>
                <span className={styles.regIcon}>🌿</span>
                <div>
                  <strong>Dedicated to Social Service</strong>
                  <p>Active in education, health, women&apos;s welfare &amp; environment</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY DONATE ── */}
      <section className={`${styles.section} ${styles.whySection}`}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTag}>Why You Should Donate</div>
            <h2 className={styles.sectionTitle}>A Gift That Lives Forever</h2>
            <p className={styles.sectionSubtitle}>
              Unlike flowers that wither or gifts that fade, a tree grows stronger with every passing year —
              absorbing carbon, sheltering birds, and carrying your name forward in time.
            </p>
          </div>
          <div className={styles.whyGrid}>
            <div className={styles.whyCard}>
              <span className={styles.whyIcon}>🎖️</span>
              <h3>Official Certificate</h3>
              <p>Receive a beautifully designed Aaradhya Foundation certificate with your name, the tree species, and plantation location — a keepsake you can frame and cherish.</p>
            </div>
            <div className={styles.whyCard}>
              <span className={styles.whyIcon}>🏅</span>
              <h3>Digital Badge</h3>
              <p>Get a shareable Green Donor badge for WhatsApp, Instagram, or print. Show the world your contribution to nature.</p>
            </div>
            <div className={styles.whyCard}>
              <span className={styles.whyIcon}>📍</span>
              <h3>Live Tracking</h3>
              <p>Track your tree&apos;s growth in real time on an interactive map. Get geotagged photo updates as it grows from sapling to tree.</p>
            </div>
            <div className={styles.whyCard}>
              <span className={styles.whyIcon}>🧾</span>
              <h3>80G Tax Benefit</h3>
              <p>Donations to The Aaradhya Foundation are eligible for 80G tax deductions under Indian Income Tax law. Your generosity pays forward.</p>
            </div>
            <div className={styles.whyCard}>
              <span className={styles.whyIcon}>🙏</span>
              <h3>Aai&apos;s Blessing</h3>
              <p>Every tree planted carries the divine blessings of Aai Kalubai — a spiritual merit that honours your family, your occasion, and your legacy.</p>
            </div>
            <div className={styles.whyCard}>
              <span className={styles.whyIcon}>🌍</span>
              <h3>Real Environmental Impact</h3>
              <p>Each tree sequesters CO₂, replenishes groundwater, and supports local biodiversity. Your donation creates measurable, lasting ecological impact.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── LEADERSHIP ── */}
      <section className={`${styles.section} ${styles.teamSection}`}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTag}>The People Behind Vatika</div>
            <h2 className={styles.sectionTitle}>Leadership & Founding Team</h2>
            <p className={styles.sectionSubtitle}>
              Vatika is built on the shoulders of dedicated leaders who believe that faith,
              community, and nature are inseparable.
            </p>
          </div>

          {/* Aaradhya Foundation Leadership */}
          <div className={styles.leadershipBlock}>
            <div className={styles.leadershipHeader}>
              <span className={styles.leadershipBadge}>🌿 The Aaradhya Foundation</span>
              <h3>Partner Organisation Leadership</h3>
            </div>
            <div className={styles.leaderCards}>
              <div className={styles.leaderCard}>
                <div className={styles.leaderAvatar}>GG</div>
                <div className={styles.leaderBadge}>Chairman</div>
                <h4 className={styles.leaderName}>Shree Ganesh Kisan Ghonge</h4>
                <p className={styles.leaderTitle}>Chairman, The Aaradhya Foundation</p>
                <p className={styles.leaderDesc}>
                  The visionary founder and chairman of The Aaradhya Foundation, Shree Ganesh Ghonge
                  has dedicated his life to social upliftment — from education and healthcare to
                  environmental conservation. Under his leadership, the Foundation has touched thousands
                  of lives across Maharashtra.
                </p>
              </div>
              <div className={styles.leaderCard}>
                <div className={styles.leaderAvatar}>SG</div>
                <div className={`${styles.leaderBadge} ${styles.leaderBadgeVice}`}>Vice Chairman</div>
                <h4 className={styles.leaderName}>Shree Santosh Kisan Ghonge</h4>
                <p className={styles.leaderTitle}>Vice Chairman, The Aaradhya Foundation</p>
                <p className={styles.leaderDesc}>
                  Shree Santosh Ghonge leads field operations and community outreach for the Foundation.
                  His deep connection to the land and its people drives the Vatika partnership — ensuring
                  every tree is planted with care, commitment, and a community's heart behind it.
                </p>
              </div>
            </div>
          </div>

          {/* Website Founders */}
          <div className={styles.leadershipBlock}>
            <div className={styles.leadershipHeader}>
              <span className={`${styles.leadershipBadge} ${styles.leadershipBadgeGold}`}>🌐 Vatika Website</span>
              <h3>Founding Members</h3>
            </div>
            <div className={styles.founderCards}>
              <div className={styles.founderCard}>
                <div className={styles.founderAvatar}>JM</div>
                <h4 className={styles.founderName}>Shree Jitendra Ramdas More</h4>
                <p className={styles.founderRole}>Co-Founder & Technology Lead</p>
                <p className={styles.founderDesc}>
                  Architect of the Vatika digital platform, Jitendra brings together technology and devotion to create
                  a seamless experience for donors — from choosing a tree to receiving live updates on its growth.
                </p>
              </div>
              <div className={styles.founderCard}>
                <div className={styles.founderAvatar}>JM</div>
                <h4 className={styles.founderName}>Shree Jagdish Ramdas More</h4>
                <p className={styles.founderRole}>Co-Founder & Community Lead</p>
                <p className={styles.founderDesc}>
                  Jagdish champions outreach and community engagement — spreading the Vatika mission
                  to devotees, families, and institutions across Maharashtra and beyond.
                </p>
              </div>
              <div className={styles.founderCard}>
                <div className={styles.founderAvatar}>SM</div>
                <h4 className={styles.founderName}>Shrimati Sushila Ramdas More</h4>
                <p className={styles.founderRole}>Co-Founder & Mission Guardian</p>
                <p className={styles.founderDesc}>
                  With deep devotion to Aai Kalubai and an unwavering belief in the power of nature,
                  Sushilatai is the spiritual heart of the Vatika initiative — inspiring the entire
                  team to plant with purpose.
                </p>
              </div>
            </div>
          </div>

          {/* Team */}
          <div className={styles.teamNote}>
            <span className={styles.teamNoteIcon}>🌳</span>
            <div>
              <h4>Our Ground Team</h4>
              <p>
                Behind every tree is a dedicated team of planters, caretakers, photographers, and
                community volunteers from The Aaradhya Foundation — people who wake up every day to
                water, protect, and photograph the trees in your name. Their tireless work is what
                turns a donation into a living legacy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className={styles.ctaSection}>
        <div className="container">
          <div className={styles.ctaCard}>
            <div className={styles.ctaLeaves}>🍃🌿🌱</div>
            <h2 className={styles.ctaTitle}>
              Plant a Tree in Aai Kalubai&apos;s Name
            </h2>
            <p className={styles.ctaDesc}>
              Join thousands of devotees who have turned their faith into forests.
              Your tree will be planted, cared for, and tracked — a living blessing
              that grows with every season.
            </p>
            <div className={styles.ctaActions}>
              <Link href="/donate" className="btn btn-primary btn-lg" id="about-donate-cta">
                🌱 Donate a Tree Now
              </Link>
              <Link href="/track" className="btn btn-ghost btn-lg" id="about-track-cta">
                🌳 Track Existing Tree
              </Link>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
