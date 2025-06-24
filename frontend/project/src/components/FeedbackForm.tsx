import React, { useState, useEffect } from 'react';
import { X, Save, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useFeedback } from '../context/FeedbackContext';
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

interface FeedbackFormProps {
  onClose: () => void;
  editingFeedback?: Feedback | null;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ onClose, editingFeedback }) => {
  const { user } = useAuth();
  const { addFeedback, updateFeedback } = useFeedback();
  
  const [formData, setFormData] = useState({
    employeeId: '',
    strengths: '',
    improvements: '',
    sentiment: 'neutral' as 'positive' | 'neutral' | 'negative'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingFeedback) {
      setFormData({
        employeeId: editingFeedback.employeeId,
        strengths: editingFeedback.strengths,
        improvements: editingFeedback.improvements,
        sentiment: editingFeedback.sentiment
      });
    }
  }, [editingFeedback]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingFeedback) {
        updateFeedback(editingFeedback.id, {
          strengths: formData.strengths,
          improvements: formData.improvements,
          sentiment: formData.sentiment
        });
      } else {
        addFeedback({
          managerId: user!.id,
          employeeId: formData.employeeId,
          strengths: formData.strengths,
          improvements: formData.improvements,
          sentiment: formData.sentiment,
          acknowledged: false
        });
      }
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      onClose();
    } catch (error) {
      console.error('Error saving feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const selectedEmployee = mockTeam.find(member => member.id === formData.employeeId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {editingFeedback ? 'Edit Feedback' : 'New Feedback'}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {editingFeedback 
              ? 'Update the feedback details below'
              : 'Create structured feedback for a team member'
            }
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border space-y-6">
          {/* Employee Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Team Member
            </label>
            {editingFeedback ? (
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <img
                  className="h-10 w-10 rounded-full object-cover"
                  src={selectedEmployee?.avatar}
                  alt={selectedEmployee?.name}
                />
                <div className="ml-3">
                  <div className="text-sm font-medium text-gray-900">
                    {selectedEmployee?.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {selectedEmployee?.email}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {mockTeam.map((member) => (
                  <button
                    key={member.id}
                    type="button"
                    onClick={() => handleInputChange('employeeId', member.id)}
                    className={`w-full flex items-center p-3 border rounded-lg transition-colors duration-200 ${
                      formData.employeeId === member.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <img
                      className="h-10 w-10 rounded-full object-cover"
                      src={member.avatar}
                      alt={member.name}
                    />
                    <div className="ml-3 text-left">
                      <div className="text-sm font-medium text-gray-900">
                        {member.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {member.email}
                      </div>
                    </div>
                    {formData.employeeId === member.id && (
                      <div className="ml-auto">
                        <div className="h-4 w-4 bg-blue-600 rounded-full"></div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Strengths */}
          <div>
            <label htmlFor="strengths" className="block text-sm font-medium text-gray-700 mb-2">
              Strengths
            </label>
            <textarea
              id="strengths"
              rows={4}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="Describe what this person does well, their positive contributions, and areas where they excel..."
              value={formData.strengths}
              onChange={(e) => handleInputChange('strengths', e.target.value)}
              required
            />
          </div>

          {/* Areas for Improvement */}
          <div>
            <label htmlFor="improvements" className="block text-sm font-medium text-gray-700 mb-2">
              Areas for Improvement
            </label>
            <textarea
              id="improvements"
              rows={4}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="Suggest specific areas where this person could grow, develop new skills, or enhance their performance..."
              value={formData.improvements}
              onChange={(e) => handleInputChange('improvements', e.target.value)}
              required
            />
          </div>

          {/* Sentiment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Overall Sentiment
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'positive', label: 'Positive', color: 'green' },
                { value: 'neutral', label: 'Neutral', color: 'yellow' },
                { value: 'negative', label: 'Negative', color: 'red' }
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleInputChange('sentiment', option.value)}
                  className={`p-3 text-center border rounded-lg transition-colors duration-200 ${
                    formData.sentiment === option.value
                      ? `border-${option.color}-500 bg-${option.color}-50 text-${option.color}-700`
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || (!editingFeedback && !formData.employeeId)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSubmitting 
              ? 'Saving...' 
              : editingFeedback 
                ? 'Update Feedback' 
                : 'Create Feedback'
            }
          </button>
        </div>
      </form>
    </div>
  );
};

export default FeedbackForm;