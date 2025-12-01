// src/components/PostCard.tsx

import { useState, useEffect } from "react";
import { MapPin, Users, ImageOff, Heart } from "lucide-react";
import { checkFavorite, addFavorite, removeFavorite } from "../apis/posts";
import { getImageUrl } from "../utils/imageUrl";

export interface PostCardProps {
  id: number;
  image: string;
  title: string;
  price: string;
  currentPeople: number;
  maxPeople: number;
  location: string;
  status: "open" | "closed" | "in_progress" | "completed" | "recruiting";
  onClick?: () => void;
  isDarkMode?: boolean;
}

export default function PostCard({
  id,
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
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const currentUserId = localStorage.getItem("userId") || "";

  // 관심 여부 확인
  useEffect(() => {
    if (currentUserId && id) {
      checkFavorite(String(id), currentUserId)
        .then((res) => {
          setIsFavorite(res.data.isFavorite || false);
        })
        .catch(() => {
          setIsFavorite(false);
        });
    }
  }, [id, currentUserId]);

  // 하트 클릭 핸들러
  const handleHeartClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // 카드 클릭 이벤트 방지
    if (!currentUserId || favoriteLoading) return;

    const newFavoriteState = !isFavorite;
    setIsFavorite(newFavoriteState);
    setFavoriteLoading(true);

    try {
      if (newFavoriteState) {
        await addFavorite(String(id), currentUserId);
      } else {
        await removeFavorite(String(id), currentUserId);
      }
    } catch (err) {
      console.error("관심 등록/해제 실패:", err);
      setIsFavorite(!newFavoriteState); // 롤백
    } finally {
      setFavoriteLoading(false);
    }
  };

  // 다크모드 스타일 (새 색상 가이드 적용)
  const textPrimary = isDarkMode ? "#FFFFFF" : "#111827";
  const textSecondary = isDarkMode ? "#A7B1C2" : "#6b7280";
  const textTertiary = isDarkMode ? "#6B7688" : "#9ca3af";
  const borderColor = isDarkMode ? "#1A2233" : "#f3f4f6";
  const bgCard = isDarkMode ? "#151C2B" : "#f3f4f6";
  const pointColor = isDarkMode ? "#4F8BFF" : "#6F91BC";
  // 상태별 배지 정보 (모집중 색상 기준으로 약간씩 변형)
  const getStatusBadge = () => {
    const statusMap: Record<string, { label: string; color: string }> = {
      open: { label: "모집중", color: isDarkMode ? "#5B9BD5" : "#6BA3E8" },
      recruiting: { label: "모집중", color: isDarkMode ? "#5B9BD5" : "#6BA3E8" },
      closed: { label: "모집완료", color: isDarkMode ? "#7A9BC4" : "#8BA8D0" },
      in_progress: { label: "진행중", color: isDarkMode ? "#6BA8C5" : "#7BB8D8" },
      completed: { label: "거래완료", color: isDarkMode ? "#6BB5C0" : "#7CC5D5" },
    };
    
    return statusMap[status] || statusMap.open;
  };

  const statusBadge = getStatusBadge();
  const badgeText = "#ffffff";
  
  // 모집 완료 여부 확인
  const isRecruitmentComplete = currentPeople >= maxPeople;
  
  // 이미지 URL 처리 (HTTPS 변환)
  const processedImageUrl = getImageUrl(image);

  return (
    <div
      onClick={onClick}
      className="flex gap-4 py-4 px-4 cursor-pointer transition-all relative"
      style={{ 
        borderBottom: `1px solid ${borderColor}`,
      }}
    >
      {/* 모집 완료 오버레이 */}
      {isRecruitmentComplete && (
        <div 
          className="absolute inset-0 z-10 backdrop-blur-sm rounded-lg"
          style={{
            backgroundColor: isDarkMode ? "rgba(0, 0, 0, 0.2)" : "rgba(255, 255, 255, 0.3)",
            pointerEvents: "none"
          }}
        />
      )}
      {/* 썸네일 */}
      <div 
        className="w-[120px] h-[120px] rounded-xl overflow-hidden flex-shrink-0 relative"
        style={{ backgroundColor: bgCard }}
      >
        {imgError || !processedImageUrl || processedImageUrl === "/placeholder.png" ? (
          <div className="w-full h-full flex items-center justify-center">
            <ImageOff className="w-8 h-8" style={{ color: textSecondary }} />
          </div>
        ) : (
          <img
            src={processedImageUrl}
            alt={title}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        )}

        {/* 상태 배지 */}
        <div className="absolute top-2 left-2">
          <span 
            className="text-[10px] px-2 py-0.5 rounded-full shadow-sm"
            style={{ 
              backgroundColor: statusBadge.color,
              color: badgeText
            }}
          >
            {statusBadge.label}
          </span>
        </div>
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
              <button
                onClick={handleHeartClick}
                disabled={favoriteLoading}
                className="ml-auto p-1 transition-opacity disabled:opacity-50"
                style={{ color: isFavorite ? "#ef4444" : textTertiary }}
              >
                <Heart 
                  className="w-4 h-4" 
                  style={{ 
                    color: isFavorite ? "#ef4444" : textTertiary,
                    fill: isFavorite ? "#ef4444" : "none"
                  }} 
                />
              </button>
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
