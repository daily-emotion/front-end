import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ModalTagSelector from '../components/diary/tagSelectorModal';
import MyDropzone from '../components/diary/addImage';
import EmotionSelectorModal from '../components/diary/emotionSelectorModal';
import { useLocation, useNavigate } from 'react-router-dom';
import { DiaryService } from '../services/diary/DiaryService';
import { emotions, Emotion, EmotionKey } from '../contants/emtionsContants';
import { tags } from '../contants/tagsContants';

const CreateDiaryPage: React.FC = () => {
  const location = useLocation();

  // date (초기값을 url에 적힌 날짜로 설정)
  const [selectedDate, setSelectedDate] = useState<Date>(
    new Date(location.pathname.split('/').pop() || '')
  );
  // Emotion
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion | null>(null);
  const [isEmotionModalOpen, setIsEmotionModalOpen] = useState(false);
  // Tags
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // content
  const [content, setContent] = useState<string>('');
  // image
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  // 허용할 이미지 용량
  const imageMaxSize = 10 * 1024 * 1024; // 10MB
  // imageUrl
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string[]>([]);
  // error
  const [error, setError] = useState<string | null>(null);
  // router
  const navigate = useNavigate();

  // 영어로 된 요일을 한국어로 번역
  const getDayName = (date: Date): string => {
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    return days[date.getDay()];
  };

  // datepicker에서 날짜 변경시 Url도 동시에 변경됨
  const handleDateChange = (date: Date | null) => {
    if (!date) return; // null 값 처리

    // KST 시간대로 날짜 format
    const formatDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    setSelectedDate(date);
    navigate(`/diaries/new/${formatDate}`);
  };

  // 감정명을 이모지 변환
  const getEmojiFromEmotion = (emotion: Emotion | null) => {
    return (
      Object.keys(emotions).find(
        (emoji) => emotions[emoji as EmotionKey] === emotion
      ) || ''
    );
  };

  const handleSaveTags = (tags: string[]) => {
    setSelectedTags(tags);
    setIsModalOpen(false);
  };

  const handleDeleteTag = (tag: string) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag));
  };

  // 이미지 관련
  const handleAddImage = async (file: File) => {

    // 이미지 한 개만 업로드 가능
    if(uploadedImages.length >= 1){
      alert('이미지는 한 개만 업로드 할 수 있습니다.')
      return;
    }

    // 이미지 용량 확인
    if (file.size > imageMaxSize) {
      alert(
        `업로드 가능한 최대 용량은 10MB입니다. (현재 파일 용량 : ${(file.size / (1024 * 1024)).toFixed(2)}MB)`
      );
      return;
    } 

    try{
      // 이미지 주소 변환
      const imageUrl = await DiaryService.imageUpload(file);
      if(imageUrl) {
        setUploadedImageUrl([imageUrl]);
        setUploadedImages([file]);
      } else {
        console.log('이미지 URL이 반환되지않았습니다.')
      }
    } catch(error){
      console.error('이미지 업로드 실패:', error);
      alert('이미지 업로드 중 오류가 발생했습니다.');
    }

    // 이미지 업로드 API
    try {
      const imageUrl = await DiaryService.imageUpload(file);
      if (imageUrl){
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

  const handleSubmit = async () => {
    setError(null);

    try {
      // emotion을 필수 입력값으로 사용자 지정
      if (!selectedEmotion) {
        throw new Error('감정을 선택해야 합니다.');
      }
      if (selectedTags.length === 0) {
        throw new Error('태그를 추가해야 합니다.');
      }

      // 전달할 일기 정보들
      const diary = {
        date: selectedDate.toISOString().split('T')[0],
        emotion: selectedEmotion,
        content: content,
        tag: selectedTags,
        imageUrl: uploadedImageUrl.join(','),
      };

      // 전달할 API
      const response = await DiaryService.createDiary(diary, diary.date);

      // console.log(`response: ${response}`);

      if (!response) {
        throw new Error('일기가 등록되지 않았습니다.');
      }

      // 일기 저장 후 이동할 경로
      navigate('/main');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'An unknown error occurred. Please try again.'
      );
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>
        {selectedDate.getMonth() + 1}월 {selectedDate.getDate()}일{' '}
        {getDayName(selectedDate)}요일
      </h2>
      <DatePicker selected={selectedDate} onChange={handleDateChange} inline />

      <div>
        <h3>감정 표현:</h3>
        <div>
          <span style={{ fontSize: '22px' }}>
            {selectedEmotion ? (
              getEmojiFromEmotion(selectedEmotion)
            ) : (
              <p>감정을 선택해주세요</p>
            )}
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
            <li key={index} style={{ display: 'flex', alignItems: 'center' }}>
              {tag}
              <button
                onClick={() => handleDeleteTag(tag)}
                style={{ marginLeft: '10px' }}
              >
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

        {/* 이미지 미리보기 */}
        {uploadedImageUrl.length > 0 && (
          <div style={{ marginTop: '10px' }}>
          <h4>이미지 미리보기</h4>
          <img 
            src={uploadedImageUrl[0]} 
            alt="Uploaded Preview Image" 
            style={{
              marginTop: '10px',
              width: '300px',  // 고정된 너비
              height: '300px', // 고정된 높이
              objectFit: 'contain',  // 잘리지 않고 이미지 비율 유지
              border: '1px solid #ddd', // 테두리 추가 (옵션)
              borderRadius: '5px' // 모서리 둥글게 (옵션)
            }} 
          />
         <div style={{ textAlign: 'center', marginTop: '10px' }}>
            <button onClick={handleDeleteImage}>삭제</button>
          </div>
        </div>
        )}
      </div>

      <textarea
        placeholder="일기 내용을 입력하세요"
        style={{ width: '100%', height: '100px', marginTop: '20px' }}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      ></textarea>

      <div style={{ marginTop: '20px' }}>
        <button
          style={{ marginRight: '10px' }}
          onClick={() => navigate('/main')}
        >
          취소하기
        </button>
        <button onClick={handleSubmit}>등록하기</button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default CreateDiaryPage;
