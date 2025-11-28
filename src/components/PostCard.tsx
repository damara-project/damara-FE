// src/components/PostCard.tsx

import { MapPin, Users } from "lucide-react";

export interface PostCardProps {
  id: number;
  image: string;
  title: string;
  price: string;
  currentPeople: number;
  maxPeople: number;
  location: string;
  status: "recruiting" | "completed";
  onClick?: () => void;
}

export default function PostCard({
  image,
  title,
  price,
  currentPeople,
  maxPeople,
  location,
  status,
  onClick,
}: PostCardProps) {
  const progressPercent = (currentPeople / maxPeople) * 100;

  return (
    <div
      onClick={onClick}
      className="flex gap-4 py-4 px-4 cursor-pointer hover:bg-gradient-to-r hover:from-[#8BA3C3]/5 hover:to-transparent transition-all border-b border-gray-100"
    >
      {/* 썸네일 */}
      <div className="w-[120px] h-[120px] rounded-xl overflow-hidden flex-shrink-0 relative">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />

        {/* 모집중 배지 */}
        {status === "recruiting" && (
          <div className="absolute top-2 left-2">
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-gradient-to-r from-[#6F91BC] to-[#8BA3C3] text-white shadow-sm">
              모집중
            </span>
          </div>
        )}
      </div>

      {/* 게시글 정보 */}
      <div className="flex-1 flex flex-col justify-between min-w-0 py-1">
        <div className="space-y-2">
          {/* 제목 */}
          <h3 className="text-gray-900 line-clamp-2 leading-snug">
            {title}
          </h3>

          {/* 위치 */}
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <MapPin className="w-3 h-3 text-[#6F91BC]" />
            <span>{location}</span>
          </div>

          {/* 참여 인원 + 진행률 */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs">
              <Users className="w-3.5 h-3.5 text-[#6F91BC]" />
              <span className="text-gray-600">
                {currentPeople}/{maxPeople}명 참여
              </span>
            </div>

            {/* 진행률 바 */}
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#6F91BC] to-[#8BA3C3] transition-all rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* 가격 */}
        <p className="bg-gradient-to-r from-[#1A2F4A] to-[#355074] bg-clip-text text-transparent mt-2">
          {price}
        </p>
      </div>
    </div>
  );
}
