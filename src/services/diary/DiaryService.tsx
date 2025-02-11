import axios from 'axios';

// API 기본 URL 설정
// export const API_BASE_URL = 'https://daily-emotion.site/api';
export const API_BASE_URL =
  import.meta.env.VITE_SERVER_URL || 'http://localhost:8080/api';

// Diary 타입 정의
export interface Diary {
  emotion: string;
  content?: string;
  tag: string[];
  imageFile?: File;
  imageUrl?: string;
}

// 이미지 업로드 응답 타입 정의
interface ImageUploadResponse {
  imageUrl: string;
}

// 토큰 관리
const token = localStorage.getItem('Authorization');

// DiaryService 정의
export const DiaryService = {
  // 프로필 조회
  getName: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/user/profile`);
      return response.data;
    } catch {
      console.log('API : 프로필 조회에 실패하였습니다.');
    }
  },

  // 일기 생성
  createDiary: async (diary: Diary, date: string) => {
    try {
      // json 데이터 전송
      const diaryData = {
        emotion: diary.emotion,
        content: diary.content,
        tag: diary.tag,
        imageUrl: diary.imageUrl,
      };

      const response = await axios.post(
        `${API_BASE_URL}/diaries/${date}`,
        diaryData,
        {
          headers: {
            Authorization: token,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('생성 : ', response.data);
      return response.data;
    } catch {
      console.log('API : 일기 생성에 실패하였습니다.');
      console.log(`${API_BASE_URL}/diaries/${date}`); // URL 확인
    }
  },

  // 이미지 첨부
  imageUpload: async (imageFile: File) => {
    try {
      // 이미지 format
      const formData = new FormData();
      formData.append('file', imageFile); // 파일 객체 추가

      formData.forEach((value, key) => {
        console.log(`${key}: ${value}`);
      });

      const response = await axios.post<ImageUploadResponse>(
        `${API_BASE_URL}/diaries/images`,
        formData,
        {
          headers: {
            Authorization: token,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log('이미지 첨부 : ', response.data);
      return response.data.imageUrl;
    } catch {
      console.log('API : 이미지 첨부에 실패하였습니다.');
    }
  },

  // 특정 날짜 일기 조회
  getDiaryByDate: async (date: string) => {
    try {
      const response = await axios.get<Diary>(
        `${API_BASE_URL}/diaries/${date}`,
        {
          headers: {
            Authorization: token,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch {
      console.log('API : 특정 날짜 일기 조회에 실패하였습니다.');
    }
  },

  // 일기 수정
  updateDiary: async (date: string, updateDiary: Partial<Diary>) => {
    // Partial<Diary> : Diary 타입의 모든 속성을 필수에서 선택으로 변경됨
    try {
      const response = await axios.put(
        `${API_BASE_URL}/diaries/${date}`,
        updateDiary,
        {
          headers: {
            Authorization: token,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('수정 : ', response.data);
      return response.data;
    } catch {
      console.log('API : 일기 수정에 실패하였습니다.');
    }
  },

  // 일기 삭제
  deleteDiary: async (date: string) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/diaries/${date}`, {
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      });
      console.log('삭제 : ', response.data);
      return response.data;
    } catch {
      console.log('API : 일기 삭제에 실패하였습니다.');
    }
  },
};
