import axiosInstance from "./axiosInstance";

// ===== 게시글 기본 CRUD =====

// 전체 상품 조회 (페이징)
export const getPosts = (limit = 20, offset = 0) =>
  axiosInstance.get(`/api/posts`, {
    params: { limit, offset },
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
