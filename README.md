# 🌳 Vatika – Jai Kalubai

> *"Rooted in Faith, Growing for Future"*

A production-grade, non-profit tree donation and plantation tracking web application inspired by Jai Kalubai — the revered deity of Maharashtra.

**Live Site**: [vatika.jaikalubai.in](https://vatika.jaikalubai.in)

---

## ✨ Features

| Feature | Details |
|---------|---------|
| 🌱 **Tree Donation Funnel** | 6-step guided wizard: Occasion → Plant → Date → Name → Payment → Success |
| 📍 **Tree Tracking** | Track growth with status timeline, progress photos, and Mapbox location map |
| 🔐 **Authentication** | Google OAuth, Facebook OAuth, Email/Password via Firebase Auth |
| 👤 **User Dashboard** | View donated trees, track progress, CO₂ offset stats |
| 🛠️ **Admin Panel** | Manage plants, update donation status, role-based access |
| 🗺️ **Mapbox Integration** | Interactive satellite map with custom tree-pin markers |
| 📱 **Mobile-First** | Fully responsive, eco-themed design |
| 🔍 **SEO Ready** | Metadata, OG tags, robots.txt, sitemap |

---

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router, SSR + API Routes)
- **Styling**: Vanilla CSS + CSS Modules (eco design system)
- **Auth**: Firebase Authentication (Google, Facebook, Email)
- **Database**: Firebase Firestore
- **Storage**: Firebase Storage
- **Maps**: Mapbox GL JS
- **Hosting**: Vercel (Free tier)
- **CI/CD**: GitHub Actions → Vercel (auto-deploy)
- **Domain**: GoDaddy → CNAME → Vercel

---

## 🏗️ Project Structure

```
vatika-jaikalubai/
├── app/
│   ├── page.tsx              # Home page
│   ├── donate/page.tsx       # 6-step donation wizard
│   ├── track/page.tsx        # Tree tracking
│   ├── login/page.tsx        # Auth page
│   ├── dashboard/page.tsx    # User dashboard
│   ├── admin/page.tsx        # Admin panel
│   └── api/                  # API routes
│       ├── donate/route.ts
│       └── track/[id]/route.ts
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   └── MapView.tsx
├── lib/
│   ├── auth.tsx              # Firebase Auth context
│   ├── mockData.ts           # Plants, testimonials, seed data
│   └── firebase/
│       ├── client.ts         # Firebase client (lazy SSR-safe)
│       ├── donations.ts      # Firestore donations layer
│       └── plants.ts         # Firestore plants layer
└── .github/
    └── workflows/ci.yml      # GitHub Actions CI
```

---

## ⚙️ Setup & Local Development

### 1. Clone the repo
```bash
git clone https://github.com/jitendrarmore/vatika-jaikalubai.git
cd vatika-jaikalubai
npm install
```

### 2. Configure environment variables
```bash
cp .env.example .env.local
# Edit .env.local with your actual keys
```

Required variables (see `.env.example`):
```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_MAPBOX_TOKEN=
NEXT_PUBLIC_GOOGLE_CLIENT_ID=
NEXT_PUBLIC_FACEBOOK_APP_ID=
```

### 3. Run locally
```bash
npm run dev
# Open http://localhost:3000
```

---

## 🔄 CI/CD Pipeline

```
git push → GitHub Actions (lint + type-check + build) → Vercel (auto-deploy)
```

- **PR push** → runs CI, deploys preview URL on Vercel
- **Main push** → runs CI, auto-deploys to `vatika.jaikalubai.in`

### Adding GitHub Secrets
Go to `Repo → Settings → Secrets → Actions` and add all `NEXT_PUBLIC_*` variables.

---

## 🌐 Deployment on Vercel

1. Go to [vercel.com](https://vercel.com) → **Import Git Repository**
2. Select `jitendrarmore/vatika-jaikalubai`
3. Add all environment variables in Vercel Dashboard
4. **GoDaddy DNS**: Add `CNAME vatika → cname.vercel-dns.com`
5. In Vercel → Domains → Add `vatika.jaikalubai.in`

---

## 🗄️ Firestore Schema

```
plants/        { name, marathiName, image, benefits[], cost, growthTimeline, category }
donations/     { uid, plantId, plantName, occasion, treeName, dedication,
                 plantationDate, trackingId, status, location, cost, createdAt }
treeProgress/  { donationId, date, status, note, imageUrl }
users/         { uid, email, name, photoURL, role }
```

---

## 🧪 Demo

Try the live tracking with demo ID: **`VJK8X2KQ4R`** at `/track`

---

## 🤝 Contributing

This is a non-profit initiative. Contributions, suggestions, and prayers are welcome. 🙏

---

## 📄 License

MIT © Vatika – Jai Kalubai Initiative

---

*🌺 आई कलुबाईचा आशीर्वाद नेहमी असो 🌺*
