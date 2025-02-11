import React, { useState } from 'react';

interface ModalTagSelectorProps {
  tags: string[];
  selectedTags: string[];
  onClose: () => void;
  onSave: (tags: string[]) => void;
}

const ModalTagSelector: React.FC<ModalTagSelectorProps> = ({
  tags,
  selectedTags,
  onClose,
  onSave,
}) => {
  const [localSelectedTags, setLocalSelectedTags] = useState<string[]>(selectedTags);

  // 태그 선택/해제 토글 함수
  const toggleTag = (tag: string) => {
    setLocalSelectedTags((prevTags)=>
    prevTags.includes(tag) 
    ? prevTags.filter((t) => t !== tag) // 이미 선택된 태그는 해제
    : [...prevTags, tag]                // 선택되지않은 태그는 추가
    );
  };

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex:10000,
    }}>
      <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '8px',
        width: '320px',
        textAlign: 'center',
      }}>
        <h3>태그 선택</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '16px' }}>
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              style={{
                padding: '8px 16px',
                border: 'none',
                borderRadius: '20px',
                backgroundColor: localSelectedTags.includes(tag) ? '#007BFF' : '#E0E0E0',
                color: localSelectedTags.includes(tag) ? '#FFFFFF' : '#000000',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease',
              }}
            >
              {tag}
            </button>
          ))}
        </div>

        <div style={{ marginTop: '20px' }}>
          <button onClick={() => onSave(localSelectedTags)} style={{ marginRight: '8px' }}>
            저장
          </button>
          <button onClick={onClose}>취소</button>
        </div>
      </div>
    </div>
  );
};

export default ModalTagSelector;