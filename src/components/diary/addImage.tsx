import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

// Props 인터페이스 정의
interface MyDropzoneProps {
  addImage: (file: File) => void; // 파일을 처리할 함수
}

const MyDropzone: React.FC<MyDropzoneProps> = ({ addImage }) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      acceptedFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          addImage(file); // 파일 추가 콜백 호출
        };
        reader.readAsArrayBuffer(file); // 파일 읽기
      });
    },
    [addImage] // addImage를 의존성으로 추가
  );

  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: {
    "image/*" : [".jpeg", ".jpg", ".png"],
  } });

  return (
    <div
      {...getRootProps()}
      style={{
        border: 'none',
        marginTop: '40px',
        textAlign: 'center',
        cursor: 'pointer',
      }}
    >
      <input {...getInputProps()} />
      <AddPhotoAlternateIcon style={{
        color:"#ccc",
        fontSize : "70px",
        transition: "color 0.2s",
      }}/>
    </div>
  );
};

export default MyDropzone;
