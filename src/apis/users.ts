import axiosInstance from "./axiosInstance";

// 회원가입
export const registerUser = (userData: {
  email: string;
  passwordHash: string;
  nickname: string;
  studentId: string;
  department?: string;
  avatarUrl?: string;
}) =>
  axiosInstance.post(`/users`, {
    user: userData,
  });

// 로그인 (학번 + 비밀번호)
export const loginUser = (studentId: string, password: string) =>
  axiosInstance.post(`/users/login`, { studentId, password });

// 전체 사용자 조회
export const getUsers = (limit = 20, offset = 0) =>
  axiosInstance.get(`/users`, {
    params: { limit, offset },
  });

// 사용자 정보 수정
export const updateUser = (
  id: string,
  data: {
    nickname?: string;
    department?: string;
    avatarUrl?: string;
  }
) =>
  axiosInstance.put(`/users/${id}`, {
    user: data,
  });

// 사용자 삭제
export const deleteUser = (id: string) =>
  axiosInstance.delete(`/users/${id}`);
