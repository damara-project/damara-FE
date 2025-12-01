import axiosInstance from "./axiosInstance";

// 알림 목록 조회
export const getNotifications = (
  userId: string,
  options?: {
    limit?: number;
    offset?: number;
    unreadOnly?: boolean;
  }
) => {
  return axiosInstance.get("/notifications", {
    params: {
      userId,
      limit: options?.limit ?? 20,
      offset: options?.offset ?? 0,
      unreadOnly: options?.unreadOnly ?? false,
    },
  });
};

// 읽지 않은 알림 개수 조회
export const getUnreadCount = (userId: string) => {
  return axiosInstance.get("/notifications/unread-count", {
    params: { userId },
  });
};

// 모든 알림 읽음 처리
export const markAllAsRead = (userId: string) => {
  return axiosInstance.patch("/notifications/read-all", { userId });
};

// 특정 알림 읽음 처리
export const markAsRead = (notificationId: string, userId: string) => {
  return axiosInstance.patch(`/notifications/${notificationId}/read`, { userId });
};

// 알림 삭제
export const deleteNotification = (notificationId: string, userId: string) => {
  return axiosInstance.delete(`/notifications/${notificationId}`, {
    params: { userId },
  });
};

