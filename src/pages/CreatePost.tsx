// src/pages/CreatePost.tsx
import { useState } from "react";
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
  const [images, setImages] = useState<string[]>([]);
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

    try {
      setLoading(true);
      const res = await uploadImage(file); // { imageUrl: "..." }
      setImages((prev) => [...prev, res.imageUrl]);
    } catch (err) {
      console.error(err);
      alert("이미지 업로드 실패");
    } finally {
      setLoading(false);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // 등록하기 ----------------------------
  const handleSubmit = async () => {
    if (!title || !price || !deadline) {
      alert("필수 값을 모두 입력해주세요.");
      return;
    }

    try {
      setLoading(true);

      await createPost({
        title,
        price: Number(price),
        deadline,
        authorId: "20241234", // 🔥 실제 로그인하면 localStorage에서 studentId 사용해야 함
        images,
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
          <Label>이미지 ({images.length}/5)</Label>
          

          <div className="flex gap-3 overflow-x-auto pb-2">
            {/* 파일 선택 */}
            <label className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center flex-shrink-0 hover:border-[#6F91BC] transition-colors cursor-pointer">
              <input type="file" className="hidden" onChange={handleSelectFile} />
              <Upload className="w-6 h-6 text-gray-400" />
            </label>

            {images.map((image, index) => (
              <div
                key={index}
                className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden"
              >
                <img
                  src={image}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center"
                >
                  <X className="w-4 h-4 text-white" />
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
              <SelectItem value="food">식료품</SelectItem>
              <SelectItem value="living">생활용품</SelectItem>
              <SelectItem value="electronics">전자제품</SelectItem>
              <SelectItem value="etc">기타</SelectItem>
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
