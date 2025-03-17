import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Diary, diaryService } from '../services/diary/diaryService';
import EmotionSelectorModal from '../components/diary/emotionSelectorModal';
import { Emotion, EmotionKey, emotions } from '../contants/emtionsContants';
import ModalTagSelector from '../components/diary/tagSelectorModal';
import { tags } from '../contants/tagsContants';
import MyDropzone from '../components/diary/addImage';
import '../styles/pages/DiaryPage.css';
import DatePicker from 'react-datepicker';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';

const UpdateDiaryPage: React.FC = () => {
  const { date } = useParams<{ date: string }>();

  // date (초기값을 url에 적힌 날짜로 설정)
  const [selectedDate] = useState<Date>(() => {
    const dateFromUrl = location.pathname.split('/').pop();
    return dateFromUrl ? new Date(dateFromUrl) : new Date();
  });

  // 감정표현
  const [emotion, setEmotion] = useState<string>('');
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion | null>(null);
  const [isEmotionModalOpen, setIsEmotionModalOpen] = useState(false);

  // 태그
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  //태그 수정
  const handleSaveTags = (updatedTags: string[]) => {
    setSelectedTags(updatedTags); // 선택된 태그 상태 업데이트
    setIsModalOpen(false);
  };

  // 이미지
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const imageMaxSize = 10 * 1024 * 1024; // 10MB
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string[]>([]);
  const handleAddImage = async (file: File) => {
    // 이미지 한 개만 업로드 가능
    if (uploadedImages.length >= 1) {
      alert('이미지는 한 개만 업로드 할 수 있습니다.');
      return;
    }

    // 이미지 용량 확인
    if (file.size > imageMaxSize) {
      alert(
        `업로드 가능한 최대 용량은 10MB입니다. (현재 파일 용량 : ${(file.size / (1024 * 1024)).toFixed(2)}MB)`
      );
      return;
    }

    try {
      // 이미지 주소 변환
      const imageUrl = await diaryService.imageUpload(file);
      if (imageUrl) {
        setUploadedImageUrl([imageUrl]);
        setUploadedImages([file]);
      } else {
        console.log('이미지 URL이 반환되지않았습니다.');
      }
    } catch (error) {
      console.error('이미지 업로드 실패:', error);
      alert('이미지 업로드 중 오류가 발생했습니다.');
    }

    // 이미지 업로드 API
    try {
      const imageUrl = await diaryService.imageUpload(file);
      if (imageUrl) {
        setUploadedImageUrl([imageUrl]); // 새 이미지 URL로  교체
        setUploadedImages([file]); // 기존 이미지 대체
      }
    } catch (error) {
      console.error('이미지 업로드 실패:', error);
      alert('이미지 업로드 중 오류가 발생했습니다.');
    }
  };

  const handleDeleteImage = () => {
    setUploadedImageUrl([]);
    setUploadedImages([]);
  };

  // 내용
  const [content, setContent] = useState<string>('');

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
          const data = await diaryService.getDiaryByDate(date);
          if (data) {
            setContent(data.content || '');
            setEmotion(data.emotion);
            setSelectedTags(data.tag || []);
            if (data.imageUrl) {
              setUploadedImageUrl([data.imageUrl]);
            }
          }
        } catch (err) {
          console.error('Error fetching diary:', err);
        }
      }
    };

    fetchDiary();
  }, [date]);

  const handleUpdate = async () => {
    if (!date) return;

    const updatedDiary: Diary = {
      emotion: selectedEmotion ?? emotion,
      tag: selectedTags,
      content: content,
      imageUrl: uploadedImageUrl.join(','),
    };

    console.log('수정 후 태그:', selectedTags);

    try {
      await diaryService.updateDiary(date, updatedDiary);
      alert('일기가 성공적으로 수정되었습니다.');
      navigate(`/diaries/view/${date}`);
    } catch (err) {
      console.error('Error updating diary:', err);
      alert('일기 수정에 실패했습니다.');
    }
  };

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

        <div className="diary-content">
          <div className="diary-date">
            <h2>{formatDate(date ?? '')}</h2>
          </div>

          <div className="content-container">
            <div className="content-left">
              <DatePicker selected={selectedDate} inline />
            </div>

            <div className="content-right">
              <div className="content-tag-area">
                <div className="content-tag-title">
                  <p>해시태그 추가</p>
                  <IconButton
                    className="tag-add-button"
                    color="primary"
                    onClick={() => setIsModalOpen(true)}
                    aria-label="태그 추가"
                  >
                    <AddIcon />
                  </IconButton>
                </div>
                <div className="content-tag-list">
                  {selectedTags.length === 0 ? (
                    <p>태그를 선택해주세요</p>
                  ) : (
                    <ul>
                      {selectedTags.map((tag, index) => (
                        <li key={index}>#{tag}</li>
                      ))}
                    </ul>
                  )}
                </div>
                {isModalOpen && (
                  <ModalTagSelector
                    tags={[...tags]}
                    selectedTags={selectedTags}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSaveTags}
                  />
                )}
              </div>

              <div className="content-right-bottom">
                <div className="content-image">
                  <p>이미지 업로드</p>
                  {uploadedImageUrl.length === 0 && (
                    <MyDropzone addImage={handleAddImage} />
                  )}

                  {/* 이미지 미리보기 */}
                  {uploadedImageUrl.length > 0 && (
                    <div className="diary-image">
                      <img
                        src={uploadedImageUrl[0]}
                        alt="Uploaded Preview Image"
                        onClick={handleDeleteImage}
                      />
                    </div>
                  )}
                </div>

                <div className="content-emotion">
                  <p>감정 추가</p>
                  <span
                    className="emotion-emoji"
                    onClick={() => setIsEmotionModalOpen(true)}
                  >
                    {emotion
                      ? getEmojiFromEmotion(emotion as Emotion)
                      : emotion
                        ? getEmojiFromEmotion(emotion as Emotion)
                        : ' 감정을 선택해주세요'}
                  </span>
                </div>
                {isEmotionModalOpen && (
                  <EmotionSelectorModal
                    selectedEmotion={selectedEmotion}
                    onSelect={(emotion) => {
                      setSelectedEmotion(emotion);
                      setEmotion(emotion);
                    }}
                    onClose={() => setIsEmotionModalOpen(false)}
                  />
                )}
              </div>
            </div>
          </div>

          <div className="content-text">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="내용을 입력하세요"
            ></textarea>
          </div>

          <div className="diary-buttons">
            <button onClick={() => navigate(`/diaries/view/${date}`)}>
              취소
            </button>
            <button onClick={handleUpdate}>수정</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdateDiaryPage;
