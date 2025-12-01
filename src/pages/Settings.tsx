// src/pages/Settings.tsx
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Bell, Moon, Shield, Smartphone, Globe, Info, Check, X, Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { toast } from "sonner";

type FontSize = "small" | "medium" | "large";

const fontSizeLabels: Record<FontSize, string> = {
  small: "작게",
  medium: "기본",
  large: "크게",
};

export default function Settings() {
  const nav = useNavigate();
  const { isDarkMode, setIsDarkMode, fontSize, setFontSize } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [showFontModal, setShowFontModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  // 모달이 열릴 때 body 스크롤 방지
  useEffect(() => {
    if (showFontModal || showPrivacyModal) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [showFontModal, showPrivacyModal]);

  // 다크모드 스타일 (새 색상 가이드 적용)
  const bgMain = isDarkMode ? "#0B0F19" : "#f9fafb";
  const bgCard = isDarkMode ? "#151C2B" : "#ffffff";
  const bgIcon = isDarkMode ? "#1A2233" : "#f3f4f6";
  const textPrimary = isDarkMode ? "#FFFFFF" : "#111827";
  const textSecondary = isDarkMode ? "#A7B1C2" : "#6b7280";
  const borderColor = isDarkMode ? "#1A2233" : "#f3f4f6";
  const pointColor = isDarkMode ? "#4F8BFF" : "#6F91BC";

  return (
    <div className="min-h-screen pb-20 transition-colors" style={{ backgroundColor: bgMain }}>
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-[#1A2F4A] to-[#355074] px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => nav(-1)} className="p-1">
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-white text-lg font-medium">앱 설정</h1>
        </div>
      </div>

      {/* 알림 설정 */}
      <div 
        className="mt-4 mx-4 rounded-2xl shadow-sm overflow-hidden transition-colors"
        style={{ backgroundColor: bgCard }}
      >
        <div className="px-4 py-3" style={{ borderBottom: `1px solid ${borderColor}` }}>
          <p className="text-xs font-medium" style={{ color: textSecondary }}>알림</p>
        </div>
        
        <button 
          type="button"
          onClick={() => setNotifications(!notifications)}
          className="w-full flex items-center justify-between px-4 py-4"
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: bgIcon }}
            >
              <Bell className="w-5 h-5" style={{ color: pointColor }} />
            </div>
            <div className="text-left">
              <span style={{ color: textPrimary }}>푸시 알림</span>
              <p className="text-xs mt-0.5" style={{ color: textSecondary }}>새로운 공구 소식 받기</p>
            </div>
          </div>
          <div
            className="w-12 h-7 rounded-full transition-colors relative"
            style={{ backgroundColor: notifications ? "#6F91BC" : (isDarkMode ? "#4b5563" : "#d1d5db") }}
          >
            <div
              className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm transition-all duration-200"
              style={{ left: notifications ? "26px" : "4px" }}
            />
          </div>
        </button>
      </div>

      {/* 화면 설정 */}
      <div 
        className="mt-4 mx-4 rounded-2xl shadow-sm overflow-hidden transition-colors"
        style={{ backgroundColor: bgCard }}
      >
        <div className="px-4 py-3" style={{ borderBottom: `1px solid ${borderColor}` }}>
          <p className="text-xs font-medium" style={{ color: textSecondary }}>화면</p>
        </div>
        
        {/* 다크 모드 */}
        <button 
          type="button"
          onClick={() => {
            console.log("다크모드 토글 클릭, 현재:", isDarkMode);
            setIsDarkMode(!isDarkMode);
          }}
          className="w-full flex items-center justify-between px-4 py-4"
          style={{ borderBottom: `1px solid ${borderColor}` }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: bgIcon }}
            >
              <Moon className="w-5 h-5" style={{ color: pointColor }} />
            </div>
            <div className="text-left">
              <span style={{ color: textPrimary }}>다크 모드</span>
              <p className="text-xs mt-0.5" style={{ color: textSecondary }}>어두운 테마 사용</p>
            </div>
          </div>
          <div
            className="w-12 h-7 rounded-full transition-colors relative"
            style={{ backgroundColor: isDarkMode ? "#6F91BC" : "#d1d5db" }}
          >
            <div
              className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm transition-all duration-200"
              style={{ left: isDarkMode ? "26px" : "4px" }}
            />
          </div>
        </button>

        {/* 글꼴 크기 */}
        <button 
          onClick={() => setShowFontModal(true)}
          className="w-full flex items-center justify-between px-4 py-4"
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: bgIcon }}
            >
              <Smartphone className="w-5 h-5" style={{ color: pointColor }} />
            </div>
            <div className="text-left">
              <span style={{ color: textPrimary }}>글꼴 크기</span>
              <p className="text-xs text-[#6F91BC] mt-0.5">{fontSizeLabels[fontSize]}</p>
            </div>
          </div>
        </button>
      </div>

      {/* 기타 설정 */}
      <div 
        className="mt-4 mx-4 rounded-2xl shadow-sm overflow-hidden transition-colors"
        style={{ backgroundColor: bgCard }}
      >
        <div className="px-4 py-3" style={{ borderBottom: `1px solid ${borderColor}` }}>
          <p className="text-xs font-medium" style={{ color: textSecondary }}>기타</p>
        </div>

        <button 
          className="w-full flex items-center justify-between px-4 py-4"
          style={{ borderBottom: `1px solid ${borderColor}` }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: bgIcon }}
            >
              <Globe className="w-5 h-5" style={{ color: pointColor }} />
            </div>
            <div className="text-left">
              <span style={{ color: textPrimary }}>언어</span>
              <p className="text-xs mt-0.5" style={{ color: textSecondary }}>한국어</p>
            </div>
          </div>
        </button>

        <button 
          onClick={() => setShowPrivacyModal(true)}
          className="w-full flex items-center justify-between px-4 py-4"
          style={{ borderBottom: `1px solid ${borderColor}` }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: bgIcon }}
            >
              <Shield className="w-5 h-5" style={{ color: pointColor }} />
            </div>
            <span style={{ color: textPrimary }}>개인정보 처리방침</span>
          </div>
        </button>

        <button className="w-full flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: bgIcon }}
            >
              <Info className="w-5 h-5" style={{ color: pointColor }} />
            </div>
            <div className="text-left">
              <span style={{ color: textPrimary }}>앱 정보</span>
              <p className="text-xs mt-0.5" style={{ color: textSecondary }}>버전 1.0.0</p>
            </div>
          </div>
        </button>
      </div>

      {/* 캐시 삭제 */}
      <div 
        className="mt-4 mx-4 rounded-2xl shadow-sm overflow-hidden transition-colors"
        style={{ backgroundColor: bgCard }}
      >
        <button 
          onClick={() => toast.success("캐시가 삭제되었습니다.")}
          className="w-full px-4 py-4 text-center text-[#6F91BC] font-medium"
        >
          캐시 삭제
        </button>
      </div>

      {/* 개인정보 처리방침 모달 */}
      {showPrivacyModal && (
        <div 
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowPrivacyModal(false);
            }
          }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            zIndex: 9999,
            touchAction: 'none',
          }}
          onTouchMove={(e) => {
            e.preventDefault();
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: bgCard,
              borderRadius: '1rem',
              width: '100%',
              maxWidth: '24rem',
              maxHeight: '90vh',
              overflow: 'hidden',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* 모달 헤더 */}
            <div 
              className="px-4 py-3 flex items-center justify-between flex-shrink-0"
              style={{ backgroundColor: isDarkMode ? "#1A2233" : "#1A2F4A" }}
            >
              <h3 className="text-white font-medium text-sm">개인정보 처리방침</h3>
              <button onClick={() => setShowPrivacyModal(false)} className="p-1">
                <X className="w-5 h-5 text-white/80" />
              </button>
            </div>

            {/* 모달 내용 */}
            <div 
              className="p-4 overflow-y-auto flex-1"
              style={{ color: textSecondary }}
            >
              <div className="space-y-4 text-xs leading-relaxed">
                <section>
                  <h4 className="font-semibold mb-1.5 text-xs" style={{ color: textPrimary }}>1. 개인정보의 수집 및 이용 목적</h4>
                  <p className="text-xs">Damara는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.</p>
                  <ul className="list-disc pl-4 mt-1.5 space-y-0.5 text-xs">
                    <li>회원 가입 및 관리</li>
                    <li>공동구매 서비스 제공</li>
                    <li>서비스 이용 기록 분석</li>
                    <li>고객 문의 응대</li>
                  </ul>
                </section>

                <section>
                  <h4 className="font-semibold mb-1.5 text-xs" style={{ color: textPrimary }}>2. 수집하는 개인정보 항목</h4>
                  <ul className="list-disc pl-4 space-y-0.5 text-xs">
                    <li>필수항목: 이메일, 비밀번호, 닉네임, 학번, 학과</li>
                    <li>선택항목: 프로필 이미지</li>
                    <li>자동수집: 서비스 이용 기록, 접속 로그, 접속 IP</li>
                  </ul>
                </section>

                <section>
                  <h4 className="font-semibold mb-1.5 text-xs" style={{ color: textPrimary }}>3. 개인정보의 보유 및 이용기간</h4>
                  <p className="text-xs">회원 탈퇴 시까지 보유하며, 탈퇴 후에는 지체 없이 파기합니다. 단, 관계 법령에 따라 보존할 필요가 있는 경우 해당 기간 동안 보관합니다.</p>
                  <ul className="list-disc pl-4 mt-1.5 space-y-0.5 text-xs">
                    <li>전자상거래법에 따른 계약 또는 청약철회 기록: 5년</li>
                    <li>소비자 불만 또는 분쟁처리 기록: 3년</li>
                    <li>접속 로그 기록: 3개월</li>
                  </ul>
                </section>

                <section>
                  <h4 className="font-semibold mb-1.5 text-xs" style={{ color: textPrimary }}>4. 개인정보의 제3자 제공</h4>
                  <p className="text-xs">Damara는 원칙적으로 이용자의 개인정보를 제3자에게 제공하지 않습니다. 다만, 아래의 경우에는 예외로 합니다.</p>
                  <ul className="list-disc pl-4 mt-1.5 space-y-0.5 text-xs">
                    <li>이용자가 사전에 동의한 경우</li>
                    <li>법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</li>
                  </ul>
                </section>

                <section>
                  <h4 className="font-semibold mb-1.5 text-xs" style={{ color: textPrimary }}>5. 이용자의 권리와 그 행사방법</h4>
                  <p className="text-xs">이용자는 언제든지 자신의 개인정보를 조회하거나 수정할 수 있으며, 회원 탈퇴를 통해 개인정보 처리 정지를 요청할 수 있습니다.</p>
                </section>

                <section>
                  <h4 className="font-semibold mb-1.5 text-xs" style={{ color: textPrimary }}>6. 개인정보 보호책임자</h4>
                  <p className="text-xs">개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.</p>
                  <div className="mt-1.5 p-2.5 rounded-lg text-xs" style={{ backgroundColor: bgIcon }}>
                    <p>담당자: Damara 개인정보보호팀</p>
                    <p>이메일: privacy@damara.kr</p>
                  </div>
                </section>

                <section>
                  <h4 className="font-semibold mb-1.5 text-xs" style={{ color: textPrimary }}>7. 개인정보 처리방침 변경</h4>
                  <p className="text-xs">이 개인정보 처리방침은 2025년 11월 29일부터 적용됩니다. 변경사항이 있을 경우 앱 내 공지사항을 통해 안내드립니다.</p>
                </section>
              </div>
            </div>

            {/* 모달 푸터 */}
            <div 
              className="px-4 py-3 flex-shrink-0"
              style={{ borderTop: `1px solid ${borderColor}` }}
            >
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="w-full py-3 rounded-xl text-white font-medium text-sm"
                style={{ backgroundColor: isDarkMode ? "#1A2233" : "#1A2F4A" }}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 글꼴 크기 선택 모달 */}
      {showFontModal && (
        <div 
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowFontModal(false);
            }
          }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            zIndex: 9999,
            touchAction: 'none',
          }}
          onTouchMove={(e) => {
            e.preventDefault();
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: bgCard,
              borderRadius: '1rem',
              width: '100%',
              maxWidth: '20rem',
              maxHeight: '90vh',
              overflow: 'hidden',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            }}
          >
            {/* 모달 헤더 */}
            <div 
              className="px-4 py-3 flex items-center justify-between"
              style={{ backgroundColor: isDarkMode ? "#1A2233" : "#1A2F4A" }}
            >
              <h3 className="text-white font-medium text-sm">글꼴 크기</h3>
              <button onClick={() => setShowFontModal(false)} className="p-1">
                <X className="w-5 h-5 text-white/80" />
              </button>
            </div>

            {/* 옵션들 */}
            <div className="px-4 pt-4 pb-2 space-y-1">
              {(["small", "medium", "large"] as FontSize[]).map((size) => (
                <button
                  key={size}
                  onClick={() => {
                    setFontSize(size);
                    setShowFontModal(false);
                  }}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors"
                  style={{ 
                    backgroundColor: fontSize === size 
                      ? (isDarkMode ? "rgba(111, 145, 188, 0.15)" : "rgba(111, 145, 188, 0.1)")
                      : "transparent"
                  }}
                >
                  <span 
                    style={{ 
                      color: textPrimary,
                      fontSize: size === "small" ? "14px" : size === "large" ? "18px" : "16px",
                      fontWeight: fontSize === size ? "500" : "400"
                    }}
                  >
                    {fontSizeLabels[size]} {size === "small" ? "14px" : size === "large" ? "18px" : "16px"}
                  </span>
                  {fontSize === size && (
                    <Check className="w-5 h-5" style={{ color: pointColor }} />
                  )}
                </button>
              ))}
            </div>

            {/* 미리보기 */}
            <div className="px-4 pt-4 pb-6 border-t" style={{ borderColor: borderColor }}>
              <p className="text-xs mb-4" style={{ color: textSecondary }}>미리보기</p>
              <div 
                className="p-4 rounded-lg"
                style={{ 
                  backgroundColor: bgIcon,
                  border: `1px solid ${borderColor}`
                }}
              >
                <p 
                  style={{ 
                    color: textPrimary,
                    fontSize: fontSize === "small" ? "14px" : fontSize === "large" ? "18px" : "16px",
                    lineHeight: "1.6"
                  }}
                >
                  Damara 공동구매 플랫폼
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
