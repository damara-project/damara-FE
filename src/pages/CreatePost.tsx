// src/pages/CreatePost.tsx
import React, { useState } from "react";
import { ArrowLeft, Upload, X } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { useNavigate } from "react-router-dom";

import { uploadImage } from "../apis/upload";
import { createPost } from "../apis/posts";

export default function CreatePost() {
  const nav = useNavigate();

  // 입력값 상태 ----------------------------
  const [images, setImages] = useState<{ preview: string; url: string }[]>([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [people, setPeople] = useState("");
  const [location, setLocation] = useState("");
  const [deadline, setDeadline] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);

  // 이미지 업로드 ---------------------------
  const handleSelectFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (images.length >= 5) {
      alert("이미지는 최대 5장까지 업로드할 수 있습니다.");
      return;
    }

    // 로컬 프리뷰 먼저 생성
    const preview = URL.createObjectURL(file);
    const tempIndex = images.length;
    setImages((prev) => [...prev, { preview, url: "" }]);

    try {
      setLoading(true);
      const res = await uploadImage(file); // { url: "/uploads/...", filename: "..." }
      console.log("📷 이미지 업로드 응답:", res); // 디버깅용
      
      // 이미지 URL 처리 (이미 전체 URL이거나 상대 경로)
      const imageUrl = res.url.startsWith("http") ? res.url : res.url;
      console.log("📷 완성된 이미지 URL:", imageUrl);
      
      // 업로드 성공 시 URL 업데이트
      setImages((prev) =>
        prev.map((img, i) =>
          i === tempIndex ? { ...img, url: imageUrl } : img
        )
      );
    } catch (err) {
      console.error("❌ 이미지 업로드 에러:", err);
      alert("이미지 업로드 실패");
      // 업로드 실패 시 해당 이미지 제거
      setImages((prev) => prev.filter((_, i) => i !== tempIndex));
    } finally {
      setLoading(false);
    }
  };

  const removeImage = (index: number) => {
    // 프리뷰 URL 해제
    URL.revokeObjectURL(images[index].preview);
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // 등록하기 ----------------------------
  const handleSubmit = async () => {
    if (images.length === 0) {
      alert("이미지를 최소 1장 이상 업로드해주세요.");
      return;
    }
    if (!title || !price || !deadline || !location || !people) {
      alert("필수 값을 모두 입력해주세요.");
      return;
    }

    // 로그인한 사용자 정보 가져오기
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("로그인이 필요합니다.");
      nav("/");
      return;
    }

    try {
      setLoading(true);

      const imageUrls = images.map((img) => img.url).filter((url) => url);
      console.log("📤 전송할 이미지 URLs:", imageUrls); // 디버깅용
      console.log("📤 전송할 데이터:", {
        title,
        content: description || title,
        price: Number(price),
        minParticipants: Number(people),
        deadline,
        pickupLocation: location,
        authorId: userId,
        images: imageUrls,
        category: category || "etc",
      });

      await createPost({
        title,
        content: description || title, // 상세 설명 또는 제목
        price: Number(price),
        minParticipants: Number(people),
        deadline,
        pickupLocation: location,
        authorId: userId,
        images: imageUrls,
        category: category || "etc", // 카테고리 추가
      });

      alert("게시글이 등록되었습니다!");
      nav("/home");
    } catch (err) {
      console.error(err);
      alert("게시글 등록 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* 헤더 */}
      <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between z-10">
        <button onClick={() => nav(-1)} className="p-1">
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h2 className="text-gray-900">공동구매 등록</h2>
        <div className="w-6" />
      </div>

      {/* 스크롤 영역 */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6 pb-24">
        {/* 이미지 업로드 */}
        <div className="space-y-3">
          <Label>이미지 ({images.length}/5) <span className="text-red-500">*필수</span></Label>
          

          <div className="flex gap-4 overflow-x-auto pb-2 pt-2 px-1">
            {/* 파일 선택 */}
            <label className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center flex-shrink-0 hover:border-[#6F91BC] transition-colors cursor-pointer">
              <input 
                type="file" 
                accept="image/*"
                onChange={handleSelectFile} 
                style={{ display: 'none' }}
              />
              <Upload className="w-6 h-6 text-gray-400" />
            </label>

            {images.map((image, index) => (
              <div
                key={index}
                className="relative w-24 h-24 flex-shrink-0 rounded-xl bg-gray-100"
                style={{ border: '2px solid #e5e7eb' }}
              >
                <img
                  src={image.preview}
                  alt=""
                  className="w-full h-full object-cover rounded-xl"
                />
                {/* 업로드 중 표시 */}
                {!image.url && (
                  <div 
                    className="absolute inset-0 bg-black/30 flex items-center justify-center rounded-xl"
                  >
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
                <button
                  onClick={() => removeImage(index)}
                  className="absolute flex items-center justify-center"
                  style={{ 
                    top: '4px', 
                    right: '4px', 
                    width: '20px', 
                    height: '20px', 
                    backgroundColor: 'rgba(0,0,0,0.6)', 
                    borderRadius: '50%'
                  }}
                >
                  <X className="w-3 h-3 text-white" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 제목 */}
        <div className="space-y-2">
          <Label>제목</Label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="공동구매 제목을 입력하세요"
            className="bg-gray-50 border-0 rounded-xl py-6"
          />
        </div>

        {/* 카테고리 */}
        <div className="space-y-2">
          <Label>카테고리</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="bg-gray-50 border-0 rounded-xl py-6">
              <SelectValue placeholder="카테고리를 선택하세요" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="food">먹거리</SelectItem>
              <SelectItem value="daily">일상용품</SelectItem>
              <SelectItem value="beauty">뷰티·패션</SelectItem>
              <SelectItem value="electronics">전자기기</SelectItem>
              <SelectItem value="school">학용품</SelectItem>
              <SelectItem value="freemarket">프리마켓</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 가격/인원 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>1인당 가격</Label>
            <Input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              type="number"
              placeholder="5000"
              className="bg-gray-50 border-0 rounded-xl py-6"
            />
          </div>

          <div className="space-y-2">
            <Label>모집 인원</Label>
            <Input
              value={people}
              onChange={(e) => setPeople(e.target.value)}
              type="number"
              placeholder="5"
              className="bg-gray-50 border-0 rounded-xl py-6"
            />
          </div>
        </div>

        {/* 장소 */}
        <div className="space-y-2">
          <Label>수령 장소</Label>
          <Input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="예: 명지대 도서관 앞"
            className="bg-gray-50 border-0 rounded-xl py-6"
          />
        </div>

        {/* 날짜 */}
        <div className="space-y-2">
          <Label>수령 날짜</Label>
          <Input
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            type="datetime-local"
            className="bg-gray-50 border-0 rounded-xl py-6"
          />
        </div>

        {/* 설명 */}
        <div className="space-y-2">
          <Label>상세 설명</Label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="공동구매 상품 및 진행 방식을 자세히 설명해주세요"
            className="bg-gray-50 border-0 rounded-xl min-h-[200px] resize-none"
          />
        </div>
      </div>

      {/* 제출 버튼 */}
      <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4">
        <Button
          disabled={loading}
          onClick={handleSubmit}
          className="w-full bg-[#1A2F4A] hover:bg-[#355074] py-6 rounded-xl"
        >
          {loading ? "등록 중..." : "등록하기"}
        </Button>
      </div>
    </div>
  );
}
