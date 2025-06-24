import React from 'react';
import { Users, MessageSquare, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useFeedback } from '../context/FeedbackContext';

// Mock team data - in real app this would come from API
const mockTeam = [
  {
    id: '2',
    name: 'Mike Chen',
    email: 'mike@company.com',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    email: 'emily@company.com',
    avatar: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  },
  {
    id: '4',
    name: 'David Park',
    email: 'david@company.com',
    avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  }
];

const ManagerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { getFeedbacksByManager } = useFeedback();
  
  const managerFeedbacks = getFeedbacksByManager(user!.id);
  
  // Calculate metrics
  const totalFeedbacks = managerFeedbacks.length;
  const acknowledgedFeedbacks = managerFeedbacks.filter(f => f.acknowledged).length;
  const pendingFeedbacks = totalFeedbacks - acknowledgedFeedbacks;
  
  const sentimentCounts = managerFeedbacks.reduce((acc, feedback) => {
    acc[feedback.sentiment] = (acc[feedback.sentiment] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const teamStats = mockTeam.map(member => {
    const memberFeedbacks = managerFeedbacks.filter(f => f.employeeId === member.id);
    const latestFeedback = memberFeedbacks.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0];
    
    return {
      ...member,
      feedbackCount: memberFeedbacks.length,
      latestFeedback,
      acknowledgedCount: memberFeedbacks.filter(f => f.acknowledged).length
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Monitor your team's feedback and performance insights
          </p>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white overflow-hidden shadow-sm rounded-lg border">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Team Members
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {mockTeam.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-sm rounded-lg border">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <MessageSquare className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Feedback
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {totalFeedbacks}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-sm rounded-lg border">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Acknowledged
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {acknowledgedFeedbacks}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-sm rounded-lg border">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Pending Review
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {pendingFeedbacks}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sentiment Overview */}
      <div className="bg-white shadow-sm rounded-lg border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Feedback Sentiment</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {sentimentCounts.positive || 0}
              </div>
              <div className="text-sm text-gray-500">Positive</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {sentimentCounts.neutral || 0}
              </div>
              <div className="text-sm text-gray-500">Neutral</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {sentimentCounts.negative || 0}
              </div>
              <div className="text-sm text-gray-500">Negative</div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Overview */}
      <div className="bg-white shadow-sm rounded-lg border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Team Overview</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {teamStats.map((member) => (
            <div key={member.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <img
                    className="h-12 w-12 rounded-full object-cover"
                    src={member.avatar}
                    alt={member.name}
                  />
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {member.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {member.email}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-900">
                      {member.feedbackCount}
                    </div>
                    <div className="text-xs text-gray-500">Feedback</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-900">
                      {member.acknowledgedCount}
                    </div>
                    <div className="text-xs text-gray-500">Acknowledged</div>
                  </div>
                  
                  <div className="text-center">
                    {member.latestFeedback ? (
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        member.latestFeedback.sentiment === 'positive' 
                          ? 'bg-green-100 text-green-800'
                          : member.latestFeedback.sentiment === 'neutral'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {member.latestFeedback.sentiment}
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">No feedback</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;