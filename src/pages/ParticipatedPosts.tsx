// src/pages/ParticipatedPosts.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import PostCard from "../components/PostCard";
import { getParticipatedPosts } from "../apis/posts";
import { useTheme } from "../contexts/ThemeContext";

export default function ParticipatedPosts() {
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
    const fetchParticipatedPosts = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        setError("로그인이 필요합니다.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await getParticipatedPosts(userId);
        console.log("📦 참여한 게시글 전체 응답:", res);
        console.log("📦 참여한 게시글 data:", res.data);
        // 응답 구조에 따라 처리
        const postsData = res.data?.posts || res.data || [];
        setPosts(Array.isArray(postsData) ? postsData : []);
      } catch (err) {
        console.error(err);
        setError("게시글을 불러올 수 없습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchParticipatedPosts();
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
        <h2 style={{ color: textPrimary }}>참여한 공동구매</h2>
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
              참여한 공동구매가 없습니다.
            </div>
          ) : (
            posts.map((item) => {
              // 참여 정보 안에 post 객체가 있음
              const post = item.post || item;
              console.log("📷 게시글 이미지:", post.images);
              return (
                <PostCard
                  key={post.id}
                  id={post.id}
                  title={post.title}
                  price={`${Number(post.price).toLocaleString()}원`}
                  image={post.images?.[0]?.imageUrl || "/placeholder.png"}
                  currentPeople={post.currentQuantity ?? 0}
                  maxPeople={post.minParticipants ?? 2}
                  location={post.pickupLocation || "명지대 캠퍼스"}
                  status={post.status === "open" ? "recruiting" : "closed"}
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

