# Order Channel Performance and Market Share Analytics

SkyCity Auckland Restaurants & Bars

An analytics dashboard for understanding how restaurants split their orders across four channels: In-Store, Uber Eats, DoorDash, and Self-Delivery. It quantifies channel volumes, maps channel dominance by Auckland subregion, compares channel mix across cuisines and business segments, and flags restaurants whose reliance on a single aggregator creates channel dependency risk.

## Features

- **Channel mix overview dashboard** — headline KPIs: total orders, aggregator dependence index, in-store reliance ratio, and a channel diversification score.
- **Channel market share** — donut and ranked list of each channel's contribution to order volume.
- **Subregion channel heatmap** — channel share across Central Auckland, North Shore, and West Auckland, with the dominant channel per subregion.
- **Cuisine and segment channel patterns** — stacked share bars showing how channel mix varies by cuisine type and business segment.
- **Dependency risk panel** — high-risk (70%+ reliance on one aggregator), watch (50%+), and balanced tiers, plus a ranked list of the most aggregator-dependent restaurants.
- **User capabilities** — subregion filter, cuisine and segment selectors, and a channel toggle (All channels vs In-Store vs Delivery).

## Tech Stack

- React 18 + TypeScript
- Vite (build tool and dev server)
- Tailwind CSS (styling)
- Lucide React (icons)

## Project Structure

```
.
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json / tsconfig.app.json / tsconfig.node.json
├── eslint.config.js
├── .gitignore
└── src/
    ├── main.tsx                          # App entry point
    ├── App.tsx                           # Dashboard layout and state
    ├── index.css                         # Tailwind entry
    ├── vite-env.d.ts
    ├── types/
    │   └── restaurant.ts                 # Channel/region/cuisine constants, data model
    ├── data/
    │   └── generateRestaurantData.ts     # Sample dataset generator (schema-conformant)
    ├── lib/
    │   └── analytics.ts                  # Filtering, shares, KPIs, risk tiers, validation
    └── components/dashboard/
        ├── FilterBar.tsx                 # Subregion / cuisine / segment filters + channel toggle
        ├── KpiCards.tsx                  # Headline KPI cards
        ├── MarketShareCard.tsx           # Channel market share donut + ranking
        ├── SubregionHeatmap.tsx          # Geographic channel preference heatmap
        ├── StackedShareBars.tsx          # Cuisine / segment channel mix bars
        └── DependencyPanel.tsx           # Dependency risk indicators
```

## Installation

Requires Node.js 18 or later.

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev
```

Open the local URL shown in the terminal (typically http://localhost:5173).

## Other Scripts

```bash
npm run build       # Production build into dist/
npm run preview     # Preview the production build locally
npm run lint        # Lint the source
npm run typecheck   # TypeScript type check
```

## Data

The dashboard runs on a generated sample dataset (120 restaurant branches x 6 months) that follows the project's schema: channel order counts sum to monthly orders, and each row carries cuisine, segment, subregion, growth factor, and average order value. To use real channel data, replace `generateRestaurantData()` in `src/App.tsx` with a loader that returns rows matching the `RestaurantMonth` interface in `src/types/restaurant.ts`.

## Methodology

- **Data validation** — every row is checked so channel order counts sum to `MonthlyOrders`; results appear in the dashboard footer.
- **Aggregator dependence index** — share of orders placed via Uber Eats plus DoorDash.
- **In-store reliance ratio** — share of orders that are walk-in.
- **Channel diversification score** — normalized Shannon entropy of the four channel shares, scaled 0–100 (higher = more resilient).
- **Dependency risk** — a restaurant is high risk when a single aggregator accounts for 70% or more of its orders; watch applies from 50%.

## Deploying to GitHub

```bash
git init
git add .
git commit -m "Initial commit: channel analytics dashboard"
git remote add origin <your-repo-url>
git push -u origin main
```

The included `.gitignore` excludes `node_modules`, `dist`, and local environment files.
