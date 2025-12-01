// src/pages/FAQ.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "Damara는 어떤 서비스인가요?",
    answer: "Damara는 대학생들을 위한 공동구매 플랫폼입니다. 같은 학교 학생들과 함께 물건을 공동구매하여 더 저렴한 가격에 구매할 수 있습니다.",
  },
  {
    question: "공동구매는 어떻게 참여하나요?",
    answer: "홈 화면에서 원하는 공동구매 게시글을 선택한 후, '참여하기' 버튼을 누르면 됩니다. 모집 인원이 마감되면 자동으로 마감됩니다.",
  },
  {
    question: "공동구매를 직접 등록할 수 있나요?",
    answer: "네, 홈 화면 우측 하단의 '+' 버튼을 눌러 새로운 공동구매를 등록할 수 있습니다. 상품명, 가격, 모집인원 등의 정보를 입력해주세요.",
  },
  {
    question: "참여 취소는 어떻게 하나요?",
    answer: "참여한 공동구매 상세 페이지에서 '참여 취소' 버튼을 누르면 됩니다. 단, 모집이 완료된 후에는 취소가 어려울 수 있습니다.",
  },
  {
    question: "결제는 어떻게 진행되나요?",
    answer: "현재는 공동구매 주최자와 직접 연락하여 결제를 진행합니다. 추후 앱 내 결제 기능이 추가될 예정입니다.",
  },
  {
    question: "배송은 어떻게 받나요?",
    answer: "공동구매 특성상 대부분 학교 내 직접 수령 방식으로 진행됩니다. 상세한 수령 방법은 각 게시글에서 확인해주세요.",
  },
  {
    question: "신뢰지수는 무엇인가요?",
    answer: "신뢰지수는 사용자의 거래 신뢰도를 나타내는 점수입니다. 성공적인 공동구매 참여와 주최를 통해 점수가 올라갑니다.",
  },
  {
    question: "문제가 생기면 어디로 문의하나요?",
    answer: "앱 내 '공지사항'을 통해 공식 연락처를 확인하거나, support@damara.kr로 이메일을 보내주세요.",
  },
];

export default function FAQ() {
  const nav = useNavigate();
  const { isDarkMode } = useTheme();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  // 다크모드 스타일 (새 색상 가이드 적용)
  const bgMain = isDarkMode ? "#0B0F19" : "#f9fafb";
  const bgCard = isDarkMode ? "#151C2B" : "#ffffff";
  const textPrimary = isDarkMode ? "#FFFFFF" : "#111827";
  const textSecondary = isDarkMode ? "#A7B1C2" : "#6b7280";
  const borderColor = isDarkMode ? "#1A2233" : "#f3f4f6";
  const pointColor = isDarkMode ? "#4F8BFF" : "#6F91BC";

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen pb-20 transition-colors" style={{ backgroundColor: bgMain }}>
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-[#1A2F4A] to-[#355074] px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => nav(-1)} className="p-1">
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-white text-lg font-medium">자주 묻는 질문</h1>
        </div>
      </div>

      {/* 검색 안내 */}
      <div className="px-4 py-4">
        <p className="text-sm" style={{ color: textSecondary }}>
          궁금한 점이 있으신가요? 아래에서 답변을 찾아보세요.
        </p>
      </div>

      {/* FAQ 리스트 */}
      <div className="mx-4 space-y-3">
        {faqData.map((item, index) => (
          <div
            key={index}
            className="rounded-2xl shadow-sm overflow-hidden transition-colors"
            style={{ backgroundColor: bgCard }}
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full flex items-center justify-between px-4 py-4 text-left"
            >
              <span className="font-medium pr-4" style={{ color: textPrimary }}>{item.question}</span>
              {openIndex === index ? (
                <ChevronUp className="w-5 h-5 flex-shrink-0" style={{ color: pointColor }} />
              ) : (
                <ChevronDown className="w-5 h-5 flex-shrink-0" style={{ color: textSecondary }} />
              )}
            </button>
            
            {openIndex === index && (
              <div className="px-4 pb-4">
                <div className="pt-3" style={{ borderTop: `1px solid ${borderColor}` }}>
                  <p className="text-sm leading-relaxed" style={{ color: textSecondary }}>
                    {item.answer}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 추가 문의 안내 */}
      <div className="mx-4 mt-20 mb-6 p-4 bg-gradient-to-r from-[#1A2F4A] to-[#355074] rounded-2xl">
        <p className="text-white font-medium">찾으시는 답변이 없으신가요?</p>
        <p className="text-white/70 text-sm mt-1">
          support@damara.kr로 문의해주세요.
        </p>
      </div>
    </div>
  );
}
