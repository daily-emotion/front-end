import React, { useEffect, useState } from "react";
import { Diary, DiaryService } from "../services/diary/DiaryService";

// Mock 데이터 생성
// const mockDiary: Diary = {
//   date: "2025-1-14",
//   emotion: "😊", // 감정 표현
//   content: "오늘은 정말 즐거운 하루를 보냈어요!", // 일기 내용
//   tags: ["운동", "독서"], // 태그 목록
//   imageId: 1,
//   imageUrl: "https://dummyimage.com/300x200/000/fff", // 대체 샘플 이미지 URL
// };

// Mock DiaryService
// const MockDiaryService = {
//   getDiaryByDate: async (date: string): Promise<Diary> => {
//     console.log(`Mock 호출 - 날짜: ${date}`);
//     if (date === mockDiary.date) {
//       return mockDiary;
//     }
//     throw new Error("Mock: 일기를 찾을 수 없습니다.");
//   },
// };

const DiaryDetail: React.FC<{ date: string }> = ({ date }) => {
  const [diary, setDiary] = useState<Diary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDiary = async () => {
      setLoading(true);
      try {
        const data = await DiaryService.getDiaryByDate(date);
        setDiary(data || null); // undefined일 경우 null로 처리
        setError(null);
      } catch (err) {
        console.error("Error fetching diary:", err); // 오류 로그 출력
        setError("일기를 가져오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchDiary();
  }, [date]);

  const deleteDiary = async () =>{
    try {
        await DiaryService.deleteDiary(date); // 삭제 요청
        setDiary(null); // 삭제 후 화면에서 제거
        alert("일기가 성공적으로 삭제되었습니다."); // 성공 메시지
      } catch (err) {
        console.error("Error deleting diary:", err); // 에러 로그 출력
        setError("일기 삭제에 실패했습니다."); // 에러 메시지 상태 업데이트
      }
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  
  return (
    <div style={{ padding: "20px" }}>
      {diary ? (
        <>
          <h2>{diary.date}</h2>
          <p><strong>감정 표현:</strong> {diary.emotion}</p>
          <p><strong>내용:</strong> {diary.content || "내용이 없습니다."}</p>
          <p><strong>태그:</strong> {diary.tags?.join(", ") || "태그가 없습니다."}</p>
          {diary.imageUrl && (
            <div>
              <strong>이미지:</strong>
              <img src={diary.imageUrl} alt="Diary" style={{ maxWidth: "300px", marginTop: "10px" }} />
            </div>
          )}

          <button>수정하기</button>
          <button onClick={deleteDiary}>삭제하기</button>
        </>
      ) : (
        <p>일기를 찾을 수 없습니다.</p>
      )}
    </div>
  );
};

export default DiaryDetail;