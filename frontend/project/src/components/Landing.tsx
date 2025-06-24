import React from 'react';

interface LandingProps {
  onLoginClick: () => void;
}

const features = [
  {
    title: "Easy Feedback",
    description: "Managers can quickly give feedback to employees with just a few clicks.",
    icon: (
      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8s-9-3.582-9-8 4.03-8 9-8 9 3.582 9 8z" />
      </svg>
    ),
  },
  {
    title: "Clear Insights",
    description: "Visualize strengths and areas for improvement with easy-to-read dashboards.",
    icon: (
      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 17a4 4 0 01-4-4V5a4 4 0 018 0v8a4 4 0 01-4 4z" />
      </svg>
    ),
  },
  {
    title: "Secure & Private",
    description: "All feedback is securely stored and only visible to authorized users.",
    icon: (
      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c0-1.657 1.343-3 3-3s3 1.343 3 3v2a3 3 0 01-3 3h-2a3 3 0 01-3-3v-2z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13V7a7 7 0 0114 0v6" />
      </svg>
    ),
  },
];

const steps = [
  {
    step: 1,
    title: "Sign Up or Login",
    description: "Create your account or log in to your dashboard.",
  },
  {
    step: 2,
    title: "Give or Receive Feedback",
    description: "Managers provide feedback, employees view and reflect.",
  },
  {
    step: 3,
    title: "Grow Together",
    description: "Track progress and improve as a team.",
  },
];

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Manager",
    feedback: "FeedbackFlow made it so easy to give meaningful feedback to my team. The process is smooth and the insights are clear!",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "Mike Chen",
    role: "Employee",
    feedback: "I love how I can see my strengths and areas to improve. It really helps me grow in my role.",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
];

const Landing: React.FC<LandingProps> = ({ onLoginClick }) => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col">
    {/* Hero Section */}
    <section className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <h1 className="text-5xl font-extrabold mb-4 text-blue-700 drop-shadow">Welcome to FeedbackFlow</h1>
      <p className="mb-8 text-gray-600 text-lg max-w-2xl">
        The lightweight feedback system for managers and employees. Give, receive, and grow together.
      </p>
      <button
        onClick={onLoginClick}
        className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition text-lg shadow"
      >
        Get Started
      </button>
    </section>

    {/* Features Section */}
    <section className="py-12 bg-white">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-8">Why Choose FeedbackFlow?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div key={idx} className="bg-blue-50 rounded-xl p-6 flex flex-col items-center shadow hover:shadow-lg transition">
              {feature.icon}
              <h3 className="mt-4 text-xl font-semibold text-blue-800">{feature.title}</h3>
              <p className="mt-2 text-gray-600 text-center">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* How It Works Section */}
    <section className="py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-8">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div key={step.step} className="flex flex-col items-center">
              <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-2xl font-bold shadow mb-4">
                {step.step}
              </div>
              <h4 className="text-lg font-semibold text-blue-800">{step.title}</h4>
              <p className="text-gray-600 text-center mt-2">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* About Us Section */}
    <section className="py-12 bg-blue-50">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-blue-700 mb-4">About Us</h2>
        <p className="text-gray-700 text-lg">
          FeedbackFlow was built by a passionate team who believe in the power of constructive feedback. Our mission is to help teams grow together by making feedback simple, actionable, and accessible for everyone.
        </p>
      </div>
    </section>

    {/* Testimonials Section */}
    <section className="py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-8">What Our Users Say</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((t, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
              <img src={t.avatar} alt={t.name} className="w-16 h-16 rounded-full mb-3 border-2 border-blue-200" />
              <p className="text-gray-700 italic mb-2">"{t.feedback}"</p>
              <div className="font-semibold text-blue-800">{t.name}</div>
              <div className="text-xs text-gray-500">{t.role}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  </div>
);

export default Landing;