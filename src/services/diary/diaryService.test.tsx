import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { API_BASE_URL, diaryService } from './diaryService.tsx';

// DiaryService 테스트를 위한 describe 블록
describe('DiaryService 테스트', () => {
  let mock: MockAdapter;

  // 각 테스트 실행 전에 MockAdapter 초기화
  beforeEach(() => {
    mock = new MockAdapter(axios); // axios 요청을 가로채고 mock 응답을 설정
  });

  // 각 테스트 실행 후 MockAdapter 복구
  afterEach(() => {
    mock.restore(); // Mock 설정 초기화
  });

  // getName() 함수 테스트
  it('getName()이 정상적으로 데이터를 반환해야 합니다', async () => {
    const mockResponse = { name: 'John Doe' }; // mock 응답 데이터 정의
    mock.onGet(`${API_BASE_URL}/user/profile`).reply(200, mockResponse); // GET 요청에 대해 mock 응답 설정

    const data = await DiaryService.getName(); // 실제 getName() 호출
    expect(data).toEqual(mockResponse); // 반환된 데이터가 mock 데이터와 일치하는지 확인
  });

  // createDiary() 함수 테스트
  it('createDiary()가 일기를 성공적으로 생성해야 합니다', async () => {
    const mockDiary = {
      // 생성할 일기 데이터
      date: '2025-01-07',
      emotion: 'happy',
      content: '내용',
      tags: ['happy'],
      imageId: undefined,
      imageUrl: undefined,
    };
    const mockResponse = { success: true }; // 성공 응답 mock 데이터 정의
    mock.onPost(`${API_BASE_URL}/diaries`).reply(200, mockResponse); // POST 요청에 대해 mock 응답 설정

    // 데이터 비교를 없애고 URL만 설정
    const data = await DiaryService.createDiary(mockDiary); // 실제 createDiary() 호출
    expect(data).toEqual(mockResponse); // 반환된 데이터가 mock 데이터와 일치하는지 확인
  });

  // getDiaryByDate() 함수 테스트
  it('getDiaryByDate()가 특정 날짜의 일기를 반환해야 합니다', async () => {
    const mockResponse = {
      // 특정 날짜의 일기 mock 데이터 정의
      date: '2025-01-07',
      content: '오늘은 좋은 날',
      emotion: 'happy',
      tags: ['happy', 'excited'],
      imageId: undefined,
      imageUrl: undefined,
    };
    mock.onGet(`${API_BASE_URL}/diaries/2025-01-07`).reply(200, mockResponse); // GET 요청에 대해 mock 응답 설정

    const data = await DiaryService.getDiaryByDate('2025-01-07'); // 실제 getDiaryByDate() 호출
    expect(data).toEqual(mockResponse); // 반환된 데이터가 mock 데이터와 일치하는지 확인
  });

  // updateDiary() 함수 테스트
  it('updateDiary()가 일기를 성공적으로 수정해야 합니다', async () => {
    const updatedDiary = { content: '수정된 내용' }; // 수정할 데이터
    const mockResponse = { success: true }; // 성공 응답 mock 데이터 정의
    mock
      .onPut(`${API_BASE_URL}/diaries/2025-01-07`, updatedDiary)
      .reply(200, mockResponse); // PUT 요청에 대해 mock 응답 설정

    const data = await DiaryService.updateDiary('2025-01-07', updatedDiary); // 실제 updateDiary() 호출
    expect(data).toEqual(mockResponse); // 반환된 데이터가 mock 데이터와 일치하는지 확인
  });

  // deleteDiary() 함수 테스트
  it('deleteDiary()가 일기를 성공적으로 삭제해야 합니다', async () => {
    const mockResponse = { success: true }; // 성공 응답 mock 데이터 정의
    mock
      .onDelete(`${API_BASE_URL}/diaries/2025-01-07`)
      .reply(200, mockResponse); // DELETE 요청에 대해 mock 응답 설정

    const data = await DiaryService.deleteDiary('2025-01-07'); // 실제 deleteDiary() 호출
    expect(data).toEqual(mockResponse); // 반환된 데이터가 mock 데이터와 일치하는지 확인
  });
});
