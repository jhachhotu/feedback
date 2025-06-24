import React from 'react';
import { LogOut, User, MessageSquare, BarChart3 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange }) => {
  const { user, logout } = useAuth();

  const managerTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'team', label: 'Team Feedback', icon: MessageSquare },
  ];

  const employeeTabs = [
    { id: 'feedback', label: 'My Feedback', icon: MessageSquare },
  ];

  const tabs = user?.role === 'manager' ? managerTabs : employeeTabs;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-white" />
                </div>
                <span className="ml-2 text-xl font-semibold text-gray-900">FeedbackFlow</span>
              </div>
              
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => onTabChange(tab.id)}
                      className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <img
                  className="h-8 w-8 rounded-full object-cover"
                  src={user?.avatar || `https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop`}
                  alt={user?.name}
                />
                <div className="hidden sm:block">
                  <div className="text-sm font-medium text-gray-900">{user?.name}</div>
                  <div className="text-xs text-gray-500 capitalize">{user?.role}</div>
                </div>
              </div>
              
              <button
                onClick={logout}
                className="inline-flex items-center p-2 border border-transparent rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors duration-200"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1 border-t border-gray-200">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`w-full text-left block pl-3 pr-4 py-2 text-base font-medium transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'bg-blue-50 border-blue-500 text-blue-700 border-l-4'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center">
                    <Icon className="h-4 w-4 mr-3" />
                    {tab.label}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;