// src/components/PostCard.tsx

import { useState } from "react";
import { MapPin, Users, ImageOff } from "lucide-react";

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
  isDarkMode?: boolean;
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
  isDarkMode = false,
}: PostCardProps) {
  const progressPercent = (currentPeople / maxPeople) * 100;
  const [imgError, setImgError] = useState(false);

  // 다크모드 스타일 (새 색상 가이드 적용)
  const textPrimary = isDarkMode ? "#FFFFFF" : "#111827";
  const textSecondary = isDarkMode ? "#A7B1C2" : "#6b7280";
  const textTertiary = isDarkMode ? "#6B7688" : "#9ca3af";
  const borderColor = isDarkMode ? "#1A2233" : "#f3f4f6";
  const bgCard = isDarkMode ? "#151C2B" : "#f3f4f6";
  const pointColor = isDarkMode ? "#4F8BFF" : "#6F91BC";
  const badgeBg = isDarkMode ? "#1A62FF33" : undefined;
  const badgeText = isDarkMode ? "#8BB3FF" : "#ffffff";

  return (
    <div
      onClick={onClick}
      className="flex gap-4 py-4 px-4 cursor-pointer transition-all"
      style={{ borderBottom: `1px solid ${borderColor}` }}
    >
      {/* 썸네일 */}
      <div 
        className="w-[120px] h-[120px] rounded-xl overflow-hidden flex-shrink-0 relative"
        style={{ backgroundColor: bgCard }}
      >
        {imgError || !image ? (
          <div className="w-full h-full flex items-center justify-center">
            <ImageOff className="w-8 h-8" style={{ color: textSecondary }} />
          </div>
        ) : (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        )}

        {/* 모집중 배지 */}
        {status === "recruiting" && (
          <div className="absolute top-2 left-2">
            <span 
              className="text-[10px] px-2 py-0.5 rounded-full shadow-sm"
              style={{ 
                backgroundColor: isDarkMode ? "#1A62FF33" : undefined,
                color: badgeText,
                background: !isDarkMode ? "linear-gradient(to right, #6F91BC, #8BA3C3)" : "#1A62FF33"
              }}
            >
              모집중
            </span>
          </div>
        )}
      </div>

      {/* 게시글 정보 */}
      <div className="flex-1 flex flex-col justify-between min-w-0 py-1">
        <div className="space-y-2">
          {/* 제목 */}
          <h3 className="line-clamp-2 leading-snug" style={{ color: textPrimary }}>
            {title}
          </h3>

          {/* 위치 */}
          <div className="flex items-center gap-1.5 text-xs" style={{ color: textSecondary }}>
            <MapPin className="w-3 h-3" style={{ color: pointColor }} />
            <span>{location}</span>
          </div>

          {/* 참여 인원 + 진행률 */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs">
              <Users className="w-3.5 h-3.5" style={{ color: pointColor }} />
              <span style={{ color: textTertiary }}>
                {currentPeople}/{maxPeople}명 참여
              </span>
            </div>

            {/* 진행률 바 */}
            <div 
              className="w-full h-1.5 rounded-full overflow-hidden"
              style={{ backgroundColor: isDarkMode ? "#1A2233" : "#f3f4f6" }}
            >
              <div
                className="h-full transition-all rounded-full"
                style={{ 
                  width: `${progressPercent}%`,
                  backgroundColor: pointColor
                }}
              />
            </div>
          </div>
        </div>

        {/* 가격 */}
        <p 
          className={`mt-2 font-medium ${!isDarkMode ? "bg-gradient-to-r from-[#1A2F4A] to-[#355074] bg-clip-text text-transparent" : ""}`}
          style={isDarkMode ? { color: "#4F8BFF" } : undefined}
        >
          {price}
        </p>
      </div>
    </div>
  );
}
