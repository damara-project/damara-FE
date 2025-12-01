/**
 * 이미지 URL을 HTTPS로 변환하는 유틸리티 함수
 * 상대 경로인 경우 VITE_API_BASE를 사용하여 전체 URL로 변환
 * EC2 IP가 포함된 URL은 Cloudflare Tunnel 주소로 변환
 */
export const getImageUrl = (imagePath: string | null | undefined): string => {
  if (!imagePath) {
    return "/placeholder.png";
  }

  // 이미 전체 URL인 경우
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    // EC2 IP 주소가 포함된 경우 Cloudflare Tunnel 주소로 변환
    if (imagePath.includes("3.38.145.117") || imagePath.includes("ec2-")) {
      const apiBase = import.meta.env.VITE_API_BASE || "";
      // URL에서 경로 부분만 추출
      try {
        const url = new URL(imagePath);
        const path = url.pathname;
        return `${apiBase}${path}`;
      } catch {
        // URL 파싱 실패 시 경로만 추출 시도
        const pathMatch = imagePath.match(/\/uploads\/.*/);
        if (pathMatch) {
          return `${apiBase}${pathMatch[0]}`;
        }
        // 경로를 찾을 수 없으면 상대 경로로 처리
        const cleanPath = imagePath.replace(/^https?:\/\/[^\/]+/, "");
        return `${apiBase}${cleanPath}`;
      }
    }
    
    // HTTP를 HTTPS로 변환 (Mixed Content 방지)
    if (imagePath.startsWith("http://")) {
      return imagePath.replace("http://", "https://");
    }
    return imagePath;
  }

  // 상대 경로인 경우 VITE_API_BASE와 결합
  const apiBase = import.meta.env.VITE_API_BASE || "";
  
  // 경로 정규화
  let cleanPath = imagePath.trim();
  
  // 이미 /로 시작하는 경우
  if (cleanPath.startsWith("/")) {
    // /uploads/로 시작하지 않으면 /uploads/images/ 추가
    if (!cleanPath.startsWith("/uploads/")) {
      cleanPath = `/uploads/images${cleanPath}`;
    }
  } else {
    // 파일명만 있는 경우 (확장자 또는 UUID 형식)
    // UUID 형식 체크: 8-4-4-4-12 형식 또는 파일 확장자 포함
    const isLikelyFilename = cleanPath.includes(".") || /^[a-f0-9-]{20,}$/i.test(cleanPath);
    
    if (isLikelyFilename) {
      cleanPath = `/uploads/images/${cleanPath}`;
    } else {
      cleanPath = `/uploads/images/${cleanPath}`;
    }
  }
  
  return `${apiBase}${cleanPath}`;
};

