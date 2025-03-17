import axios from 'axios';
import API, { BASE_URL } from '../../configs/apiConfig';

// Diary 타입 정의
export interface Diary {
  emotion: string;
  content?: string;
  tag: string[];
  imageFile?: File;
  imageUrl?: string;
}

// 토큰 관리
const token = localStorage.getItem('Authorization');

// diaryService 정의
export const diaryService = {
  // 프로필 조회
  getName: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/user/profile`);
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
        `${BASE_URL}/diaries/${date}`,
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
      console.log(`${BASE_URL}/diaries/${date}`); // URL 확인
    }
  },

  // 이미지 첨부
  imageUpload: async (imageFile: File) => {
    try {
      // 이미지 format
      const formData = new FormData();
      formData.append('file', imageFile); // 파일 객체 추가

      const response = await axios.post(
        `${BASE_URL}/diaries/images`,
        formData,
        {
          headers: {
            Authorization: token,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return response.data as string; // 타입을 명식적으로 변환
    } catch {
      console.log('API : 이미지 첨부에 실패하였습니다.');
    }
  },

  // 특정 날짜 일기 조회
  getDiaryByDate: async (date: string) => {
    try {
      const response = await axios.get<Diary>(`${BASE_URL}/diaries/${date}`, {
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch {
      console.log('API : 특정 날짜 일기 조회에 실패하였습니다.');
    }
  },

  // 일기 수정
  updateDiary: async (date: string, updateDiary: Diary) => {
    // Partial<Diary> : Diary 타입의 모든 속성을 필수에서 선택으로 변경됨
    try {
      const diaryData = {
        emotion: updateDiary.emotion,
        tag: updateDiary.tag,
        content: updateDiary.content || '',
        imageUrl: updateDiary.imageUrl || '',
      };
      console.log('API로 보낼 태그 데이터:', diaryData.tag);

      const response = await axios.put(
        `${BASE_URL}/diaries/${date}`,
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
    } catch (error) {
      console.log('API : 일기 수정에 실패하였습니다.');
      throw error; // 에러를 던져서 catch 블록에서 처리할 수 있게 만듦
    }
  },

  // 일기 삭제
  deleteDiary: async (date: string) => {
    try {
      const response = await axios.delete(`${BASE_URL}/diaries/${date}`, {
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

// 로그아웃
export const logout = async () => {
  try {
    // 최신 토큰 가져오기
    const accessToken = localStorage.getItem('Authorization');
    const refreshToken = localStorage.getItem('RefreshToken');

    await API.post(
      `${BASE_URL}/logout`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          RefreshToken: `Bearer ${refreshToken}`,
        },
      }
    );
  } catch (error) {
    console.error('로그아웃 실패', error);
  }
};
