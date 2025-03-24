import React, { useState } from 'react';
import {
  Emotion,
  EmotionKey,
  emotions,
} from '../../constants/emotionConstants';
import '../../styles/Modal/EmotionModal.css';

interface EmotionSelectorModalProps {
  selectedEmotion: Emotion | null; // 단일 감정을 선택
  onSelect: (emotion: Emotion) => void; // 선택된 감정을 부모 컴포넌트에 전달
  onClose: () => void; // 모달 닫기
}

const EmotionSelectorModal: React.FC<EmotionSelectorModalProps> = ({
  selectedEmotion,
  onSelect,
  onClose,
}) => {
  const [currentEmotion, setCurrentEmotion] = useState<Emotion | null>(
    selectedEmotion
  );

  // 감정 선택 함수
  const selectEmotion = (emoji: EmotionKey) => {
    const emotionValue: Emotion = emotions[emoji];
    setCurrentEmotion(emotionValue); // 선택한 감정을 설정
    console.log('선택된 감정: ', emotionValue);
  };

  // 저장 버튼 클릭 시 실행
  const handleSave = () => {
    if (currentEmotion) {
      onSelect(currentEmotion); // ✅ 감정명을 부모 컴포넌트에 전달
      onClose();
    }
  };

  return (
    <div className="emotion-modal-overlay">
      <div className="emotion-modal-container">
        <h3 className="emotion-modal-title">감정 추가</h3>
        <p className="emotion-modal-content">오늘의 감정을 기록해보세요!</p>
        <div className="emotion-buttons-container">
          {Object.entries(emotions).map(([emoji, emotion]) => (
            <button
              key={emoji}
              onClick={() => selectEmotion(emoji as EmotionKey)}
              className={`emotion-button ${currentEmotion === emotion ? 'selected' : ''}`}
            >
              {emoji}
            </button>
          ))}
        </div>

        <div className="emotion-modal-buttons">
          <button onClick={handleSave}>저장</button>
          <button onClick={onClose}>취소</button>
        </div>
      </div>
    </div>
  );
};

export default EmotionSelectorModal;
