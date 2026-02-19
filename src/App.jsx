import { Routes, Route } from 'react-router-dom';
import { DataProvider, useData } from './contexts/DataContext';
import Layout from './components/Layout';
import LoginScreen from './components/LoginScreen';
import Dashboard from './components/Dashboard';
import LogEvent from './components/LogEvent';
import EmergencyMode from './components/EmergencyMode';
import CommunityHub from './components/CommunityHub';
import SkillExchange from './components/SkillExchange';
import ResourceLibrary from './components/ResourceLibrary';
import GratitudeWall from './components/GratitudeWall';
import TimeBank from './components/TimeBank';
import CommunityPulse from './components/CommunityPulse';
import NeighborhoodEvents from './components/NeighborhoodEvents';
import SafetyNet from './components/SafetyNet';
import CommunityGarden from './components/CommunityGarden';
import InsightsHub from './components/InsightsHub';
import VerificationPage from './components/VerificationPage';
import NetworkHealthPage from './components/NetworkHealthPage';
import DecayMonitorPage from './components/DecayMonitorPage';
import BridgingIndexPage from './components/BridgingIndexPage';
import CrisisModePage from './components/CrisisModePage';
import ReinforcementsPage from './components/ReinforcementsPage';
import HealthForecastPage from './components/HealthForecastPage';
import DiversityNudgesPage from './components/DiversityNudgesPage';
import CoopBudgetPage from './components/CoopBudgetPage';
import ResearchLayerPage from './components/ResearchLayerPage';
import UserProfile from './components/UserProfile';
import ActivityFeed from './components/ActivityFeed';
import ErrorBoundary from './components/ErrorBoundary';

function AppRoutes() {
  const { currentUser, login } = useData();

  if (!currentUser) {
    return <LoginScreen onLogin={login} />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/log" element={<LogEvent />} />
        <Route path="/emergency" element={<EmergencyMode />} />
        <Route path="/community" element={<CommunityHub />} />
        <Route path="/community/skills" element={<SkillExchange />} />
        <Route path="/community/library" element={<ResourceLibrary />} />
        <Route path="/community/gratitude" element={<GratitudeWall />} />
        <Route path="/community/timebank" element={<TimeBank />} />
        <Route path="/community/pulse" element={<CommunityPulse />} />
        <Route path="/community/events" element={<NeighborhoodEvents />} />
        <Route path="/community/safety" element={<SafetyNet />} />
        <Route path="/community/garden" element={<CommunityGarden />} />
        <Route path="/insights" element={<InsightsHub />} />
        <Route path="/insights/verification" element={<VerificationPage />} />
        <Route path="/insights/network" element={<NetworkHealthPage />} />
        <Route path="/insights/decay" element={<DecayMonitorPage />} />
        <Route path="/insights/bridging" element={<BridgingIndexPage />} />
        <Route path="/insights/crisis" element={<CrisisModePage />} />
        <Route path="/insights/reinforcements" element={<ReinforcementsPage />} />
        <Route path="/insights/forecast" element={<HealthForecastPage />} />
        <Route path="/insights/nudges" element={<DiversityNudgesPage />} />
        <Route path="/insights/coop" element={<CoopBudgetPage />} />
        <Route path="/insights/research" element={<ResearchLayerPage />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/feed" element={<ActivityFeed />} />
      </Routes>
    </Layout>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <DataProvider>
        <AppRoutes />
      </DataProvider>
    </ErrorBoundary>
  );
}
