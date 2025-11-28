import "@fontsource/montserrat/700.css";
import "@fontsource/montserrat/800.css";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

export default function Login() {
  const nav = useNavigate();

  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (!studentId || !password) {
      alert("학번과 비밀번호를 입력해주세요.");
      return;
    }
    nav("/home");
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-white px-6">

      {/* 중앙 프레임 */}
      <div className="w-full max-w-[430px] flex flex-col items-center">

        {/* 🔵 DAMARA 텍스트 로고 */}
        <h1 className="text-6xl font-extrabold mb-16 tracking-tight text-[#355074]"
  style={{ fontFamily: "Montserrat" }}
>
  DAMARA
</h1>
        {/* 🔵 입력 폼 */}
        <div className="w-full max-w-sm space-y-4">

          {/* 학번 */}
          <div className="space-y-2">
            <p className="text-sm text-gray-600">학번</p>
            <Input
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              placeholder="학번을 입력하세요"
              className="
                h-12 bg-gray-50 border border-gray-200 rounded-xl 
                px-4 text-[15px]
                focus:ring-2 focus:ring-[#355074] focus:bg-white
              "
            />
          </div>

          {/* 비밀번호 */}
          <div className="space-y-2">
            <p className="text-sm text-gray-600">비밀번호</p>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              className="
                h-12 bg-gray-50 border border-gray-200 rounded-xl 
                px-4 text-[15px]
                focus:ring-2 focus:ring-[#355074] focus:bg-white
              "
            />
          </div>

          {/* 로그인 버튼 */}
          <Button
            onClick={handleLogin}
            className="
              w-full h-12 rounded-xl text-white font-medium
              bg-gradient-to-r from-[#1A2F4A] to-[#355074]
              shadow-md active:scale-[0.98] transition
            "
          >
            로그인
          </Button>

          {/* 가입 안내 */}
          <div className="text-center pt-2">
            <span className="text-gray-600 text-sm">계정이 없나요?</span>
            <button
              onClick={() => nav('/register')}
              className="text-[#355074] font-semibold text-sm ml-1 hover:underline"
            >
              회원가입
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
