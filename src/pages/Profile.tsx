// src/pages/Profile.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Settings, ShoppingBag, Heart, Award, Bell, HelpCircle, ChevronRight, LogOut, Edit3, X, Trash2, Star } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "../components/ui/avatar";
import { getPostsByStudentId, getParticipatedPosts } from "../apis/posts";
import { updateUser, deleteUser } from "../apis/users";
import { uploadImage } from "../apis/upload";
import { useTheme } from "../contexts/ThemeContext";
import { getImageUrl } from "../utils/imageUrl";

export default function Profile() {
  const nav = useNavigate();
  const { isDarkMode } = useTheme();
  
  // 다크모드 스타일 (새 색상 가이드 적용)
  const bgMain = isDarkMode ? "#0B0F19" : "#f9fafb";
  const bgCard = isDarkMode ? "#151C2B" : "#ffffff";
  const textPrimary = isDarkMode ? "#FFFFFF" : "#111827";
  const textSecondary = isDarkMode ? "#A7B1C2" : "#6b7280";
  const borderColor = isDarkMode ? "#1A2233" : "#f3f4f6";
  const bgIcon = isDarkMode ? "#1A2233" : "#f3f4f6";
  const pointColor = isDarkMode ? "#4F8BFF" : "#6F91BC";
  
  // 사용자 정보 (localStorage에서 가져오기)
  const [user, setUser] = useState<any>(null);
  const [myPostsCount, setMyPostsCount] = useState(0);
  const [participatedCount, setParticipatedCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // 프로필 수정 모달 상태
  const [showEditModal, setShowEditModal] = useState(false);
  const [editNickname, setEditNickname] = useState("");
  const [editDepartment, setEditDepartment] = useState("");
  const [updating, setUpdating] = useState(false);

  // 공지사항 모달 상태
  const [showNoticeModal, setShowNoticeModal] = useState(false);

  // 프로필 이미지 업로드 상태
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    // localStorage에서 사용자 정보 가져오기
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const userId = localStorage.getItem("userId");
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // 내가 등록한 게시글 수
        if (user?.studentId) {
          const myPostsRes = await getPostsByStudentId(user.studentId);
          setMyPostsCount(myPostsRes.data?.length || 0);
        }
        
        // 내가 참여한 게시글 수
        if (userId) {
          const participatedRes = await getParticipatedPosts(userId);
          setParticipatedCount(participatedRes.data?.length || 0);
        }
      } catch (err) {
        console.error("프로필 데이터 로드 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.studentId]);

  // 로그아웃
  const handleLogout = () => {
    if (!confirm("로그아웃 하시겠습니까?")) return;
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    nav("/login");
  };

  // 프로필 수정 모달 열기
  const openEditModal = () => {
    console.log("openEditModal 실행, 현재 showEditModal:", showEditModal);
    setEditNickname(user?.nickname || "");
    setEditDepartment(user?.department || "");
    setShowEditModal(true);
    console.log("setShowEditModal(true) 호출됨");
  };

  // 프로필 수정 저장
  const handleUpdateProfile = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return alert("로그인이 필요합니다.");

    if (!editNickname.trim()) {
      return alert("닉네임을 입력해주세요.");
    }

    try {
      setUpdating(true);
      const res = await updateUser(userId, {
        nickname: editNickname.trim(),
        department: editDepartment.trim(),
      });

      // localStorage 업데이트
      const updatedUser = { ...user, nickname: editNickname.trim(), department: editDepartment.trim() };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);

      setShowEditModal(false);
      alert("프로필이 수정되었습니다.");
    } catch (err: any) {
      console.error("프로필 수정 실패:", err);
      alert(err.response?.data?.message || "프로필 수정에 실패했습니다.");
    } finally {
      setUpdating(false);
    }
  };

  // 프로필 이미지 업로드
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      setUploadingImage(true);
      
      // 이미지 업로드
      const res = await uploadImage(file);
      // 이미지 URL 처리 - 상대 경로인 경우 VITE_API_BASE와 결합
      const apiBase = import.meta.env.VITE_API_BASE || "";
      const imageUrl = res.url.startsWith("http") 
        ? res.url.replace("http://", "https://") 
        : `${apiBase}${res.url.startsWith("/") ? res.url : `/${res.url}`}`;
      
      // 사용자 정보 업데이트
      await updateUser(userId, { avatarUrl: imageUrl });
      
      // 로컬 상태 및 localStorage 업데이트
      const updatedUser = { ...user, avatarUrl: imageUrl };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      alert("프로필 이미지가 변경되었습니다!");
    } catch (err) {
      console.error("프로필 이미지 업로드 실패:", err);
      alert("프로필 이미지 업로드에 실패했습니다.");
    } finally {
      setUploadingImage(false);
    }
  };

  // 회원 탈퇴
  const handleDeleteAccount = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return alert("로그인이 필요합니다.");

    if (!confirm("정말 탈퇴하시겠습니까?\n\n등록한 게시글과 참여 정보가 모두 삭제됩니다.\n이 작업은 되돌릴 수 없습니다.")) {
      return;
    }

    // 2차 확인
    if (!confirm("마지막 확인입니다.\n정말로 회원 탈퇴를 진행하시겠습니까?")) {
      return;
    }

    try {
      await deleteUser(userId);
      localStorage.removeItem("user");
      localStorage.removeItem("userId");
      alert("회원 탈퇴가 완료되었습니다.\n이용해 주셔서 감사합니다.");
      nav("/login");
    } catch (err: any) {
      console.error("회원 탈퇴 실패:", err);
      alert(err.response?.data?.message || "회원 탈퇴에 실패했습니다.");
    }
  };

  return (
    <div 
      className="min-h-screen pb-20 transition-colors"
      style={{ backgroundColor: isDarkMode ? "#111827" : "#f9fafb" }}
    >
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-[#1A2F4A] to-[#355074] px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <h1 className="text-white">나의 Damara</h1>
          <button className="p-1" onClick={handleLogout}>
            <LogOut className="w-6 h-6 text-white/90" />
          </button>
        </div>
      </div>

      {/* 프로필 정보 */}
      <div className="bg-gradient-to-r from-[#1A2F4A] to-[#355074] px-4 pb-6 relative">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar className="w-20 h-20 border-4 border-white/20">
              {user?.avatarUrl ? (
                <AvatarImage src={getImageUrl(user.avatarUrl)} />
              ) : null}
              <AvatarFallback className="bg-gradient-to-br from-[#6F91BC] to-[#8BA3C3]">
                <svg className="w-12 h-12 text-white/80" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </AvatarFallback>
            </Avatar>

            {/* 프로필 이미지 수정 버튼 (오른쪽 아래) */}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              id="profile-image-input"
              style={{ display: 'none' }}
              disabled={uploadingImage}
            />
            <button
              type="button"
              onClick={() => document.getElementById('profile-image-input')?.click()}
              disabled={uploadingImage}
              className="absolute -bottom-1 -right-1 w-7 h-7 bg-gradient-to-r from-[#6F91BC] to-[#8BA3C3] rounded-full flex items-center justify-center border-2 border-[#1A2F4A] cursor-pointer hover:scale-110 transition-transform"
            >
              {uploadingImage ? (
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Edit3 className="w-3.5 h-3.5 text-white" />
              )}
            </button>
          </div>

          <div className="flex-1">
            <h2 className="text-white">{user?.nickname || "사용자"}</h2>
            <p className="text-sm text-white/70 mt-0.5">
              {user?.department || "명지대학교"} #{user?.studentId || ""}
            </p>
          </div>
          
          {/* 프로필 수정 버튼 */}
          <button 
            type="button"
            onClick={() => {
              console.log("프로필 수정 버튼 클릭됨");
              openEditModal();
            }}
            className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all relative z-20 cursor-pointer"
          >
            <Edit3 className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* 통계 카드 3개 - 동일한 그라디언트 */}
        <div className="grid grid-cols-3 gap-3 mt-5">
          <div className="bg-gradient-to-br from-[#6F91BC] to-[#8BA3C3] rounded-xl p-3 text-center shadow-lg">
            <p className="text-2xl text-white font-semibold">{loading ? "-" : myPostsCount}</p>
            <p className="text-xs text-white/90 mt-1">등록한 공구</p>
          </div>

          <div className="bg-gradient-to-br from-[#6F91BC] to-[#8BA3C3] rounded-xl p-3 text-center shadow-lg">
            <p className="text-2xl text-white font-semibold">{loading ? "-" : participatedCount}</p>
            <p className="text-xs text-white/90 mt-1">참여한 공구</p>
          </div>

          <div className="bg-gradient-to-br from-[#6F91BC] to-[#8BA3C3] rounded-xl p-3 text-center shadow-lg">
            <p className="text-2xl text-white font-semibold">500</p>
            <p className="text-xs text-white/90 mt-1">신뢰점수</p>
          </div>
        </div>
      </div>

      {/* 메뉴 리스트 1 */}
      <div 
        className="mt-4 mx-4 rounded-2xl shadow-sm overflow-hidden transition-colors"
        style={{ backgroundColor: bgCard }}
      >
        {/* 나의 공동구매 */}
        <button 
          onClick={() => nav("/my-posts")}
          className="w-full flex items-center justify-between px-4 py-4 transition-all"
          style={{ borderBottom: `1px solid ${borderColor}` }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: isDarkMode ? "#1A2F4A" : "#EEF2F7" }}
            >
              <ShoppingBag className="w-5 h-5" style={{ color: pointColor }} />
            </div>
            <span style={{ color: textPrimary }}>나의 공동구매</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm" style={{ color: textSecondary }}>{myPostsCount}개</span>
            <ChevronRight className="w-5 h-5" style={{ color: textSecondary }} />
          </div>
        </button>

        {/* 참여한 공동구매 */}
        <button 
          onClick={() => nav("/participated")}
          className="w-full flex items-center justify-between px-4 py-4 transition-all"
          style={{ borderBottom: `1px solid ${borderColor}` }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: isDarkMode ? "#1A2F4A" : "#EEF2F7" }}
            >
              <Heart className="w-5 h-5" style={{ color: pointColor }} />
            </div>
            <span style={{ color: textPrimary }}>참여한 공동구매</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm" style={{ color: textSecondary }}>{participatedCount}개</span>
            <ChevronRight className="w-5 h-5" style={{ color: textSecondary }} />
          </div>
        </button>

        {/* 관심목록 */}
        <button 
          onClick={() => nav("/favorites")}
          className="w-full flex items-center justify-between px-4 py-4 transition-all"
          style={{ borderBottom: `1px solid ${borderColor}` }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: isDarkMode ? "#1A2F4A" : "#EEF2F7" }}
            >
              <Star className="w-5 h-5" style={{ color: pointColor }} />
            </div>
            <span style={{ color: textPrimary }}>관심목록</span>
          </div>
          <ChevronRight className="w-5 h-5" style={{ color: textSecondary }} />
        </button>

        {/* 신뢰지수 */}
        <button className="w-full flex items-center justify-between px-4 py-4 transition-all">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: isDarkMode ? "#1A2F4A" : "#EEF2F7" }}
            >
              <Award className="w-5 h-5" style={{ color: pointColor }} />
            </div>
            <span style={{ color: textPrimary }}>신뢰지수</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium" style={{ color: pointColor }}>
              500점
            </span>
            <ChevronRight className="w-5 h-5" style={{ color: textSecondary }} />
          </div>
        </button>
      </div>

      {/* 메뉴 리스트 2 */}
      <div 
        className="mt-4 mx-4 rounded-2xl shadow-sm overflow-hidden transition-colors"
        style={{ backgroundColor: bgCard }}
      >
        {/* 공지사항 */}
        <button 
          onClick={() => setShowNoticeModal(true)}
          className="w-full flex items-center justify-between px-4 py-4 transition-all"
          style={{ borderBottom: `1px solid ${borderColor}` }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: bgIcon }}
            >
              <Bell className="w-5 h-5" style={{ color: pointColor }} />
            </div>
            <span style={{ color: textPrimary }}>공지사항</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs bg-gradient-to-r from-[#6F91BC] to-[#8BA3C3] text-white px-2 py-0.5 rounded-full">
              New
            </span>
            <ChevronRight className="w-5 h-5" style={{ color: textSecondary }} />
          </div>
        </button>

        {/* FAQ */}
        <button 
          onClick={() => nav("/faq")}
          className="w-full flex items-center justify-between px-4 py-4 transition-all"
          style={{ borderBottom: `1px solid ${borderColor}` }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: bgIcon }}
            >
              <HelpCircle className="w-5 h-5" style={{ color: pointColor }} />
            </div>
            <span style={{ color: textPrimary }}>자주 묻는 질문</span>
          </div>
          <ChevronRight className="w-5 h-5" style={{ color: textSecondary }} />
        </button>

        {/* 앱 설정 */}
        <button 
          onClick={() => nav("/settings")}
          className="w-full flex items-center justify-between px-4 py-4 transition-all"
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: bgIcon }}
            >
              <Settings className="w-5 h-5" style={{ color: pointColor }} />
            </div>
            <span style={{ color: textPrimary }}>앱 설정</span>
          </div>
          <ChevronRight className="w-5 h-5" style={{ color: textSecondary }} />
        </button>
      </div>

      {/* 회원 탈퇴 */}
      <div 
        className="mt-4 mx-4 rounded-2xl shadow-sm overflow-hidden transition-colors"
        style={{ backgroundColor: bgCard }}
      >
        <button 
          onClick={handleDeleteAccount}
          className="w-full flex items-center justify-between px-4 py-4 transition-all"
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: isDarkMode ? "#3B1A1A" : "#FEE2E2" }}
            >
              <Trash2 className="w-5 h-5 text-red-500" />
            </div>
            <span style={{ color: textPrimary }}>회원 탈퇴</span>
          </div>
          <ChevronRight className="w-5 h-5" style={{ color: textSecondary }} />
        </button>
      </div>

      {/* 프로필 수정 모달 */}
      {showEditModal && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            zIndex: 9999,
          }}
        >
          <div 
            style={{
              backgroundColor: 'white',
              borderRadius: '1rem',
              width: '100%',
              maxWidth: '24rem',
              overflow: 'hidden',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            }}
          >
            {/* 모달 헤더 */}
            <div className="bg-gradient-to-r from-[#1A2F4A] to-[#355074] px-4 py-4 flex items-center justify-between">
              <h3 className="text-white font-medium">프로필 수정</h3>
              <button onClick={() => setShowEditModal(false)} className="p-1">
                <X className="w-5 h-5 text-white/80" />
              </button>
            </div>

            {/* 모달 바디 */}
            <div className="p-4 space-y-4">
              {/* 닉네임 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  닉네임
                </label>
                <input
                  type="text"
                  value={editNickname}
                  onChange={(e) => setEditNickname(e.target.value)}
                  placeholder="닉네임을 입력하세요"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6F91BC] focus:border-transparent"
                />
              </div>

              {/* 학과 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  학과
                </label>
                <input
                  type="text"
                  value={editDepartment}
                  onChange={(e) => setEditDepartment(e.target.value)}
                  placeholder="학과를 입력하세요"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6F91BC] focus:border-transparent"
                />
              </div>

              {/* 안내 메시지 */}
              <p className="text-xs text-gray-400 mt-2">
                * 학번과 이메일은 변경할 수 없습니다.
              </p>
            </div>

            {/* 모달 푸터 */}
            <div className="px-4 pb-6 pt-4 flex gap-2">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 py-3 border border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleUpdateProfile}
                disabled={updating}
                className="flex-1 py-3 bg-gradient-to-r from-[#1A2F4A] to-[#355074] rounded-xl text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {updating ? "저장 중..." : "저장"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 공지사항 모달 */}
      {showNoticeModal && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            zIndex: 9999,
          }}
        >
          <div 
            style={{
              backgroundColor: 'white',
              borderRadius: '1rem',
              width: '100%',
              maxWidth: '24rem',
              maxHeight: '80vh',
              overflow: 'hidden',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            }}
          >
            {/* 모달 헤더 */}
            <div className="bg-gradient-to-r from-[#1A2F4A] to-[#355074] px-4 py-4 flex items-center justify-between">
              <h3 className="text-white font-medium">공지사항</h3>
              <button onClick={() => setShowNoticeModal(false)} className="p-1">
                <X className="w-5 h-5 text-white/80" />
              </button>
            </div>

            {/* 모달 바디 - 스크롤 가능 */}
            <div className="overflow-y-auto" style={{ maxHeight: 'calc(80vh - 60px)' }}>
              {/* 공지사항 1 */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs bg-gradient-to-r from-[#6F91BC] to-[#8BA3C3] text-white px-2 py-0.5 rounded-full">
                    New
                  </span>
                  <span className="text-xs text-gray-400">2024.11.29</span>
                </div>
                <h4 className="font-medium text-gray-900 mb-1">Damara 서비스 오픈 안내</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  안녕하세요! Damara 서비스가 정식 오픈되었습니다. 대학생들을 위한 공동구매 플랫폼으로, 더 저렴하게 함께 구매하세요!
                </p>
              </div>

              {/* 공지사항 2 */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-gray-400">2024.11.28</span>
                </div>
                <h4 className="font-medium text-gray-900 mb-1">이용 가이드 안내</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  공동구매 참여 방법과 등록 방법에 대한 자세한 가이드를 확인해보세요. 자주 묻는 질문에서 더 많은 정보를 얻을 수 있습니다.
                </p>
              </div>

              {/* 공지사항 3 */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-gray-400">2024.11.27</span>
                </div>
                <h4 className="font-medium text-gray-900 mb-1">개인정보 처리방침 안내</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Damara는 사용자의 개인정보를 안전하게 보호합니다. 자세한 내용은 앱 설정에서 확인하실 수 있습니다.
                </p>
              </div>

              {/* 공지사항 4 */}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-gray-400">2024.11.25</span>
                </div>
                <h4 className="font-medium text-gray-900 mb-1">신뢰지수 시스템 안내</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  신뢰지수는 성공적인 거래를 통해 올라갑니다. 높은 신뢰지수는 다른 사용자에게 신뢰를 줄 수 있습니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
