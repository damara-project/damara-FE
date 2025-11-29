// src/pages/Home.tsx
import { useState, useEffect, useRef } from "react";
import { ChevronDown, Search, Menu, Bell, Plus, X, Settings, HelpCircle, Info, LogOut, User, Filter, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

import PostCard from "../components/PostCard";
import { Button } from "../components/ui/button";
import { getPosts } from "../apis/posts";
import { getNotifications, getUnreadCount, markAllAsRead, markAsRead } from "../apis/notifications";
import { useTheme } from "../contexts/ThemeContext";

export default function Home() {
  const nav = useNavigate();
  const { isDarkMode } = useTheme();
  const searchInputRef = useRef<HTMLInputElement>(null);

  // 다크모드 스타일 (새 색상 가이드 적용)
  const bgMain = isDarkMode ? "#0B0F19" : "#ffffff";
  const bgCard = isDarkMode ? "#151C2B" : "#ffffff";
  const textPrimary = isDarkMode ? "#FFFFFF" : "#111827";
  const textSecondary = isDarkMode ? "#A7B1C2" : "#6b7280";
  const textTertiary = isDarkMode ? "#6B7688" : "#9ca3af";
  const borderColor = isDarkMode ? "#1A2233" : "#e5e7eb";
  const pointColor = isDarkMode ? "#4F8BFF" : "#355074";
  const bgIcon = isDarkMode ? "#1A2233" : "#f3f4f6";

  // 검색 상태
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // 모달 상태
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showCategorySheet, setShowCategorySheet] = useState(false);

  // 알림 상태
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationsLoading, setNotificationsLoading] = useState(false);

  // 카테고리
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = [
    { id: "all", label: "전체", color: "from-[#1A2F4A] to-[#355074]" },
    { id: "food", label: "먹거리", color: "from-[#1A2F4A] to-[#355074]" },
    { id: "daily", label: "일상용품", color: "from-[#1A2F4A] to-[#355074]" },
    { id: "beauty", label: "뷰티·패션", color: "from-[#1A2F4A] to-[#355074]" },
    { id: "electronics", label: "전자기기", color: "from-[#1A2F4A] to-[#355074]" },
    { id: "school", label: "학용품", color: "from-[#1A2F4A] to-[#355074]" },
    { id: "freemarket", label: "프리마켓", color: "from-[#1A2F4A] to-[#355074]" },
  ];

  // 게시글 리스트 (API)
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);      // 로딩
  const [error, setError] = useState<string | null>(null); // 에러

  // 검색창 열 때 자동 포커스
  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  // 검색 + 카테고리 필터링된 게시글
  const filteredPosts = posts.filter((post) => {
    // 검색어 필터링
    const matchesSearch = searchQuery === "" || 
      post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.pickupLocation?.toLowerCase().includes(searchQuery.toLowerCase());
    
    // 카테고리 필터링 (전체면 모든 게시글, 아니면 해당 카테고리만)
    const matchesCategory = activeCategory === "all" || post.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  // ===== API 호출 =====
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await getPosts(); // GET /api/posts
        console.log("📦 Posts API 응답:", res.data); // 디버깅용
        // 각 게시글의 category 확인
        res.data.forEach((post: any, i: number) => {
          console.log(`📋 게시글[${i}] "${post.title}" category:`, post.category);
        });
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

  // ===== 알림 API 호출 =====
  const userId = localStorage.getItem("userId") || "";

  // 알림 목록 조회
  const fetchNotifications = async () => {
    if (!userId) return;
    setNotificationsLoading(true);
    try {
      const res = await getNotifications(userId);
      console.log("🔔 Notifications API 응답:", res.data);
      setNotifications(res.data.notifications || []);
      setUnreadCount(res.data.unreadCount || 0);
    } catch (e) {
      console.error("알림 조회 실패:", e);
    } finally {
      setNotificationsLoading(false);
    }
  };

  // 읽지 않은 알림 개수 조회
  const fetchUnreadCount = async () => {
    if (!userId) return;
    try {
      const res = await getUnreadCount(userId);
      setUnreadCount(res.data.unreadCount || 0);
    } catch (e) {
      console.error("읽지 않은 알림 개수 조회 실패:", e);
    }
  };

  // 모든 알림 읽음 처리
  const handleMarkAllAsRead = async () => {
    if (!userId) return;
    try {
      await markAllAsRead(userId);
      // 알림 목록 새로고침
      fetchNotifications();
    } catch (e) {
      console.error("모든 알림 읽음 처리 실패:", e);
    }
  };

  // 특정 알림 읽음 처리
  const handleMarkAsRead = async (notificationId: string) => {
    if (!userId) return;
    try {
      await markAsRead(notificationId, userId);
      // 알림 목록 새로고침
      fetchNotifications();
    } catch (e) {
      console.error("알림 읽음 처리 실패:", e);
    }
  };

  // 컴포넌트 마운트 시 읽지 않은 알림 개수 조회
  useEffect(() => {
    fetchUnreadCount();
  }, []);

  // 알림 모달 열릴 때 알림 목록 조회
  useEffect(() => {
    if (showNotificationModal) {
      fetchNotifications();
    }
  }, [showNotificationModal]);

  return (
    <div 
      className="relative min-h-screen pb-20 transition-colors"
      style={{ backgroundColor: bgMain }}
    >
      {/* 스크롤바 숨기기 스타일 */}
      <style>
        {`
          .category-scroll::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
      {/* ===== 헤더 ===== */}
      <div 
        className="sticky top-0 z-10 transition-colors"
        style={{ backgroundColor: bgMain }}
      >
        <div className="px-4 py-3 flex items-center justify-between">
          {/* 검색 모드가 아닐 때 */}
          {!showSearch ? (
            <>
              <button className="flex items-center gap-1.5 group">
                <span 
                  className="text-lg font-semibold"
                  style={{ color: isDarkMode ? "#FFFFFF" : "#1A2F4A" }}
                >
                  명지대
                </span>
                <ChevronDown className="w-5 h-5" style={{ color: isDarkMode ? "#A7B1C2" : "#6F91BC" }} />
              </button>

              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setShowSearch(true)}
                  className="p-1.5 transition-colors"
                >
                  <Search className="w-6 h-6" style={{ color: isDarkMode ? "#A7B1C2" : "#6b7280" }} />
                </button>
                <button 
                  onClick={() => setShowMenuModal(true)}
                  className="p-1.5 transition-colors"
                >
                  <Menu className="w-6 h-6" style={{ color: isDarkMode ? "#A7B1C2" : "#6b7280" }} />
                </button>
                <button 
                  onClick={() => setShowNotificationModal(true)}
                  className="p-1.5 relative transition-colors"
                >
                  <Bell className="w-6 h-6" style={{ color: isDarkMode ? "#A7B1C2" : "#6b7280" }} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 rounded-full text-white text-[10px] font-bold flex items-center justify-center px-1">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </button>
              </div>
            </>
          ) : (
            /* 검색 모드일 때 */
            <div className="flex items-center gap-3 w-full">
              <div 
                className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-xl"
                style={{ 
                  backgroundColor: isDarkMode ? "#1A2233" : "#f3f4f6",
                  border: `1px solid ${borderColor}`
                }}
              >
                <Search className="w-5 h-5 flex-shrink-0" style={{ color: textSecondary }} />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="공동구매 검색..."
                  className="flex-1 bg-transparent outline-none text-sm"
                  style={{ color: textPrimary }}
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="p-1">
                    <X className="w-4 h-4" style={{ color: textSecondary }} />
                  </button>
                )}
              </div>
              <button
                onClick={() => { setShowSearch(false); setSearchQuery(""); }}
                className="px-2 py-2 text-sm font-medium"
                style={{ color: pointColor }}
              >
                취소
              </button>
            </div>
          )}
        </div>

        {/* ===== 카테고리 칩 ===== */}
        <div 
          className="category-scroll flex gap-2 overflow-x-auto px-4 pb-3"
          style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
        >
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-3 py-1.5 text-sm rounded-full whitespace-nowrap transition-all
                ${activeCategory === category.id 
                  ? "bg-[#1A2F4A] text-white border-transparent shadow-sm" 
                  : "bg-white border border-gray-200 shadow-none"
                }`}
              style={
                activeCategory !== category.id
                  ? {
                      backgroundColor: isDarkMode ? "#151C2B" : "#ffffff",
                      color: isDarkMode ? "#A7B1C2" : "#6b7280",
                      borderColor: isDarkMode ? "#1A2233" : "#e5e7eb",
                    }
                  : undefined
              }
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* ===== 로딩 ===== */}
      {loading && (
        <div className="text-center py-16" style={{ color: textSecondary }}>불러오는 중...</div>
      )}

      {/* ===== 에러 ===== */}
      {error && (
        <div className="text-center py-16 text-red-500">{error}</div>
      )}

      {/* ===== 검색 결과 안내 ===== */}
      {showSearch && searchQuery && !loading && (
        <div 
          className="px-4 py-2"
          style={{ backgroundColor: bgMain }}
        >
          <p className="text-xs" style={{ color: textSecondary }}>
            <span style={{ color: pointColor }}>"{searchQuery}"</span> 검색 결과 
            <span className="font-medium" style={{ color: textPrimary }}> {filteredPosts.length}개</span>
          </p>
        </div>
      )}

      {/* ===== 게시글 리스트 ===== */}
      {!loading && !error && (
        <div className="px-4 pt-2 pb-4" style={{ backgroundColor: bgMain }}>
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12" style={{ color: textSecondary }}>
              {searchQuery ? (
                <div className="space-y-1">
                  <p>검색 결과가 없습니다.</p>
                  <p className="text-sm" style={{ color: textTertiary }}>다른 키워드로 검색해보세요.</p>
                </div>
              ) : (
                "게시글이 없습니다."
              )}
            </div>
          ) : (
            filteredPosts.map((post) => (
              <PostCard
                key={post.id}
                id={post.id}
                title={post.title}
                price={`${post.price?.toLocaleString() ?? 0}원`}
                image={post.images?.[0]?.imageUrl || "/placeholder.png"}
                currentPeople={post.currentQuantity ?? 0}
                maxPeople={post.minParticipants ?? 2}
                location={post.pickupLocation || "명지대 캠퍼스"}
                status={post.status === "open" ? "recruiting" : "completed"}
                onClick={() => nav(`/post/${post.id}`)}
                isDarkMode={isDarkMode}
              />
            ))
          )}
        </div>
      )}

      {/* ===== FAB ===== */}
      <button
        onClick={() => nav("/create")}
        className="fixed w-14 h-14 rounded-full flex items-center justify-center transition-transform hover:scale-105 active:scale-95 z-50"
        style={{ 
          bottom: '88px', 
          right: 'max(24px, calc(50% - 215px + 24px))',
          background: 'linear-gradient(180deg, #1A2F4A 0%, #253B67 100%)',
          boxShadow: '0 4px 14px rgba(0, 0, 0, 0.1)'
        }}
      >
        <Plus className="w-7 h-7 text-white" strokeWidth={2} />
      </button>

      {/* ===== 메뉴 모달 ===== */}
      {showMenuModal && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            paddingTop: '60px',
            zIndex: 9999,
          }}
          onClick={() => setShowMenuModal(false)}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: bgCard,
              borderRadius: '1rem',
              width: '90%',
              maxWidth: '20rem',
              overflow: 'hidden',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            }}
          >
            {/* 모달 헤더 */}
            <div className="bg-gradient-to-r from-[#1A2F4A] to-[#355074] px-4 py-4 flex items-center justify-between">
              <h3 className="text-white font-medium">메뉴</h3>
              <button onClick={() => setShowMenuModal(false)} className="p-1">
                <X className="w-5 h-5 text-white/80" />
              </button>
            </div>

            {/* 메뉴 항목들 */}
            <div className="p-2">
              <button
                onClick={() => {
                  setShowMenuModal(false);
                  nav("/profile");
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors hover:bg-gray-100"
                style={{ color: textPrimary }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: bgIcon }}>
                  <User className="w-5 h-5" style={{ color: pointColor }} />
                </div>
                <span>내 프로필</span>
              </button>

              <button
                onClick={() => {
                  setShowMenuModal(false);
                  nav("/settings");
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors hover:bg-gray-100"
                style={{ color: textPrimary }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: bgIcon }}>
                  <Settings className="w-5 h-5" style={{ color: pointColor }} />
                </div>
                <span>앱 설정</span>
              </button>

              <button
                onClick={() => {
                  setShowMenuModal(false);
                  nav("/faq");
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors hover:bg-gray-100"
                style={{ color: textPrimary }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: bgIcon }}>
                  <HelpCircle className="w-5 h-5" style={{ color: pointColor }} />
                </div>
                <span>자주 묻는 질문</span>
              </button>

              <button
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors hover:bg-gray-100"
                style={{ color: textPrimary }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: bgIcon }}>
                  <Info className="w-5 h-5" style={{ color: pointColor }} />
                </div>
                <div className="flex-1 text-left">
                  <span>앱 정보</span>
                  <p className="text-xs" style={{ color: textSecondary }}>버전 1.0.0</p>
                </div>
              </button>
            </div>

            {/* 로그아웃 */}
            <div className="px-4 pb-4">
              <button
                onClick={() => {
                  if (confirm("로그아웃 하시겠습니까?")) {
                    localStorage.removeItem("user");
                    localStorage.removeItem("userId");
                    nav("/login");
                  }
                }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>로그아웃</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== 알림 모달 ===== */}
      {showNotificationModal && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            paddingTop: '60px',
            zIndex: 9999,
          }}
          onClick={() => setShowNotificationModal(false)}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: bgCard,
              borderRadius: '1rem',
              width: '90%',
              maxWidth: '24rem',
              maxHeight: '70vh',
              overflow: 'hidden',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* 모달 헤더 */}
            <div className="bg-gradient-to-r from-[#1A2F4A] to-[#355074] px-4 py-4 flex items-center justify-between flex-shrink-0">
              <h3 className="text-white font-medium">알림</h3>
              <button onClick={() => setShowNotificationModal(false)} className="p-1">
                <X className="w-5 h-5 text-white/80" />
              </button>
            </div>

            {/* 알림 목록 */}
            <div className="flex-1 overflow-y-auto">
              {notificationsLoading ? (
                <div className="text-center py-12" style={{ color: textSecondary }}>
                  불러오는 중...
                </div>
              ) : notifications.length === 0 ? (
                <div className="text-center py-12" style={{ color: textSecondary }}>
                  알림이 없습니다.
                </div>
              ) : (
                <div className="p-2">
                  {notifications.map((notification: any) => (
                    <div
                      key={notification.id}
                      className="p-3 rounded-xl mb-2 transition-colors cursor-pointer hover:opacity-80"
                      style={{ 
                        backgroundColor: !notification.isRead 
                          ? (isDarkMode ? "rgba(79, 139, 255, 0.1)" : "rgba(111, 145, 188, 0.1)") 
                          : "transparent"
                      }}
                      onClick={() => !notification.isRead && handleMarkAsRead(notification.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: bgIcon }}
                        >
                          <Bell className="w-5 h-5" style={{ color: pointColor }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium" style={{ color: textPrimary }}>
                              {notification.title}
                            </span>
                            {!notification.isRead && (
                              <span className="px-2 py-0.5 text-[10px] rounded-full bg-gradient-to-r from-[#6F91BC] to-[#8BA3C3] text-white">
                                NEW
                              </span>
                            )}
                          </div>
                          <p className="text-sm mt-1" style={{ color: textSecondary }}>
                            {notification.message || notification.content}
                          </p>
                          <p className="text-xs mt-1" style={{ color: textTertiary }}>
                            {notification.createdAt ? new Date(notification.createdAt).toLocaleString('ko-KR') : ''}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 모달 푸터 */}
            <div 
              className="px-4 py-3 flex-shrink-0"
              style={{ borderTop: `1px solid ${borderColor}` }}
            >
              <button
                onClick={handleMarkAllAsRead}
                className="w-full py-2 text-sm font-medium rounded-xl transition-colors hover:opacity-80"
                style={{ color: pointColor }}
                disabled={unreadCount === 0}
              >
                모두 읽음으로 표시 {unreadCount > 0 && `(${unreadCount})`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
