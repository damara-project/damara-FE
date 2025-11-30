import axiosInstance from "./axiosInstance";

// ===== 게시글 기본 CRUD =====

// 전체 상품 조회 (페이징 및 카테고리 필터링)
export const getPosts = (limit = 20, offset = 0, category?: string) =>
  axiosInstance.get(`/api/posts`, {
    params: { limit, offset, ...(category && category !== "all" && { category }) },
  });

// 상품 상세 조회
export const getPostDetail = (id: string) =>
  axiosInstance.get(`/api/posts/${id}`);

// 상품 등록
export const createPost = (data: {
  authorId: string;
  title: string;
  content: string;
  price: number;
  minParticipants: number;
  deadline: string;
  pickupLocation: string;
  images?: string[];
  category?: string;
}) =>
  axiosInstance.post(`/api/posts`, {
    post: data,
  });

// 상품 수정
export const updatePost = (
  id: string,
  data: {
    title?: string;
    content?: string;
    price?: number;
    deadline?: string;
    pickupLocation?: string;
    images?: string[];
  }
) => axiosInstance.put(`/api/posts/${id}`, data);

// 상품 삭제
export const deletePost = (id: string) =>
  axiosInstance.delete(`/api/posts/${id}`);

// 학번으로 상품 조회
export const getPostsByStudentId = (
  studentId: string,
  limit = 20,
  offset = 0
) =>
  axiosInstance.get(`/api/posts/student/${studentId}`, {
    params: { limit, offset },
  });

// ===== 공동구매 참여 관련 =====

// 공동구매 참여
export const participatePost = (postId: string, userId: string) =>
  axiosInstance.post(`/api/posts/${postId}/participate`, { userId });

// 공동구매 참여 취소
export const cancelParticipation = (postId: string, userId: string) =>
  axiosInstance.delete(`/api/posts/${postId}/participate/${userId}`);

// 참여 여부 확인
export const checkParticipation = (postId: string, userId: string) =>
  axiosInstance.get(`/api/posts/${postId}/participate/${userId}`);

// 게시글의 참여자 목록 조회
export const getParticipants = (postId: string) =>
  axiosInstance.get(`/api/posts/${postId}/participants`);

// 사용자가 참여한 게시글 목록 조회
export const getParticipatedPosts = (userId: string) =>
  axiosInstance.get(`/api/posts/user/${userId}/participated`);

// ===== 게시글 상태 변경 =====

// 게시글 상태 변경 (작성자만 가능)
export const updatePostStatus = (
  postId: string,
  status: "open" | "closed" | "in_progress" | "completed",
  authorId: string
) => {
  const url = `/api/posts/${postId}/status`;
  const body = { status, authorId };
  
  console.log("========== 상태 변경 API 호출 ==========");
  console.log("📍 URL:", `${axiosInstance.defaults.baseURL}${url}`);
  console.log("�method: PATCH");
  console.log("📦 Request Body:", JSON.stringify(body, null, 2));
  console.log("=========================================");
  
  return axiosInstance.patch(url, body);
};

// ===== 관심(찜) 기능 =====

// 관심 등록
export const addFavorite = (postId: string, userId: string) =>
  axiosInstance.post(`/api/posts/${postId}/favorite`, { userId });

// 관심 여부 확인
export const checkFavorite = (postId: string, userId: string) =>
  axiosInstance.get(`/api/posts/${postId}/favorite/${userId}`);

// 관심 해제
export const removeFavorite = (postId: string, userId: string) =>
  axiosInstance.delete(`/api/posts/${postId}/favorite/${userId}`);

// 사용자가 관심 등록한 게시글 목록 조회
// 여러 가능한 엔드포인트 시도
export const getFavoritePosts = async (userId: string) => {
  // 가능한 엔드포인트 목록
  const endpoints = [
    `/api/posts/user/${userId}/favorites`,
    `/api/users/${userId}/favorites`,
    `/api/favorites/${userId}`,
  ];

  // 첫 번째 엔드포인트 시도
  try {
    return await axiosInstance.get(endpoints[0]);
  } catch (err: any) {
    // 404가 아니면 그대로 에러 throw
    if (err.response?.status !== 404) {
      throw err;
    }
    
    // 404면 다른 엔드포인트 시도
    for (let i = 1; i < endpoints.length; i++) {
      try {
        return await axiosInstance.get(endpoints[i]);
      } catch (e: any) {
        if (i === endpoints.length - 1) {
          // 마지막 엔드포인트도 실패하면 원래 에러 throw
          throw err;
        }
      }
    }
    throw err;
  }
};