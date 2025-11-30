// src/pages/Chat.tsx
import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { ArrowLeft, Send, MoreVertical, Eye, LogOut } from "lucide-react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "../components/ui/avatar";
import { useTheme } from "../contexts/ThemeContext";
import { getUserChatRooms, getMessages, sendMessage, markAllMessagesAsRead, getChatRoomById, deleteChatRoom } from "../apis/chat";
import { useNavigate } from "react-router-dom";

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
  const nav = useNavigate();
  const [searchParams] = useSearchParams();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentUserId = localStorage.getItem("userId") || "";
  const roomIdFromQuery = searchParams.get("roomId");

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
  const [showMenu, setShowMenu] = useState(false);

  // 채팅방 목록 로드
  const fetchChatRooms = async () => {
    if (!currentUserId) {
      setLoading(false);
      return;
    }
    
    try {
      const res = await getUserChatRooms(currentUserId);
      console.log("💬 채팅방 목록:", res.data);
      
      // API 응답 형식에 맞게 변환
      const rooms = (res.data.chatRooms || []).map((room: any) => ({
        id: room.id,
        postId: room.postId,
        post: room.post,
        lastMessage: room.lastMessage?.content || "",
        lastMessageTime: room.lastMessage?.createdAt 
          ? new Date(room.lastMessage.createdAt).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })
          : "",
        unreadCount: room.unreadCount || 0,
      }));
      
      setChatRooms(rooms);
      
      // 쿼리 파라미터로 받은 roomId가 있으면 해당 채팅방 자동 선택
      if (roomIdFromQuery && !selectedRoom) {
        const targetRoom = rooms.find((room) => room.id === roomIdFromQuery);
        if (targetRoom) {
          setSelectedRoom(targetRoom);
        } else {
          // 목록에 없으면 채팅방 정보를 직접 조회
          try {
            const roomRes = await getChatRoomById(roomIdFromQuery);
            const roomData = roomRes.data;
            setSelectedRoom({
              id: roomData.id,
              postId: roomData.postId,
              post: roomData.post,
              lastMessage: roomData.lastMessage?.content || "",
              lastMessageTime: roomData.lastMessage?.createdAt 
                ? new Date(roomData.lastMessage.createdAt).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })
                : "",
              unreadCount: roomData.unreadCount || 0,
            });
          } catch (err) {
            console.error("채팅방 조회 실패:", err);
          }
        }
      }
    } catch (err) {
      console.error("채팅방 목록 로드 실패:", err);
      // API 실패 시 빈 목록 표시
      setChatRooms([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchChatRooms();
  }, [currentUserId, roomIdFromQuery]);

  // 채팅방 목록 화면일 때 주기적으로 새로고침 (5초마다)
  useEffect(() => {
    if (!selectedRoom && currentUserId) {
      const interval = setInterval(() => {
        fetchChatRooms();
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [selectedRoom, currentUserId]);

  // 채팅방 선택 시 메시지 로드
  useEffect(() => {
    if (!selectedRoom) return;
    const fetchMessages = async () => {
      try {
        const res = await getMessages(selectedRoom.id);
        console.log("📨 메시지 목록:", res.data);
        setMessages(res.data.messages || res.data || []);
        if (currentUserId) {
          try {
            await markAllMessagesAsRead(selectedRoom.id, currentUserId);
          } catch (e) {
            console.error("읽음 처리 실패:", e);
          }
        }
      } catch (err) {
        console.error("메시지 로드 실패:", err);
        setMessages([]);
      }
    };
    fetchMessages();
    
    // 새 메시지와 읽음 상태를 주기적으로 업데이트 (3초마다)
    const interval = setInterval(() => {
      if (selectedRoom && currentUserId) {
        getMessages(selectedRoom.id).then((res) => {
          const newMessages = res.data.messages || res.data || [];
          setMessages((prev) => {
            // 새 메시지가 있는지 확인
            const prevIds = new Set(prev.map((m: Message) => m.id));
            const hasNewMessages = newMessages.some((m: Message) => !prevIds.has(m.id));
            
            if (hasNewMessages) {
              // 새 메시지가 있으면 전체 목록을 새로고침
              return newMessages;
            } else {
              // 새 메시지가 없으면 읽음 상태만 업데이트
              return prev.map((oldMsg) => {
                const updatedMsg = newMessages.find((m: any) => m.id === oldMsg.id);
                return updatedMsg ? { ...oldMsg, isRead: updatedMsg.isRead } : oldMsg;
              });
            }
          });
        }).catch((err) => {
          console.error("메시지 업데이트 실패:", err);
        });
      }
    }, 3000);
    
    return () => clearInterval(interval);
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

  // 채팅방 나가기
  const handleLeaveChatRoom = async () => {
    if (!selectedRoom) return;
    if (!confirm("채팅방을 나가시겠습니까?")) return;

    try {
      await deleteChatRoom(selectedRoom.id);
      // 채팅방 목록 새로고침
      if (currentUserId) {
        const res = await getUserChatRooms(currentUserId);
        const rooms = (res.data.chatRooms || []).map((room: any) => ({
          id: room.id,
          postId: room.postId,
          post: room.post,
          lastMessage: room.lastMessage?.content || "",
          lastMessageTime: room.lastMessage?.createdAt 
            ? new Date(room.lastMessage.createdAt).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })
            : "",
          unreadCount: room.unreadCount || 0,
        }));
        setChatRooms(rooms);
      }
      setSelectedRoom(null);
      setShowMenu(false);
    } catch (err: any) {
      console.error("채팅방 나가기 실패:", err);
      if (err.response?.status === 404) {
        alert("채팅방을 찾을 수 없습니다.");
      } else {
        alert("채팅방 나가기에 실패했습니다.");
      }
    }
  };

  // 게시글 보기
  const handleViewPost = () => {
    if (!selectedRoom?.postId) return;
    setShowMenu(false);
    nav(`/post/${selectedRoom.postId}`);
  };

  // ======================================================
  // (1) 채팅 상세 화면
  // ======================================================
  if (selectedRoom) {
    return (
      <div className="min-h-screen flex flex-col transition-colors" style={{ backgroundColor: bgMain, paddingBottom: '112px' }}>
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
          <div className="relative">
            <button 
              onClick={() => setShowMenu(!showMenu)} 
              className="p-2"
            >
              <MoreVertical className="w-5 h-5 text-white/80" />
            </button>
            
            {/* 메뉴 드롭다운 */}
            {showMenu && (
              <>
                <div 
                  className="fixed inset-0 z-20" 
                  onClick={() => setShowMenu(false)}
                />
                <div 
                  className="absolute top-full right-0 mt-1 min-w-[180px] rounded-xl overflow-hidden z-30"
                  style={{ 
                    backgroundColor: "#ffffff",
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.04)"
                  }}
                >
                  <button
                    onClick={handleViewPost}
                    className="w-full px-4 py-2 text-sm text-left transition-colors hover:bg-gray-50 flex items-center gap-3 whitespace-nowrap"
                    style={{ 
                      color: "#1f2937"
                    }}
                  >
                    <Eye className="w-4 h-4 flex-shrink-0" style={{ color: "#6b7280" }} />
                    <span className="flex-shrink-0">게시글 보기</span>
                  </button>
                  <div style={{ borderTop: "1px solid #f3f4f6", margin: "0 8px" }} />
                  <button
                    onClick={handleLeaveChatRoom}
                    className="w-full px-4 py-2 text-sm text-left transition-colors hover:bg-red-50 flex items-center gap-3 whitespace-nowrap"
                    style={{ 
                      color: "#ef4444",
                      fontWeight: "500"
                    }}
                  >
                    <LogOut className="w-4 h-4 flex-shrink-0" style={{ color: "#ef4444" }} />
                    <span className="flex-shrink-0">채팅방 나가기</span>
                  </button>
                </div>
              </>
            )}
          </div>
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
                  <div className={`flex items-center gap-1 mt-1 ${isMe ? "flex-row-reverse" : ""}`}>
                    <span className="text-xs px-1" style={{ color: textTertiary }}>{formatTime(msg.createdAt)}</span>
                    {isMe && !msg.isRead && (
                      <span 
                        className="text-xs font-medium"
                        style={{ color: pointColor }}
                      >
                        1
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* 메시지 입력창 */}
        <div className="fixed left-0 right-0 px-3 py-2 transition-colors z-10 max-w-[430px] mx-auto" style={{ backgroundColor: bgCard, bottom: '64px' }}>
          <div className="flex gap-2 items-center">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
              placeholder="메시지를 입력하세요"
              className="flex-1 rounded-xl"
              style={{ 
                backgroundColor: bgIcon, 
                color: textPrimary, 
                borderColor: borderColor,
                padding: "10px 14px",
                height: "40px",
                fontSize: "14px"
              }}
              disabled={sending}
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={sending || !newMessage.trim()} 
              className="bg-gradient-to-br from-[#1A2F4A] to-[#355074] rounded-xl flex-shrink-0"
              style={{ 
                width: "40px",
                height: "40px",
                padding: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Send className="w-4 h-4" />
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
