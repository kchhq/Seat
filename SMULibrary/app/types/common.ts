// API 요청/응답에서 자주 반복되는 공통 타입들을 정의

// 공통 응답 타입 : 모든 API 응답이 따르는 기본 구조
export type CommonResponse<T> = {
  status: boolean; // 요청 성공 여부 (true/false)
  statusCode: number; // HTTP 상태 코드 : 서버가 클라이언트의 요청에 어떻게 응답했는지
  message: string; // 응답 메시지
  data: T; // 실제 데이터 (제네릭 타입으로 유연하게 받음)
};
