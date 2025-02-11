import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Diary, DiaryService } from "../services/diary/DiaryService";
import EmotionSelectorModal from "../components/diary/emotionSelectorModal";
import { Emotion, EmotionKey, emotions } from "../contants/emtionsContants";
import ModalTagSelector from "../components/diary/tagSelectorModal";
import { tags } from "../contants/tagsContants";

const UpdateDiaryPage: React.FC = () => {
  const { date } = useParams<{ date: string }>();
  

  // 감정표현
  const [emotion, setEmotion] = useState<string>("");
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion | null>(null);
  const [isEmotionModalOpen, setIsEmotionModalOpen] = useState(false);

  // 태그
  const [tag, setTag] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // 태그 삭제
  const handleDeleteTag = (tag: string) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag));
  }
  //태그 수정
  const handleSaveTags = (updatedTags:string[]) => {
    setSelectedTags(updatedTags); // 선택된 태그 상태 업데이트
    setTag(updatedTags); // 전체 태그 상태 업데이트
    setIsModalOpen(false);
  }

  // 이미지
  // const [image,setImage] = useState<string>("");

  // 내용
  const [content, setContent] = useState<string>("");

  const navigate = useNavigate();

  // 감정명을 이모지 변환
    const getEmojiFromEmotion = (emotion: Emotion | null) => {
      return (
        Object.keys(emotions).find(
          (emoji) => emotions[emoji as EmotionKey] === emotion
        ) || ''
      );
    };

  useEffect(() => {
    const fetchDiary = async () => {
      if (date) {
        try {
          const data = await DiaryService.getDiaryByDate(date);
          if (data) {
            setContent(data.content || "");
            setEmotion(data.emotion);
            setTag(data.tag || []);
            setSelectedTags(data.tag || []);
            // setImage(data.imageUrl||"");
          }
        } catch (err) {
          console.error("Error fetching diary:", err);
        }
      }
    };

    fetchDiary();
  }, [date]);

  const handleUpdate = async () => {
    if (!date) return;

    const updatedDiary: Partial<Diary> = {
      emotion,
      tag,
    };

    try {
      await DiaryService.updateDiary(date, updatedDiary);
      alert("일기가 성공적으로 수정되었습니다.");
      navigate(`/diaries/view/${date}`);
    } catch (err) {
      console.error("Error updating diary:", err);
      alert("일기 수정에 실패했습니다.");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h2>일기 수정</h2>

      {/* 날짜 제목 */}
      <div>
        <h3>{date}</h3>
      </div>
      {/* 감정 표현 */}
      <div>
        <h3>감정 표현:</h3>
          <div>
            <span style={{ fontSize: '22px' }}>
              {emotion ? getEmojiFromEmotion(emotion as Emotion) : 
              emotion ? getEmojiFromEmotion(emotion as Emotion): " 감정을 선택해주세요"}
            </span>
            <button
              onClick={() => setIsEmotionModalOpen(true)}
              style={{ marginLeft: '10px' }}
            >
              감정 선택
            </button>
          </div>
          {isEmotionModalOpen && (
            <EmotionSelectorModal
              selectedEmotion={selectedEmotion ?? (emotion as Emotion)}
              onSelect={(newEmotion) => {
                setSelectedEmotion(newEmotion); // 새로운 선택된 감정 저장
                setEmotion(newEmotion); // 수정된 감정을 상태에 반영
                setIsEmotionModalOpen(false); // 모달 닫기
              }}
              onClose={() => setIsEmotionModalOpen(false)}
            />
          )}
        </div>
      {/* 태그 모달 */}
      <div>
        <h3>선택한 태그 : </h3>
        <ul>
        {selectedTags.length > 0 ? (
          selectedTags.map((tag, index) => (
            <li key={index} style={{ display: 'flex', alignItems: 'center' }}>
              {tag}
              <button onClick={() => handleDeleteTag(tag)}>삭제</button>
            </li>
      ))
    ) : (
      <p>선택된 태그가 없습니다.</p>
    )}
        </ul>
        <button onClick={() => setIsModalOpen(true)}>태그 수정</button>
        {isModalOpen && (
          <ModalTagSelector 
            tags={[...tags]} // 기존 태그 목록 전달
            selectedTags={selectedTags} // 이미 선택된 태그 전달
            onClose={() => setIsModalOpen(false)}
            onSave={handleSaveTags}
          />
        )}
      </div>
      
      {/* 이미지 업로드 */}

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="내용을 입력하세요"
        style={{ width: "100%", height: "100px" }}
      ></textarea>

      <div style={{ marginTop: "20px" }}>
        <button onClick={handleUpdate} style={{ marginRight: "10px" }}>
          수정 완료
        </button>
        <button onClick={() => navigate(`/diaries/view/${date}`)}>취소</button>
      </div>
    </div>
  );
};

export default UpdateDiaryPage;
