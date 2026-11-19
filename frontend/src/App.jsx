import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import SemanticSearchPage from './pages/SemanticSearchPage';
import KnowledgeGraphPage from './pages/KnowledgeGraphPage';
import ReasoningEnginePage from './pages/ReasoningEnginePage';
import DepartmentExplorerPage from './pages/DepartmentExplorerPage';
import ServicesCatalogPage from './pages/ServicesCatalogPage';
import ChatAssistantPage from './pages/ChatAssistantPage';
import AnalyticsPage from './pages/AnalyticsPage';
import AboutPage from './pages/AboutPage';

export default function App() {
  const [currentTab, setCurrentTab] = useState('home');
  const [activeSearchQuery, setActiveSearchQuery] = useState('');
  const [activeGraphService, setActiveGraphService] = useState(null);
  const [fontSize, setFontSize] = useState(16);

  const handleGlobalSearch = (query) => {
    setActiveSearchQuery(query);
    setCurrentTab('search');
  };

  const handleExploreGraph = (serviceId) => {
    setActiveGraphService(serviceId);
    setCurrentTab('graph');
  };

  return (
    <div 
      className="min-h-screen flex flex-col bg-slate-50 font-sans"
      style={{ fontSize: `${fontSize}px` }}
    >
      {/* Top Header */}
      <Header 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
        fontSize={fontSize}
        setFontSize={setFontSize}
      />

      {/* Main Page Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-2 sm:px-4 pt-6 sm:pt-8">
        {currentTab === 'home' && (
          <HomePage 
            onSearch={handleGlobalSearch} 
            setCurrentTab={setCurrentTab} 
          />
        )}

        {currentTab === 'search' && (
          <SemanticSearchPage 
            initialQuery={activeSearchQuery} 
            onExploreGraph={handleExploreGraph}
          />
        )}

        {currentTab === 'graph' && (
          <KnowledgeGraphPage 
            initialSelectedService={activeGraphService} 
          />
        )}

        {currentTab === 'reasoning' && (
          <ReasoningEnginePage 
            onExploreGraph={handleExploreGraph}
          />
        )}

        {currentTab === 'departments' && (
          <DepartmentExplorerPage 
            onExploreGraph={handleExploreGraph}
          />
        )}

        {currentTab === 'services' && (
          <ServicesCatalogPage 
            onExploreGraph={handleExploreGraph}
          />
        )}

        {currentTab === 'chat' && (
          <ChatAssistantPage 
            onExploreGraph={handleExploreGraph}
          />
        )}

        {currentTab === 'analytics' && (
          <AnalyticsPage />
        )}

        {currentTab === 'about' && (
          <AboutPage setCurrentTab={setCurrentTab} />
        )}
      </main>

      {/* Portal Footer */}
      <Footer setCurrentTab={setCurrentTab} />
    </div>
  );
}
