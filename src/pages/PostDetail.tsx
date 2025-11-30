// src/pages/PostDetail.tsx

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Users, MapPin, Trash2, ImageOff, Pencil, X, Check, ChevronDown, Heart, MessageCircle } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { getPostDetail, deletePost, updatePost, checkParticipation, participatePost, cancelParticipation, addFavorite, checkFavorite, removeFavorite, updatePostStatus } from "../apis/posts";
import { getChatRoomByPostId } from "../apis/chat";
import { useTheme } from "../contexts/ThemeContext";

export default function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();
  const { isDarkMode } = useTheme();

  // 다크모드 스타일 (새 색상 가이드 적용)
  const bgMain = isDarkMode ? "#0B0F19" : "#ffffff";
  const bgCard = isDarkMode ? "#151C2B" : "#ffffff";
  const textPrimary = isDarkMode ? "#FFFFFF" : "#111827";
  const textSecondary = isDarkMode ? "#A7B1C2" : "#6b7280";
  const textTertiary = isDarkMode ? "#6B7688" : "#9ca3af";
  const borderColor = isDarkMode ? "#1A2233" : "#f3f4f6";
  const pointColor = isDarkMode ? "#4F8BFF" : "#1A2F4A";
  const badgeBg = isDarkMode ? "#1A62FF33" : "#1A2F4A";
  const badgeText = isDarkMode ? "#8BB3FF" : "#ffffff";

  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [isParticipant, setIsParticipant] = useState(false);
  const [participating, setParticipating] = useState(false);
  
  // 수정 모드
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editDeadline, setEditDeadline] = useState("");
  const [saving, setSaving] = useState(false);

  // 관심 등록 상태
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  
  // 상태 변경 로딩
  const [statusLoading, setStatusLoading] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  
  // 채팅방 열기
  const [openingChat, setOpeningChat] = useState(false);

  // 현재 로그인한 사용자 ID
  const currentUserId = localStorage.getItem("userId");

  // 게시글 상세 조회
  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const res = await getPostDetail(id);
        console.log("📦 게시글 상세:", res.data);
        setPost(res.data);
      } catch (err) {
        console.error(err);
        setError("게시글을 불러올 수 없습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  // 참여 여부 확인
  useEffect(() => {
    const checkStatus = async () => {
      if (!id || !currentUserId) return;
      try {
        const res = await checkParticipation(id, currentUserId);
        console.log("📋 참여 여부:", res.data);
        setIsParticipant(res.data.isParticipant);
      } catch (err) {
        console.error(err);
      }
    };
    checkStatus();
  }, [id, currentUserId]);

  // 관심 여부 확인
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (!id || !currentUserId) return;
      try {
        const res = await checkFavorite(id, currentUserId);
        console.log("❤️ 관심 여부:", res.data);
        setIsFavorite(res.data.isFavorite);
      } catch (err) {
        console.error(err);
      }
    };
    checkFavoriteStatus();
  }, [id, currentUserId]);

  // 공동구매 참여
  const handleParticipate = async () => {
    if (!id || !currentUserId) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      setParticipating(true);
      await participatePost(id, currentUserId);
      setIsParticipant(true);
      // 참여 인원 업데이트
      setPost((prev: any) => ({
        ...prev,
        currentQuantity: (prev.currentQuantity ?? 0) + 1,
      }));
      alert("참여가 완료되었습니다!");
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 400) {
        alert("이미 참여했거나 작성자는 참여할 수 없습니다.");
      } else {
        alert("참여에 실패했습니다.");
      }
    } finally {
      setParticipating(false);
    }
  };

  // 공동구매 참여 취소
  const handleCancelParticipation = async () => {
    if (!id || !currentUserId) return;
    if (!confirm("참여를 취소하시겠습니까?")) return;

    try {
      setParticipating(true);
      await cancelParticipation(id, currentUserId);
      setIsParticipant(false);
      // 참여 인원 업데이트
      setPost((prev: any) => ({
        ...prev,
        currentQuantity: Math.max((prev.currentQuantity ?? 1) - 1, 0),
      }));
      alert("참여가 취소되었습니다.");
    } catch (err) {
      console.error(err);
      alert("참여 취소에 실패했습니다.");
    } finally {
      setParticipating(false);
    }
  };

  // 수정 모드 시작
  const startEditing = () => {
    setEditTitle(post.title || "");
    setEditPrice(String(post.price) || "");
    // deadline을 datetime-local 형식으로 변환
    if (post.deadline) {
      const date = new Date(post.deadline);
      setEditDeadline(date.toISOString().slice(0, 16));
    }
    setIsEditing(true);
  };

  // 수정 취소
  const cancelEditing = () => {
    setIsEditing(false);
  };

  // 수정 저장
  const handleSave = async () => {
    if (!id) return;
    if (!editTitle || !editPrice || !editDeadline) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    try {
      setSaving(true);
      const imageUrls = post.images?.map((img: any) => img.imageUrl) || [];
      // deadline을 ISO 8601 형식으로 변환
      const isoDeadline = new Date(editDeadline).toISOString();
      
      console.log("📤 수정 데이터:", {
        title: editTitle,
        price: Number(editPrice),
        deadline: isoDeadline,
        images: imageUrls,
      });

      await updatePost(id, {
        title: editTitle,
        price: Number(editPrice),
        deadline: isoDeadline,
        images: imageUrls,
      });
      
      // 로컬 상태 업데이트
      setPost((prev: any) => ({
        ...prev,
        title: editTitle,
        price: Number(editPrice),
        deadline: editDeadline,
      }));
      
      setIsEditing(false);
      alert("수정되었습니다!");
    } catch (err: any) {
      console.error("❌ 수정 에러:", err);
      console.error("❌ 에러 응답:", err.response?.data);
      alert(`수정에 실패했습니다: ${err.response?.data?.error || err.message}`);
    } finally {
      setSaving(false);
    }
  };

  // 게시글 삭제
  const handleDelete = async () => {
    if (!id) return;
    if (!confirm("정말 삭제하시겠습니까?")) return;

    try {
      setDeleting(true);
      await deletePost(id);
      alert("게시글이 삭제되었습니다.");
      nav("/home");
    } catch (err) {
      console.error(err);
      alert("삭제에 실패했습니다.");
    } finally {
      setDeleting(false);
    }
  };

  // 본인 게시글인지 확인
  const isOwner = currentUserId && post?.authorId === currentUserId;

  // 이미지 URL
  const imageUrl = post?.images?.[0]?.imageUrl || null;

  // 관심 등록/해제 토글
  const toggleFavorite = async () => {
    if (!id || !currentUserId) {
      alert("로그인이 필요합니다.");
      return;
    }

    // 먼저 UI 업데이트 (낙관적 업데이트)
    const newFavoriteState = !isFavorite;
    setIsFavorite(newFavoriteState);

    try {
      setFavoriteLoading(true);
      if (newFavoriteState) {
        await addFavorite(id, currentUserId);
      } else {
        await removeFavorite(id, currentUserId);
      }
      console.log("❤️ 관심 등록/해제 성공:", newFavoriteState ? "등록" : "해제");
    } catch (err: any) {
      console.error("관심 등록/해제 실패:", err);
      // API 실패해도 UI는 유지 (백엔드 구현 전까지 임시)
      // 나중에 백엔드 구현되면 아래 주석 해제
      // setIsFavorite(!newFavoriteState); // 롤백
    } finally {
      setFavoriteLoading(false);
    }
  };

  // 상태 목록 정의 (파스텔톤 색상)
  const statusList = [
    { value: "open", label: "모집중", color: isDarkMode ? "#6F91BC" : "#8BA3C3" },
    { value: "closed", label: "모집완료", color: isDarkMode ? "#A8B5C8" : "#B8C5D8" },
    { value: "in_progress", label: "진행중", color: isDarkMode ? "#7A9BC4" : "#9BB3D1" },
    { value: "completed", label: "거래완료", color: isDarkMode ? "#8FA8C0" : "#A5B8D0" },
  ];

  // 현재 상태의 라벨과 색상 가져오기
  const currentStatus = statusList.find(s => s.value === post?.status) || statusList[0];

  // 게시글 상태 변경 (작성자만)
  const handleStatusChange = async (newStatus: string) => {
    if (!id || !currentUserId) return;
    const statusLabel = statusList.find(s => s.value === newStatus)?.label || newStatus;
    
    try {
      setStatusLoading(true);
      setShowStatusDropdown(false);
      await updatePostStatus(id, newStatus as any, currentUserId);
      setPost((prev: any) => ({ ...prev, status: newStatus }));
    } catch (err: any) {
      console.error("상태 변경 실패:", err);
      console.error("에러 응답:", err.response?.data);
      
      if (err.response?.status === 403) {
        alert("작성자만 상태를 변경할 수 있습니다.");
      } else if (err.response?.status === 400) {
        const errorMessage = err.response?.data?.error || err.response?.data?.message || "상태 변경이 불가능합니다.";
        alert(errorMessage);
      } else {
        const errorMessage = err.response?.data?.error || err.response?.data?.message || "상태 변경에 실패했습니다.";
        alert(errorMessage);
      }
    } finally {
      setStatusLoading(false);
    }
  };

  // 채팅방 열기
  const handleOpenChat = async () => {
    if (!id || !currentUserId) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      setOpeningChat(true);
      // Post ID로 채팅방 조회 또는 생성
      const res = await getChatRoomByPostId(id);
      console.log("💬 채팅방 조회/생성:", res.data);
      
      // 채팅방 ID를 쿼리 파라미터로 전달하여 Chat 페이지로 이동
      const chatRoomId = res.data.id || res.data.chatRoomId;
      if (chatRoomId) {
        nav(`/chat?roomId=${chatRoomId}`);
      } else {
        nav("/chat");
      }
    } catch (err: any) {
      console.error("채팅방 열기 실패:", err);
      if (err.response?.status === 404) {
        alert("게시글을 찾을 수 없습니다.");
      } else {
        alert("채팅방을 열 수 없습니다.");
      }
    } finally {
      setOpeningChat(false);
    }
  };

  if (loading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: bgMain }}
      >
        <p style={{ color: textSecondary }}>불러오는 중...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div 
        className="min-h-screen flex flex-col items-center justify-center gap-4"
        style={{ backgroundColor: bgMain }}
      >
        <p style={{ color: textSecondary }}>{error || "게시글을 찾을 수 없습니다."}</p>
        <Button 
          onClick={() => nav("/home")} 
          variant="outline"
          style={{ 
            borderColor: borderColor, 
            color: textPrimary,
            backgroundColor: bgCard
          }}
        >
          홈으로 돌아가기
        </Button>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex flex-col pb-20 transition-colors"
      style={{ backgroundColor: bgMain }}
    >
      {/* 헤더 */}
      <div 
        className="sticky top-0 px-4 py-3 flex items-center justify-between z-10 transition-colors"
        style={{ backgroundColor: bgMain, borderBottom: `1px solid ${borderColor}` }}
      >
        <div className="flex items-center gap-3">
          <button onClick={() => nav(-1)} className="p-1">
            <ArrowLeft className="w-6 h-6" style={{ color: textPrimary }} />
          </button>
          <h2 style={{ color: textPrimary }}>공동구매 상세</h2>
        </div>

        {/* 본인 게시글이면 수정/삭제 버튼 표시 */}
        {isOwner && !isEditing && (
          <div className="flex items-center gap-1">
            <button
              onClick={startEditing}
              className="p-2 rounded-lg transition"
              style={{ color: textSecondary }}
            >
              <Pencil className="w-5 h-5" />
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* 본인 게시글이 아니면 관심(하트) 버튼 표시 */}
        {!isOwner && !isEditing && (
          <button
            onClick={toggleFavorite}
            disabled={favoriteLoading}
            className="p-2 rounded-lg transition hover:scale-110 disabled:opacity-50"
          >
            <Heart 
              className={`w-6 h-6 transition-colors ${favoriteLoading ? "animate-pulse" : ""}`}
              style={{ 
                color: isFavorite ? "#ef4444" : textSecondary,
                fill: isFavorite ? "#ef4444" : "none"
              }} 
            />
          </button>
        )}
        
        {/* 수정 모드일 때 저장/취소 버튼 */}
        {isOwner && isEditing && (
          <div className="flex items-center gap-1">
            <button
              onClick={cancelEditing}
              disabled={saving}
              className="p-2 rounded-lg transition"
              style={{ color: textSecondary }}
            >
              <X className="w-5 h-5" />
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="p-2 text-green-500 hover:bg-green-900/20 rounded-lg transition"
            >
              <Check className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* 스크롤 콘텐츠 */}
      <div className="flex-1 overflow-y-auto">
        {/* 상품 이미지 */}
        <div 
          className="aspect-square w-full"
          style={{ backgroundColor: isDarkMode ? "#1A2233" : "#f3f4f6" }}
        >
          {imgError || !imageUrl ? (
            <div className="w-full h-full flex items-center justify-center">
              <ImageOff className="w-16 h-16" style={{ color: textTertiary }} />
            </div>
          ) : (
            <img
              src={imageUrl}
              alt={post.title}
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
          )}
        </div>

        {/* 상세 내용 */}
        <div className="p-5 space-y-6">
          {/* 상태/참여인원 */}
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              {/* 작성자면 상태 변경 가능 */}
              {isOwner ? (
                <div className="relative">
                  <button
                    onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                    disabled={statusLoading}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all hover:opacity-90 active:scale-95 disabled:opacity-50"
                    style={{
                      backgroundColor: currentStatus.color,
                      color: "#ffffff"
                    }}
                  >
                    <span className="text-xs font-medium">{currentStatus.label}</span>
                    <ChevronDown 
                      className={`w-3.5 h-3.5 transition-transform ${showStatusDropdown ? "rotate-180" : ""}`} 
                    />
                  </button>
                  
                  {/* 상태 변경 드롭다운 */}
                  {showStatusDropdown && (
                    <>
                      {/* 배경 클릭시 닫기 */}
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setShowStatusDropdown(false)}
                      />
                      <div 
                        className="absolute top-full left-0 mt-2 min-w-[140px] rounded-xl shadow-xl overflow-hidden z-20 animate-in fade-in slide-in-from-top-2 duration-200"
                        style={{ 
                          backgroundColor: bgCard, 
                          border: `1px solid ${borderColor}`,
                          boxShadow: isDarkMode 
                            ? "0 10px 40px rgba(0,0,0,0.5)" 
                            : "0 10px 40px rgba(0,0,0,0.15)"
                        }}
                      >
                        {statusList.map((status) => (
                          <button
                            key={status.value}
                            onClick={() => handleStatusChange(status.value)}
                            disabled={statusLoading || post.status === status.value}
                            className="w-full px-4 py-3 text-sm text-left flex items-center gap-3 transition-colors disabled:opacity-40"
                            style={{ 
                              color: textPrimary,
                              backgroundColor: post.status === status.value 
                                ? (isDarkMode ? "rgba(79, 139, 255, 0.1)" : "rgba(26, 47, 74, 0.05)") 
                                : "transparent"
                            }}
                          >
                            <span 
                              className="w-2.5 h-2.5 rounded-full"
                              style={{ backgroundColor: status.color }}
                            />
                            <span className={post.status === status.value ? "font-medium" : ""}>
                              {status.label}
                            </span>
                            {post.status === status.value && (
                              <Check className="w-4 h-4 ml-auto" style={{ color: pointColor }} />
                            )}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <Badge
                  className="px-3 py-1.5 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: currentStatus.color,
                    color: "#ffffff"
                  }}
                >
                  {currentStatus.label}
                </Badge>
              )}

              <div className="flex items-center gap-4 text-sm" style={{ color: textSecondary }}>
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4" style={{ color: pointColor }} />
                  <span>
                    {post.currentQuantity ?? 0}/{post.minParticipants ?? 2}명
                  </span>
                </div>
              </div>
            </div>

            {/* 제목 */}
            {isEditing ? (
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="text-lg font-medium"
                placeholder="제목"
                style={{ 
                  backgroundColor: bgCard, 
                  color: textPrimary,
                  borderColor: borderColor
                }}
              />
            ) : (
              <h2 className="text-lg" style={{ color: textPrimary }}>{post.title}</h2>
            )}

            {/* 가격 */}
            {isEditing ? (
              <div className="flex items-center gap-2">
                <span className="font-semibold" style={{ color: pointColor }}>1인당</span>
                <Input
                  type="number"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  className="w-32"
                  placeholder="가격"
                  style={{ 
                    backgroundColor: bgCard, 
                    color: textPrimary,
                    borderColor: borderColor
                  }}
                />
                <span className="font-semibold" style={{ color: pointColor }}>원</span>
              </div>
            ) : (
              <p className="font-semibold" style={{ color: pointColor }}>
                1인당 {Math.floor(Number(post.price)).toLocaleString()}원
              </p>
            )}

            {/* 위치/마감일 */}
            <div className="flex items-center gap-2" style={{ color: textSecondary }}>
              <MapPin className="w-4 h-4" style={{ color: pointColor }} />
              <span className="text-sm">{post.pickupLocation}</span>
              <span className="text-sm" style={{ color: textTertiary }}>·</span>
              {isEditing ? (
                <Input
                  type="datetime-local"
                  value={editDeadline}
                  onChange={(e) => setEditDeadline(e.target.value)}
                  className="text-sm w-auto"
                  style={{ 
                    backgroundColor: bgCard, 
                    color: textPrimary,
                    borderColor: borderColor
                  }}
                />
              ) : (
                <span className="text-sm" style={{ color: textTertiary }}>
                  마감: {new Date(post.deadline).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>

          {/* 구분선 */}
          <div style={{ borderTop: `1px solid ${borderColor}` }} />

          {/* 본문 */}
          <div>
            <p className="leading-relaxed whitespace-pre-line" style={{ color: textSecondary }}>
              {post.content}
            </p>
            {isEditing && (
              <p className="text-xs mt-2" style={{ color: textTertiary }}>* 본문 내용은 수정할 수 없습니다.</p>
            )}
          </div>
        </div>
      </div>

      {/* 하단 버튼 영역 (작성자가 아닐 때만 표시) */}
      {!isOwner && post.status === "open" && (
        <div 
          className="sticky bottom-0 p-4 transition-colors"
          style={{ backgroundColor: bgMain, borderTop: `1px solid ${borderColor}` }}
        >
          {isParticipant ? (
            // 참여자일 때: 채팅하기 버튼
            <Button
              onClick={handleOpenChat}
              disabled={openingChat}
              className="w-full py-6 rounded-xl transition-colors"
              style={{ 
                backgroundColor: isDarkMode ? "#4F8BFF" : "#1A2F4A",
                color: "#ffffff"
              }}
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              {openingChat ? "열기 중..." : "채팅하기"}
            </Button>
          ) : (
            // 비참여자일 때: 참여하기 버튼
            <Button
              onClick={handleParticipate}
              disabled={participating}
              className="w-full py-6 rounded-xl transition-colors"
              style={{ 
                backgroundColor: isDarkMode ? "#4F8BFF" : "#1A2F4A",
                color: "#ffffff"
              }}
            >
              {participating ? "처리 중..." : "참여하기"}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
