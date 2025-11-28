// src/pages/Profile.tsx
import { ArrowLeft, Settings, ShoppingBag, Heart, Award, Bell, HelpCircle, ChevronRight, Sparkles } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "../components/ui/avatar";

export default function Profile() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#8BA3C3]/5 pb-20">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-[#1A2F4A] to-[#355074] px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <h1 className="text-white">나의 Damara</h1>
          <button className="p-1">
            <Settings className="w-6 h-6 text-white/90" />
          </button>
        </div>
      </div>

      {/* 프로필 정보 */}
      <div className="bg-gradient-to-r from-[#1A2F4A] to-[#355074] px-4 pb-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar className="w-20 h-20 border-4 border-white/20">
              <AvatarImage src="https://images.unsplash.com/photo-1568880893176-fb2bdab44e41?w=300&q=80" />
              <AvatarFallback className="bg-gradient-to-br from-[#6F91BC] to-[#8BA3C3] text-white">
                김
              </AvatarFallback>
            </Avatar>

            <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-gradient-to-r from-[#6F91BC] to-[#8BA3C3] rounded-full flex items-center justify-center border-2 border-[#1A2F4A]">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
          </div>

          <div className="flex-1">
            <h2 className="text-white">김민준</h2>
            <p className="text-sm text-white/70 mt-0.5">명지대학교 #202012345</p>
          </div>
        </div>

        {/* 통계 카드 3개 */}
        <div className="grid grid-cols-3 gap-3 mt-5">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
            <p className="text-2xl text-white">5</p>
            <p className="text-xs text-white/80 mt-1">등록한 공구</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
            <p className="text-2xl text-white">12</p>
            <p className="text-xs text-white/80 mt-1">참여한 공구</p>
          </div>

          <div className="bg-gradient-to-br from-[#6F91BC] to-[#8BA3C3] rounded-xl p-3 text-center shadow-lg">
            <p className="text-2xl text-white">500</p>
            <p className="text-xs text-white mt-1">신뢰점수</p>
          </div>
        </div>
      </div>

      {/* 메뉴 리스트 1 */}
      <div className="bg-white mt-4 mx-4 rounded-2xl shadow-sm overflow-hidden">
        {/* 나의 공동구매 */}
        <button className="w-full flex items-center justify-between px-4 py-4 border-b border-gray-100 hover:bg-gradient-to-r hover:from-[#8BA3C3]/5 transition-all">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#6F91BC] to-[#8BA3C3] rounded-xl flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <span className="text-gray-900">나의 공동구매</span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>

        {/* 관심목록 */}
        <button className="w-full flex items-center justify-between px-4 py-4 border-b border-gray-100 hover:bg-gradient-to-r hover:from-[#8BA3C3]/5 transition-all">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#355074] to-[#6F91BC] rounded-xl flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-gray-900">관심 목록</span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>

        {/* 신뢰지수 */}
        <button className="w-full flex items-center justify-between px-4 py-4 hover:bg-gradient-to-r hover:from-[#8BA3C3]/5 transition-all">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#1A2F4A] to-[#355074] rounded-xl flex items-center justify-center">
              <Award className="w-5 h-5 text-white" />
            </div>
            <span className="text-gray-900">신뢰지수</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm bg-gradient-to-r from-[#6F91BC] to-[#8BA3C3] bg-clip-text text-transparent px-2 py-1 rounded-lg">
              500점
            </span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
        </button>
      </div>

      {/* 메뉴 리스트 2 */}
      <div className="bg-white mt-4 mx-4 rounded-2xl shadow-sm overflow-hidden">
        {/* 공지사항 */}
        <button className="w-full flex items-center justify-between px-4 py-4 border-b border-gray-100 hover:bg-gradient-to-r hover:from-[#8BA3C3]/5 transition-all">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
              <Bell className="w-5 h-5 text-[#6F91BC]" />
            </div>
            <span className="text-gray-900">공지사항</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs bg-gradient-to-r from-[#6F91BC] to-[#8BA3C3] text-white px-2 py-0.5 rounded-full">
              New
            </span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
        </button>

        {/* FAQ */}
        <button className="w-full flex items-center justify-between px-4 py-4 border-b border-gray-100 hover:bg-gradient-to-r hover:from-[#8BA3C3]/5 transition-all">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
              <HelpCircle className="w-5 h-5 text-[#6F91BC]" />
            </div>
            <span className="text-gray-900">자주 묻는 질문</span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>

        {/* 앱 설정 */}
        <button className="w-full flex items-center justify-between px-4 py-4 hover:bg-gradient-to-r hover:from-[#8BA3C3]/5 transition-all">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
              <Settings className="w-5 h-5 text-[#6F91BC]" />
            </div>
            <span className="text-gray-900">앱 설정</span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>
      </div>
    </div>
  );
}
