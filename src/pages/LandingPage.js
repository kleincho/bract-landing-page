import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/animations.css';
import { API_URL } from '../services/config';
import { isMobile } from 'react-device-detect';
import { supabase } from '../lib/supabaseClient';

function LandingPage() {
  const sliderRef = useRef(null);
  const scrollIntervalRef = useRef(null);
  const [activeFeature, setActiveFeature] = useState('feature1');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
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
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    const formData = new FormData(e.target);
    const email = formData.get('email');

    if (!email) {
      setErrorMessage('Please enter your email address');
      setIsSubmitting(false);
      return;
    }

    try {
      const { error } = await supabase
        .from('landing-page-waitlist')
        .insert([
          { 
            email,
            created_at: new Date().toISOString()
          }
        ]);

      if (error) throw error;

      e.target.reset();
      setSuccessMessage('Successfully joined the waitlist!');
      navigate('/confirmation', { state: { email } });
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage(error.message || 'Failed to join waitlist. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const ProblemSection = () => (
    <section className="px-6 py-20 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-16 text-gray-900">
          The <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#103F31] to-[#176a50]">Problem</span> We're Solving
        </h2>
        
        <div className="flex items-center justify-center space-x-16 mb-12">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 flex items-center justify-center">
              <svg className="w-12 h-12 text-[#103F31]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-600 mt-2">Field</span>
          </div>

          <div className="flex-1 max-w-[200px] relative">
            <div className="absolute inset-0 flex items-center">
              <div className="absolute left-4 right-4 h-1 bg-gray-500"></div>
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-sm font-medium text-gray-600">Disconnect</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-16 h-16 flex items-center justify-center">
              <svg className="w-12 h-12 text-[#103F31]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-600 mt-2">Operations</span>
          </div>
        </div>

        <div className="max-w-3xl mx-auto text-center space-y-4">
          <p className="text-xl text-gray-600">
            Field data gets buried in PDFs and spreadsheets.
          </p>
          <p className="text-xl font-semibold text-gray-900">
            Operations can't see what's really happening — until it's too late.
          </p>
        </div>
      </div>
    </section>
  );

  const ExpertSection = () => (
    <section className="px-6 py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">
          Expert Insights from Top Institutions
        </h2>
        <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
          Our interviews feature professionals and students from leading institutions
        </p>

        <div className="relative overflow-hidden py-8 bg-white rounded-xl shadow-sm">
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10"></div>
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10"></div>
          
          <div 
            ref={sliderRef}
            className="flex space-x-12 overflow-x-hidden whitespace-nowrap px-12"
          >
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
              <div className="inline-flex flex-col items-center min-w-[200px]">
                <img 
                  src="/logos/Foros.png" 
                  alt="Foros"
                  className="h-12 w-auto grayscale hover:grayscale-0 transition-all"
                />
              </div>
            </div>
          </div>
        </div>

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
        title: 'Automated Task & Progress Tracking',
        description: 'Bract parses WIP schedules and daily field reports to generate and update task progress — no manual data entry required.',
        isActive: activeFeature === 'feature1'
      },
      {
        id: 'feature2',
        title: 'Built-in Cost & Revenue Engine',
        description: 'From contract value to actual cost and earned revenue, Bract keeps your numbers updated in real time so that field progress matches financial truth.',
        isActive: activeFeature === 'feature2'
      },
      {
        id: 'feature3',
        title: 'Risk Flagging & Operational Visibility',
        description: 'Bract flags anomalies like delayed tasks or underbilling risks — helping both operations and finance stay ahead of problems, not react to them.',
        isActive: activeFeature === 'feature3'
      }
    ];

    const DatabaseAnimation = () => {
      const [showCards, setShowCards] = useState(false);
      const [activeCard, setActiveCard] = useState(0);

      useEffect(() => {
        if (activeFeature === 'feature1') {
          setShowCards(false);
          setActiveCard(0);
          
          setTimeout(() => {
            setShowCards(true);
          }, 500);

          const cardInterval = setInterval(() => {
            setActiveCard(prev => (prev + 1) % 4);
          }, 1500);

          return () => clearInterval(cardInterval);
        }
      }, [activeFeature]);

      const tasks = [
        {
          title: "Install HVAC Units",
          progress: 75,
          status: "In Progress",
          details: "Main floor units installed, testing in progress"
        },
        {
          title: "Wire Thermostat",
          progress: 45,
          status: "Delayed",
          details: "Materials arriving next week"
        },
        {
          title: "Ductwork Setup",
          progress: 90,
          status: "Completed",
          details: "All ducts installed and sealed"
        },
        {
          title: "System Testing",
          progress: 30,
          status: "In Progress",
          details: "Pressure testing in progress"
        }
      ];

      return (
        <div className="relative w-full h-[32rem] flex items-center justify-center">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`absolute top-8 left-1/2 transform -translate-x-1/2 transition-all duration-500 ${
              showCards ? 'opacity-0 -translate-y-4' : 'opacity-100'
            }`}>
              <div className="bg-white rounded-lg shadow-lg p-4 w-48">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-[#103F31]/10 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#103F31]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">WIP Schedule</p>
                    <p className="text-xs text-gray-500">PDF</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {tasks.map((task, index) => (
                <div
                  key={index}
                  className={`bg-white rounded-lg shadow-lg p-4 w-[36rem] transform transition-all duration-500 ${
                    showCards && index <= activeCard
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-4'
                  }`}
                  style={{
                    animation: showCards && index <= activeCard ? `bounceIn 0.5s ease-out ${index * 0.2}s` : 'none'
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">{task.title}</h3>
                      <p className="text-xs text-gray-500 mt-1">{task.details}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      task.status === 'Completed' ? 'bg-[#103F31]/10 text-[#103F31]' :
                      task.status === 'Delayed' ? 'bg-red-50 text-red-600' :
                      'bg-yellow-50 text-yellow-600'
                    }`}>
                      {task.status}
                    </span>
                  </div>
                  
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#103F31] rounded-full transition-all duration-1000 ease-out"
                      style={{
                        width: showCards && index <= activeCard ? `${task.progress}%` : '0%',
                        transitionDelay: `${index * 0.2}s`
                      }}
                    />
                  </div>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-xs text-gray-500">Progress</span>
                    <span className="text-xs font-medium text-[#103F31]">{task.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    };

    const PersonaAnimation = () => {
      const [showMetrics, setShowMetrics] = useState(false);
      const [progress, setProgress] = useState(0);
      const [showDelay, setShowDelay] = useState(false);
      const [showWarnings, setShowWarnings] = useState(false);

      useEffect(() => {
        if (activeFeature === 'feature2') {
          setShowMetrics(false);
          setProgress(0);
          setShowDelay(false);
          setShowWarnings(false);

          setTimeout(() => {
            setShowMetrics(true);
            const progressInterval = setInterval(() => {
              setProgress(prev => {
                if (prev >= 65) {
                  clearInterval(progressInterval);
                  return 65;
                }
                return prev + 1;
              });
            }, 20);

            setTimeout(() => {
              setShowDelay(true);
            }, 1200);

            setTimeout(() => {
              setShowWarnings(true);
            }, 1800);

            return () => clearInterval(progressInterval);
          }, 500);
        }
      }, [activeFeature]);

      return (
        <div className="relative w-full h-[32rem] flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg p-8 w-[32rem]">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-900">HVAC Installation</h3>
                <span className="text-sm text-gray-500">Task Progress</span>
              </div>
              
              <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden mb-2">
                <div 
                  className="absolute inset-y-0 left-0 bg-[#103F31] rounded-full transition-all duration-100 ease-out"
                  style={{ width: `${progress}%` }}
                />
                
                <div 
                  className={`absolute -top-8 left-[60%] transform -translate-x-1/2 transition-all duration-500 ${
                    showDelay ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
                  }`}
                >
                  <div className="bg-red-50 text-red-600 px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap border border-red-200">
                    3 days late
                  </div>
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 -translate-y-1 rotate-45 w-2 h-2 bg-red-50 border-r border-b border-red-200"></div>
                </div>
              </div>
            </div>

            <div className={`space-y-6 transition-all duration-500 ${
              showWarnings ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium text-yellow-800">Underbilling Risk</div>
                  <div className="text-lg font-bold text-yellow-900">$12,400</div>
                </div>
                <p className="text-xs text-yellow-700">
                  Current progress exceeds billed amount by 15%
                </p>
              </div>

              <div className="bg-white border border-gray-100 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm font-medium text-gray-900">Cost Forecast</div>
                  <div className="text-sm font-medium text-red-600">+8.9%</div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center">
                    <span className="text-xs text-gray-500 mr-3 w-16">Budget</span>
                    <div className="relative flex-1 h-4 bg-gray-200 rounded-full">
                      <div className="absolute left-0 top-0 h-4 bg-gray-500 rounded-full transition-all duration-1000 ease-out" style={{ width: '70%' }}></div>
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-700">$50K</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="text-xs text-gray-500 mr-3 w-16">Forecast</span>
                    <div className="relative flex-1 h-4 bg-red-100 rounded-full">
                      <div 
                        className="absolute left-0 top-0 h-4 bg-red-500 rounded-full transition-all duration-1000 ease-out" 
                        style={{ width: showWarnings ? '82%' : '0%' }}
                      ></div>
                      <span className="absolute right-10 top-1/2 -translate-y-1/2 text-xs font-semibold text-red-700">$60K</span>
                      <span className="absolute right-2 top-1/2 -translate-y-1/2">
                        <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={`mt-8 pt-6 border-t border-gray-100 transition-all duration-500 ${
              showWarnings ? 'opacity-100' : 'opacity-0'
            }`}>
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">Risk Level</div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-sm font-medium text-red-600">High</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    };

    const ChatAnimation = () => {
      const [progress, setProgress] = useState(0);
      const [showDelay, setShowDelay] = useState(false);
      const [showWarnings, setShowWarnings] = useState(false);

      useEffect(() => {
        if (activeFeature === 'feature3') {
          setProgress(0);
          setShowDelay(false);
          setShowWarnings(false);

          setTimeout(() => {
            const progressInterval = setInterval(() => {
              setProgress(prev => {
                if (prev >= 80) {
                  clearInterval(progressInterval);
                  return 80;
                }
                return prev + 1;
              });
            }, 20);

            setTimeout(() => {
              setShowDelay(true);
            }, 1200);

            setTimeout(() => {
              setShowWarnings(true);
            }, 1800);

            return () => clearInterval(progressInterval);
          }, 500);
        }
      }, [activeFeature]);

      return (
        <div className="relative w-full h-[32rem] flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg p-8 w-[32rem]">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-900">HVAC Installation</h3>
                <span className="text-sm text-gray-500">Task Progress</span>
              </div>
              
              <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden mb-2">
                <div 
                  className="absolute inset-y-0 left-0 bg-[#103F31] rounded-full transition-all duration-100 ease-out"
                  style={{ width: `${progress}%` }}
                />
                
                <div 
                  className={`absolute -top-8 left-[60%] transform -translate-x-1/2 transition-all duration-500 ${
                    showDelay ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
                  }`}
                >
                  <div className="bg-red-50 text-red-600 px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap border border-red-200">
                    3 days late
                  </div>
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 -translate-y-1 rotate-45 w-2 h-2 bg-red-50 border-r border-b border-red-200"></div>
                </div>
              </div>
            </div>

            <div className={`space-y-6 transition-all duration-500 ${
              showWarnings ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium text-yellow-800">Underbilling Risk</div>
                  <div className="text-lg font-bold text-yellow-900">$12,400</div>
                </div>
                <p className="text-xs text-yellow-700">
                  Current progress exceeds billed amount by 15%
                </p>
              </div>

              <div className="bg-white border border-gray-100 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm font-medium text-gray-900">Cost Forecast</div>
                  <div className="text-sm font-medium text-red-600">+8.9%</div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center">
                    <span className="text-xs text-gray-500 mr-3 w-16">Budget</span>
                    <div className="relative flex-1 h-4 bg-gray-200 rounded-full">
                      <div className="absolute left-0 top-0 h-4 bg-gray-500 rounded-full transition-all duration-1000 ease-out" style={{ width: '70%' }}></div>
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-700">$50K</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="text-xs text-gray-500 mr-3 w-16">Forecast</span>
                    <div className="relative flex-1 h-4 bg-red-100 rounded-full">
                      <div 
                        className="absolute left-0 top-0 h-4 bg-red-500 rounded-full transition-all duration-1000 ease-out" 
                        style={{ width: showWarnings ? '82%' : '0%' }}
                      ></div>
                      <span className="absolute right-10 top-1/2 -translate-y-1/2 text-xs font-semibold text-red-700">$60K</span>
                      <span className="absolute right-2 top-1/2 -translate-y-1/2">
                        <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={`mt-8 pt-6 border-t border-gray-100 transition-all duration-500 ${
              showWarnings ? 'opacity-100' : 'opacity-0'
            }`}>
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">Risk Level</div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-sm font-medium text-red-600">High</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    };

    return (
      <section className="px-6 py-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-16 text-gray-900 text-center">
            Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#103F31] to-[#176a50]">Bract</span>
          </h2>
          
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="lg:w-1/2 bg-[#f5f5f4] rounded-2xl overflow-hidden">
              <div className="p-8">
                {activeFeature === 'feature1' && <DatabaseAnimation />}
                {activeFeature === 'feature2' && <PersonaAnimation />}
                {activeFeature === 'feature3' && <ChatAnimation />}
              </div>
            </div>

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
                          feature.isActive ? 'bg-[#103F31]' : 'bg-gray-200'
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

  const AutomationDemo = () => {
    const [phase, setPhase] = useState('upload');
    const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
      const runAnimation = () => {
        setPhase('upload');
        setIsDragging(true);
        setCursorPosition({ x: 25, y: 50 });
        
        setTimeout(() => {
          const startTime = Date.now();
          const duration = 1500;
          
          const animateCursor = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const easeProgress = progress < 0.5
              ? 4 * progress * progress * progress
              : 1 - Math.pow(-2 * progress + 2, 3) / 2;
            
            const x = 25 + (50 * easeProgress);
            setCursorPosition({ x, y: 50 });
            
            if (progress < 1) {
              requestAnimationFrame(animateCursor);
            } else {
              setPhase('processing');
              setIsDragging(false);
              
              setTimeout(() => {
                setPhase('insights');
                
                setTimeout(() => {
                  runAnimation();
                }, 5000);
              }, 1500);
            }
          };
          
          requestAnimationFrame(animateCursor);
        }, 1500);
      };
      
      runAnimation();
    }, []);

    return (
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
        <div className="p-8">
          <div className="relative h-[500px] flex items-center justify-center">
            
            {phase === 'upload' && (
              <div className="w-full h-full flex items-center justify-between">
                <div className="w-1/2 flex justify-center">
                  <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 max-w-sm">
                    <div className="flex items-center space-x-3 mb-4">
                      <svg className="w-8 h-8 text-[#103F31]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900">Daily Field Report</h3>
                        <p className="text-xs text-gray-500">May 26, 2025</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-left">
                      <div className="flex items-start">
                        <span className="text-red-500 mr-2 mt-1 text-xs">•</span>
                        <p className="text-xs text-gray-700">Insulate ductwork delayed due to missing material</p>
                      </div>
                      <div className="flex items-start">
                        <span className="text-red-500 mr-2 mt-1 text-xs">•</span>
                        <p className="text-xs text-gray-700">Projected completion pushed back by 3 days</p>
                      </div>
                      <div className="flex items-start">
                        <span className="text-yellow-500 mr-2 mt-1 text-xs">•</span>
                        <p className="text-xs text-gray-700">Spent $9,000 on unplanned sealant delivery</p>
                      </div>
                      <div className="flex items-start">
                        <span className="text-gray-400 mr-2 mt-1 text-xs">•</span>
                        <p className="text-xs text-gray-700">No update on thermostat wiring</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="w-1/2 flex justify-center">
                  <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ease-out w-64 h-48 flex flex-col items-center justify-center ${
                    isDragging && cursorPosition.x > 60 ? 'border-[#103F31] bg-[#103F31]/8 shadow-lg' : 'border-gray-300'
                  }`}>
                    <svg className={`w-12 h-12 mb-4 transition-all duration-200 ease-out ${
                      isDragging && cursorPosition.x > 60 ? 'text-[#103F31] scale-110' : 'text-gray-400'
                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <h3 className={`text-lg font-medium mb-2 transition-colors duration-200 ${
                      isDragging && cursorPosition.x > 60 ? 'text-[#103F31]' : 'text-gray-900'
                    }`}>Drop report here</h3>
                    <p className="text-sm text-gray-500">Upload your daily field report</p>
                  </div>
                </div>

                {isDragging && (
                  <div 
                    className="absolute pointer-events-none z-50"
                    style={{
                      left: `${cursorPosition.x}%`,
                      top: `${cursorPosition.y}%`,
                      transform: 'translate(-50%, -50%)',
                      transition: 'all 0.05s ease-out'
                    }}
                  >
                    <div className="relative">
                      <div className="absolute inset-0 translate-x-0.5 translate-y-0.5">
                        <svg className="w-6 h-6 text-gray-300 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                        </svg>
                      </div>
                      <svg className="w-6 h-6 text-gray-700 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            )}

            {phase === 'processing' && (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <div className="w-3 h-3 bg-[#103F31] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-3 h-3 bg-[#103F31] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-3 h-3 bg-[#103F31] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                  <p className="text-lg font-medium text-[#103F31]">Bract is processing your file...</p>
                </div>
              </div>
            )}

            {phase === 'insights' && (
              <div className="w-full relative">
                <div className="grid grid-cols-[1fr_120px_1fr] gap-6">
                  <div className="col-start-1 row-start-1 bg-white rounded-xl p-4 border border-[#103F31]/10 shadow-lg w-full h-56 flex flex-col justify-between">
                    <h3 className="text-sm font-medium text-gray-900 mb-1">✅ 64% complete</h3>
                    <p className="text-xs text-gray-600 mb-2">11 of 17 total tasks parsed from the report</p>
                    <span className="text-2xl font-bold text-[#103F31]">64%</span>
                    <div className="relative w-28 h-28 flex-shrink-0 flex items-center justify-end mx-auto mt-2">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" fill="none" stroke="#E5E7EB" strokeWidth="10" />
                        <circle 
                          cx="50" 
                          cy="50" 
                          r="40" 
                          fill="none" 
                          stroke="#103F31" 
                          strokeWidth="8"
                          strokeDasharray="251"
                          strokeDashoffset="90"
                          className="transition-all duration-1000 ease-out"
                        />
                      </svg>
                    </div>
                  </div>

                  <div className="col-start-3 row-start-1 bg-yellow-50 rounded-xl p-4 border border-yellow-200 shadow-lg w-full h-56 flex flex-col justify-between">
                    <h3 className="text-sm font-medium text-yellow-800 mb-3">⚠️ You're underbilling by $12,400</h3>
                    <p className="text-xs text-yellow-700 mb-1">Based on 64% actual completion vs. 48% recognized revenue</p>
                    <div className="text-xl font-bold text-yellow-900 mb-1">$12,400</div>
                    <div className="mt-0 flex items-end space-x-4">
                      <div className="flex-1 flex flex-col items-center">
                        <div className="w-full bg-yellow-50 rounded-t flex items-end" style={{height: '64px'}}>
                          <div className="w-full bg-yellow-500 rounded-t transition-all duration-1000 ease-out" style={{height: '64%'}}></div>
                        </div>
                        <div className="text-xs text-yellow-700 mt-0 font-medium">Actual</div>
                        <div className="text-xs text-yellow-800 font-bold mb-0">64%</div>
                      </div>
                      <div className="flex-1 flex flex-col items-center">
                        <div className="w-full bg-yellow-50 rounded-t flex items-end" style={{height: '64px'}}>
                          <div className="w-full bg-yellow-600 rounded-t transition-all duration-1000 ease-out" style={{height: '48%'}}></div>
                        </div>
                        <div className="text-xs text-yellow-700 mt-0 font-medium">Billed</div>
                        <div className="text-xs text-yellow-800 font-bold mb-0">48%</div>
                      </div>
                    </div>
                  </div>

                  <div className="col-start-1 row-start-2 bg-red-50 rounded-xl p-4 border border-red-200 shadow-lg w-full h-56 flex flex-col justify-between">
                    <h3 className="text-sm font-medium text-red-800 mb-4">🕒 "Insulate ductwork" is 3 days late</h3>
                    <div className="flex items-center justify-between gap-x-2 my-2 px-1">
                      <div className="w-9 h-9 rounded bg-[#16a34a] border-2 border-white"></div>
                      <div className="w-9 h-9 rounded bg-[#16a34a] border-2 border-white"></div>
                      <div className="w-9 h-9 rounded bg-[#E5E7EB] border-2 border-white"></div>
                      <div className="w-9 h-9 rounded bg-[#DC2626] border-2 border-white"></div>
                      <div className="w-9 h-9 rounded bg-[#DC2626] border-2 border-white"></div>
                      <div className="w-9 h-9 rounded bg-[#DC2626] border-2 border-white"></div>
                      <div className="w-9 h-9 rounded bg-[#E5E7EB] border-2 border-white"></div>
                    </div>
                    <div className="mt-1 flex flex-col items-center">
                      <span className="text-sm text-gray-500 mb-1 font-medium">Last 7 days</span>
                      <span className="text-base text-red-700 text-center font-semibold">3 delayed days detected — task is at risk</span>
                    </div>
                  </div>

                  <div className="col-start-3 row-start-2 bg-red-50 rounded-xl p-4 border border-red-200 shadow-lg w-full h-56 flex flex-col justify-between">
                    <div className="flex items-center space-x-3 mb-2">
                      <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <h3 className="text-lg font-bold text-red-800"> $8,900 over budget </h3>
                    </div>
                    <p className="text-xs text-red-700 mb-4">If material delay continues 3+ days</p>
                    <div className="space-y-3 mt-2">
                      <div className="flex items-center">
                        <span className="text-xs text-gray-500 mr-2 w-14">Budget</span>
                        <div className="relative flex-1 h-4 bg-gray-200 rounded-full">
                          <div className="absolute left-0 top-0 h-4 bg-gray-500 rounded-full" style={{ width: '70%' }}></div>
                          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-700">$50K</span>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className="text-xs text-gray-500 mr-2 w-14">Forecast</span>
                        <div className="relative flex-1 h-4 bg-red-100 rounded-full">
                          <div className="absolute left-0 top-0 h-4 bg-red-500 rounded-full" style={{ width: '82%' }}></div>
                          <span className="absolute right-14 top-1/2 -translate-y-1/2 text-xs font-semibold text-red-700">$60K</span>
                          <span className="absolute right-2 top-1/2 -translate-y-1/2">
                            <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center justify-center" style={{width: '120px', height: '120px'}}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg width="150" height="150" viewBox="0 0 150 150">
                      <circle cx="75" cy="75" r="67.5" fill="none" stroke="#103F31" strokeWidth="2.5" />
                    </svg>
                  </div>
                  <div className="flex flex-col items-center justify-center w-full h-full">
                    <svg className="w-12 h-12 text-[#103F31] mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <div className="text-xs font-semibold text-gray-900 text-center">
                      <div>Daily Field</div>
                      <div>Report</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const MobileHeroSection = () => (
    <section className="px-4 py-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          <span className="whitespace-nowrap">Sync HVAC field and operations</span>
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#103F31] to-[#176a50]">
            Instantly
          </span>
        </h1>
        <p className="text-base text-gray-600 mb-6">
            No more manual updates. Bract automatically turns field reports into real-time progress, cost, and billing insights.
        </p>
        
        <form 
          onSubmit={handleEmailSubmit}
          className="space-y-3"
        >
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            className="w-full px-4 py-2.5 rounded-lg bg-white border border-gray-200 outline-none text-sm text-gray-800 placeholder-gray-400"
            required
            disabled={isSubmitting}
          />
          <button 
            type="submit"
            className="w-full px-4 py-2.5 bg-[#103F31] text-white rounded-lg font-medium text-sm hover:bg-[#176a50] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Joining...' : 'Join Waitlist'}
          </button>
          {errorMessage && (
            <div className="text-red-500 text-sm">{errorMessage}</div>
          )}
          {successMessage && (
            <div className="text-green-500 text-sm">{successMessage}</div>
          )}
        </form>
      </div>
    </section>
  );

  const MobileDemoAnimation = () => {
    const [phase, setPhase] = useState('upload');
    const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
      const runAnimation = () => {
        setPhase('upload');
        setIsDragging(true);
        setCursorPosition({ x: 25, y: 50 });
        
        setTimeout(() => {
          const startTime = Date.now();
          const duration = 1500;
          
          const animateCursor = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const easeProgress = progress < 0.5
              ? 4 * progress * progress * progress
              : 1 - Math.pow(-2 * progress + 2, 3) / 2;
            
            const x = 25 + (50 * easeProgress);
            setCursorPosition({ x, y: 50 });
            
            if (progress < 1) {
              requestAnimationFrame(animateCursor);
            } else {
              setPhase('processing');
              setIsDragging(false);
              
              setTimeout(() => {
                setPhase('insights');
                
                setTimeout(() => {
                  runAnimation();
                }, 5000);
              }, 1500);
            }
          };
          
          requestAnimationFrame(animateCursor);
        }, 1500);
      };
      
      runAnimation();
    }, []);

    return (
      <div className="mx-4 mb-6">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
          <div className="p-4">
            <div className="relative h-[300px] flex items-center justify-center">
              
              {phase === 'upload' && (
                <div className="w-full h-full flex items-center justify-between">
                  <div className="w-1/2 flex justify-center">
                    <div className="bg-white rounded-lg shadow-md p-3 border border-gray-200 max-w-[140px]">
                      <div className="flex items-center space-x-2 mb-2">
                        <svg className="w-4 h-4 text-[#103F31]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <div>
                          <h3 className="text-xs font-semibold text-gray-900">Daily Report</h3>
                          <p className="text-[10px] text-gray-500">May 26, 2025</p>
                        </div>
                      </div>
                      
                      <div className="space-y-1 text-left">
                        <div className="flex items-start">
                          <span className="text-red-500 mr-1 mt-0.5 text-[8px]">•</span>
                          <p className="text-[8px] text-gray-700">Ductwork delayed</p>
                        </div>
                        <div className="flex items-start">
                          <span className="text-yellow-500 mr-1 mt-0.5 text-[8px]">•</span>
                          <p className="text-[8px] text-gray-700">$9K unplanned cost</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="w-1/2 flex justify-center">
                    <div className={`border-2 border-dashed rounded-xl p-4 text-center transition-all duration-200 ease-out w-32 h-24 flex flex-col items-center justify-center ${
                      isDragging && cursorPosition.x > 60 ? 'border-[#103F31] bg-[#103F31]/8' : 'border-gray-300'
                    }`}>
                      <svg className={`w-6 h-6 mb-1 transition-all duration-200 ease-out ${
                        isDragging && cursorPosition.x > 60 ? 'text-[#103F31]' : 'text-gray-400'
                      }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="text-[10px] text-gray-500">Drop here</p>
                    </div>
                  </div>

                  {isDragging && (
                    <div 
                      className="absolute pointer-events-none z-50"
                      style={{
                        left: `${cursorPosition.x}%`,
                        top: `${cursorPosition.y}%`,
                        transform: 'translate(-50%, -50%)',
                        transition: 'all 0.05s ease-out'
                      }}
                    >
                      <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5" />
                      </svg>
                    </div>
                  )}
                </div>
              )}

              {phase === 'processing' && (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 mb-3">
                      <div className="w-2 h-2 bg-[#103F31] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-[#103F31] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-[#103F31] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                    <p className="text-sm font-medium text-[#103F31]">Bract is processing...</p>
                  </div>
                </div>
              )}

              {phase === 'insights' && (
                <div className="w-full relative">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-white rounded-lg p-3 border border-[#103F31]/10 shadow-sm h-24 flex flex-col justify-between">
                      <h3 className="text-[10px] font-medium text-gray-900">✅ 64% complete</h3>
                      <span className="text-lg font-bold text-[#103F31]">64%</span>
                    </div>

                    <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200 shadow-sm h-24 flex flex-col justify-between">
                      <h3 className="text-sm font-medium text-yellow-800">⚠️ Underbilling</h3>
                      <span className="text-lg font-bold text-yellow-900">$12,400</span>
                    </div>

                    <div className="bg-red-50 rounded-lg p-3 border border-red-200 shadow-sm h-24 flex flex-col justify-between">
                      <h3 className="text-sm font-medium text-red-800">🕒 3 days late</h3>
                      <span className="text-xs text-red-700 font-semibold">At risk</span>
                    </div>

                    <div className="bg-red-50 rounded-lg p-3 border border-red-200 shadow-sm h-24 flex flex-col justify-between">
                      <h3 className="text-sm font-medium text-red-800">🔺 Over budget</h3>
                      <span className="text-lg font-bold text-red-800">$8,900</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const MobileProblemSection = () => (
    <section className="px-4 py-8 bg-white">
      <div className="max-w-md mx-auto">
        <h2 className="text-lg font-semibold text-center mb-8 text-gray-900">
          The <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#103F31] to-[#176a50]">Problem</span> We're Solving
        </h2>
        
        <div className="flex items-center justify-center space-x-8 mb-8">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 flex items-center justify-center">
              <svg className="w-8 h-8 text-[#103F31]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
              </svg>
            </div>
            <span className="text-xs font-medium text-gray-600 mt-1">Field</span>
          </div>

          <div className="flex-1 max-w-[100px] relative">
            <div className="absolute inset-0 flex items-center">
              <div className="absolute left-2 right-2 h-0.5 bg-gray-500"></div>
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-medium text-gray-600">Disconnect</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 flex items-center justify-center">
              <svg className="w-8 h-8 text-[#103F31]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <span className="text-xs font-medium text-gray-600 mt-1">Operations</span>
          </div>
        </div>

        <div className="text-center space-y-3">
          <p className="text-base text-gray-600">
            Field data gets buried in PDFs and spreadsheets.
          </p>
          <p className="text-base font-semibold text-gray-900">
            Operations can't see what's really happening — until it's too late.
          </p>
        </div>
      </div>
    </section>
  );

  const MobileFeaturesSection = () => {
    const [activeFeature, setActiveFeature] = useState(0);
    const containerRef = useRef(null);

    const features = [
      {
        id: 'feature1',
        title: 'Automated Task & Progress Tracking',
        description: 'Bract parses WIP schedules and daily field reports to generate and update task progress — no manual data entry required.',
      },
      {
        id: 'feature2',
        title: 'Built-in Cost & Revenue Engine',
        description: 'From contract value to actual cost and earned revenue, Bract keeps your numbers updated in real time so that field progress matches financial truth.',
      },
      {
        id: 'feature3',
        title: 'Risk Flagging & Operational Visibility',
        description: 'Bract flags anomalies like delayed tasks or underbilling risks — helping both operations and finance stay ahead of problems, not react to them.',
      }
    ];

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

    const MobileDatabaseAnimation = () => (
      <div className="relative w-full h-[160px] flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-sm p-3 w-[280px] scale-[0.8]">
          <div className="space-y-2">
            <div className="bg-white rounded-lg shadow-sm p-3 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-medium text-gray-900">Install HVAC Units</h3>
                <span className="text-xs px-2 py-1 rounded-full bg-[#103F31]/10 text-[#103F31]">In Progress</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#103F31] rounded-full w-3/4 transition-all duration-1000"></div>
              </div>
              <div className="mt-1 flex justify-between items-center">
                <span className="text-xs text-gray-500">Progress</span>
                <span className="text-xs font-medium text-[#103F31]">75%</span>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-3 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-medium text-gray-900">Wire Thermostat</h3>
                <span className="text-xs px-2 py-1 rounded-full bg-red-50 text-red-600">Delayed</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-red-500 rounded-full w-1/2 transition-all duration-1000"></div>
              </div>
              <div className="mt-1 flex justify-between items-center">
                <span className="text-xs text-gray-500">Progress</span>
                <span className="text-xs font-medium text-red-600">45%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );

    const MobilePersonaAnimation = () => (
      <div className="relative w-full h-[160px] flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-sm p-4 w-[280px] scale-[0.8]">
          <div className="relative w-24 h-24 mx-auto mb-4">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#E5E7EB" strokeWidth="8" />
              <circle 
                cx="50" 
                cy="50" 
                r="40" 
                fill="none" 
                stroke="#103F31" 
                strokeWidth="8"
                strokeDasharray="251"
                strokeDashoffset="90"
                transform="rotate(-90 50 50)"
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold text-[#103F31]">65%</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-600">Earned Revenue</div>
              <div className="text-sm font-bold text-[#103F31]">$82,000</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-600">Actual Cost</div>
              <div className="text-sm font-bold text-[#103F31]">$63,000</div>
            </div>
          </div>
        </div>
      </div>
    );

    const MobileChatAnimation = () => (
      <div className="relative w-full h-[160px] flex items-center justify-center">
        <div className="w-[280px] scale-[0.8]">
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-medium text-gray-900">HVAC Installation</h3>
                <span className="text-xs text-gray-500">Progress</span>
              </div>
              <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
                <div className="absolute inset-y-0 left-0 bg-[#103F31] rounded-full w-4/5 transition-all duration-1000"></div>
                <div className="absolute top-0 left-3/5 transform -translate-x-1/2 -translate-y-full">
                  <div className="bg-red-50 text-red-600 px-2 py-1 rounded-full text-[10px] font-medium whitespace-nowrap">
                    3 days late
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-2">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-medium text-yellow-800">Underbilling Risk</div>
                  <div className="text-sm font-bold text-yellow-900">$12,400</div>
                </div>
              </div>
              
              <div className="bg-red-50 border border-red-100 rounded-lg p-2">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-medium text-red-800">Cost Overrun</div>
                  <div className="text-sm font-bold text-red-800">$8,900</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );

    return (
      <section className="py-8 bg-white">
        <h2 className="text-lg font-semibold text-center mb-6 px-4">
          Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#103F31] to-[#176a50]">Bract</span>
        </h2>
        
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
                {index === 0 && <MobileDatabaseAnimation />}
                {index === 1 && <MobilePersonaAnimation />}
                {index === 2 && <MobileChatAnimation />}
                
                <div className="text-center mt-4">
                  <h3 className="text-base font-medium mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600 px-2">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center space-x-2 mt-6">
          {features.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                activeFeature === index ? 'bg-[#103F31]' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </section>
    );
  };

  const MobileCTASection = () => (
    <section className="px-4 py-8 bg-[#f0fdfa]">
      <div className="text-center">
        <h2 className="text-lg font-semibold mb-3">Ready to Get Started?</h2>
        <p className="text-sm text-gray-600 mb-4">
          Join the waitlist to be among the first to experience Bract
        </p>
        
        <form 
          onSubmit={handleEmailSubmit}
          className="space-y-3"
        >
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            className="w-full px-4 py-2.5 rounded-lg bg-white border border-gray-200 outline-none text-sm text-gray-800 placeholder-gray-400"
            required
            disabled={isSubmitting}
          />
          <button 
            type="submit"
            className="w-full px-4 py-2.5 bg-[#103F31] text-white rounded-lg font-medium text-sm hover:bg-[#176a50] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Joining...' : 'Join Waitlist'}
          </button>
          {errorMessage && (
            <div className="text-red-500 text-sm">{errorMessage}</div>
          )}
          {successMessage && (
            <div className="text-green-500 text-sm">{successMessage}</div>
          )}
        </form>
      </div>
    </section>
  );

  const styles = `
    .hide-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
    .hide-scrollbar::-webkit-scrollbar {
      display: none;
    }

    @keyframes bounceIn {
      0% {
        opacity: 0;
        transform: translateY(20px);
      }
      50% {
        transform: translateY(-5px);
      }
      100% {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes fade-in-up {
      0% {
        opacity: 0;
        transform: translateY(10px) scale(1);
      }
      100% {
        opacity: 1;
        transform: translateY(0) scale(1.05);
      }
    }

    .animate-fade-in-up {
      animation: fade-in-up 0.6s ease-out forwards;
    }
  `;

  if (isMobile) {
    return (
      <div className="min-h-screen bg-white">
        <style>{styles}</style>
        
        <nav className="px-4 py-3 border-b border-gray-100 bg-white">
          <div className="flex justify-between items-center">
            <img 
              src="/bract-logo-upscaled.png" 
              alt="Bract"
              className="h-8 w-auto"
            />
          </div>
        </nav>

        <MobileHeroSection />
        <MobileDemoAnimation />
        <MobileProblemSection />
        <MobileFeaturesSection />
        <MobileCTASection />
        
        <footer className="px-4 py-6 bg-gray-50 border-t border-gray-100">
          <div className="text-center text-xs text-gray-600">
            <p>© 2025 Bract. All rights reserved.</p>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0fdfa] to-white">
      <nav className="px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <img 
            src="/bract-logo-upscaled.png" 
            alt="Bract"
            className="h-10 w-auto mt-4"
          />
        </div>
      </nav>

      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-5xl mx-auto mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              <span className="whitespace-nowrap">Sync HVAC field and operations</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#103F31] to-[#176a50]">
                Instantly
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
                No more manual updates. Bract automatically turns field reports into real-time progress, cost, and billing insights.
            </p>
            
            <div className="max-w-md mx-auto">
              <form 
                onSubmit={handleEmailSubmit}
                className="flex flex-col items-center gap-3"
              >
                <div className="w-full flex items-center gap-3 bg-white rounded-full p-1 border-2 border-[#103F31]/20">
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-2 bg-transparent outline-none text-gray-800 placeholder-gray-400"
                    required
                  />
                  <button 
                    type="submit"
                    className="px-6 py-2 bg-[#103F31] text-white rounded-full hover:bg-[#176a50] transition-colors text-base font-medium whitespace-nowrap"
                  >
                    Join Waitlist
                  </button>
                </div>
              </form>
            </div>
          </div>

          <AutomationDemo />
        </div>
      </section>

      <ProblemSection />
      <FeaturesSection />

      <section className="px-6 py-20 bg-[#f0fdfa]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">Ready to Get Started?</h2>
          <p className="text-gray-600 mb-8">
            Join the waitlist to be among the first to experience Bract
          </p>
          
          <div className="max-w-md mx-auto">
            <form 
              onSubmit={handleEmailSubmit}
              className="flex flex-col items-center gap-3"
            >
              <div className="w-full flex items-center gap-3 bg-white rounded-full p-1 border-2 border-[#103F31]/20">
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 bg-transparent outline-none text-gray-800 placeholder-gray-400"
                  required
                />
                <button 
                  type="submit"
                  className="px-6 py-2 bg-[#103F31] text-white rounded-full hover:bg-[#176a50] transition-colors text-base font-medium whitespace-nowrap"
                >
                  Join Waitlist
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <footer className="px-6 py-8 bg-[#f5f5f4]">
        <div className="max-w-7xl mx-auto text-center text-gray-600">
          <p>© 2025 Bract. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage; 