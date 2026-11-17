import { useMemo, useState } from 'react';
import { UtensilsCrossed } from 'lucide-react';
import { generateRestaurantData } from '@/data/generateRestaurantData';
import {
  ALL,
  aggregatorDependence,
  buildRestaurantProfiles,
  diversificationScore,
  filterRows,
  groupShares,
  inStoreReliance,
  buildSegments,
  sumOrders,
  totalOf,
  validateRows,
  type Filters,
  type ViewMode,
} from '@/lib/analytics';
import { CUISINES, SEGMENTS, SUBREGIONS } from '@/types/restaurant';
import FilterBar from '@/components/dashboard/FilterBar';
import KpiCards from '@/components/dashboard/KpiCards';
import MarketShareCard from '@/components/dashboard/MarketShareCard';
import StackedShareBars from '@/components/dashboard/StackedShareBars';
import SubregionHeatmap from '@/components/dashboard/SubregionHeatmap';
import DependencyPanel from '@/components/dashboard/DependencyPanel';

const DATASET = generateRestaurantData();
const DATA_CHECKS = validateRows(DATASET);
const BRANCH_COUNT = new Set(DATASET.map((row) => row.restaurantId)).size;

const DEFAULT_FILTERS: Filters = { subregion: ALL, cuisine: ALL, segment: ALL };

function App() {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [mode, setMode] = useState<ViewMode>('full');

  const view = useMemo(() => {
    const rows = filterRows(DATASET, filters);
    const orders = sumOrders(rows);
    return {
      total: totalOf(orders),
      orders,
      segments: buildSegments(orders, mode),
      subregionGroups: groupShares(rows, (row) => row.subregion, SUBREGIONS, mode),
      cuisineGroups: groupShares(rows, (row) => row.cuisineType, CUISINES, mode),
      segmentGroups: groupShares(rows, (row) => row.segment, SEGMENTS, mode),
      profiles: buildRestaurantProfiles(rows),
    };
  }, [filters, mode]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-5 sm:px-6 lg:px-8">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white">
            <UtensilsCrossed className="h-5 w-5" />
          </span>
          <div>
            <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Auckland Channel Analytics</h1>
            <p className="text-sm text-slate-500">
              Order channel performance and market share for SkyCity Auckland Restaurants and Bars
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <FilterBar filters={filters} onFiltersChange={setFilters} mode={mode} onModeChange={setMode} />

        <KpiCards
          totalOrders={view.total}
          aggregatorDependence={aggregatorDependence(view.orders)}
          inStoreReliance={inStoreReliance(view.orders)}
          diversificationScore={diversificationScore(view.orders)}
        />

        <div className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <MarketShareCard segments={view.segments} total={view.total} />
          </div>
          <div className="lg:col-span-2">
            <DependencyPanel profiles={view.profiles} />
          </div>
        </div>

        <SubregionHeatmap groups={view.subregionGroups} />

        <div className="grid gap-6 lg:grid-cols-2">
          <StackedShareBars
            title="Channel mix by cuisine"
            description="Where each cuisine's orders come from, from in-store to delivery channels."
            groups={view.cuisineGroups}
          />
          <StackedShareBars
            title="Channel reliance by segment"
            description="How each business model splits its orders across channels."
            groups={view.segmentGroups}
          />
        </div>

        <footer className="border-t border-slate-200 pt-6 text-xs leading-relaxed text-slate-500">
          Sample dataset of {BRANCH_COUNT} restaurant branches over six months (May to October 2026), generated to match the
          project schema. Data checks: {DATA_CHECKS.checked} rows reviewed, {DATA_CHECKS.orderMismatches} with channel
          orders that do not sum to monthly orders.
        </footer>
      </main>
    </div>
  );
}

export default App;
