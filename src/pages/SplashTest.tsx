// src/pages/Splashtest.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DamaraLogo from "../assets/Damara_logo.png";

export default function Splashtest() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      // fade-out 클래스 추가
      const splash = document.getElementById("splash-container");
      if (splash) splash.classList.add("fade-out");

      // 300ms 후 로그인으로 이동
      setTimeout(() => navigate("/login"), 300);
    }, 3200);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div
      id="splash-container"
      style={{
        width: "100vw",
        height: "100vh",
        position: "fixed",
        inset: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#FFF",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "430px",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          background: "linear-gradient(180deg, #1A2F4A 0%, #6F91BC 100%)",
          color: "white",
          position: "relative",
        }}
      >
        <img
          src={DamaraLogo}
          alt="Damara Logo"
          className="splash-logo"
          style={{
            width: "180px",
            height: "180px",
            objectFit: "contain",
            marginBottom: "14px",
            opacity: 0,
            animation: "fadeIn 1s ease-out forwards",
          }}
        />

        <p
          style={{
            fontSize: "20px",
            fontWeight: 500,
            opacity: 0,
            animation: "fadeIn 1.2s ease-out forwards",
            animationDelay: "0.4s",
            marginBottom: "32px",
          }}
        >
          함께 사는 즐거움, Damara
        </p>

        <div style={{ display: "flex", gap: "10px" }}>
          <div className="dot" />
          <div className="dot" />
          <div className="dot" />
        </div>

        <style>
          {`
            @keyframes fadeIn {
              0% { opacity: 0; transform: translateY(10px); }
              100% { opacity: 1; transform: translateY(0); }
            }

            /* 로딩 점 */
            .dot {
              width: 10px;
              height: 10px;
              border-radius: 50%;
              background: white;
              opacity: 0.5;
              animation: wave 1.4s infinite ease-in-out;
            }

            .dot:nth-child(2) { animation-delay: 0.2s; }
            .dot:nth-child(3) { animation-delay: 0.4s; }

            @keyframes wave {
              0%, 100% { transform: scale(0.9); opacity: 0.4; }
              50% { transform: scale(1.4); opacity: 1; }
            }

            /* 🔥 fade-out */
            .fade-out {
              animation: fadeOut 0.35s ease forwards;
            }

            @keyframes fadeOut {
              from { opacity: 1; }
              to { opacity: 0; }
            }
        `}
        </style>
      </div>
    </div>
  );
}
