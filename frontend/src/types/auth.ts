// 로그인, 회원가입 시 서버와 주고받는 데이터의 타입을 정의
import { CommonResponse } from "./common"; // 공통으로 받는 데이터 타입

// [회원가입] 요청 시에 서버에 보낼 데이터 타입을 정의
export type RequestSignupDto = {
  USER_id?: string; // <- 이렇게 바꾸세요!
  USER_name: string;
  USER_studentid: number;
  USER_email: string;
  USER_password: string;
};


// [회원가입] 성공 시 서버로부터 받는 응답 타입
export type ResponseSignupDto = CommonResponse<{
  USER_name: string;
  USER_studentid: number;
  USER_email: string;
  USER_password: string;
}>;

// [로그인] 요청 시 서버에 보낼 데이터 타입
export type RequestSigninDto = {
  USER_email: string;
  USER_password: string;
};

// [로그인] 응답 타입 : 로그인하면 사용자 정보, 토큰을 함께 반환
export type ResponseSigninDto = CommonResponse<{
  accessToken: string;
  refreshToken: string;
  user: {
    USER_id: number; // user_id
    USER_name: string; // user_name
    USER_email: string; // user_email
    USER_studentId: string; // user_studentID
  };
}>;
