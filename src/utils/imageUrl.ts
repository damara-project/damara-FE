/**
 * 이미지 URL을 HTTPS로 변환하는 유틸리티 함수
 * 상대 경로인 경우 VITE_API_BASE를 사용하여 전체 URL로 변환
 */
export const getImageUrl = (imagePath: string | null | undefined): string => {
  if (!imagePath) {
    return "/placeholder.png";
  }

  // 이미 전체 URL인 경우 그대로 반환
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    // HTTP를 HTTPS로 변환 (Mixed Content 방지)
    if (imagePath.startsWith("http://")) {
      return imagePath.replace("http://", "https://");
    }
    return imagePath;
  }

  // 상대 경로인 경우 VITE_API_BASE와 결합
  const apiBase = import.meta.env.VITE_API_BASE || "";
  const cleanPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
  
  return `${apiBase}${cleanPath}`;
};

