
import { ModeToggle } from './features/modeToggle/ModeToggle';
import { TopMetrics } from './features/metrics/TopMetrics';
import { PriceChart } from './features/charts/PriceChart';
import { EventLog } from './features/eventlog/EventLog';
import { CoinsTable } from './features/coins/CoinsTable';
import { useDashboardData } from './hooks/useDashboardData';

function App() {
  const { refresh, isRealtime } = useDashboardData();

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      
      {/* Header
      <header className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur border-b border-gray-700 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${isRealtime ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
            <h1 className="text-2xl font-bold tracking-tight">
              Live Crypto Dashboard
            </h1>
          </div>
          <ModeToggle />
        </div>
      </header> */}


      <header className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur border-b border-gray-700 px-4 md:px-6 py-4">
  <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
    
    {/* Title Section */}
    <div className="flex items-center gap-2 md:gap-3 w-full md:w-auto justify-center md:justify-start">
      <div className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full flex-shrink-0 ${isRealtime ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
      <h1 className="text-xl md:text-2xl font-bold tracking-tight text-center">
        Live Crypto Dashboard
      </h1>
    </div>

    {/* Toggle Section */}
    <div className="w-full md:w-auto">
      <ModeToggle />
    </div>

  </div>
</header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6 space-y-6">
        
        {/* Manual Refresh */}
        {!isRealtime && (
          <div className="flex justify-end">
            <button
              onClick={refresh}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              🔄 Refresh Data
            </button>
          </div>
        )}

        {/* Top 3 Metrics */}
        <TopMetrics />

        {/* Chart + Event Log */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <PriceChart />
          </div>
          <div className="lg:col-span-1">
            <EventLog />
          </div>
        </section>

        {/* Coins Table */}
        <CoinsTable />

      </main>
    </div>
  );
}

export default App;