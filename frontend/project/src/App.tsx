import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { FeedbackProvider } from './context/FeedbackContext';
import Login from './components/Login';
import Layout from './components/Layout';
import ManagerDashboard from './components/ManagerDashboard';
import TeamFeedback from './components/TeamFeedback';
import EmployeeFeedback from './components/EmployeeFeedback';
import Home from './components/Landing';

const AppContent: React.FC = () => {
  const { user, isLoading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState(() => user?.role === 'manager' ? 'dashboard' : 'feedback');
  const [showLogin, setShowLogin] = useState(false);
  const [showHome, setShowHome] = useState(false); // NEW STATE

  React.useEffect(() => {
    if (user) {
      setActiveTab(user.role === 'manager' ? 'dashboard' : 'feedback');
      setShowLogin(false);
      setShowHome(false); // Go to dashboard after login
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <Navbar onLoginClick={() => setShowLogin(true)} />
        {showLogin ? (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 relative">
              <Login onClose={() => setShowLogin(false)} />
            </div>
          </div>
        ) : (
          <Home onLoginClick={() => setShowLogin(true)} />
        )}
      </>
    );
  }

  // If user is logged in and wants to see Home, show Home with a "Back to Dashboard" button
  if (showHome) {
    return (
      <>
        <Navbar
          onLoginClick={() => setShowLogin(true)}
          showHome={false}
          showDashboard={true}
          onHomeClick={() => setShowHome(false)}
          onDashboardClick={() => setShowHome(false)}
          showLogout={true}
          onLogout={logout}
        />
        <Home onLoginClick={() => setShowLogin(false)} />
        <div className="flex justify-center mt-6">
          <button
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            onClick={() => setShowHome(false)}
          >
            Back to Dashboard
          </button>
        </div>
      </>
    );
  }

  const renderContent = () => {
    if (user.role === 'manager') {
      switch (activeTab) {
        case 'dashboard':
          return <ManagerDashboard />;
        case 'team':
          return <TeamFeedback />;
        default:
          return <ManagerDashboard />;
      }
    } else {
      return <EmployeeFeedback />;
    }
  };

  return (
    <>
      <Navbar
        onLoginClick={() => setShowLogin(true)}
        showHome={true}
        onHomeClick={() => setShowHome(true)}
        showLogout={true}
        onLogout={logout}
      />
      <Layout activeTab={activeTab} onTabChange={setActiveTab}>
        {renderContent()}
      </Layout>
    </>
  );
};

// Improved Navbar for logged-in users
const Navbar: React.FC<{
  onLoginClick: () => void;
  showHome?: boolean;
  onHomeClick?: () => void;
  showDashboard?: boolean;
  onDashboardClick?: () => void;
  showLogout?: boolean;
  onLogout?: () => void;
}> = ({
  onLoginClick,
  showHome = false,
  onHomeClick,
  showLogout = false,
  onLogout,
}) => (
  <nav className="w-full bg-white shadow-sm border-b px-6 py-4 flex justify-between items-center">
    <span className="text-xl font-bold text-blue-700 cursor-pointer" onClick={onHomeClick}>
      FeedbackFlow
    </span>
    <div>
      {showHome && (
        <button
          onClick={onHomeClick}
          className="mr-4 px-4 py-2 bg-gray-100 text-blue-700 rounded-lg font-semibold hover:bg-blue-200 transition"
        >
          Home
        </button>
      )}
      {showLogout && (
        <button
          onClick={onLogout}
          className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition"
        >
          Logout
        </button>
      )}
    </div>
  </nav>
);

function App() {
  return (
    <AuthProvider>
      <FeedbackProvider>
        <AppContent />
      </FeedbackProvider>
    </AuthProvider>
  );
}

export default App;