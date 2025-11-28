import axiosInstance from "./axiosInstance";

// 전체 상품 조회 (페이징)
export const getPosts = (limit = 20, offset = 0) =>
  axiosInstance.get(`/api/posts`, {
    params: { limit, offset },
  });

// 상품 상세 조회
export const getPostDetail = (id: string) =>
  axiosInstance.get(`/api/posts/${id}`);

// 상품 생성
export const createPost = (data: {
  title: string;
  price: number;
  deadline: string;
  authorId: string;
  images: string[];
}) => axiosInstance.post(`/api/posts`, data);

// 상품 수정
export const updatePost = (
  id: string,
  data: {
    title?: string;
    price?: number;
    deadline?: string;
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
