// src/pages/Home.tsx
import { useState, useEffect } from "react";
import { ChevronDown, Search, Menu, Bell, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

import PostCard from "../components/PostCard";
import { Button } from "../components/ui/button";
import { getPosts } from "../apis/posts";

export default function Home() {
  const nav = useNavigate();

  // 카테고리
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = [
    { id: "all", label: "전체", color: "from-[#1A2F4A] to-[#355074]" },
    { id: "food", label: "식료품", color: "from-[#6F91BC] to-[#8BA3C3]" },
    { id: "living", label: "생활용품", color: "from-[#355074] to-[#6F91BC]" },
    { id: "electronics", label: "전자제품", color: "from-[#8BA3C3] to-[#6F91BC]" },
    { id: "etc", label: "기타", color: "from-[#1A2F4A] to-[#6F91BC]" },
  ];

  // 게시글 리스트 (API)
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);      // 로딩
  const [error, setError] = useState<string | null>(null); // 에러

  // ===== API 호출 =====
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await getPosts(); // GET /api/posts
        setPosts(res.data); // 배열 형태 그대로 세팅됨
      } catch (e) {
        setError("게시글을 불러올 수 없습니다.");
        console.log(e);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* ===== 헤더 ===== */}
      <div className="bg-gradient-to-b from-white to-[#8BA3C3]/5 border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-3 flex items-center justify-between">
          <button className="flex items-center gap-1 group">
            <span className="bg-gradient-to-r from-[#1A2F4A] to-[#355074] bg-clip-text text-transparent">
              명지대
            </span>
            <ChevronDown className="w-5 h-5 text-[#6F91BC] group-hover:text-[#355074]" />
          </button>

          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-[#8BA3C3]/10 rounded-full">
              <Search className="w-6 h-6 text-[#355074]" />
            </button>
            <button className="p-2 hover:bg-[#8BA3C3]/10 rounded-full">
              <Menu className="w-6 h-6 text-[#355074]" />
            </button>
            <button className="p-2 relative hover:bg-[#8BA3C3]/10 rounded-full">
              <Bell className="w-6 h-6 text-[#355074]" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-gradient-to-r from-[#6F91BC] to-[#8BA3C3] rounded-full animate-pulse"></span>
            </button>
          </div>
        </div>

        {/* ===== 카테고리 탭 ===== */}
        <div className="flex gap-2 overflow-x-auto px-4 py-3 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-2 text-sm rounded-full whitespace-nowrap transition-all shadow-sm
                ${
                  activeCategory === category.id
                    ? `bg-gradient-to-r ${category.color} text-white`
                    : "bg-white text-gray-700 border border-gray-200 hover:border-[#8BA3C3]"
                }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* ===== 로딩 ===== */}
      {loading && (
        <div className="text-center py-16 text-gray-500">불러오는 중...</div>
      )}

      {/* ===== 에러 ===== */}
      {error && (
        <div className="text-center py-16 text-red-500">{error}</div>
      )}

      {/* ===== 게시글 리스트 ===== */}
      {!loading && !error && (
        <div className="bg-white">
          {posts.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              게시글이 없습니다.
            </div>
          ) : (
            posts.map((post) => (
              <PostCard
                key={post.id}
                id={post.id}
                title={post.title}
                price={`${post.price.toLocaleString()}원`}
                image={post.images?.[0] || "/placeholder.png"}
                currentPeople={post.currentPeople ?? 0} // API엔 없음 → 추후 수정 가능
                maxPeople={post.maxPeople ?? 5}
                location={"명지대 캠퍼스"} // API엔 없음 → 기본값
                status="recruiting"
                onClick={() => nav(`/post/${post.id}`)}
              />
            ))
          )}
        </div>
      )}

      {/* ===== Floating Button ===== */}
      <Button
        onClick={() => nav("/create")}
        className="fixed bottom-28 right-4 w-14 h-14 rounded-full bg-gradient-to-br from-[#1A2F4A] to-[#355074] shadow-xl shadow-[#6F91BC]/20 hover:scale-110 transition"
      >
        <Plus className="w-6 h-6" />
      </Button>
    </div>
  );
}
