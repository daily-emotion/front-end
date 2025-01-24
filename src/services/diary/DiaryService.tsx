import axios from 'axios';

// API 기본 URL 설정
// export const API_BASE_URL = 'https://daily-emotion.site/';
export const API_BASE_URL = 'http://localhost:8080/api';

// Diary 타입 정의
export interface Diary {
  date: string;
  emotion: string;
  content ?: string;
  tags: string[];
  image ?: string;
}

// DiaryService 정의
export const DiaryService = {
  // 프로필 조회
  getName: async () => {
    try {
      const response = await axios.get<{ name: string }>(`${API_BASE_URL}/user/profile`); // <{ name: string }> : API 응답 데이터의 구조 정의
      return response.data;
    } catch {
      console.log('API : 프로필 조회에 실패하였습니다.');
    }
  },

  // 일기 생성
  createDiary: async (diary: Diary, date : string) => {
    try {
      const response = await axios.post<{ success: boolean }>(`${API_BASE_URL}/diaries/${date}`, diary,
        {
        headers: {
          // "Authorization": token,
          'Content-Type': 'application/json',
        }
      });
      return response.data;
    } catch {
      console.log('API : 일기 생성에 실패하였습니다.');
      console.log(`${API_BASE_URL}/diaries/${date}`); // URL 확인
    }
  },

  // 특정 날짜 일기 조회
  getDiaryByDate: async (date: string) => {
    try {
      const response = await axios.get<Diary>(`${API_BASE_URL}/diaries/${date}`,{
        headers: {
          // "Authorization": token,
          'Content-Type': 'application/json',
        }
      });
      return response.data;
    } catch {
      console.log('API : 특정 날짜 일기 조회에 실패하였습니다.');
    }
  },

  // 일기 수정
  updateDiary: async (date: string, updateDiary: Partial<Diary>) => { // Partial<Diary> : Diary 타입의 모든 속성을 필수에서 선택으로 변경됨
    try {
      const response = await axios.put<{ success: boolean }>(`${API_BASE_URL}/diaries/${date}`, updateDiary,{
        headers: {
          // "Authorization": token,
          'Content-Type': 'application/json',
        }
      }); // <{ success: boolean }> : 응답 데이터 구조 정의
      return response.data;
    } catch {
      console.log('API : 일기 수정에 실패하였습니다.');
    }
  },

  // 일기 삭제
  deleteDiary: async (date: string) => {
    try {
      const response = await axios.delete<{ success: boolean }>(`${API_BASE_URL}/diaries/${date}`,{
        headers: {
          // "Authorization": token,
          'Content-Type': 'application/json',
        }
      });
      return response.data;
    } catch {
      console.log('API : 일기 삭제에 실패하였습니다.');
    }
  },
};