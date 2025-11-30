import "@fontsource/montserrat/700.css";
import "@fontsource/montserrat/800.css";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { X, Eye, EyeOff, Loader2 } from "lucide-react";
import { loginUser } from "../apis/users";

export default function Login() {
  const nav = useNavigate();

  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    // 입력 검증
    if (!studentId || !password) {
      setError("학번과 비밀번호를 입력해주세요.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await loginUser(studentId, password);
      
      // 유저 정보 저장 (응답: id, email, nickname, studentId, department, avatarUrl, createdAt, updatedAt)
      const userData = response.data;
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("userId", userData.id);

      console.log("✅ 로그인 성공:", userData);

      // 홈으로 이동
      nav("/home");
    } catch (err: any) {
      console.error("로그인 실패:", err);
      
      // 에러 메시지 처리
      if (err.response?.status === 401) {
        setError("학번 또는 비밀번호가 올바르지 않습니다.");
      } else if (err.response?.status === 400) {
        setError("입력 형식이 올바르지 않습니다.");
      } else {
        setError("로그인에 실패했습니다. 다시 시도해주세요.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Enter 키로 로그인
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      handleLogin();
    }
  };

  return (
    <div 
      className="w-full min-h-screen flex flex-col justify-center items-center px-6 relative overflow-hidden"
      style={{
        background: "linear-gradient(145deg, #ffffff 0%, #f5f7fa 40%, #e4ecf5 100%)"
      }}
    >
      {/* 배경 블러 장식 */}
      <div 
        className="absolute top-[-20%] right-[-15%] w-[50%] h-[50%] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(53,80,116,0.08) 0%, transparent 70%)"
        }}
      />
      <div 
        className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(139,163,195,0.1) 0%, transparent 70%)"
        }}
      />

      {/* 중앙 프레임 */}
      <div className="w-full max-w-[430px] flex flex-col">

        {/* 🔵 DAMARA 텍스트 로고 + 슬로건 - 중앙 배치 */}
        <div className="mb-16 text-center">
          <h1
            className="font-extrabold tracking-tight text-[#355074]"
            style={{ fontFamily: "Montserrat", fontSize: "3rem" }}
          >
            DAMARA
          </h1>
          <p className="text-gray-400 text-sm mt-3">
            함께 사는 즐거움
          </p>
        </div>

        {/* 🔵 입력 폼 */}
        <div className="w-full max-w-sm space-y-4" style={{ marginTop: '40px' }}>

          {/* 에러 메시지 */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          {/* 학번 */}
          <div>
            <div className="relative">
              <input
                type="text"
                value={studentId}
                onChange={(e) => {
                  setStudentId(e.target.value);
                  setError("");
                }}
                onKeyDown={handleKeyDown}
                placeholder="학번을 입력하세요"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[15px] focus:ring-2 focus:ring-[#355074] focus:bg-white focus:outline-none transition-all duration-200"
              />
              {studentId && (
                <button
                  type="button"
                  onClick={() => setStudentId("")}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)' }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </div>

          {/* 비밀번호 */}
          <div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                onKeyDown={handleKeyDown}
                placeholder="비밀번호를 입력하세요"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[15px] focus:ring-2 focus:ring-[#355074] focus:bg-white focus:outline-none transition-all duration-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)' }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* 로그인 버튼 */}
          <Button
            onClick={handleLogin}
            disabled={isLoading}
            className="
              w-full py-3 rounded-xl text-white font-medium
              bg-gradient-to-r from-[#1A2F4A] to-[#355074]
              hover:from-[#243a5a] hover:to-[#3d5d87]
              shadow-md shadow-black/10 active:scale-[0.98] transition-all duration-200
              mt-2 disabled:opacity-70 disabled:cursor-not-allowed
            "
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 size={18} className="animate-spin" />
                로그인 중...
              </span>
            ) : (
              "로그인"
            )}
          </Button>

          {/* 가입 안내 - 버튼과 가까워지게 mt-4 */}
          <div className="text-center mt-4">
            <span className="text-gray-500 text-sm">계정이 없나요?</span>
            <button
              onClick={() => nav('/register')}
              className="text-[#355074] font-semibold text-sm ml-2 hover:underline transition-colors"
            >
              회원가입
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
