// src/pages/Chat.tsx
import { useState } from "react";
import { ArrowLeft, MessageCircle, Send } from "lucide-react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "../components/ui/avatar";

interface ChatScreenProps {
  onBack?: () => void; // App.tsx 안의 구조 때문에 optional 처리
}

export default function Chat({ onBack }: ChatScreenProps) {
  // 채팅방 목록 데이터
  const chatRooms = [
    {
      id: 1,
      name: "허니버터칩 공구",
      lastMessage: "내일 5시에 봬요!",
      time: "오후 3:24",
      unread: 2,
      avatar: "",
    },
    {
      id: 2,
      name: "생활용품 공구방",
      lastMessage: "네 감사합니다!",
      time: "오전 11:15",
      unread: 0,
      avatar: "",
    },
  ];

  // 현재 선택된 채팅방 ID
  const [selectedChat, setSelectedChat] = useState<number | null>(null);

  // 채팅 메시지 목록
  const messages = [
    {
      id: 1,
      sender: "other",
      senderName: "김민지",
      content: "안녕하세요! 공동구매 참여하고 싶어요",
      time: "오후 2:15",
      avatar:
        "https://images.unsplash.com/photo-1568880893176-fb2bdab44e41?w=200&q=80",
    },
    {
      id: 2,
      sender: "me",
      content: "네! 환영합니다 😊",
      time: "오후 2:16",
    },
    {
      id: 3,
      sender: "other",
      senderName: "김민지",
      content: "수령은 언제 어디서 하나요?",
      time: "오후 2:17",
      avatar:
        "https://images.unsplash.com/photo-1568880893176-fb2bdab44e41?w=200&q=80",
    },
    {
      id: 4,
      sender: "me",
      content: "내일 오후 5시에 도서관 앞에서 만나요!",
      time: "오후 3:24",
    },
  ];

  // ======================================================
  // (1) 채팅 상세 화면
  // ======================================================
  if (selectedChat) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#8BA3C3]/5 to-white flex flex-col pb-20">
        {/* 헤더 */}
        <div className="sticky top-0 bg-gradient-to-r from-[#1A2F4A] to-[#355074] px-4 py-3 flex items-center gap-3 z-10 shadow-md">
          <button onClick={() => setSelectedChat(null)} className="p-1">
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>

          <Avatar className="w-10 h-10 ring-2 ring-white/30">
            <AvatarFallback className="bg-gradient-to-br from-[#6F91BC] to-[#8BA3C3] text-white">
              김
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <h3 className="text-white">허니버터칩 공구</h3>
            <p className="text-xs text-white/80">참여자 3명</p>
          </div>
        </div>

        {/* 메시지 목록 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-2 ${
                msg.sender === "me" ? "flex-row-reverse" : ""
              }`}
            >
              {msg.sender === "other" && (
                <Avatar className="w-8 h-8">
                  <AvatarImage src={msg.avatar} />
                  <AvatarFallback className="bg-[#8BA3C3] text-white text-xs">
                    {msg.senderName?.[0]}
                  </AvatarFallback>
                </Avatar>
              )}

              <div
                className={`flex flex-col ${
                  msg.sender === "me" ? "items-end" : "items-start"
                } max-w-[70%]`}
              >
                {msg.sender === "other" && msg.senderName && (
                  <span className="text-xs text-gray-500 mb-1 px-1">
                    {msg.senderName}
                  </span>
                )}

                <div
                  className={`px-4 py-3 rounded-2xl shadow-sm ${
                    msg.sender === "me"
                      ? "bg-gradient-to-br from-[#1A2F4A] to-[#355074] text-white rounded-br-sm"
                      : "bg-white text-gray-900 rounded-bl-sm border border-gray-100"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                </div>

                <span className="text-xs text-gray-400 mt-1 px-1">
                  {msg.time}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* 메시지 입력창 */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 shadow-lg">
          <div className="flex gap-2">
            <Input
              placeholder="메시지를 입력하세요"
              className="flex-1 bg-gray-50 border border-gray-200 rounded-xl py-6"
            />
            <Button className="bg-gradient-to-br from-[#1A2F4A] to-[#355074] px-6 rounded-xl">
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
    <div className="min-h-screen bg-white pb-20">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-[#1A2F4A] to-[#355074] px-4 py-4 sticky top-0 z-10">
        <h1 className="text-white">채팅</h1>
      </div>

      {/* 채팅방 목록 */}
      <div className="bg-white">
        {chatRooms.map((room, index) => (
          <button
            key={room.id}
            onClick={() => setSelectedChat(room.id)}
            className="w-full px-4 py-4 flex items-center gap-3 hover:bg-gradient-to-r hover:from-[#8BA3C3]/5 border-b border-gray-100"
          >
            <div className="relative">
              <Avatar className="w-14 h-14">
                <AvatarFallback
                  className={`${
                    index === 0
                      ? "bg-gradient-to-br from-[#6F91BC] to-[#8BA3C3]"
                      : "bg-gradient-to-br from-[#355074] to-[#6F91BC]"
                  } text-white`}
                >
                  {room.name[0]}
                </AvatarFallback>
              </Avatar>

              {room.unread > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-[#6F91BC] to-[#8BA3C3] text-white text-xs rounded-full flex items-center justify-center">
                  {room.unread}
                </div>
              )}
            </div>

            <div className="flex-1 text-left">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-gray-900 truncate">{room.name}</h3>
                <span className="text-xs text-[#6F91BC]">{room.time}</span>
              </div>
              <p
                className={`text-sm truncate ${
                  room.unread > 0 ? "text-gray-900" : "text-gray-500"
                }`}
              >
                {room.lastMessage}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
