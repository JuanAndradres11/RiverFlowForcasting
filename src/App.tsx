import { useState } from 'react';
import { Landing } from './pages/Landing';
import { Overview } from './pages/Overview';
import { CatchmentForecast } from './pages/CatchmentForecast';
import { ModelInsights } from './pages/ModelInsights';
import { HistoricalTrends } from './pages/HistoricalTrends';
import { Settings } from './pages/Settings';
import { Sidebar } from './components/Sidebar';
import CatchmentMapPage from './pages/CatchmentMapPage';  

type Page = 'landing' | 'overview' | 'catchment' | 'model' | 'trends' | 'settings'| 'map';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');

  const handleStartForecasting = () => {
    setCurrentPage('overview');
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page);
  };

  if (currentPage === 'landing') {
    return <Landing onStartForecasting={handleStartForecasting} />;
  }

  return (
    <div className="flex">
      <Sidebar currentPage={currentPage} onNavigate={handleNavigate} />
      <main className="flex-1">
        {currentPage === 'overview' && <Overview />}
        {currentPage === 'catchment' && <CatchmentForecast />}
        {currentPage === 'model' && <ModelInsights />}
        {currentPage === 'trends' && <HistoricalTrends />}
        {currentPage === 'settings' && <Settings />}
        {currentPage === 'map' && <CatchmentMapPage />}
      </main>
    </div>
  );
}

export default App;
