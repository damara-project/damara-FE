// src/pages/Register.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

export default function Register() {
  const nav = useNavigate();

  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = () => {
    if (!studentId || !password) {
      alert("학번과 비밀번호를 입력해주세요.");
      return;
    }

    alert("회원가입 성공(임시)");
    nav("/login");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center px-8 pt-24">
      <h1 className="text-2xl font-bold text-[#1A2F4A] mb-10">회원가입</h1>

      <div className="w-full space-y-5">
        <Input
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          placeholder="학번 입력"
          className="bg-gray-50 border-0 rounded-xl py-6"
        />

        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호 입력"
          className="bg-gray-50 border-0 rounded-xl py-6"
        />

        <Button
          onClick={handleRegister}
          className="w-full py-6 rounded-xl bg-gradient-to-r from-[#1A2F4A] to-[#355074] text-white"
        >
          가입하기
        </Button>
      </div>
    </div>
  );
}
