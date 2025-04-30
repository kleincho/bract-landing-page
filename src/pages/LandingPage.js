import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/animations.css';
import { API_URL } from '../services/config';
import { isMobile } from 'react-device-detect';


function LandingPage() {
  const sliderRef = useRef(null);
  const scrollIntervalRef = useRef(null);
  const mobileSliderRef = useRef(null);
  const mobileScrollIntervalRef = useRef(null);
  const [activeFeature, setActiveFeature] = useState('feature1');
  const navigate = useNavigate();

  const startScrolling = () => {
    const slider = sliderRef.current;
    if (slider) {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
      }
      
      scrollIntervalRef.current = setInterval(() => {
        if (slider.scrollLeft + slider.clientWidth >= slider.scrollWidth) {
          slider.scrollLeft = 0;
        } else {
          slider.scrollLeft += 1;
        }
      }, 30);
    }
  };

  useEffect(() => {
    startScrolling();
    
    return () => {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    startScrolling();
  }, [activeFeature]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            startScrolling();
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sliderRef.current) {
      observer.observe(sliderRef.current);
    }

    return () => {
      if (sliderRef.current) {
        observer.unobserve(sliderRef.current);
      }
    };
  }, []);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get('email');
    
    try {
      // Add to waitlist
      const response = await fetch(`${API_URL}/api/waitlist/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email,
          has_valid_card: false,
          created_at: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to join waitlist');
      }

      // Navigate to confirmation page
      navigate('/confirmation', { state: { email } });
    } catch (error) {
      console.error('Error:', error);
      // Handle error (show error message to user)
    }
  };

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
        title: 'Proprietary Expert Knowledge Base',
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
        description: 'Keep the conversation going with AI-powered suggestions and follow-ups based on what you ask.',
        isActive: activeFeature === 'feature3'
      }
    ];

    // Animation for Feature 1: Database Animation
    const DatabaseAnimation = () => (
      <div className="relative w-full h-[32rem] flex items-center justify-center">
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Animated Interview Transcripts */}
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className={`absolute bg-white rounded-lg shadow-lg p-6 w-[36rem] transform transition-all duration-700 max-h-[28rem] overflow-hidden
                ${activeFeature === 'feature1' ? 'opacity-100' : 'opacity-0'}`}
              style={{
                animation: `float${i + 1} 3s ease-in-out infinite`,
                animationDelay: `${i * 0.2}s`,
                transform: `translateY(${i * 20}px) scale(${1 - i * 0.05})`,
                zIndex: 3 - i
              }}
            >
              {/* Interview Metadata Header */}
              <div className="border-b-2 border-gray-200 pb-3 mb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-mono text-xs text-gray-500 mb-1">
                      INTERVIEW_ID: {['GS_VP_2024_03', 'MS_AD_2024_02', 'JPM_AN_2024_01'][i]}
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {['Vice President', 'Associate Director', 'Senior Analyst'][i]}
                    </div>
                    <div className="text-xs text-gray-600">
                      {['Goldman Sachs - Investment Banking', 'Morgan Stanley - M&A', 'JPMorgan - ECM'][i]}
                    </div>
                  </div>
                  <div className="font-mono text-xs text-gray-500 text-right">
                    DATE: 2024-03-{15 - i}
                    <br />
                    LOCATION: New York, NY
                  </div>
                </div>
              </div>

              {/* Updated Transcript Content with More Follow-ups */}
              <div className="font-mono text-xs space-y-4">
                <div className="grid grid-cols-[80px,1fr] gap-2">
                  <div className="text-gray-400">[00:03:15]</div>
                  <div className="text-gray-800">
                    <span className="text-sky-600 font-semibold">INTERVIEWER: </span>
                    Could you walk us through a typical deal process?
                  </div>
                </div>

                <div className="grid grid-cols-[80px,1fr] gap-2">
                  <div className="text-gray-400">[00:03:42]</div>
                  <div className="text-gray-800">
                    <span className="text-sky-600 font-semibold">PARTICIPANT: </span>
                    {[
                      "Sure. The process typically starts with client outreach or inbound requests. First thing we do is assemble a team...",
                      "Let me break this down into phases. Phase one is always about understanding the client's strategic objectives...",
                      "I'll give you a concrete example from a recent deal. We started with extensive market analysis..."
                    ][i]}
                  </div>
                </div>

                <div className="grid grid-cols-[80px,1fr] gap-2">
                  <div className="text-gray-400">[00:04:18]</div>
                  <div className="text-gray-800">
                    <span className="text-sky-600 font-semibold">INTERVIEWER: </span>
                    What are the key challenges in this stage?
                  </div>
                </div>

                <div className="grid grid-cols-[80px,1fr] gap-2">
                  <div className="text-gray-400">[00:04:45]</div>
                  <div className="text-gray-800">
                    <span className="text-sky-600 font-semibold">PARTICIPANT: </span>
                    {[
                      "The main challenge is managing multiple stakeholders while maintaining confidentiality...",
                      "Time management becomes critical. You're often coordinating across different time zones...",
                      "The biggest challenge is ensuring accuracy in your financial models..."
                    ][i]}
                  </div>
                </div>

                <div className="grid grid-cols-[80px,1fr] gap-2">
                  <div className="text-gray-400">[00:05:30]</div>
                  <div className="text-gray-800">
                    <span className="text-sky-600 font-semibold">INTERVIEWER: </span>
                    How do you handle client communication during this process?
                  </div>
                </div>

                <div className="grid grid-cols-[80px,1fr] gap-2">
                  <div className="text-gray-400">[00:05:45]</div>
                  <div className="text-gray-800">
                    <span className="text-sky-600 font-semibold">PARTICIPANT: </span>
                    {[
                      "Clear communication is crucial. We have weekly updates with the client...",
                      "We maintain a structured communication cadence with daily internal updates...",
                      "It's important to have a single point of contact for the client..."
                    ][i]}
                  </div>
                </div>
              </div>

              {/* Footer Metadata */}
              <div className="mt-4 pt-2 border-t border-gray-100">
                <div className="flex justify-between items-center">
                  <div className="text-xs text-gray-400 font-mono">
                    DURATION: 1:45:30
                  </div>
                  <div className="text-xs text-gray-400 font-mono">
                    PAGE 4/28
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );

    // Animation for Feature 2: Persona Matching
    const PersonaAnimation = () => {
      const [showResults, setShowResults] = useState(false);

      useEffect(() => {
        if (activeFeature === 'feature2') {
          setShowResults(false);
          const timer = setTimeout(() => setShowResults(true), 1000);
          return () => clearTimeout(timer);
        }
      }, [activeFeature]);

      return (
        <div className="relative w-full h-[32rem] flex flex-col items-center">
          {/* Target Persona Input */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-sky-200 max-w-lg mx-auto mb-12">
            <div className="text-sm text-gray-500 mb-4">🎯 Emory Alumni, International Student, Econ Major</div>
            <div className="flex flex-wrap gap-2">
              {['University: Emory', 'Region: International', 'Major: Econ'].map((tag) => (
                <span key={tag} className="bg-sky-50 text-sky-600 text-xs px-3 py-1.5 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Matched Profiles */}
          {showResults && (
            <div className="grid grid-cols-3 gap-6 w-full max-w-4xl mx-auto animate-fade-in">
              {[
                {
                  name: "Michael Jackson",
                  role: "IB Analyst",
                  firm: "Goldman Sachs",
                  background: "Emory '22",
                  match: "100%",
                  quote: "Leveraging alumni network was key..."
                },
                {
                  name: "Tom Brady",
                  role: "Summer Analyst",
                  firm: "Morgan Stanley",
                  background: "Emory '23",
                  match: "97%",
                  quote: "Unique recruiting process..."
                },
                {
                  name: "Timothee Chalamet",
                  role: "IB Analyst",
                  firm: "J.P. Morgan",
                  background: "Emory '21",
                  match: "94%",
                  quote: "Adapted networking approach..."
                }
              ].map((profile, i) => (
                <div
                  key={i}
                  className={`bg-white rounded-xl p-5 shadow-sm border ${
                    i === 0 ? 'border-sky-200' : 'border-gray-100'
                  }`}
                >
                  {/* Header with Name and Match */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="font-medium text-gray-900">{profile.name}</div>
                    <div className="bg-green-50 text-green-600 text-xs px-2 py-1 rounded-full">
                      {profile.match}
                    </div>
                  </div>

                  {/* Role Info */}
                  <div className="space-y-1 mb-4">
                    <div className="text-sm text-gray-600">
                      {profile.role} · {profile.firm}
                    </div>
                    <div className="text-xs text-gray-500">
                      {profile.background}
                    </div>
                  </div>

                  {/* Quote */}
                  <div className="text-sm text-gray-600 italic bg-gray-50 p-3 rounded-lg">
                    "{profile.quote}"
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    };

    // Animation for Feature 3: Interactive Chat
    const ChatAnimation = () => {
      const [animationStep, setAnimationStep] = useState(0);

      useEffect(() => {
        if (activeFeature === 'feature3') {
          setAnimationStep(0);
          const timer = setTimeout(() => setAnimationStep(1), 500);
          return () => clearTimeout(timer);
        }
      }, [activeFeature]);

      return (
        <div className="relative w-full h-[32rem] flex items-center justify-center">
          <div className={`transition-all duration-700 ${activeFeature === 'feature3' ? 'opacity-100' : 'opacity-0'} w-full max-w-3xl mx-auto`}>
            {/* Main Question */}
            <div className="flex justify-end mb-6">
              <div className="bg-sky-500 text-white rounded-2xl px-6 py-3 shadow-md max-w-xl">
                <p className="text-sm">What's the difference between Evercore SF vs NYC?</p>
              </div>
            </div>

            {/* AI Initial Response Preview */}
            <div className="flex items-start space-x-3 mb-8">
              <div className="w-8 h-8 rounded-full bg-[#4AA3DF]/10 flex items-center justify-center flex-shrink-0">
                <img 
                  src="/humint_icon.png" 
                  alt="HUMINT AI"
                  className="w-5 h-5 object-contain"
                />
              </div>
              <div className="bg-white rounded-2xl shadow-md p-4 max-w-xl">
                <p className="text-sm text-gray-600 mb-3">
                  Based on our interviews with Evercore bankers, there are several key differences between the SF and NYC offices...
                </p>
                <div className="text-xs text-gray-400">Click to expand full response</div>
              </div>
            </div>

            {/* Follow-up Questions Section */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <div className="flex items-center mb-4">
                <span className="mr-2">💡</span>
                <h3 className="text-sm font-medium text-gray-700">Related questions you might want to ask:</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    question: "What types of deals does SF office handle?",
                    preview: "Tech & Healthcare focus...",
                    category: "Deals & Coverage"
                  },
                  {
                    question: "How's the culture different?",
                    preview: "Work style & team dynamics...",
                    category: "Culture"
                  },
                  {
                    question: "What's the size comparison?",
                    preview: "Team structure & growth...",
                    category: "Office Size"
                  },
                  {
                    question: "Which office has better exit opps?",
                    preview: "Different paths & opportunities...",
                    category: "Career Path"
                  }
                ].map((item, i) => (
                  <div
                    key={i}
                    className={`bg-white rounded-xl p-4 border border-gray-100 hover:border-sky-200 transition-all duration-300 cursor-pointer group
                      ${animationStep >= 1 ? 'opacity-100 transform-none' : 'opacity-0 translate-y-4'}`}
                    style={{ animationDelay: `${i * 0.1}s` }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="text-xs text-sky-600 font-medium px-2 py-1 bg-sky-50 rounded-full">
                        {item.category}
                      </div>
                      <div className="text-gray-400 group-hover:text-sky-500 transition-colors">
                        →
                      </div>
                    </div>
                    <p className="text-sm text-gray-800 mb-1 font-medium">
                      {item.question}
                    </p>
                    <p className="text-xs text-gray-500">
                      {item.preview}
                    </p>
                  </div>
                ))}
              </div>

              {/* Quick Follow-ups */}
              <div className="mt-6 flex flex-wrap gap-2">
                <div className="text-xs text-gray-500 flex items-center mr-2">
                  <span className="mr-2">🔍</span>
                  Quick follow-ups:
                </div>
                {[
                  "Average deal size?",
                  "Work-life balance?",
                  "Team structure?",
                  "Exit opportunities?"
                ].map((q, i) => (
                  <button
                    key={i}
                    className={`text-xs px-3 py-1.5 rounded-full border border-gray-200 text-gray-600 
                      hover:bg-sky-50 hover:border-sky-200 hover:text-sky-600 transition-all duration-300
                      ${animationStep >= 1 ? 'opacity-100 transform-none' : 'opacity-0 translate-y-4'}`}
                    style={{ animationDelay: `${0.4 + i * 0.1}s` }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    };

    return (
      <section className="px-6 py-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-16 text-gray-900">Why Choose humint</h2>
          
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
                          feature.isActive ? 'bg-[#4AA3DF]' : 'bg-gray-200'
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
    const [loadingMessage, setLoadingMessage] = useState('Analyzing responses from top finance professionals...');
    const demoQuestion = "How early should I start networking for junior internships?";

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
        setTimeout(() => {
          setDemoState(2);
        }, 2000);
      }
    }, [demoState]);

    return (
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
        {/* Demo Chat Interface */}
        <div className="p-6 space-y-6">
          {/* User Question */}
          <div className="flex justify-end">
            <div className="bg-[#4AA3DF] text-white rounded-2xl px-6 py-4 max-w-2xl">
              <p>{typedText || "..."}</p>
            </div>
          </div>

          {/* Loading State */}
          {demoState === 1 && (
            <div className="flex items-start space-x-4 animate-fade-in">
              <div className="w-8 h-8 rounded-full bg-[#4AA3DF]/10 flex items-center justify-center">
                <img 
                  src="/humint_icon.png" 
                  alt="HUMINT AI"
                  className="w-5 h-5 object-contain"
                />
              </div>
              <div className="flex-1 bg-white border border-gray-200 rounded-2xl p-6">
                <div className="flex items-center space-x-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-[#4AA3DF] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-[#4AA3DF] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-[#4AA3DF] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
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
              <div className="w-8 h-8 rounded-full bg-[#4AA3DF]/10 flex items-center justify-center">
                <img 
                  src="/humint_icon.png" 
                  alt="HUMINT AI"
                  className="w-5 h-5 object-contain"
                />
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
                    Based on 8 sources
                  </div>
                </div>

                {/* Main Response */}
                <div className="p-4">
                  <p className="text-gray-800 mb-4">
                    While opinions vary on the ideal timing, the consensus is that starting early gives you more options. However, quality of networking matters more than timing—focus on building genuine relationships rather than rushing to check a box.
                  </p>

                  {/* Expert Insights */}
                  <div className="bg-gray-50 rounded-xl p-4 mt-4">
                    <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center">
                      <span className="mr-2">📚</span>
                      Expert Perspectives
                    </h3>
                    <div className="space-y-3">
                      {/* Early Start Perspective */}
                      <div className="bg-white rounded-lg border border-gray-200 p-3">
                        <blockquote className="text-gray-700 mb-3 italic">
                          "Starting early in freshman year gave me a huge advantage. I had time to build relationships naturally and was well-prepared when accelerated recruiting began."
                        </blockquote>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                              <span className="text-base">💼</span>
                            </div>
                            <div>
                              <div className="text-[#4AA3DF] font-medium flex items-center">
                                Jane Doe
                              </div>
                              <div className="text-xs text-gray-600 flex items-center">
                                <span className="font-medium">Goldman Sachs</span>
                                <span className="mx-1.5">·</span>
                                <span>Investment Banking</span>
                                <span className="mx-1.5">·</span>
                                <span>Summer Analyst</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Alternative Perspective */}
                      <div className="bg-white rounded-lg border border-gray-200 p-3">
                        <blockquote className="text-gray-700 mb-3 italic">
                          "Don't stress too much about starting super early. I began networking mid-sophomore year and still landed my dream role. Focus on quality connections and genuine interest in the industry."
                        </blockquote>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                              <span className="text-base">💼</span>
                            </div>
                            <div>
                              <div className="text-[#4AA3DF] font-medium flex items-center">
                                John Doe
                              </div>
                              <div className="text-xs text-gray-600 flex items-center">
                                <span className="font-medium">Jefferies</span>
                                <span className="mx-1.5">·</span>
                                <span>Investment Banking</span>
                                <span className="mx-1.5">·</span>
                                <span>Analyst</span>
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
            <button className="p-3 rounded-full bg-[#4AA3DF] text-white">
              <span className="w-5 h-5 block">➤</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Updated Mobile Hero Section
  const MobileHeroSection = () => (
    <section className="px-4 py-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            We Interviewed 200+ Bankers
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4AA3DF] to-[#3182a8] block mt-1">
              So You Don't Have To
            </span>
          </h1>
          <p className="text-sm text-gray-600 mb-4">
            Stop guessing in recruiting. Get AI-powered answers from real bankers.
          </p>
          
          {/* Updated email form with proper form handling */}
          <form 
            onSubmit={handleEmailSubmit}  // Use the same handler as desktop version
            className="space-y-3"
          >
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2.5 rounded-lg bg-white border border-gray-200 outline-none text-sm text-gray-800 placeholder-gray-400"
              required
            />
            <button 
              type="submit"
              className="w-full px-4 py-2.5 bg-[#4AA3DF] text-white rounded-lg font-medium text-sm"
            >
              Join Waitlist
            </button>
          </form>
        </div>
      </div>
    </section>
  );

  // Simplified Mobile Demo Animation (Chat-like interface)
  const MobileDemoAnimation = () => {
    const [demoState, setDemoState] = useState(0);
    const [typedText, setTypedText] = useState('');
    const demoQuestion = "How early should I start networking?"; // Shortened for mobile

    useEffect(() => {
      if (demoState === 0) {
        let currentText = '';
        const typeInterval = setInterval(() => {
          if (currentText.length < demoQuestion.length) {
            currentText = demoQuestion.slice(0, currentText.length + 1);
            setTypedText(currentText);
          } else {
            clearInterval(typeInterval);
            setDemoState(1);
          }
        }, 50);

        return () => clearInterval(typeInterval);
      }

      if (demoState === 1) {
        setTimeout(() => setDemoState(2), 1500);
      }
    }, [demoState]);

    return (
      <div className="mx-4 mb-6">
        <div className="bg-gray-100 rounded-2xl p-4">
          {/* Chat Interface */}
          <div className="space-y-4">
            {/* User Message */}
            <div className="flex justify-end">
              <div className="bg-[#4AA3DF] text-white rounded-2xl px-4 py-2 max-w-[80%]">
                <p className="text-sm">{typedText || "..."}</p>
              </div>
            </div>

            {/* AI Response */}
            {demoState >= 1 && (
              <div className="space-y-4">
                {/* Initial Response */}
                <div className="flex items-start space-x-2">
                  <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                    <img 
                      src="/humint_icon.png" 
                      alt="HUMINT"
                      className="w-4 h-4"
                    />
                  </div>
                  {demoState === 1 ? (
                    <div className="bg-white rounded-2xl px-3 py-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white rounded-2xl px-4 py-3 w-full">
                      {/* Metadata Bar */}
                      <div className="flex items-center justify-between mb-2 text-[10px]">
                        <div className="flex items-center space-x-2">
                          <span className="px-1.5 py-0.5 bg-green-100 text-green-700 rounded-full">
                            High Confidence
                          </span>
                          <span className="px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded-full">
                            Early Career
                          </span>
                        </div>
                        <span className="text-gray-500">8 sources</span>
                      </div>

                      {/* Main Response */}
                      <p className="text-sm text-gray-800 mb-3">
                        While opinions vary, quality of networking matters more than timing. Here's what successful bankers say:
                      </p>

                      {/* Expert Quotes */}
                      <div className="space-y-3">
                        <div className="bg-gray-50 rounded-xl p-3">
                          <blockquote className="text-xs text-gray-700 italic mb-2">
                            "Starting early in freshman year gave me a huge advantage. I had time to build genuine relationships."
                          </blockquote>
                          <div className="flex items-center space-x-2">
                            <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center">
                              <span className="text-xs">💼</span>
                            </div>
                            <div>
                              <div className="text-[#4AA3DF] text-xs font-medium">
                                Jane Doe
                              </div>
                              <div className="text-[10px] text-gray-600">
                                Goldman Sachs · IB
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-3">
                          <blockquote className="text-xs text-gray-700 italic mb-2">
                            "Don't stress about starting super early. Focus on quality connections and genuine interest."
                          </blockquote>
                          <div className="flex items-center space-x-2">
                            <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center">
                              <span className="text-xs">💼</span>
                            </div>
                            <div>
                              <div className="text-[#4AA3DF] text-xs font-medium">
                                John Doe
                              </div>
                              <div className="text-[10px] text-gray-600">
                                Jefferies · IB
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Mobile Chat Input */}
          <div className="mt-4 flex items-center space-x-2">
            <input
              type="text"
              placeholder="Ask about recruiting..."
              className="flex-1 bg-white rounded-full px-4 py-2 text-sm border border-gray-200"
              disabled
            />
            <button className="w-8 h-8 bg-[#4AA3DF] rounded-full flex items-center justify-center">
              <span className="text-white text-sm">➤</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Move these animation components BEFORE MobileFeaturesSection
  const MobileDatabaseAnimation = () => (
    <div className="relative w-full h-[200px] flex items-center justify-center">
      <div className="absolute inset-0 flex items-center justify-center scale-[0.6]">
        {/* Single transcript for mobile */}
        <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-[280px]">
          <div className="border-b border-gray-200 pb-2 mb-2">
            <div className="font-mono text-[10px] text-gray-500">
              INTERVIEW_ID: GS_VP_2024_03
            </div>
            <div className="text-xs font-medium text-gray-900">
              Vice President
            </div>
            <div className="text-[10px] text-gray-600">
              Goldman Sachs - IB
            </div>
          </div>
          <div className="font-mono text-[10px] space-y-2">
            <div className="text-gray-800">
              "The process typically starts with client outreach..."
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const MobilePersonaAnimation = () => (
    <div className="relative w-full h-[200px] flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-sm p-3 w-[280px] scale-[0.8]">
        <div className="text-xs text-gray-500 mb-2">🎯 Duke Alumni, Econ Major</div>
        <div className="flex flex-wrap gap-1">
          {['Emory', 'Korea', 'IB'].map((tag) => (
            <span key={tag} className="bg-sky-50 text-sky-600 text-[10px] px-2 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  const MobileChatAnimation = () => (
    <div className="relative w-full h-[200px] flex items-center justify-center">
      <div className="w-[280px] scale-[0.8]">
        <div className="bg-[#4AA3DF] text-white rounded-xl px-3 py-2 text-xs mb-2 ml-auto">
          What's the difference between offices?
        </div>
        <div className="flex items-start space-x-2">
          <div className="w-6 h-6 rounded-full bg-[#4AA3DF]/10 flex items-center justify-center">
            <img 
              src="/humint_icon.png" 
              alt="HUMINT"
              className="w-4 h-4"
            />
          </div>
          <div className="bg-white rounded-xl shadow-sm p-3 flex-1">
            <p className="text-xs text-gray-600">
              Based on our interviews, there are several key differences...
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // Then update MobileFeaturesSection to use these components
  const MobileFeaturesSection = () => {
    const [activeFeature, setActiveFeature] = useState(0);
    const containerRef = useRef(null);

    const features = [
      {
        id: 'feature1',
        icon: '📚',
        title: 'Proprietary Expert Knowledge Base',
        description: 'Every response is powered by real insights from our database of 200+ banker interviews.',
        component: MobileDatabaseAnimation  // Updated reference
      },
      {
        id: 'feature2',
        icon: '🎯',
        title: 'Target Persona Matching',
        description: 'Get personalized advice based on your background and goals, ensuring relevant guidance for your specific situation.',
        component: MobilePersonaAnimation  // Updated reference
      },
      {
        id: 'feature3',
        icon: '💬',
        title: 'Interactive Follow-ups',
        description: 'Keep the conversation going with AI-powered suggestions and follow-ups based on what you ask.',
        component: MobileChatAnimation  // Updated reference
      }
    ];

    // Handle scroll events to update active feature
    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      const handleScroll = () => {
        const scrollPosition = container.scrollLeft;
        const cardWidth = container.offsetWidth;
        const newActiveFeature = Math.round(scrollPosition / cardWidth);
        setActiveFeature(newActiveFeature);
      };

      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }, []);

    return (
      <section className="py-6 bg-white">
        <h2 className="text-lg font-semibold text-center mb-4">
          Why Choose humint
        </h2>
        
        {/* Feature Cards with Animations */}
        <div 
          ref={containerRef}
          className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar"
          style={{ scrollBehavior: 'smooth' }}
        >
          {features.map((feature, index) => (
            <div 
              key={index}
              className="snap-center w-full flex-shrink-0"
            >
              <div className="px-4">
                {/* Animation Container */}
                {index === 0 && <MobileDatabaseAnimation />}
                {index === 1 && <MobilePersonaAnimation />}
                {index === 2 && <MobileChatAnimation />}
                
                {/* Feature Text */}
                <div className="text-center mt-4">
                  <h3 className="text-base font-medium mb-1">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center space-x-2 mt-6">
          {features.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                activeFeature === index ? 'bg-[#4AA3DF]' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </section>
    );
  };

  // Add a new function for mobile scrolling
  const startMobileScrolling = () => {
    const slider = mobileSliderRef.current;
    if (slider) {
      if (mobileScrollIntervalRef.current) {
        clearInterval(mobileScrollIntervalRef.current);
      }
      
      mobileScrollIntervalRef.current = setInterval(() => {
        if (slider.scrollLeft + slider.clientWidth >= slider.scrollWidth) {
          slider.scrollLeft = 0;
        } else {
          slider.scrollLeft += 1;
        }
      }, 30);
    }
  };

  // Update the MobileInstitutionsSection component
  const MobileInstitutionsSection = () => {
    useEffect(() => {
      startMobileScrolling();
      
      return () => {
        if (mobileScrollIntervalRef.current) {
          clearInterval(mobileScrollIntervalRef.current);
        }
      };
    }, []);

    useEffect(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              startMobileScrolling();
            }
          });
        },
        { threshold: 0.1 }
      );

      if (mobileSliderRef.current) {
        observer.observe(mobileSliderRef.current);
      }

      return () => {
        if (mobileSliderRef.current) {
          observer.unobserve(mobileSliderRef.current);
        }
      };
    }, []);

    return (
      <section className="px-4 py-8 bg-gray-50">
        <h2 className="text-lg font-semibold text-center mb-4">
          Expert Insights from Top Institutions
        </h2>
        
        {/* Scrolling Logos Container */}
        <div className="relative overflow-hidden py-4 bg-white rounded-xl shadow-sm mb-6">
          {/* Gradient Overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white to-transparent z-10"></div>
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent z-10"></div>
          
          {/* Scrolling Logos */}
          <div 
            ref={mobileSliderRef}
            className="flex space-x-8 overflow-x-hidden whitespace-nowrap px-4"
          >
            <div className="flex items-center space-x-8">
              {[
                { src: '/logos/Duke.png', alt: 'Duke', width: 'min-w-[100px]' },
                { src: '/logos/Wharton.png', alt: 'Wharton', width: 'min-w-[150px]' },
                { src: '/logos/GS.png', alt: 'Goldman Sachs', width: 'min-w-[100px]' },
                { src: '/logos/JPM.png', alt: 'JP Morgan', width: 'min-w-[175px]' },
                { src: '/logos/BofA.png', alt: 'Bank of America', width: 'min-w-[100px]' },
                { src: '/logos/Evercore.png', alt: 'Evercore', width: 'min-w-[200px]' },
                { src: '/logos/Foros.png', alt: 'Foros', width: 'min-w-[100px]' }
              ].map((logo, i) => (
                <div key={i} className={`inline-flex flex-col items-center ${logo.width}`}>
                  <img 
                    src={logo.src} 
                    alt={logo.alt}
                    className="h-8 w-auto grayscale hover:grayscale-0 transition-all"
                  />
                </div>
              ))}
              {/* Duplicate logos for continuous scroll */}
              {[
                { src: '/logos/Duke.png', alt: 'Duke', width: 'min-w-[100px]' },
                { src: '/logos/Wharton.png', alt: 'Wharton', width: 'min-w-[150px]' },
                { src: '/logos/GS.png', alt: 'Goldman Sachs', width: 'min-w-[100px]' },
                { src: '/logos/JPM.png', alt: 'JP Morgan', width: 'min-w-[175px]' },
                { src: '/logos/BofA.png', alt: 'Bank of America', width: 'min-w-[100px]' },
                { src: '/logos/Evercore.png', alt: 'Evercore', width: 'min-w-[200px]' },
                { src: '/logos/Foros.png', alt: 'Foros', width: 'min-w-[100px]' }
              ].map((logo, i) => (
                <div key={`duplicate-${i}`} className={`inline-flex flex-col items-center ${logo.width}`}>
                  <img 
                    src={logo.src} 
                    alt={logo.alt}
                    className="h-8 w-auto grayscale hover:grayscale-0 transition-all"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats in a row */}
        <div className="grid grid-cols-3 gap-2 px-2">
          <div className="text-center">
            <div className="text-xl font-bold text-[#4AA3DF]">200+</div>
            <div className="text-xs text-gray-600">Interviews</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-[#4AA3DF]">15+</div>
            <div className="text-xs text-gray-600">Universities</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-[#4AA3DF]">15+</div>
            <div className="text-xs text-gray-600">Banks</div>
          </div>
        </div>
      </section>
    );
  };

  // Add a simplified mobile CTA section
  const MobileCTASection = () => (
    <section className="px-4 py-8 bg-gray-50">
      <div className="text-center">
        <h2 className="text-lg font-semibold mb-3">Ready to Get Started?</h2>
        <p className="text-sm text-gray-600 mb-4">
          Join the waitlist to be among the first to experience humint
        </p>
        
        <form 
          onSubmit={handleEmailSubmit}  // Use the same handler as desktop version
          className="space-y-3"
        >
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            className="w-full px-4 py-2.5 rounded-lg bg-white border border-gray-200 outline-none text-sm text-gray-800 placeholder-gray-400"
            required
          />
          <button 
            type="submit"
            className="w-full px-4 py-2.5 bg-[#4AA3DF] text-white rounded-lg font-medium text-sm"
          >
            Join Waitlist
          </button>
        </form>
      </div>
    </section>
  );

  // Add this CSS to hide scrollbar but keep functionality
  const styles = `
    .hide-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
    .hide-scrollbar::-webkit-scrollbar {
      display: none;
    }
  `;

  if (isMobile) {
    return (
      <div className="min-h-screen bg-white">
        <style>{styles}</style>
        
        {/* Mobile Navigation */}
        <nav className="px-4 py-3 border-b border-gray-100 bg-white">
          <div className="flex justify-between items-center">
            <img 
              src="/humint_logo.png" 
              alt="HUMINT"
              className="h-6 w-auto"
            />
          </div>
        </nav>

        <MobileHeroSection />
        <MobileDemoAnimation />
        <MobileFeaturesSection />
        <MobileInstitutionsSection />
        <MobileCTASection />
        
        {/* Mobile Footer */}
        <footer className="px-4 py-6 bg-gray-50 border-t border-gray-100">
          <div className="text-center text-xs text-gray-600">
            <p>© 2024 Humint. All rights reserved.</p>
          </div>
        </footer>
      </div>
    );
  }

  // Return the existing desktop version exactly as is
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      {/* Navigation */}
      <nav className="px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <img 
            src="/humint_logo.png" 
            alt="HUMINT"
            className="h-8 w-auto"
          />
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          {/* Text Content */}
          <div className="text-center max-w-4xl mx-auto mb-12">
            <h1 className="text-6xl font-bold text-gray-900 mb-6">
              We Interviewed 200+ Bankers 
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4AA3DF] to-[#3182a8]">
                So You Don't Have To
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
            Stop guessing in recruiting. Get AI-powered answers by real people at top investment banks.
            </p>
            
            {/* New Email Form */}
            <div className="max-w-md mx-auto">
              <form 
                onSubmit={handleEmailSubmit}
                className="flex items-center gap-3 bg-white rounded-full p-1 border-2 border-[#4AA3DF]/20"
              >
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 bg-transparent outline-none text-gray-800 placeholder-gray-400"
                  required
                />
                <button 
                  type="submit"
                  className="px-6 py-2 bg-[#4AA3DF] text-white rounded-full hover:bg-[#3182a8] transition-colors text-base font-medium whitespace-nowrap"
                >
                  Join Waitlist
                </button>
              </form>
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
            Join the waitlist to be among the first to experience humint
          </p>
          
          <div className="max-w-md mx-auto">
            <form 
              onSubmit={handleEmailSubmit}
              className="flex items-center gap-3 bg-white rounded-full p-1 border-2 border-[#4AA3DF]/20"
            >
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-transparent outline-none text-gray-800 placeholder-gray-400"
                required
              />
              <button 
                type="submit"
                className="px-6 py-2 bg-[#4AA3DF] text-white rounded-full hover:bg-[#3182a8] transition-colors text-base font-medium whitespace-nowrap"
              >
                Join Waitlist
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto text-center text-gray-600">
          <p>© 2024 Humint. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;

