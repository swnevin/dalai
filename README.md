# Dalai Demo Platform

En intern plattform for å administrere og dele chatbot demoer med kunder.

## Teknisk Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Prisma (SQLite database)

## Oppsett

1. Installer avhengigheter:
```bash
npm install
```

2. Sett opp databasen:
```bash
npx prisma generate
npx prisma db push
```

3. Start utviklingsserveren:
```bash
npm run dev
```

## Mappestruktur

```
dalai-demo-platform/
├── src/
│   ├── app/
│   │   ├── admin/         # Admin panel
│   │   ├── demo/          # Demo sider
│   │   └── layout.tsx     # Root layout
│   └── components/        # Delte komponenter
├── prisma/
│   └── schema.prisma      # Database schema
└── public/
    └── logos/            # Klient logoer
```

## Funksjoner

- Admin Panel (norsk grensesnitt)
  - Administrere eksisterende demoer
  - Opprette nye demoer
  - Laste opp klient logoer

- Demo Sider
  - Dynamisk genererte demo sider
  - Voiceflow chat widget integrasjon
  - Klient-spesifikk styling

## Merknad

Husk å legge til klient logoer i `public/logos/` mappen.
