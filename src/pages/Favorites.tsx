// src/pages/Favorites.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import PostCard from "../components/PostCard";
import { getFavoritePosts } from "../apis/posts";
import { useTheme } from "../contexts/ThemeContext";

export default function Favorites() {
  const nav = useNavigate();
  const { isDarkMode } = useTheme();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 다크모드 스타일 (새 색상 가이드 적용)
  const bgMain = isDarkMode ? "#0B0F19" : "#ffffff";
  const textPrimary = isDarkMode ? "#FFFFFF" : "#111827";
  const textSecondary = isDarkMode ? "#A7B1C2" : "#6b7280";
  const borderColor = isDarkMode ? "#1A2233" : "#f3f4f6";

  useEffect(() => {
    const fetchFavoritePosts = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        setError("로그인이 필요합니다.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await getFavoritePosts(userId);
        console.log("❤️ 관심목록 전체 응답:", res);
        console.log("❤️ 관심목록 data:", res.data);
        
        // 다양한 응답 구조 처리
        let postsData: any[] = [];
        if (Array.isArray(res.data)) {
          postsData = res.data;
        } else if (res.data?.posts && Array.isArray(res.data.posts)) {
          postsData = res.data.posts;
        } else if (res.data?.favorites && Array.isArray(res.data.favorites)) {
          postsData = res.data.favorites;
        } else if (res.data?.data && Array.isArray(res.data.data)) {
          postsData = res.data.data;
        }
        
        setPosts(postsData);
      } catch (err: any) {
        console.error("관심목록 로드 실패:", err);
        if (err.response?.status === 404) {
          // API가 아직 구현되지 않은 경우 빈 목록 표시 (에러 없이)
          setPosts([]);
          setError(null);
        } else {
          setError("관심목록을 불러올 수 없습니다.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFavoritePosts();
  }, []);

  return (
    <div 
      className="min-h-screen pb-20 transition-colors"
      style={{ backgroundColor: bgMain }}
    >
      {/* 헤더 */}
      <div 
        className="sticky top-0 px-4 py-3 flex items-center gap-3 z-10 transition-colors"
        style={{ backgroundColor: bgMain, borderBottom: `1px solid ${borderColor}` }}
      >
        <button onClick={() => nav(-1)} className="p-1">
          <ArrowLeft className="w-6 h-6" style={{ color: textPrimary }} />
        </button>
        <h2 style={{ color: textPrimary }}>관심목록</h2>
      </div>

      {/* 로딩 */}
      {loading && (
        <div className="text-center py-16" style={{ color: textSecondary }}>불러오는 중...</div>
      )}

      {/* 에러 */}
      {error && (
        <div className="text-center py-16 text-red-500">{error}</div>
      )}

      {/* 게시글 리스트 */}
      {!loading && !error && (
        <div style={{ backgroundColor: bgMain }}>
          {posts.length === 0 ? (
            <div className="text-center py-12" style={{ color: textSecondary }}>
              관심 등록한 게시글이 없습니다.
            </div>
          ) : (
            posts.map((item) => {
              // 응답 구조에 따라 post 객체 추출
              const post = item.post || item;
              console.log("📷 게시글 이미지:", post.images);
              return (
                <PostCard
                  key={post.id}
                  id={post.id}
                  title={post.title}
                  price={`${Math.floor(Number(post.price)).toLocaleString()}원`}
                  image={post.images?.[0]?.imageUrl || "/placeholder.png"}
                  currentPeople={post.currentQuantity ?? 0}
                  maxPeople={post.minParticipants ?? 2}
                  location={post.pickupLocation || "명지대 캠퍼스"}
                  status={post.status || "open"}
                  onClick={() => nav(`/post/${post.id}`)}
                  isDarkMode={isDarkMode}
                />
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

