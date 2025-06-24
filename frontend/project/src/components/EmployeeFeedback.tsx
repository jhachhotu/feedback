import React, { useState } from 'react';
import { Calendar, CheckCircle, Clock, MessageSquare, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useFeedback } from '../context/FeedbackContext';

// Mock manager data
const mockManager = {
  id: '1',
  name: 'Sarah Johnson',
  avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
};

const EmployeeFeedback: React.FC = () => {
  const { user } = useAuth();
  const { getFeedbacksByEmployee, acknowledgeFeedback } = useFeedback();
  
  const myFeedbacks = getFeedbacksByEmployee(user!.id);
  const [selectedFeedback, setSelectedFeedback] = useState<string | null>(null);

  const handleAcknowledge = (feedbackId: string) => {
    acknowledgeFeedback(feedbackId);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const unacknowledgedCount = myFeedbacks.filter(f => !f.acknowledged).length;
  const totalFeedbacks = myFeedbacks.length;

  // Sort feedbacks by date (newest first)
  const sortedFeedbacks = [...myFeedbacks].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Feedback</h1>
        <p className="mt-1 text-sm text-gray-500">
          Review feedback from your manager and track your development
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white overflow-hidden shadow-sm rounded-lg border">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <MessageSquare className="h-6 w-6 text-blue-600" />
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
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Pending Review
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {unacknowledgedCount}
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
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Acknowledged
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {totalFeedbacks - unacknowledgedCount}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Timeline */}
      <div className="bg-white shadow-sm rounded-lg border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Feedback Timeline</h3>
        </div>
        <div className="p-6">
          {sortedFeedbacks.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No feedback yet</h3>
              <p className="mt-1 text-sm text-gray-500">
                Your manager hasn't provided any feedback yet. Check back later!
              </p>
            </div>
          ) : (
            <div className="flow-root">
              <ul className="-mb-8">
                {sortedFeedbacks.map((feedback, feedbackIdx) => (
                  <li key={feedback.id}>
                    <div className="relative pb-8">
                      {feedbackIdx !== sortedFeedbacks.length - 1 ? (
                        <span
                          className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                          aria-hidden="true"
                        />
                      ) : null}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                            feedback.acknowledged
                              ? 'bg-green-500'
                              : feedback.sentiment === 'positive'
                              ? 'bg-blue-500'
                              : feedback.sentiment === 'neutral'
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                          }`}>
                            {feedback.acknowledged ? (
                              <CheckCircle className="h-5 w-5 text-white" />
                            ) : (
                              <MessageSquare className="h-5 w-5 text-white" />
                            )}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center space-x-3 mb-3">
                                <img
                                  className="h-8 w-8 rounded-full object-cover"
                                  src={mockManager.avatar}
                                  alt={mockManager.name}
                                />
                                <div>
                                  <p className="text-sm font-medium text-gray-900">
                                    {mockManager.name}
                                  </p>
                                  <div className="flex items-center mt-1 text-xs text-gray-500">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    {formatDate(feedback.createdAt)}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  feedback.sentiment === 'positive' 
                                    ? 'bg-green-100 text-green-800'
                                    : feedback.sentiment === 'neutral'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {feedback.sentiment}
                                </span>
                              </div>
                            </div>
                            
                            <div className="space-y-4">
                              <div>
                                <h4 className="text-sm font-medium text-green-800 mb-2">
                                  🌟 Strengths
                                </h4>
                                <p className="text-sm text-gray-700 bg-white p-3 rounded border">
                                  {feedback.strengths}
                                </p>
                              </div>
                              
                              <div>
                                <h4 className="text-sm font-medium text-amber-800 mb-2">
                                  🚀 Areas for Growth
                                </h4>
                                <p className="text-sm text-gray-700 bg-white p-3 rounded border">
                                  {feedback.improvements}
                                </p>
                              </div>
                            </div>

                            {feedback.acknowledged ? (
                              <div className="mt-4 flex items-center text-xs text-green-600">
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Acknowledged on {formatDate(feedback.acknowledgedAt!)}
                              </div>
                            ) : (
                              <div className="mt-4">
                                <button
                                  onClick={() => handleAcknowledge(feedback.id)}
                                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                                >
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Mark as Read
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeFeedback;