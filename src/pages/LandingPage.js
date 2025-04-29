import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/animations.css';

function LandingPage() {
  const sliderRef = useRef(null);
  const [activeFeature, setActiveFeature] = useState('feature1');

  useEffect(() => {
    // Auto-scroll animation for logos
    const slider = sliderRef.current;
    if (slider) {
      const scroll = () => {
        if (slider.scrollLeft + slider.clientWidth >= slider.scrollWidth) {
          slider.scrollLeft = 0;
        } else {
          slider.scrollLeft += 1;
        }
      };
      
      const interval = setInterval(scroll, 30);
      return () => clearInterval(interval);
    }
  }, []);

  const ExpertSection = () => (
    <section className="px-6 py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">
          Expert Insights from Top Institutions
        </h2>
        <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
          Our interviews feature professionals and students from leading institutions
        </p>

        {/* Logos Container */}
        <div className="relative overflow-hidden py-8 bg-white rounded-xl shadow-sm">
          {/* Gradient Overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10"></div>
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10"></div>
          
          {/* Scrolling Logos */}
          <div 
            ref={sliderRef}
            className="flex space-x-12 overflow-x-hidden whitespace-nowrap px-12"
          >
            {/* Universities */}
            <div className="flex items-center space-x-12">
              <div className="inline-flex flex-col items-center min-w-[200px]">
                <img 
                  src="/logos/Duke.png" 
                  alt="Duke"
                  className="h-12 w-auto grayscale hover:grayscale-0 transition-all"
                />
              </div>
              <div className="inline-flex flex-col items-center min-w-[300px]">
                <img 
                  src="/logos/Wharton.png" 
                  alt="Wharton"
                  className="h-12 w-auto grayscale hover:grayscale-0 transition-all"
                />
              </div>
              <div className="inline-flex flex-col items-center min-w-[200px]">
                <img 
                  src="/logos/GS.png" 
                  alt="GS"
                  className="h-12 w-auto grayscale hover:grayscale-0 transition-all"
                />
              </div>

              {/* Finance Companies */}
              <div className="inline-flex flex-col items-center min-w-[400px]">
                <img 
                  src="/logos/Evercore.png" 
                  alt="Evercore"
                  className="h-10 w-auto grayscale hover:grayscale-0 transition-all"
                />
              </div>
              <div className="inline-flex flex-col items-center min-w-[350px]">
                <img 
                  src="/logos/JPM.png" 
                  alt="JP Morgan"
                  className="h-10 w-auto grayscale hover:grayscale-0 transition-all mt-3"
                />
              </div>
              <div className="inline-flex flex-col items-center min-w-[200px]">
                <img 
                  src="/logos/BofA.png" 
                  alt="BofA"
                  className="h-12 w-auto grayscale hover:grayscale-0 transition-all"
                />
              </div>

              {/* Duplicate logos for continuous scroll */}
              <div className="inline-flex flex-col items-center min-w-[200px]">
                <img 
                  src="/logos/Foros.png" 
                  alt="Foros"
                  className="h-12 w-auto grayscale hover:grayscale-0 transition-all"
                />
              </div>
              {/* ... duplicate other logos ... */}
            </div>
          </div>
        </div>

        {/* Stats or Additional Info */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="p-6 bg-white rounded-xl shadow-sm">
            <div className="text-3xl font-bold text-sky-600 mb-2">200+</div>
            <div className="text-gray-600">Expert Interviews</div>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-sm">
            <div className="text-3xl font-bold text-sky-600 mb-2">15+</div>
            <div className="text-gray-600">Top Universities</div>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-sm">
            <div className="text-3xl font-bold text-sky-600 mb-2">15+</div>
            <div className="text-gray-600">Financial Institutions</div>
          </div>
        </div>
      </div>
    </section>
  );

  const FeaturesSection = () => {
    const features = [
      {
        id: 'feature1',
        title: 'Expert Interview Database',
        description: 'Access curated insights from successful professionals and students, providing real-world guidance for your journey.',
        isActive: activeFeature === 'feature1'
      },
      {
        id: 'feature2',
        title: 'Target Persona Matching',
        description: 'Get personalized advice based on your background and goals, ensuring relevant guidance for your specific situation.',
        isActive: activeFeature === 'feature2'
      },
      {
        id: 'feature3',
        title: 'Interactive Follow-ups',
        description: 'Engage in dynamic conversations with AI that adapts to your responses and provides targeted recommendations.',
        isActive: activeFeature === 'feature3'
      }
    ];

    // Animation for Feature 1: Database Animation
    const DatabaseAnimation = () => (
      <div className="relative w-full h-64 flex items-center justify-center">
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Animated Cards */}
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className={`absolute bg-white rounded-lg shadow-lg p-4 w-48 transform transition-all duration-700
                ${activeFeature === 'feature1' ? 'opacity-100' : 'opacity-0'}
                translate-y-${i * 4}`}
              style={{
                animation: `float${i + 1} 3s ease-in-out infinite`,
                animationDelay: `${i * 0.2}s`
              }}
            >
              <div className="h-2 w-12 bg-sky-200 rounded mb-2"></div>
              <div className="h-2 w-24 bg-gray-100 rounded"></div>
              <div className="mt-2 flex items-center">
                <div className="w-6 h-6 rounded-full bg-gray-100"></div>
                <div className="ml-2 h-2 w-16 bg-gray-100 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );

    // Animation for Feature 2: Persona Matching
    const PersonaAnimation = () => (
      <div className="relative w-full h-64 flex items-center justify-center">
        <div className={`transition-all duration-700 ${activeFeature === 'feature2' ? 'opacity-100' : 'opacity-0'}`}>
          {/* Central Avatar */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-16 h-16 bg-sky-500 rounded-full flex items-center justify-center text-white text-2xl">
              👤
            </div>
          </div>
          {/* Orbiting Personas */}
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="absolute w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center"
              style={{
                animation: `orbit 4s linear infinite`,
                animationDelay: `${i * (4 / 4)}s`,
                transformOrigin: 'center center',
                left: 'calc(50% - 5rem)',
                top: 'calc(50% - 5rem)',
              }}
            >
              <span className="text-sm">🎯</span>
            </div>
          ))}
        </div>
      </div>
    );

    // Animation for Feature 3: Interactive Chat
    const ChatAnimation = () => (
      <div className="relative w-full h-64 flex items-center justify-center">
        <div className={`space-y-4 transition-all duration-700 ${activeFeature === 'feature3' ? 'opacity-100' : 'opacity-0'}`}>
          {/* User Message */}
          <div className="flex justify-end">
            <div className="bg-sky-500 text-white rounded-lg px-4 py-2 max-w-xs animate-slideIn">
              Tell me more about...
            </div>
          </div>
          {/* AI Response */}
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg px-4 py-2 max-w-xs animate-slideIn animation-delay-300">
              Based on your interests...
            </div>
          </div>
          {/* Follow-up Suggestions */}
          <div className="flex flex-wrap gap-2 justify-center animate-slideIn animation-delay-600">
            <div className="bg-sky-100 text-sky-700 rounded-full px-3 py-1 text-sm">
              Follow-up 1 →
            </div>
            <div className="bg-sky-100 text-sky-700 rounded-full px-3 py-1 text-sm">
              Follow-up 2 →
            </div>
          </div>
        </div>
      </div>
    );

    return (
      <section className="px-6 py-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-16 text-gray-900">What makes HUMINT different</h2>
          
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Visualization Area */}
            <div className="lg:w-1/2 bg-gray-50 rounded-2xl overflow-hidden">
              <div className="p-8">
                {activeFeature === 'feature1' && <DatabaseAnimation />}
                {activeFeature === 'feature2' && <PersonaAnimation />}
                {activeFeature === 'feature3' && <ChatAnimation />}
              </div>
            </div>

            {/* Feature List - Right Side */}
            <div className="lg:w-1/2">
              <div className="space-y-8">
                {features.map((feature) => (
                  <div
                    key={feature.id}
                    className={`cursor-pointer transition-all duration-300 ${
                      feature.isActive 
                        ? 'opacity-100' 
                        : 'opacity-50 hover:opacity-75'
                    }`}
                    onClick={() => setActiveFeature(feature.id)}
                  >
                    <div className="flex items-start">
                      <div className="mr-4 mt-2">
                        <div className={`w-1 h-full rounded ${
                          feature.isActive ? 'bg-sky-500' : 'bg-gray-200'
                        }`} style={{ height: '24px' }}></div>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2 text-gray-900">
                          {feature.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  };

  const DemoAnimation = () => {
    const [demoState, setDemoState] = useState(0); // 0: typing, 1: loading, 2: response
    const [typedText, setTypedText] = useState('');
    const [loadingMessage, setLoadingMessage] = useState('');
    const demoQuestion = "What's the typical career path in investment banking?";

    const loadingMessages = [
      "Retrieving expert interview insights...",
      "Analyzing responses from top finance professionals...",
      "Matching relevant career experiences...",
      "Synthesizing personalized guidance..."
    ];

    useEffect(() => {
      // Type out the demo question
      if (demoState === 0) {
        let currentText = '';
        const typeInterval = setInterval(() => {
          if (currentText.length < demoQuestion.length) {
            currentText = demoQuestion.slice(0, currentText.length + 1);
            setTypedText(currentText);
          } else {
            clearInterval(typeInterval);
            setDemoState(1); // Move to loading state
          }
        }, 50);

        return () => clearInterval(typeInterval);
      }

      // Handle loading state
      if (demoState === 1) {
        let messageIndex = 0;
        const loadingInterval = setInterval(() => {
          setLoadingMessage(loadingMessages[messageIndex]);
          messageIndex = (messageIndex + 1) % loadingMessages.length;
        }, 2000);

        // After loading completes, show the response
        setTimeout(() => {
          clearInterval(loadingInterval);
          setDemoState(2);
        }, 6000);

        return () => clearInterval(loadingInterval);
      }
    }, [demoState]);

    return (
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
        {/* Demo Chat Interface */}
        <div className="p-6 space-y-6">
          {/* User Question */}
          <div className="flex justify-end">
            <div className="bg-sky-500 text-white rounded-2xl px-6 py-4 max-w-2xl">
              <p>{typedText || "..."}</p>
            </div>
          </div>

          {/* Loading State */}
          {demoState === 1 && (
            <div className="flex items-start space-x-4 animate-fade-in">
              <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center">
                🤖
              </div>
              <div className="flex-1 bg-white border border-gray-200 rounded-2xl p-6">
                <div className="flex items-center space-x-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-sky-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-sky-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-sky-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                  <span className="text-gray-600 animate-fade-in">
                    {loadingMessage}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* AI Response */}
          {demoState === 2 && (
            <div className="flex items-start space-x-4 animate-fade-in">
              <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center">
                🤖
              </div>
              <div className="flex-1 bg-white border border-gray-200 rounded-2xl shadow-sm">
                {/* Metadata Bar */}
                <div className="px-4 py-2 bg-gray-50 rounded-t-2xl flex items-center justify-between border-b">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">Confidence:</span>
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        High
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">🎯 Persona:</span>
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                        Early Career IB Analyst
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    Based on 5 sources
                  </div>
                </div>

                {/* Main Response */}
                <div className="p-4">
                  <p className="text-gray-800 mb-4">
                    A typical investment banking career path usually starts as an Analyst (2-3 years), followed by Associate (3-4 years), then VP, Director, and Managing Director...
                  </p>

                  {/* Expert Insights */}
                  <div className="bg-gray-50 rounded-xl p-4 mt-4">
                    <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center">
                      <span className="mr-2">📚</span>
                      Expert Insights
                    </h3>
                    <div className="space-y-3">
                      <div className="bg-white rounded-lg border border-gray-200 p-3">
                        <blockquote className="text-gray-700 mb-3 italic">
                          "The first two years as an analyst are crucial. You'll learn financial modeling, deal execution, and build a strong foundation for your career."
                        </blockquote>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-xl">💼</span>
                            <div>
                              <div className="text-sky-600 font-medium">
                                VP at Goldman Sachs
                              </div>
                              <div className="text-xs text-gray-500">
                                Investment Banking Division
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Demo Input Bar */}
        <div className="border-t bg-gray-50 p-4">
          <div className="max-w-4xl mx-auto flex items-center space-x-4">
            <div className="flex-1 bg-white rounded-full border border-gray-200 px-6 py-3 text-gray-400">
              Ask about finance recruiting...
            </div>
            <button className="p-3 rounded-full bg-sky-500 text-white">
              <span className="w-5 h-5 block">➤</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      {/* Navigation */}
      <nav className="px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold text-sky-600">HUMINT</div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          {/* Text Content */}
          <div className="text-center max-w-4xl mx-auto mb-12">
            <h1 className="text-6xl font-bold text-gray-900 mb-6">
              Your AI-Powered
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-sky-700">
                Finance Career Guide
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Get personalized insights from 200+ finance professionals at top investment banks and private equity firms
            </p>
            
            {/* New Email Form */}
            <div className="max-w-md mx-auto">
              <form className="flex items-center gap-3 bg-white rounded-full p-1 border-2 border-sky-100">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 bg-transparent outline-none text-gray-800 placeholder-gray-400"
                />
                <button 
                  type="submit"
                  className="px-6 py-2 bg-sky-500 text-white rounded-full hover:bg-sky-600 transition-colors text-base font-medium whitespace-nowrap"
                >
                  Join Waitlist
                </button>
              </form>
              <p className="text-sm text-gray-500 mt-2">
                Be among the first to experience HUMINT
              </p>
            </div>
          </div>

          {/* Demo Animation */}
          <DemoAnimation />
        </div>
      </section>

      {/* Features Section */}
      <FeaturesSection />

      <ExpertSection />

      {/* CTA Section */}
      <section className="px-6 py-20 bg-sky-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">Ready to Get Started?</h2>
          <p className="text-gray-600 mb-8">
            Join the waitlist to be among the first to experience HUMINT
          </p>
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="px-8 py-3 bg-sky-500 text-white rounded-full hover:bg-sky-600 transition-colors text-lg font-medium"
          >
            Join Waitlist
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto text-center text-gray-600">
          <p>© 2024 HUMINT. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
