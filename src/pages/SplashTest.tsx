// src/pages/SplashTest.tsx
import "@fontsource/montserrat/700.css";
import "@fontsource/montserrat/800.css";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DamaraLogo from "../assets/Damara_splash.png";

export default function SplashTest() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      const splash = document.getElementById("splash-container");
      if (splash) splash.classList.add("fade-out");
      setTimeout(() => navigate("/login"), 400);
    }, 3500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div
      id="splash-container"
      className="w-full min-h-screen flex justify-center items-center overflow-hidden animated-bg"
    >
      {/* 모바일 프레임 */}
      <div className="w-full max-w-[430px] min-h-screen flex flex-col items-center justify-center relative">
        
        {/* 배경 블러 장식 */}
        <div className="floating-orb orb-1" />
        <div className="floating-orb orb-2" />

        {/* 컨텐츠 영역 */}
        <div className="flex flex-col items-center justify-center -mt-8 relative z-10">
          
          {/* 로고 + 글로우 컨테이너 */}
          <div className="relative flex items-center justify-center">
            {/* 글로우 효과 */}
            <div className="logo-glow" />
            
            {/* 로고 */}
            <img
              src={DamaraLogo}
              alt="Damara Logo"
              className="logo-main relative z-10"
            />
          </div>

          {/* 슬로건 */}
          <p className="slogan text-[#355074] text-base tracking-wider mt-8 font-light">
            함께 사는 즐거움, Damara
          </p>

          {/* 로딩 바 */}
          <div className="loading-bar-container mt-12">
            <div className="loading-bar">
              <div className="loading-bar-glow" />
            </div>
          </div>
        </div>

        <style>
          {`
            /* 🌈 움직이는 배경 그라디언트 */
            .animated-bg {
              background: linear-gradient(
                145deg,
                #ffffff 0%,
                #f5f7fa 25%,
                #e4ecf5 50%,
                #f0f4f8 75%,
                #ffffff 100%
              );
              background-size: 200% 200%;
              animation: gradientFlow 6s ease-in-out infinite;
            }

            @keyframes gradientFlow {
              0%, 100% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
            }

            /* 🔮 은은한 배경 장식 */
            .floating-orb {
              position: absolute;
              border-radius: 50%;
              filter: blur(80px);
              animation: floatOrb 8s ease-in-out infinite;
            }

            .orb-1 {
              width: 300px;
              height: 300px;
              background: radial-gradient(circle, rgba(53, 80, 116, 0.08) 0%, transparent 70%);
              top: -10%;
              right: -15%;
              animation-delay: 0s;
            }

            .orb-2 {
              width: 250px;
              height: 250px;
              background: radial-gradient(circle, rgba(139, 163, 195, 0.1) 0%, transparent 70%);
              bottom: -5%;
              left: -10%;
              animation-delay: -3s;
            }

            @keyframes floatOrb {
              0%, 100% { transform: translateY(0) scale(1); }
              50% { transform: translateY(-20px) scale(1.05); }
            }

            /* ✨ 로고 글로우 */
            .logo-glow {
              position: absolute;
              width: 220px;
              height: 220px;
              background: radial-gradient(circle, rgba(111, 145, 188, 0.2) 0%, transparent 70%);
              border-radius: 50%;
              animation: glowPulse 2.5s ease-in-out infinite;
            }

            @keyframes glowPulse {
              0%, 100% { transform: scale(1); opacity: 0.4; }
              50% { transform: scale(1.15); opacity: 0.6; }
            }

            /* 🎯 로고 메인 */
            .logo-main {
              width: 180px;
              height: 180px;
              object-fit: contain;
              animation: logoEntry 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
            }

            @keyframes logoEntry {
              0% { 
                opacity: 0; 
                transform: scale(0.5) translateY(20px); 
              }
              100% { 
                opacity: 1; 
                transform: scale(1) translateY(0); 
              }
            }

            /* 📝 슬로건 */
            .slogan {
              opacity: 0;
              animation: slideUp 0.8s ease-out 0.6s forwards;
            }

            @keyframes slideUp {
              0% { opacity: 0; transform: translateY(20px); }
              100% { opacity: 1; transform: translateY(0); }
            }

            /* 📊 로딩 바 */
            .loading-bar-container {
              width: 200px;
              height: 4px;
              background: rgba(53, 80, 116, 0.1);
              border-radius: 20px;
              overflow: hidden;
              opacity: 0;
              animation: fadeIn 0.5s ease 0.8s forwards;
            }

            .loading-bar {
              width: 0%;
              height: 100%;
              background: linear-gradient(90deg, 
                #1A2F4A 0%, 
                #355074 50%, 
                #6F91BC 100%
              );
              border-radius: 20px;
              animation: loadProgress 2.8s cubic-bezier(0.4, 0, 0.2, 1) 0.8s forwards;
              position: relative;
              overflow: hidden;
            }

            .loading-bar-glow {
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: linear-gradient(
                90deg,
                transparent 0%,
                rgba(255, 255, 255, 0.5) 50%,
                transparent 100%
              );
              animation: shimmer 1.5s infinite;
            }

            @keyframes shimmer {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(100%); }
            }

            @keyframes loadProgress {
              0% { width: 0%; }
              15% { width: 15%; }
              30% { width: 35%; }
              50% { width: 55%; }
              70% { width: 75%; }
              85% { width: 90%; }
              100% { width: 100%; }
            }

            @keyframes fadeIn {
              to { opacity: 1; }
            }

            /* 🔥 페이드 아웃 */
            #splash-container.fade-out {
              animation: fadeOut 0.4s ease forwards;
            }

            @keyframes fadeOut {
              to { opacity: 0; transform: scale(1.05); }
            }
          `}
        </style>
      </div>
    </div>
  );
}