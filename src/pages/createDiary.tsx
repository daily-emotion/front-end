import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ModalTagSelector from "../components/diary/tagSelectorModal";
import MyDropzone from "../components/diary/addImage";
import EmotionSelectorModal from "../components/diary/emotionSelectorModal";
import { useNavigate } from "react-router-dom";
import { DiaryService } from "../services/diary/DiaryService";
import { emotions, Emotion, EmotionKey } from "../contants/emtionsContants";
import { tags } from "../contants/tagsContants";

const CreateDiaryPage: React.FC = () => {
  // date
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  // Emotion
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion | null>(null);
  const [isEmotionModalOpen, setIsEmotionModalOpen] = useState(false);
  // Tags
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  // content
  const [content, setContent] = useState<string>("");
  // image
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // error
  const [error, setError] = useState<string | null>(null);
  // router
  const navigate = useNavigate();

  // 영어로 된 요일을 한국어로 번역
  const getDayName = (date: Date): string => {
    const days = ["일", "월", "화", "수", "목", "금", "토"];
    return days[date.getDay()];
  };

  // datepicker에서 날짜 변경시 Url도 동시에 변경됨
  const handleDateChange = (date: Date | null) => {
  if (!date) return; // null 값 처리

  // KST 시간대로 날짜 format
  const formatDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
    setSelectedDate(date);
    navigate(`/diaries/new/${formatDate}`);
  };

  // 감정명을 이모지 변환
  const getEmojiFromEmotion = (emotion:Emotion | null) => {
    return Object.keys(emotions).find(
      (emoji) => emotions[emoji as EmotionKey] === emotion
    ) || "";
  };

  const handleSaveTags = (tags: string[]) => {
    setSelectedTags(tags);
    setIsModalOpen(false);
  };

  const handleDeleteTag = (tag: string) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag));
  };

  const handleAddImage = (file: File) => {
    setUploadedImages((prevImages) => [...prevImages, file]);
  };

  const handleDeleteImage = (index: number) => {
    setUploadedImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setError(null);

    try {
      // emotion을 필수 입력값으로 사용자 지정
      if (!selectedEmotion) {
        throw new Error("감정을 선택해야 합니다.");
      }
      if (selectedTags.length === 0) {
        throw new Error("태그를 추가해야 합니다.");
      }

      // 전달할 일기 정보들
      const diary = {
        date: selectedDate.toISOString().split('T')[0],
        emotion: selectedEmotion,
        content: content,
        tags: selectedTags,
        image: uploadedImages.length > 0 ? uploadedImages[0].name : undefined,
      };

      // 전달할 API
      const response = await DiaryService.createDiary(diary,diary.date);

      if (!response || !response.success) {
        throw new Error("일기가 등록되지않았습니다.");
      }

      // 일기 저장 후 이동할 경로
      navigate("/main");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred. Please try again.");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h2>
        {selectedDate.getMonth() + 1}월 {selectedDate.getDate()}일 {getDayName(selectedDate)}요일
      </h2>
      <DatePicker selected={selectedDate} onChange={handleDateChange} inline />

      <div>
        <h3>감정 표현:</h3>
        <div>
          <span style={{ fontSize: "22px" }}>
            {selectedEmotion ? getEmojiFromEmotion(selectedEmotion) : <p>감정을 선택해주세요</p>}
          </span>
          <button onClick={() => setIsEmotionModalOpen(true)} style={{ marginLeft: "10px" }}>
            감정 선택
          </button>
        </div>
        {isEmotionModalOpen && (
          <EmotionSelectorModal
            selectedEmotion={selectedEmotion}
            onSelect={(emotion) => setSelectedEmotion(emotion)}
            onClose={() => setIsEmotionModalOpen(false)}
          />
        )}
      </div>

      <div>
        <h3>선택한 태그:</h3>
        <ul>
          {selectedTags.map((tag, index) => (
            <li key={index} style={{ display: "flex", alignItems: "center" }}>
              {tag}
              <button onClick={() => handleDeleteTag(tag)} style={{ marginLeft: "10px" }}>
                삭제
              </button>
            </li>
          ))}
        </ul>
        <button onClick={() => setIsModalOpen(true)}>태그 추가</button>
        {isModalOpen && (
          <ModalTagSelector
            tags={[...tags]}
            selectedTags={selectedTags}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSaveTags}
          />
        )}
      </div>

      <div>
        <h3>이미지 업로드</h3>
        <MyDropzone addImage={handleAddImage} />
        <ul>
          {uploadedImages.map((file, index) => (
            <li key={index} style={{ display: "flex", alignItems: "center" }}>
              {file.name}
              <button onClick={() => handleDeleteImage(index)} style={{ marginLeft: "10px" }}>
                삭제
              </button>
            </li>
          ))}
        </ul>
      </div>

      <textarea
        placeholder="일기 내용을 입력하세요"
        style={{ width: "100%", height: "100px", marginTop: "20px" }}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      ></textarea>

      <div style={{ marginTop: "20px" }}>
        <button style={{ marginRight: "10px" }} onClick={() => navigate("/main")}>
          취소하기
        </button>
        <button onClick={handleSubmit}>등록하기</button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default CreateDiaryPage;