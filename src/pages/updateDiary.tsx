import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Diary, DiaryService } from "../services/diary/DiaryService";

const UpdateDiaryPage: React.FC = () => {
  const { date } = useParams<{ date: string }>();
  const [content, setContent] = useState<string>("");
  const [emotion, setEmotion] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDiary = async () => {
      if (date) {
        try {
          const data = await DiaryService.getDiaryByDate(date);
          if (data) {
            setContent(data.content || "");
            setEmotion(data.emotion);
            setTags(data.tags || []);
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
      tags,
    };

    try {
      await DiaryService.updateDiary(date, updatedDiary);
      alert("일기가 성공적으로 수정되었습니다.");
      navigate(`/diaries/${date}`);
    } catch (err) {
      console.error("Error updating diary:", err);
      alert("일기 수정에 실패했습니다.");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h2>일기 수정</h2>

      {/* 날짜 제목 */}
      {/* 감정 표현 */}
      {/* 태그 모달 */}
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
        <button onClick={() => navigate(`/diaries/${date}`)}>취소</button>
      </div>
    </div>
  );
};

export default UpdateDiaryPage;
