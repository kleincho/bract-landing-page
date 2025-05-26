import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/animations.css';
import { API_URL } from '../services/config';
import { isMobile } from 'react-device-detect';
import { supabase } from '../lib/supabaseClient';


function LandingPage() {
  const sliderRef = useRef(null);
  const scrollIntervalRef = useRef(null);
  const mobileSliderRef = useRef(null);
  const mobileScrollIntervalRef = useRef(null);
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

      // Clear the form
      e.target.reset();
      setSuccessMessage('Successfully joined the waitlist!');
      
      // Navigate to confirmation page
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
          The Problem We're Solving
        </h2>
        
        {/* Visual Elements */}
        <div className="flex items-center justify-center space-x-12 mb-12">
          {/* Field Icon */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 flex items-center justify-center">
              <svg className="w-12 h-12 text-[#103F31]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-600 mt-2">Field</span>
          </div>

          {/* Disconnect Icon */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 flex items-center justify-center">
              <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-600 mt-2">Disconnect</span>
          </div>

          {/* Operations Icon */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 flex items-center justify-center">
              <svg className="w-12 h-12 text-[#103F31]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-600 mt-2">Operations</span>
          </div>
        </div>

        {/* Problem Description */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <p className="text-lg text-gray-600">
            HVAC teams still operate in silos — field activity lives in PDFs and spreadsheets, while operations rely on delayed manual updates.
          </p>
          <p className="text-lg text-gray-600">
            There's no real-time bridge between what's happening on-site and what's being recorded in the office.
          </p>
          <p className="text-lg text-gray-600">
            This disconnect causes slow decisions, delayed revenue recognition, and mounting risks.
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

    // Animation for Feature 1: Task Progress Animation
    const DatabaseAnimation = () => {
      const [showCards, setShowCards] = useState(false);
      const [activeCard, setActiveCard] = useState(0);

      useEffect(() => {
        if (activeFeature === 'feature1') {
          setShowCards(false);
          setActiveCard(0);
          
          // Start animation sequence
          setTimeout(() => {
            setShowCards(true);
          }, 500);

          // Animate cards in sequence
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
            {/* WIP Schedule Upload */}
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

            {/* Task Cards */}
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
                  
                  {/* Progress Bar */}
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

    // Animation for Feature 2: Cost & Revenue Engine
    const PersonaAnimation = () => {
      const [showMetrics, setShowMetrics] = useState(false);
      const [progress, setProgress] = useState(0);

      useEffect(() => {
        if (activeFeature === 'feature2') {
          setShowMetrics(false);
          setProgress(0);

          // Start animation sequence
          setTimeout(() => {
            setShowMetrics(true);
            // Animate progress from 0 to 65%
            const progressInterval = setInterval(() => {
              setProgress(prev => {
                if (prev >= 65) {
                  clearInterval(progressInterval);
                  return 65;
                }
                return prev + 1;
              });
            }, 20);

            return () => clearInterval(progressInterval);
          }, 500);
        }
      }, [activeFeature]);

      return (
        <div className="relative w-full h-[32rem] flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg p-8 w-[32rem]">
            {/* Radial Progress */}
            <div className="relative w-48 h-48 mx-auto mb-8">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#E5E7EB"
                  strokeWidth="8"
                />
                {/* Progress circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#103F31"
                  strokeWidth="8"
                  strokeDasharray="283"
                  strokeDashoffset={283 - (283 * progress) / 100}
                  transform="rotate(-90 50 50)"
                  className="transition-all duration-100 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold text-[#103F31]">{progress}%</span>
              </div>
            </div>

            {/* Financial Metrics */}
            <div className="space-y-6">
              {/* Earned Revenue */}
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">Earned Revenue</div>
                <div className="text-lg font-bold text-[#103F31]">
                  ${showMetrics ? Math.floor(52000 * (progress / 65)) : 0}
                </div>
              </div>

              {/* Actual Cost */}
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">Actual Cost</div>
                <div className="text-lg font-bold text-[#103F31]">
                  ${showMetrics ? Math.floor(49500 * (progress / 65)) : 0}
                </div>
              </div>

              {/* Cost Overrun */}
              <div className={`flex items-center justify-between transition-opacity duration-500 ${
                progress >= 50 ? 'opacity-100' : 'opacity-0'
              }`}>
                <div className="text-sm text-gray-600">Forecasted Cost Overrun</div>
                <div className="text-lg font-bold text-red-600">
                  ${showMetrics ? Math.floor(8900 * ((progress - 50) / 15)) : 0}
                </div>
              </div>

              {/* Profit Margin */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">Profit Margin</div>
                  <div className="text-lg font-bold text-[#103F31]">
                    {showMetrics ? Math.floor((52000 - 49500) * (progress / 65)) : 0}%
                  </div>
                </div>
              </div>
            </div>

            {/* Sparkline */}
            <div className="mt-8 h-16 relative">
              <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                <path
                  d={`M0,35 L20,${35 - (progress * 0.3)} L40,${35 - (progress * 0.4)} L60,${35 - (progress * 0.5)} L80,${35 - (progress * 0.6)} L100,${35 - (progress * 0.7)}`}
                  fill="none"
                  stroke="#103F31"
                  strokeWidth="2"
                  className="transition-all duration-100 ease-out"
                />
                <path
                  d={`M0,35 L20,${35 - (progress * 0.3)} L40,${35 - (progress * 0.4)} L60,${35 - (progress * 0.5)} L80,${35 - (progress * 0.6)} L100,${35 - (progress * 0.7)}`}
                  fill="url(#gradient)"
                  opacity="0.2"
                  className="transition-all duration-100 ease-out"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#103F31" />
                    <stop offset="100%" stopColor="#103F31" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>
      );
    };

    // Animation for Feature 3: Risk Flagging
    const ChatAnimation = () => {
      const [progress, setProgress] = useState(0);
      const [showDelay, setShowDelay] = useState(false);
      const [showWarnings, setShowWarnings] = useState(false);

      useEffect(() => {
        if (activeFeature === 'feature3') {
          setProgress(0);
          setShowDelay(false);
          setShowWarnings(false);

          // Start animation sequence
          setTimeout(() => {
            // Animate progress bar
            const progressInterval = setInterval(() => {
              setProgress(prev => {
                if (prev >= 80) {
                  clearInterval(progressInterval);
                  return 80;
                }
                return prev + 1;
              });
            }, 20);

            // Show delay flag at 60% progress
            setTimeout(() => {
              setShowDelay(true);
            }, 1200);

            // Show warnings after delay flag
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
            {/* Task Progress Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-900">HVAC Installation</h3>
                <span className="text-sm text-gray-500">Task Progress</span>
              </div>
              
              {/* Progress Bar */}
              <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="absolute inset-y-0 left-0 bg-[#103F31] rounded-full transition-all duration-100 ease-out"
                  style={{ width: `${progress}%` }}
                />
                
                {/* Delay Flag */}
                <div 
                  className={`absolute top-0 left-[60%] transform -translate-x-1/2 transition-all duration-500 ${
                    showDelay ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
                  }`}
                >
                  <div className="bg-red-50 text-red-600 px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap">
                    3 days late
                  </div>
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-red-50"></div>
                </div>
              </div>
            </div>

            {/* Risk Warnings */}
            <div className={`space-y-6 transition-all duration-500 ${
              showWarnings ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              {/* Underbilling Warning */}
              <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium text-yellow-800">Underbilling Risk</div>
                  <div className="text-lg font-bold text-yellow-900">$12,400</div>
                </div>
                <p className="text-xs text-yellow-700">
                  Current progress exceeds billed amount by 15%
                </p>
              </div>

              {/* Cost Forecast */}
              <div className="bg-white border border-gray-100 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm font-medium text-gray-900">Cost Forecast</div>
                  <div className="text-sm font-medium text-red-600">+8.9%</div>
                </div>
                
                {/* Trend Graph */}
                <div className="h-16 relative">
                  <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                    {/* Background line */}
                    <path
                      d="M0,35 L100,35"
                      stroke="#E5E7EB"
                      strokeWidth="1"
                      fill="none"
                    />
                    {/* Trend line */}
                    <path
                      d={`M0,35 L20,${35 - (progress * 0.2)} L40,${35 - (progress * 0.3)} L60,${35 - (progress * 0.4)} L80,${35 - (progress * 0.5)} L100,${35 - (progress * 0.6)}`}
                      stroke="#DC2626"
                      strokeWidth="2"
                      fill="none"
                      className="transition-all duration-100 ease-out"
                    />
                    {/* Trend arrow */}
                    <path
                      d="M90,20 L100,10 L100,30 Z"
                      fill="#DC2626"
                      className="transition-all duration-100 ease-out"
                      style={{
                        opacity: progress > 40 ? 1 : 0,
                        transform: `translate(${progress * 0.1}px, ${-progress * 0.3}px)`
                      }}
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Risk Summary */}
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
          <h2 className="text-3xl font-bold mb-16 text-gray-900">Why Choose Bract</h2>
          
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Visualization Area */}
            <div className="lg:w-1/2 bg-[#f5f5f4] rounded-2xl overflow-hidden">
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
    const [isProcessing, setIsProcessing] = useState(true);
    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
      const animationInterval = setInterval(() => {
        setIsProcessing(true);
        setShowContent(false);

        // Show results after processing
        setTimeout(() => {
          setIsProcessing(false);
          setShowContent(true);
        }, 1500);

      }, 6000); // Total animation cycle

      return () => clearInterval(animationInterval);
    }, []);

    return (
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
        <div className="p-8">
          {/* Main Content Area */}
          <div className="relative min-h-[200px] flex items-center justify-center">
            {/* File Preview */}
            {showContent && (
              <div className="w-full max-w-lg mx-auto transition-all duration-500">
                <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
                  {/* Report Header */}
                  <div className="border-b border-gray-200 pb-3 mb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Daily Field Report</h3>
                        <p className="text-sm text-gray-500">May 26, 2024</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-400">PDF</span>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#103F31]/10 text-[#103F31]">
                          ✓ Uploaded
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Report Content */}
                  <div className="space-y-3 text-left">
                    <div className="flex items-start">
                      <span className="text-red-500 mr-2 mt-1">•</span>
                      <p className="text-sm text-gray-700">Insulate ductwork on 2nd floor delayed due to missing material.</p>
                    </div>
                    <div className="flex items-start">
                      <span className="text-red-500 mr-2 mt-1">•</span>
                      <p className="text-sm text-gray-700">Projected completion pushed back by 3 days.</p>
                    </div>
                    <div className="flex items-start">
                      <span className="text-yellow-500 mr-2 mt-1">•</span>
                      <p className="text-sm text-gray-700">Spent $9,000 on additional sealant delivery (unplanned).</p>
                    </div>
                    <div className="flex items-start">
                      <span className="text-[#103F31] mr-2 mt-1">•</span>
                      <p className="text-sm text-gray-700">Site crew worked 8 hours. Minor rain delays.</p>
                    </div>
                    <div className="flex items-start">
                      <span className="text-gray-400 mr-2 mt-1">•</span>
                      <p className="text-sm text-gray-700">No update on thermostat wiring – likely pushed to next week.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Processing Indicator */}
            {isProcessing && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <div className="w-2 h-2 bg-[#103F31] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-[#103F31] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-[#103F31] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                  <p className="text-sm font-medium text-[#103F31]">Bract is reading your report...</p>
                </div>
              </div>
            )}
          </div>

          {/* Insights Dashboard */}
          {showContent && (
            <div className="mt-8 space-y-6 animate-fade-in">
              <div className="grid grid-cols-2 gap-6">
                {/* Project Completion - Radial Progress */}
                <div className="bg-white rounded-xl p-6 border border-[#103F31]/10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-gray-900">Project Completion</h3>
                    <span className="text-lg font-bold text-[#103F31]">64%</span>
                  </div>
                  <div className="relative w-32 h-32 mx-auto">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      {/* Background circle */}
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="#E5E7EB"
                        strokeWidth="8"
                      />
                      {/* Progress circle */}
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="#103F31"
                        strokeWidth="8"
                        strokeDasharray="283"
                        strokeDashoffset="102"
                        transform="rotate(-90 50 50)"
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold text-[#103F31]">64%</span>
                    </div>
                  </div>
                </div>

                {/* Task Delay - Timeline */}
                <div className="bg-white rounded-xl p-6 border border-red-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-red-800">Task Delay</h3>
                    <span className="text-sm text-red-600">3 days late</span>
                  </div>
                  <div className="relative h-16">
                    {/* Timeline bar */}
                    <div className="absolute inset-y-0 left-0 w-full bg-gray-100 rounded-full"></div>
                    {/* Progress */}
                    <div className="absolute inset-y-0 left-0 w-3/4 bg-[#103F31] rounded-full"></div>
                    {/* Delay marker */}
                    <div className="absolute top-0 bottom-0 left-3/4 w-0.5 bg-red-500">
                      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                        <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">"Insulate ductwork"</p>
                </div>

                {/* Underbilling - Sparkline */}
                <div className="bg-white rounded-xl p-6 border border-yellow-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-yellow-800">Underbilling Trend</h3>
                    <span className="text-lg font-bold text-yellow-900">$12,400</span>
                  </div>
                  <div className="h-20 relative">
                    {/* Sparkline */}
                    <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                      <path
                        d="M0,35 L20,30 L40,25 L60,20 L80,15 L100,10"
                        fill="none"
                        stroke="#103F31"
                        strokeWidth="2"
                      />
                      <path
                        d="M0,35 L20,30 L40,25 L60,20 L80,15 L100,10"
                        fill="url(#gradient)"
                        opacity="0.2"
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#103F31" />
                          <stop offset="100%" stopColor="#103F31" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                    </svg>
                    {/* Current value marker */}
                    <div className="absolute right-0 top-0 w-2 h-2 bg-yellow-500 rounded-full"></div>
                  </div>
                </div>

                {/* Cost Overrun - Trend */}
                <div className="bg-white rounded-xl p-6 border border-red-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-red-800">Cost Overrun Forecast</h3>
                    <span className="text-lg font-bold text-red-900">$8,900</span>
                  </div>
                  <div className="h-20 relative">
                    {/* Trend arrow */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                    {/* Background graph */}
                    <svg className="w-full h-full absolute inset-0" viewBox="0 0 100 40" preserveAspectRatio="none">
                      <path
                        d="M0,20 L20,18 L40,15 L60,12 L80,8 L100,5"
                        fill="none"
                        stroke="#FEE2E2"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          )}
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
            Sync HVAC field and operations.
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#103F31] to-[#176a50] block mt-1">
              Instantly.
            </span>
          </h1>
          <p className="text-sm text-gray-600 mb-4">
            Upload what you already have — reports, schedules, invoices. Bract reads them, extracts key metrics, and keeps both the field and accounting on the same page.
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
          {['Duke', 'Econ Major'].map((tag) => (
            <span key={tag} className="bg-emerald-50 text-emerald-600 text-[10px] px-2 py-1 rounded-full">
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
                activeFeature === index ? 'bg-emerald-500' : 'bg-gray-200'
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

  // Add this CSS to hide scrollbar but keep functionality
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
  `;

  if (isMobile) {
    return (
      <div className="min-h-screen bg-white">
        <style>{styles}</style>
        
        {/* Mobile Navigation */}
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
        <MobileFeaturesSection />
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
    <div className="min-h-screen bg-gradient-to-b from-[#f0fdfa] to-white">
      {/* Navigation */}
      <nav className="px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <img 
            src="/bract-logo-upscaled.png" 
            alt="Bract"
            className="h-10 w-auto mt-4"
          />
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          {/* Text Content */}
          <div className="text-center max-w-4xl mx-auto mb-12">
            <h1 className="text-6xl font-bold text-gray-900 mb-6">
              Sync HVAC field and operations.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#103F31] to-[#176a50]">
                Instantly.
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Upload what you already have — reports, schedules, invoices. Bract reads them, extracts key metrics, and keeps both the field and accounting on the same page.
            </p>
            
            {/* Email Form */}
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

          {/* Automation Demo */}
          <AutomationDemo />
        </div>
      </section>

      {/* Problem Section */}
      <ProblemSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* CTA Section */}
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

      {/* Footer */}
      <footer className="px-6 py-8 bg-[#f5f5f4]">
        <div className="max-w-7xl mx-auto text-center text-gray-600">
          <p>© 2024 Bract. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;

