// src/apis/chat.ts
import axiosInstance from "./axiosInstance";

// ===== 채팅방 관련 =====

// 채팅방 생성
export const createChatRoom = (postId: string) =>
  axiosInstance.post(`/chat/rooms`, {
    chatRoom: { postId },
  });

// 사용자가 참여한 채팅방 목록 조회
export const getUserChatRooms = (userId: string, limit = 20, offset = 0) =>
  axiosInstance.get(`/chat/rooms/user/${userId}`, {
    params: { limit, offset },
  });

// Post ID로 채팅방 조회 또는 생성
export const getChatRoomByPostId = (postId: string) =>
  axiosInstance.get(`/chat/rooms/post/${postId}`);

// 채팅방 ID로 조회
export const getChatRoomById = (id: string) =>
  axiosInstance.get(`/chat/rooms/${id}`);

// 채팅방 삭제
export const deleteChatRoom = (id: string) =>
  axiosInstance.delete(`/chat/rooms/${id}`);

// ===== 메시지 관련 =====

// 메시지 전송
export const sendMessage = (data: {
  chatRoomId: string;
  senderId: string;
  content: string;
  messageType?: string;
}) =>
  axiosInstance.post(`/chat/messages`, {
    message: {
      chatRoomId: data.chatRoomId,
      senderId: data.senderId,
      content: data.content,
      messageType: data.messageType || "text",
    },
  });

// 채팅방의 메시지 목록 조회
export const getMessages = (chatRoomId: string, limit = 50, offset = 0) =>
  axiosInstance.get(`/chat/rooms/${chatRoomId}/messages`, {
    params: { limit, offset },
  });

// 메시지 읽음 처리
export const markMessageAsRead = (messageId: string, userId: string) =>
  axiosInstance.patch(`/chat/messages/${messageId}/read`, { userId });

// 채팅방의 모든 메시지 읽음 처리
export const markAllMessagesAsRead = (chatRoomId: string, userId: string) =>
  axiosInstance.patch(`/chat/rooms/${chatRoomId}/read-all`, { userId });

// 읽지 않은 메시지 수 조회
export const getUnreadCount = (chatRoomId: string, userId: string) =>
  axiosInstance.get(`/chat/rooms/${chatRoomId}/unread-count`, {
    params: { userId },
  });

// 메시지 삭제
export const deleteMessage = (messageId: string) =>
  axiosInstance.delete(`/chat/messages/${messageId}`);

