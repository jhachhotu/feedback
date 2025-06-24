import React, { useState } from 'react';
import { Plus, Search, Edit2, Calendar, User, MessageSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useFeedback } from '../context/FeedbackContext';
import FeedbackForm from './FeedbackForm';
import { Feedback } from '../types';

// Mock team data
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

const TeamFeedback: React.FC = () => {
  const { user } = useAuth();
  const { getFeedbacksByManager } = useFeedback();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [showForm, setShowForm] = useState(false);
  const [editingFeedback, setEditingFeedback] = useState<Feedback | null>(null);

  const allFeedbacks = getFeedbacksByManager(user!.id);
  
  // Filter feedbacks based on search and employee selection
  const filteredFeedbacks = allFeedbacks.filter(feedback => {
    const employee = mockTeam.find(member => member.id === feedback.employeeId);
    const matchesSearch = !searchTerm || 
      employee?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.strengths.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.improvements.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesEmployee = !selectedEmployee || feedback.employeeId === selectedEmployee;
    
    return matchesSearch && matchesEmployee;
  });

  const handleEdit = (feedback: Feedback) => {
    setEditingFeedback(feedback);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingFeedback(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEmployeeName = (employeeId: string) => {
    const employee = mockTeam.find(member => member.id === employeeId);
    return employee?.name || 'Unknown Employee';
  };

  const getEmployeeAvatar = (employeeId: string) => {
    const employee = mockTeam.find(member => member.id === employeeId);
    return employee?.avatar || '';
  };

  if (showForm) {
    return (
      <FeedbackForm 
        onClose={handleCloseForm}
        editingFeedback={editingFeedback}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team Feedback</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and track feedback for your team members
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Feedback
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Search feedback..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="sm:w-48">
            <select
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
            >
              <option value="">All Team Members</option>
              {mockTeam.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Feedback List */}
      <div className="space-y-4">
        {filteredFeedbacks.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border">
            <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No feedback found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || selectedEmployee 
                ? "Try adjusting your search filters."
                : "Get started by creating feedback for your team members."}
            </p>
            {!searchTerm && !selectedEmployee && (
              <div className="mt-6">
                <button
                  onClick={() => setShowForm(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Feedback
                </button>
              </div>
            )}
          </div>
        ) : (
          filteredFeedbacks.map((feedback) => (
            <div key={feedback.id} className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-200">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <img
                    className="h-10 w-10 rounded-full object-cover"
                    src={getEmployeeAvatar(feedback.employeeId)}
                    alt={getEmployeeName(feedback.employeeId)}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {getEmployeeName(feedback.employeeId)}
                        </p>
                        <div className="flex items-center mt-1 text-xs text-gray-500">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(feedback.createdAt)}
                          {feedback.updatedAt !== feedback.createdAt && (
                            <span className="ml-2 text-blue-600">• Updated</span>
                          )}
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
                        {feedback.acknowledged && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Acknowledged
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-medium text-green-800 mb-1">Strengths</h4>
                        <p className="text-sm text-gray-700">{feedback.strengths}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-amber-800 mb-1">Areas for Improvement</h4>
                        <p className="text-sm text-gray-700">{feedback.improvements}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => handleEdit(feedback)}
                  className="ml-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TeamFeedback;