import React, { useState } from "react";
import { Emotion, EmotionKey, emotions } from "../../contants/emtionsContants";



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
  const [currentEmotion, setCurrentEmotion] = useState<Emotion | null>(selectedEmotion);

  // 감정 선택 함수
  const selectEmotion = (emoji: EmotionKey) => {
    const emotionValue:Emotion = emotions[emoji];
    setCurrentEmotion(emotionValue); // 선택한 감정을 설정
    console.log("선택된 감정: ", emotionValue);
  };

  // 저장 버튼 클릭 시 실행
  const handleSave = () => {
    if (currentEmotion) {
      onSelect(currentEmotion); // ✅ 감정명을 부모 컴포넌트에 전달
      onClose();
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 10000,
      }}
    >
      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "8px",
          width: "300px",
          textAlign: "center",
        }}
      >
        <h3 style={{color : "black"}}>감정 표현 선택</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom : "15px", }}>
          {Object.entries(emotions).map(([emoji, emotion]) => (
            <button
              key={emoji}
              onClick={() => selectEmotion(emoji as EmotionKey)}
              style={{
                padding: "8px 16px",
                border: "none",
                borderRadius: "20px",
                backgroundColor: currentEmotion === emotion ? "#007BFF" : "#E0E0E0",
                color: currentEmotion === emotion ? "#FFFFFF" : "#000000",
                cursor: "pointer",
              }}
            >
              {emoji}
            </button>
          ))}
        </div>

        <div>
          <button onClick={handleSave} style={{ marginRight: "10px" }}>
            저장
          </button>
          <button onClick={onClose}>취소</button>
        </div>
      </div>
    </div>
  );
};

export default EmotionSelectorModal;
