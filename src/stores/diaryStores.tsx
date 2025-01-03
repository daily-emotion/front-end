import { create } from 'zustand';

// interface를 사용하는 이유
// 객체의 구조를 정의하고, 코드의 명확성, 안정성, 유지보수성을 높이기 위해 사용

// 인터페이스로 규칙을 정함
interface Diary {
  date : string;
  emotion : string;
  content : string;
  tags : string[];
  imageId : number;
  imageUrl : string;
}

// 상태를 어떻게 저장하고, 상태를 어떻게 업데이트하거나 검색할 지를 명확하게 정해준다.
interface DiaryStore {
  diaries: Diary[]; // 여러 개의 일기 데이터를 저장하는 배열
  addDiary: (diary: Diary) => void; // 새로운 일기를 추가하는 함수 + Diary 타입의 데이터를 인자로 받고 반환값은 없음 (void)
  updateDiary: (date: string, updatedDiary: Diary) => void; // 기존 일기를 수정하는 함수
  getDiaryByDate: (date: string) => Diary | undefined;  // 특정 날짜로 일기를 찾는 함수 + 찾지 못하면 undefined;
}

// zustand로 상태관리
export const useDiaryStore = create<DiaryStore>((set) => ({
  diaries: [] as Diary[],
  addDiary: (diary) =>
    set((state:DiaryStore) => ({ diaries: [...state.diaries, diary] })),
  updateDiary: (date, updatedDiary) =>
    set((state:DiaryStore) => ({
      diaries: state.diaries.map((d : Diary) =>
        d.date === date ? updatedDiary : d
      ),
    })),
    getDiaryByDate: (date): Diary | undefined => {
        const state = useDiaryStore.getState();
        return state.diaries.find((d: Diary) => d.date === date);
    },
}));
