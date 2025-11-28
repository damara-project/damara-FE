// src/pages/PostDetail.tsx

import { ArrowLeft, Users, MapPin, MessageCircle } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";

export default function PostDetail() {
  // 이미지 목록
  const images = [
    "https://images.unsplash.com/photo-1731004270604-78999bfc0bf6?auto=format&w=900&q=80",
  ];

  // 댓글 목록
  const comments = [
    {
      id: 1,
      author: "김민지",
      avatar:
        "https://images.unsplash.com/photo-1568880893176-fb2bdab44e41?auto=format&w=300&q=80",
      content: "언제 받을 수 있나요?",
      time: "10분 전",
    },
    {
      id: 2,
      author: "이서준",
      avatar: "",
      content: "저도 참여하고 싶어요!",
      time: "25분 전",
    },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col pb-20">
      {/* 헤더 */}
      <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3 z-10">
        <button onClick={() => history.back()} className="p-1">
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h2 className="text-gray-900">공동구매 상세</h2>
      </div>

      {/* 스크롤 콘텐츠 */}
      <div className="flex-1 overflow-y-auto">
        {/* 상품 이미지 */}
        <div className="aspect-square w-full bg-gray-100">
          <img
            src={images[0]}
            alt="Product"
            className="w-full h-full object-cover"
          />
        </div>

        {/* 상세 내용 */}
        <div className="p-5 space-y-6">
          {/* 상태/참여인원 */}
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <Badge className="bg-[#1A2F4A] text-white px-3 py-1 rounded-full">
                모집중
              </Badge>

              <div className="flex items-center gap-1.5 text-sm text-gray-600">
                <Users className="w-4 h-4" />
                <span>3/5명 참여</span>
              </div>
            </div>

            {/* 제목 */}
            <h2 className="text-gray-900 text-lg">
              허니버터칩 대량구매 함께하실 분 구해요!
            </h2>

            {/* 가격 */}
            <p className="text-[#1A2F4A] font-semibold">1인당 5,000원</p>

            {/* 위치/시간 */}
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span className="text-sm">명지대 도서관 앞</span>
              <span className="text-sm text-gray-400">·</span>
              <span className="text-sm text-gray-400">2시간 전</span>
            </div>
          </div>

          {/* 구분선 */}
          <div className="border-t border-gray-100" />

          {/* 본문 */}
          <div>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              허니버터칩 대량으로 주문하려고 합니다!
              {"\n"}같이 구매하실 분 모집합니다.
              {"\n\n"}📦 상품: 허니버터칩 (1박스 10개입)
              {"\n"}💰 가격: 1인당 5,000원
              {"\n"}📍 수령: 명지대 도서관 앞
              {"\n"}📅 수령일: 11월 10일 (금) 오후 5시
              {"\n\n"}관심 있으신 분은 채팅 주세요!
            </p>
          </div>

          {/* 구분선 */}
          <div className="border-t border-gray-100" />

          {/* 댓글 */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <MessageCircle className="w-5 h-5 text-gray-600" />
              <h3 className="text-gray-900">댓글 {comments.length}개</h3>
            </div>

            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={comment.avatar} />
                    <AvatarFallback className="bg-[#8BA3C3] text-white">
                      {comment.author[0]}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm text-gray-900">
                        {comment.author}
                      </span>
                      <span className="text-xs text-gray-400">
                        {comment.time}
                      </span>
                    </div>

                    <p className="text-sm text-gray-700">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* 댓글 입력 */}
            <div className="flex gap-2 mt-4">
              <Input
                placeholder="댓글을 입력하세요"
                className="flex-1 bg-gray-50 border-0 rounded-xl"
              />
              <Button className="bg-[#1A2F4A] hover:bg-[#355074] px-6 rounded-xl">
                등록
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 참여 버튼 */}
      <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4">
        <Button className="w-full bg-[#1A2F4A] hover:bg-[#355074] py-6 rounded-xl">
          참여하기
        </Button>
      </div>
    </div>
  );
}
  