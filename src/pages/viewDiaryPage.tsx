import React, { useEffect, useState } from 'react';
import { Diary, diaryService } from '../services/diary/diaryService.ts';
import { useNavigate, useParams } from 'react-router-dom';
import { Emotion, EmotionKey, emotions } from '../contants/emtionsContants';
import { Button } from '@mui/material';
import '../styles/pages/ViewDiaryPage.css';

const DiaryDetail: React.FC = () => {
  const { date } = useParams<{ date: string }>(); // URL 파라미터에서 date 가져오기
  const [diary, setDiary] = useState<Diary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // 감정표현 이모티콘으로 변환
  const getEmojiFromEmotion = (emotion: Emotion | null) => {
    return (
      Object.keys(emotions).find(
        (emoji) => emotions[emoji as EmotionKey] === emotion
      ) || ''
    );
  };

  useEffect(() => {
    const fetchDiary = async () => {
      setLoading(true);
      try {
        const data = await diaryService.getDiaryByDate(date!); // ! 을 붙인 이유는 절대 undefined가 올 수 없음을 알려준다.
        setDiary(data!);
        console.log('조회 페이지 태그:', data?.tag);
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
    navigate(`/diaries/edit/${date}`, { state: { tags: diary?.tag || [] } });
  };

  const deleteDiary = async () => {
    try {
      await diaryService.deleteDiary(date!); // 삭제 요청
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

  // 영어로 된 요일을 한국어로 번역
  const getDayName = (date: Date): string => {
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    return days[date.getDay()];
  };

  // 날짜 변환
  const formatDate = (dateString: string) => {
    const dateObj = new Date(dateString);
    return `${(dateObj.getMonth() + 1).toString().padStart(2, '0')}월 ${dateObj.getDate().toString().padStart(2, '0')}일 ${getDayName(dateObj)}요일`;
  };

  return (
    <>
      <div className="diary-container">
        {/* 배경에 아이콘 추가 */}
        <div className="diary-icon-third"></div>
        <div className="view-container">
          {diary ? (
            <>
              <div className="view-title">
                <h2 className="view-title-date">{formatDate(date ?? '')}</h2>

                <div className="view-title-button">
                  <Button onClick={updateDiary}>수정</Button>
                  <Button onClick={deleteDiary}>삭제</Button>
                </div>
              </div>

              <div
                className={`view-image-container ${diary.imageUrl ? 'has-image' : 'no-image'}`}
              >
                {diary.imageUrl ? (
                  <img src={diary.imageUrl} alt="Diary" />
                ) : null}
                <p>{getEmojiFromEmotion(diary.emotion as Emotion)}</p>
              </div>
              <div className="view-content-container">
                <p>{diary.content || '내용이 없습니다.'}</p>
              </div>
              <div className="view-tag-container">
                <p>
                  {diary.tag?.length > 0
                    ? diary.tag.map((t, index) => <span key={index}>#{t}</span>)
                    : '태그가 없습니다.'}
                </p>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default DiaryDetail;
