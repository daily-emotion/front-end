import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Diary, DiaryService } from "../services/diary/DiaryService";
import EmotionSelectorModal from "../components/diary/emotionSelectorModal";
import { Emotion, EmotionKey, emotions } from "../contants/emtionsContants";
import ModalTagSelector from "../components/diary/tagSelectorModal";
import { tags } from "../contants/tagsContants";
import MyDropzone from "../components/diary/addImage";

const UpdateDiaryPage: React.FC = () => {
  const { date } = useParams<{ date: string }>();
  

  // 감정표현
  const [emotion, setEmotion] = useState<string>("");
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion | null>(null);
  const [isEmotionModalOpen, setIsEmotionModalOpen] = useState(false);

  // 태그
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // 태그 삭제
  const handleDeleteTag = (tag: string) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag));
  }
  //태그 수정
  const handleSaveTags = (updatedTags:string[]) => {
    setSelectedTags(updatedTags); // 선택된 태그 상태 업데이트
    setIsModalOpen(false);
  }

  // 이미지
   const [uploadedImages, setUploadedImages] = useState<File[]>([]);
   const imageMaxSize = 10 * 1024 * 1024; // 10MB
   const [uploadedImageUrl, setUploadedImageUrl] = useState<string[]>([]);
   const handleAddImage = async (file : File) => {
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
   }

   const handleDeleteImage = () => {
    setUploadedImageUrl([]);
    setUploadedImages([]);
  };

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
            setSelectedTags(data.tag || []);
            if(data.imageUrl) {setUploadedImageUrl([data.imageUrl]);}
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

    const updatedDiary:Diary = {
      emotion : selectedEmotion ?? emotion,
      tag: selectedTags,
      content:content,
      imageUrl: uploadedImageUrl.join(','),

    console.log("수정 후 태그:", selectedTags);

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
      <div>
        <MyDropzone addImage={handleAddImage}/>
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
