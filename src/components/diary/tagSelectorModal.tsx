import React, { useState } from 'react';

interface ModalTagSelectorProps {
    tags: string[];
    selectedTags: string[];
    onClose: () => void;
    onSave: (tags: string[]) => void;
}

const ModalTagSelector: React.FC<ModalTagSelectorProps> = ({tags, selectedTags, onClose, onSave,}) => {
    const [localSelectedTags, setLocalSelectedTags] = useState<string[]>(selectedTags);

    // 태그 선택/해제 토글 함수 (최소 1개, 최대 3개 제한)
    const toggleTag = (tag: string) => {
        setLocalSelectedTags((prevTags) => {
            if (prevTags.includes(tag)) {
                // 최소 1개는 선택된 상태여야 함
                return prevTags.length > 1 ? prevTags.filter((t) => t !== tag) : prevTags;
            } else {
                // 최대 3개까지 선택 가능
                return prevTags.length < 3 ? [...prevTags, tag] : prevTags;
            }
        });
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
                <h3 style={{color : "black"}}>태그 선택</h3>
                <p style={{color : "black"}}>최소 1개에서 최대 3개까지 선택 가능합니다.</p>
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