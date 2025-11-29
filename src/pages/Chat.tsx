// src/pages/Chat.tsx
import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Send, MoreVertical } from "lucide-react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "../components/ui/avatar";
import { useTheme } from "../contexts/ThemeContext";
import { getMessages, sendMessage, markAllMessagesAsRead } from "../apis/chat";

interface ChatRoom {
  id: string;
  postId: string;
  post?: { id: string; title: string; authorId: string };
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
}

interface Message {
  id: string;
  chatRoomId: string;
  senderId: string;
  content: string;
  messageType: string;
  isRead: boolean;
  createdAt: string;
  sender?: { id: string; nickname: string; avatarUrl?: string };
}

export default function Chat() {
  const { isDarkMode } = useTheme();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentUserId = localStorage.getItem("userId") || "";

  // 다크모드 스타일
  const bgMain = isDarkMode ? "#0B0F19" : "#ffffff";
  const bgCard = isDarkMode ? "#151C2B" : "#ffffff";
  const textPrimary = isDarkMode ? "#FFFFFF" : "#111827";
  const textSecondary = isDarkMode ? "#A7B1C2" : "#6b7280";
  const textTertiary = isDarkMode ? "#6B7688" : "#9ca3af";
  const borderColor = isDarkMode ? "#1A2233" : "#f3f4f6";
  const bgIcon = isDarkMode ? "#1A2233" : "#f3f4f6";
  const pointColor = isDarkMode ? "#4F8BFF" : "#1A2F4A";

  // 상태
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // 채팅방 목록 로드
  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        setLoading(true);
        // TODO: 사용자의 채팅방 목록을 조회하는 API (GET /api/chat/rooms/user/{userId})
        // 현재는 Mock 데이터 사용
        const mockRooms: ChatRoom[] = [
          { id: "1", postId: "post-1", post: { id: "post-1", title: "허니버터칩 공구", authorId: "a1" }, lastMessage: "내일 5시에 봬요!", lastMessageTime: "오후 3:24", unreadCount: 2 },
          { id: "2", postId: "post-2", post: { id: "post-2", title: "생활용품 공구방", authorId: "a2" }, lastMessage: "네 감사합니다!", lastMessageTime: "오전 11:15", unreadCount: 0 },
        ];
        setChatRooms(mockRooms);
      } catch (err) {
        console.error("채팅방 목록 로드 실패:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchChatRooms();
  }, []);

  // 채팅방 선택 시 메시지 로드
  useEffect(() => {
    if (!selectedRoom) return;
    const fetchMessages = async () => {
      try {
        const res = await getMessages(selectedRoom.id);
        console.log("📨 메시지 목록:", res.data);
        setMessages(res.data || []);
        if (currentUserId) await markAllMessagesAsRead(selectedRoom.id, currentUserId);
      } catch (err) {
        console.error("메시지 로드 실패 (Mock 사용):", err);
        setMessages([
          { id: "1", chatRoomId: selectedRoom.id, senderId: "other-user", content: "안녕하세요! 공동구매 참여하고 싶어요", messageType: "text", isRead: true, createdAt: new Date().toISOString(), sender: { id: "other-user", nickname: "김민지" } },
          { id: "2", chatRoomId: selectedRoom.id, senderId: currentUserId, content: "네! 환영합니다 😊", messageType: "text", isRead: true, createdAt: new Date().toISOString() },
          { id: "3", chatRoomId: selectedRoom.id, senderId: "other-user", content: "수령은 언제 어디서 하나요?", messageType: "text", isRead: true, createdAt: new Date().toISOString(), sender: { id: "other-user", nickname: "김민지" } },
          { id: "4", chatRoomId: selectedRoom.id, senderId: currentUserId, content: "내일 오후 5시에 도서관 앞에서 만나요!", messageType: "text", isRead: true, createdAt: new Date().toISOString() },
        ]);
      }
    };
    fetchMessages();
  }, [selectedRoom, currentUserId]);

  // 메시지 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 메시지 전송
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedRoom || !currentUserId) return;
    try {
      setSending(true);
      const res = await sendMessage({ chatRoomId: selectedRoom.id, senderId: currentUserId, content: newMessage, messageType: "text" });
      console.log("📤 메시지 전송 성공:", res.data);
      setMessages((prev) => [...prev, { id: res.data?.id || Date.now().toString(), chatRoomId: selectedRoom.id, senderId: currentUserId, content: newMessage, messageType: "text", isRead: false, createdAt: new Date().toISOString() }]);
      setNewMessage("");
    } catch (err) {
      console.error("메시지 전송 실패 (로컬 추가):", err);
      setMessages((prev) => [...prev, { id: Date.now().toString(), chatRoomId: selectedRoom.id, senderId: currentUserId, content: newMessage, messageType: "text", isRead: false, createdAt: new Date().toISOString() }]);
      setNewMessage("");
    } finally {
      setSending(false);
    }
  };

  // 시간 포맷
  const formatTime = (dateString: string) => new Date(dateString).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });

  // ======================================================
  // (1) 채팅 상세 화면
  // ======================================================
  if (selectedRoom) {
    return (
      <div className="min-h-screen flex flex-col pb-20 transition-colors" style={{ backgroundColor: bgMain }}>
        {/* 헤더 */}
        <div className="sticky top-0 bg-gradient-to-r from-[#1A2F4A] to-[#355074] px-4 py-3 flex items-center gap-3 z-10 shadow-md">
          <button onClick={() => setSelectedRoom(null)} className="p-1">
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <Avatar className="w-10 h-10 ring-2 ring-white/30">
            <AvatarFallback className="bg-gradient-to-br from-[#6F91BC] to-[#8BA3C3] text-white">
              {selectedRoom.post?.title?.[0] || "?"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="text-white">{selectedRoom.post?.title || "채팅방"}</h3>
            <p className="text-xs text-white/80">참여자 {messages.length > 0 ? "2" : "0"}명</p>
          </div>
          <button className="p-2"><MoreVertical className="w-5 h-5 text-white/80" /></button>
        </div>

        {/* 메시지 목록 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => {
            const isMe = msg.senderId === currentUserId;
            return (
              <div key={msg.id} className={`flex gap-2 ${isMe ? "flex-row-reverse" : ""}`}>
                {!isMe && (
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={msg.sender?.avatarUrl} />
                    <AvatarFallback className="text-white text-xs" style={{ backgroundColor: pointColor }}>
                      {msg.sender?.nickname?.[0] || "?"}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div className={`flex flex-col ${isMe ? "items-end" : "items-start"} max-w-[70%]`}>
                  {!isMe && msg.sender?.nickname && (
                    <span className="text-xs mb-1 px-1" style={{ color: textSecondary }}>{msg.sender.nickname}</span>
                  )}
                  <div
                    className={`px-4 py-3 rounded-2xl shadow-sm ${isMe ? "bg-gradient-to-br from-[#1A2F4A] to-[#355074] text-white rounded-br-sm" : "rounded-bl-sm"}`}
                    style={!isMe ? { backgroundColor: bgCard, color: textPrimary, border: `1px solid ${borderColor}` } : undefined}
                  >
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                  </div>
                  <span className="text-xs mt-1 px-1" style={{ color: textTertiary }}>{formatTime(msg.createdAt)}</span>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* 메시지 입력창 */}
        <div className="sticky bottom-0 p-4 shadow-lg transition-colors" style={{ backgroundColor: bgCard, borderTop: `1px solid ${borderColor}` }}>
          <div className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
              placeholder="메시지를 입력하세요"
              className="flex-1 rounded-xl py-6"
              style={{ backgroundColor: bgIcon, color: textPrimary, borderColor: borderColor }}
              disabled={sending}
            />
            <Button onClick={handleSendMessage} disabled={sending || !newMessage.trim()} className="bg-gradient-to-br from-[#1A2F4A] to-[#355074] px-6 rounded-xl">
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ======================================================
  // (2) 채팅방 목록 화면
  // ======================================================
  return (
    <div className="min-h-screen pb-20 transition-colors" style={{ backgroundColor: bgMain }}>
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-[#1A2F4A] to-[#355074] px-4 py-4 sticky top-0 z-10">
        <h1 className="text-white text-lg font-medium">채팅</h1>
      </div>

      {/* 로딩 */}
      {loading && <div className="text-center py-16" style={{ color: textSecondary }}>불러오는 중...</div>}

      {/* 채팅방 목록 */}
      {!loading && (
        <div style={{ backgroundColor: bgMain }}>
          {chatRooms.length === 0 ? (
            <div className="text-center py-16" style={{ color: textSecondary }}>
              <p>채팅방이 없습니다.</p>
              <p className="text-sm mt-2" style={{ color: textTertiary }}>공동구매에 참여하면 채팅방이 생성됩니다.</p>
            </div>
          ) : (
            chatRooms.map((room, index) => (
              <button
                key={room.id}
                onClick={() => setSelectedRoom(room)}
                className="w-full px-4 py-4 flex items-center gap-3 transition-colors"
                style={{ borderBottom: `1px solid ${borderColor}` }}
              >
                <div className="relative">
                  <Avatar className="w-14 h-14">
                    <AvatarFallback className={`${index % 2 === 0 ? "bg-gradient-to-br from-[#6F91BC] to-[#8BA3C3]" : "bg-gradient-to-br from-[#355074] to-[#6F91BC]"} text-white`}>
                      {room.post?.title?.[0] || "?"}
                    </AvatarFallback>
                  </Avatar>
                  {(room.unreadCount ?? 0) > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-[#6F91BC] to-[#8BA3C3] text-white text-xs rounded-full flex items-center justify-center">
                      {room.unreadCount}
                    </div>
                  )}
                </div>
                <div className="flex-1 text-left min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="truncate" style={{ color: textPrimary }}>{room.post?.title || "채팅방"}</h3>
                    <span className="text-xs flex-shrink-0 ml-2" style={{ color: pointColor }}>{room.lastMessageTime || ""}</span>
                  </div>
                  <p className="text-sm truncate" style={{ color: (room.unreadCount ?? 0) > 0 ? textPrimary : textSecondary }}>
                    {room.lastMessage || "대화를 시작해보세요"}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
