import React, { useEffect, useState } from 'react';
import { Diary, DiaryService } from '../services/diary/DiaryService';
import { useNavigate, useParams } from 'react-router-dom';
import { Emotion, EmotionKey, emotions } from '../contants/emtionsContants';

const DiaryDetail: React.FC = () => {
  const { date } = useParams<{ date: string }>(); // URL 파라미터에서 date 가져오기
  const [diary, setDiary] = useState<Diary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // 감정표현 이모티콘으로 변환
  const getEmojiFromEmotion = (emotion:Emotion | null) => {
    return(
      Object.keys(emotions).find(
        (emoji) => emotions[emoji as EmotionKey] === emotion
      ) || ''
    );
  };

  useEffect(() => {
    const fetchDiary = async () => {
      setLoading(true);
      try {
        const data = await DiaryService.getDiaryByDate(date!); // ! 을 붙인 이유는 절대 undefined가 올 수 없음을 알려준다.
        setDiary(data || null); // undefined일 경우 null로 처리
        setError(null);
      } catch (err) {
        console.error('Error fetching diary:', err); // 오류 로그 출력
        setError('일기를 가져오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchDiary();
  }, [date]);

  // 일기를 찾을 수 없을 경우 생성페이지로 이동
  useEffect(() => {
    if (error === '일기를 가져오는 데 실패했습니다.') {
      alert('해당 날짜의 일기가 존재하지않습니다. 새로운 일기를 작성해주세요.');
      navigate(`/diaries/new/${date}`);
    }
  }, [error, navigate, date]); // 의존성 배열을 추가함으로써 불필요한 렌더링 방지

  const updateDiary = () => {
    navigate(`/diaries/edit/${date}`, { state : { tags : diary?.tag||[]}});
  };

  const deleteDiary = async () => {
    try {
      await DiaryService.deleteDiary(date!); // 삭제 요청
      setDiary(null); // 삭제 후 화면에서 제거
      alert('일기가 성공적으로 삭제되었습니다.'); // 성공 메시지
      navigate(`/main`);
    } catch (err) {
      console.error('Error deleting diary:', err); // 에러 로그 출력
      setError('일기 삭제에 실패했습니다.'); // 에러 메시지 상태 업데이트
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={{ padding: '20px' }}>
      {diary ? (
        <>
          <h2>{date}</h2>
          <p>
            <strong>감정 표현:</strong> {getEmojiFromEmotion(diary.emotion as Emotion)}
          </p>
          <p>
            <strong>내용:</strong> {diary.content || '내용이 없습니다.'}
          </p>
          <p>
            <strong>태그:</strong> {diary.tag?.join(', ') || '태그가 없습니다.'}
          </p>
          {diary.imageUrl ? (
            <div>
              <h2><strong>이미지:</strong></h2>
              <div>
                <img
                  src={diary.imageUrl}
                  alt="Diary"
                  style={{ maxWidth: '300px' }}
                />
              </div>
            </div>
          ) : null}
          <button onClick={updateDiary}>수정하기</button>
          <button onClick={deleteDiary}>삭제하기</button>
        </>
      ) : null}
    </div>
  );
};

export default DiaryDetail;
