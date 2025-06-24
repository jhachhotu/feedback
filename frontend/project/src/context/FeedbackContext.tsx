import React, { createContext, useContext, useState, useEffect } from 'react';
import { Feedback } from '../types';

interface FeedbackContextType {
  feedbacks: Feedback[];
  addFeedback: (feedback: Omit<Feedback, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateFeedback: (id: string, updates: Partial<Feedback>) => void;
  acknowledgeFeedback: (id: string) => void;
  getFeedbacksByEmployee: (employeeId: string) => Feedback[];
  getFeedbacksByManager: (managerId: string) => Feedback[];
}

// Mock feedback data
const mockFeedbacks: Feedback[] = [
  {
    id: '1',
    managerId: '1',
    employeeId: '2',
    strengths: 'Excellent problem-solving skills and consistently delivers high-quality code. Great team collaboration and always willing to help colleagues.',
    improvements: 'Could benefit from improving time estimation for tasks and speaking up more in team meetings.',
    sentiment: 'positive',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    acknowledged: true,
    acknowledgedAt: '2024-01-16T09:30:00Z'
  },
  {
    id: '2',
    managerId: '1',
    employeeId: '3',
    strengths: 'Outstanding leadership on the recent project. Shows great initiative and has strong communication skills with clients.',
    improvements: 'Focus on delegating more tasks to team members and avoid taking on too much work personally.',
    sentiment: 'positive',
    createdAt: '2024-01-10T14:30:00Z',
    updatedAt: '2024-01-10T14:30:00Z',
    acknowledged: false
  },
  {
    id: '3',
    managerId: '1',
    employeeId: '4',
    strengths: 'Very detail-oriented and catches issues others miss. Solid technical foundation and reliable delivery.',
    improvements: 'Work on being more proactive in suggesting improvements and take more ownership of feature development.',
    sentiment: 'neutral',
    createdAt: '2024-01-08T11:15:00Z',
    updatedAt: '2024-01-08T11:15:00Z',
    acknowledged: true,
    acknowledgedAt: '2024-01-09T10:00:00Z'
  }
];

const FeedbackContext = createContext<FeedbackContextType | undefined>(undefined);

export const FeedbackProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);

  useEffect(() => {
    // Load from localStorage or use mock data
    const stored = localStorage.getItem('feedbacks');
    if (stored) {
      setFeedbacks(JSON.parse(stored));
    } else {
      setFeedbacks(mockFeedbacks);
      localStorage.setItem('feedbacks', JSON.stringify(mockFeedbacks));
    }
  }, []);

  useEffect(() => {
    // Save to localStorage whenever feedbacks change
    localStorage.setItem('feedbacks', JSON.stringify(feedbacks));
  }, [feedbacks]);

  const addFeedback = (feedbackData: Omit<Feedback, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newFeedback: Feedback = {
      ...feedbackData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setFeedbacks(prev => [newFeedback, ...prev]);
  };

  const updateFeedback = (id: string, updates: Partial<Feedback>) => {
    setFeedbacks(prev => prev.map(feedback => 
      feedback.id === id 
        ? { ...feedback, ...updates, updatedAt: new Date().toISOString() }
        : feedback
    ));
  };

  const acknowledgeFeedback = (id: string) => {
    updateFeedback(id, { 
      acknowledged: true, 
      acknowledgedAt: new Date().toISOString() 
    });
  };

  const getFeedbacksByEmployee = (employeeId: string) => {
    return feedbacks.filter(f => f.employeeId === employeeId);
  };

  const getFeedbacksByManager = (managerId: string) => {
    return feedbacks.filter(f => f.managerId === managerId);
  };

  return (
    <FeedbackContext.Provider value={{
      feedbacks,
      addFeedback,
      updateFeedback,
      acknowledgeFeedback,
      getFeedbacksByEmployee,
      getFeedbacksByManager
    }}>
      {children}
    </FeedbackContext.Provider>
  );
};

export const useFeedback = () => {
  const context = useContext(FeedbackContext);
  if (!context) {
    throw new Error('useFeedback must be used within a FeedbackProvider');
  }
  return context;
};