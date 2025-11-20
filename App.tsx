import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Home } from './views/Home';
import { PurchaseFlow } from './views/PurchaseFlow';
import { Policies } from './views/Policies';
import { Claims } from './views/Claims';
import { SupportChat } from './views/SupportChat';
import { ViewState, Policy } from './types';
import { MOCK_POLICIES } from './constants';

const App: React.FC = () => {
  const [currentView, setView] = useState<ViewState>('HOME');
  const [policies, setPolicies] = useState<Policy[]>(MOCK_POLICIES);
  
  // Get the most recent active policy
  const activePolicy = policies.find(p => p.status === 'ACTIVE');

  const handlePurchaseComplete = (policy: Policy) => {
    setPolicies([policy, ...policies]);
    setView('HOME'); // Go back to home to see new policy
  };

  const renderView = () => {
    switch (currentView) {
      case 'HOME':
        return <Home setView={setView} activePolicy={activePolicy} />;
      case 'BUY_FLOW':
        return (
          <PurchaseFlow 
            onCancel={() => setView('HOME')} 
            onComplete={handlePurchaseComplete} 
          />
        );
      case 'POLICIES':
        return <Policies policies={policies} />;
      case 'CLAIMS':
        return <Claims />;
      case 'SUPPORT':
        return <SupportChat onBack={() => setView('HOME')} />;
      default:
        return <Home setView={setView} />;
    }
  };

  // If Support view is active, we might want to hide the bottom nav or render differently
  // For now, we render it inside Layout except for specific full-screen flows if desired.
  // But design asked for consistent app feel. 
  // SupportChat handles its own header, so we might render it without Layout wrapper if we want full screen, 
  // or within Layout. Let's render SupportChat full screen on top.

  if (currentView === 'SUPPORT') {
      return <SupportChat onBack={() => setView('HOME')} />;
  }

  return (
    <Layout currentView={currentView} setView={setView}>
      {renderView()}
    </Layout>
  );
};

export default App;