import React, { useEffect, useState } from 'react';
import {
  FaRobot,
  FaClock,
  FaShieldAlt,
  FaBrain,
  FaPlay,
  FaHeadset,
  FaMoon,
  FaSun,
  FaSpinner,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
const InteractiveSessions = () => {
  const [isLightMode, setIsLightMode] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    createParticles();
  }, []);

  const createParticles = () => {
    const container = document.getElementById('particles');
    if (!container) return;

    const particleCount = 30;
    container.innerHTML = '';

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');

      // Random size
      const size = Math.random() * 3 + 1;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;

      // Random position
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100 + 100}%`;

      // Random animation duration
      const duration = Math.random() * 10 + 10;
      particle.style.animationDuration = `${duration}s`;

      // Random opacity
      particle.style.opacity = Math.random() * 0.7 + 0.1;

      particle.className =
        'absolute bg-white rounded-full animate-floatParticle';
      container.appendChild(particle);
    }
  };

  const startSession = () => {
    setIsStarting(true);

    setTimeout(() => {
      navigate('/avatar');
    }, 1500);
  };

  const downloadPDF = () => {
    const link = document.createElement('a');
    link.href = '/prepform.pdf';
    link.download = 'ss-prepform.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      className={`min-h-screen overflow-x-hidden relative flex items-center justify-center p-5 transition-all duration-400 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] ${
        isLightMode
          ? 'bg-gradient-to-br from-[#d8e4f0] to-[#eef2f3] text-[#2c3e50]'
          : 'bg-gradient-to-br from-[#080616] to-[#0f0c29] text-white'
      }`}
    >
      {/* Tech grid background */}
      <div
        className='absolute inset-0 w-full h-full opacity-30 transition-all duration-400 ease-[cubic-bezier(0.175,0.885,0.32,1.275)]'
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                               linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      ></div>

      {/* Particles */}
      <div
        id='particles'
        className='absolute inset-0 w-full h-full -z-10 overflow-hidden'
      ></div>

      {/* Radial gradient overlay */}
      <div
        className='absolute inset-0 w-full h-full -z-20 transition-all duration-400 ease-[cubic-bezier(0.175,0.885,0.32,1.275)]'
        style={{
          background: `radial-gradient(circle at 10% 20%, rgba(9, 127, 205, 0.15) 0%, transparent 40%),
                          radial-gradient(circle at 90% 80%, rgba(11, 55, 89, 0.15) 0%, transparent 40%)`,
        }}
      ></div>

      {/* Main container */}
      <div
        className={`relative backdrop-blur-xl rounded-3xl p-12 max-w-6xl w-full shadow-2xl overflow-hidden transition-all duration-400 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] ${
          isLightMode
            ? 'bg-white/70 border border-white/80'
            : 'bg-white/10 border border-white/20'
        }`}
      >
        {/* Shine effect */}
        <div className='absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-gradient-to-r from-transparent via-[rgba(0,201,255,0.1)] to-transparent -z-10 rotate-[30deg] animate-shine'></div>

        {/* Header */}
        <div className='flex justify-between items-center mb-8'>
          <div className='flex items-center  gap-4'>
            <img
              src='/linerlegallaw.png'
              className='w-[180px] h'
              alt='linerlegallaw'
            />

            <div
              className={`text-3xl font-bold bg-gradient-to-r from-[#097FCD] to-[#00C9FF] bg-clip-text text-transparent tracking-tight`}
            >
              Interactive Session
            </div>
          </div>

          {/* Theme toggle */}
          <div
            className={`relative w-14 h-7 rounded-full cursor-pointer transition-all duration-400 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] shadow-md flex items-center px-1 ${
              isLightMode
                ? 'bg-[#0B3759] justify-end'
                : 'bg-[#0B3759] justify-start'
            }`}
            onClick={() => setIsLightMode(!isLightMode)}
          >
            <div
              className={`absolute w-5 h-5 rounded-full transition-all duration-400 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] flex items-center justify-center ${
                isLightMode
                  ? 'left-[calc(100%-26px)] bg-yellow-400'
                  : 'left-1 bg-[#00C9FF]'
              }`}
            >
              <FaMoon
                className={`text-white text-xs absolute transition-all duration-400 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] ${
                  isLightMode ? 'opacity-0' : 'opacity-100'
                }`}
              />
              <FaSun
                className={`text-yellow-400 text-xs absolute transition-all duration-400 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] ${
                  isLightMode ? 'opacity-100' : 'opacity-0'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Content wrapper */}
        <div className='flex w-full flex-wrap gap-12'>
          {/* Left content */}
          <div className='flex-1 min-w-[300px]  w-full relative z-10'>
            <h1 className='text-4xl font-bold mb-4 relative inline-block transition-all duration-400 ease-[cubic-bezier(0.175,0.885,0.32,1.275)]'>
              Welcome to Your{' '}
              <span className='bg-gradient-to-r from-[#00C9FF] to-[#097FCD] bg-clip-text text-transparent font-bold'>
                AI-Powered
              </span>{' '}
              Intake Session
              <span className='absolute bottom-[-10px] left-0 w-20 h-1 bg-gradient-to-r from-[#00C9FF] to-[#097FCD] rounded transition-all duration-400 ease-[cubic-bezier(0.175,0.885,0.32,1.275)]'></span>
            </h1>

            <p
              className={`text-xl my-8 leading-relaxed transition-all duration-400 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] ${
                isLightMode ? 'text-[#2c3e50]/85' : 'text-white/85'
              }`}
            >
              You're about to start a quick, guided session with our advanced AI
              assistant to help us gather the necessary information securely and
              efficiently.
            </p>

            <ul className='list-none p-0 mb-10'>
              {[
                {
                  icon: <FaRobot />,
                  text: 'Powered by MeetGabbi AI Virtual Assistant',
                },
                {
                  icon: <FaClock />,
                  text: 'Only takes 5–10 minutes to complete',
                },
                {
                  icon: <FaShieldAlt />,
                  text: 'Advance encryption for your data security',
                },
                {
                  icon: <FaBrain />,
                  text: 'Intelligent analysis with no technical knowledge required',
                },
              ].map((item, index) => (
                <li
                  key={index}
                  className={`mb-5 text-lg flex items-start transition-all duration-300 ${
                    isLightMode ? 'text-[#2c3e50]/90' : 'text-white/90'
                  }`}
                  style={{
                    animation: `fadeInUp 0.5s ease-out forwards`,
                    animationDelay: `${0.2 + index * 0.2}s`,
                    opacity: 0,
                    transform: 'translateY(20px)',
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.transform = 'translateX(10px)')
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.transform = 'translateX(0)')
                  }
                >
                  <span className='flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-[#00C9FF] to-[#097FCD] mr-4 flex-shrink-0 shadow-[0_0_15px_rgba(9,127,205,0.7)]'>
                    {item.icon}
                  </span>
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
            <div className='flex gap-3'>
              <button
                className={`bg-gradient-to-br from-[#097FCD] to-[#0B3759] text-white py-4 px-10 text-xl font-semibold rounded-xl cursor-pointer transition-all duration-400 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] relative overflow-hidden shadow-lg inline-flex items-center gap-3 mt-4 ${
                  isStarting
                    ? 'opacity-80'
                    : 'hover:-translate-y-1 hover:shadow-xl active:translate-y-0.5'
                }`}
                onClick={startSession}
                disabled={isStarting}
              >
                {isStarting ? (
                  <FaSpinner className='animate-spin' />
                ) : (
                  <FaPlay />
                )}
                {isStarting ? 'Initializing...' : 'Begin Process'}
              </button>

              <button
                className={`bg-gradient-to-br from-[#097FCD] to-[#0B3759] text-white py-4 px-10 text-xl font-semibold rounded-xl cursor-pointer transition-all duration-400 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] relative overflow-hidden shadow-lg inline-flex items-center gap-3 mt-4 ${
                  isStarting
                    ? 'opacity-80'
                    : 'hover:-translate-y-1 hover:shadow-xl active:translate-y-0.5'
                }`}
                onClick={downloadPDF}
              >
                Fill Later
              </button>
            </div>
           
          </div>

          {/* Right avatar */}
          <div className='flex-1 min-w-[300px] flex items-center justify-center relative '>
            <div
              className={`w-72 h-72 rounded-full flex items-center  justify-center relative cursor-pointer transition-all duration-400 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] animate-float ${
                isStarting
                  ? 'scale-110 shadow-[0_0_0_15px_rgba(0,201,255,0.3),0_0_80px_rgba(11,55,89,0.9)]'
                  : 'hover:scale-105 shadow-[0_0_0_10px_rgba(255,255,255,0.05),0_0_50px_rgba(11,55,89,0.5)] hover:shadow-[0_0_0_12px_rgba(255,255,255,0.08),0_0_70px_rgba(11,55,89,0.8)]'
              }`}
              style={{
                background: 'linear-gradient(145deg, #097FCD, #0B3759)',
              }}
            >
              {/* Pulse effect */}
              <div className='absolute inset-0 rounded-full bg-[rgba(9,127,205,0.3)] animate-pulse'></div>

              {/* Avatar image */}
              <div className='w-[92%] h-[92%] rounded-full bg-[#1a0a42] flex items-center justify-center overflow-hidden relative'>
                <div className='absolute inset-0 bg-gradient-to-r from-transparent via-[rgba(0,201,255,0.1)] to-transparent animate-shine'></div>
                <img
                  src='/micheal.png'
                  alt='AI Assistant'
                  className='w-full  h-full object-cover rounded-full'
                />
              </div>

              {/* Speech bubble */}
              <div
                className={`absolute top-[-50px] right-5 bg-white/90 text-[#0B3759] px-5 py-3 rounded-2xl text-sm max-w-[200px] shadow-md transition-all duration-400 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] ${
                  isStarting
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0'
                }`}
              >
                Hello! I'm Michael Liner, your AI assistant. Ready when you are!
                <div className='absolute bottom-[-10px] right-10 border-l-[10px] border-r-[10px] border-t-[10px] border-l-transparent border-r-transparent border-t-white/90'></div>
              </div>
            </div>
          </div>
        </div>

         <div className='w-full max-w-[950px]  flex justify-between  mt-10 gap-4'>
              {/* Support Text */}
              <div
                className={`text-sm flex items-center gap-3 transition-all duration-400 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] ${
                  isLightMode ? 'text-[#2c3e50]/60' : 'text-white/60'
                }`}
              >
                <FaHeadset />
                <span>Need help? Our support team is available 24/7</span>
              </div>

              {/* Gabbi Image */}
              
                
             
            </div>

            <div className='w-full flex  justify-center items-center mt-2   max-w-[1000px]'>
              {isLightMode ? 
               <img
                  src='/gabbiblue.png'
                  alt='Meet Gabbi'
                  className='w-full max-w-[200px]'
                /> :
                <img
                  src='/gabbiwhite.png'
                  alt='Meet Gabbi'
                  className='w-full max-w-[200px]'
                />
            }
            </div>
      </div>

      {/* Global styles and animations */}
      <style jsx global>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes pulse {
          0% {
            transform: scale(0.95);
            opacity: 0.7;
          }
          70% {
            transform: scale(1.2);
            opacity: 0;
          }
          100% {
            transform: scale(1.2);
            opacity: 0;
          }
        }

        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shine {
          0% {
            transform: rotate(30deg) translate(-50%, -50%);
          }
          100% {
            transform: rotate(30deg) translate(50%, 50%);
          }
        }

        @keyframes floatParticle {
          to {
            transform: translateY(-100vh);
          }
        }
      `}</style>
    </div>
  );
};

export default InteractiveSessions;
