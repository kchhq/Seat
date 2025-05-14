import { z } from 'zod';
import { CommonResponse } from './common';

// ----------------------
//  Zod 회원가입 스키마
// ----------------------

export const signupSchema = z
  .object({
    name: z.string().min(1, { message: '이름을 입력해주세요.' }),
    studentId: z.string().min(1, { message: '학번을 입력해주세요.' }),
    email: z.string().email({ message: '올바른 이메일 형식이 아닙니다.' }),
    password: z
      .string()
      .min(8, { message: '비밀번호는 8자 이상이어야 합니다.' })
      .max(20, { message: '비밀번호는 20자 이하여야 합니다.' }),
    passwordCheck: z
      .string()
      .min(8, { message: '비밀번호를 다시 입력해주세요.' })
      .max(20, { message: '비밀번호는 20자 이하여야 합니다.' }),
  })
  .refine((data) => data.password === data.passwordCheck, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['passwordCheck'],
  });

// ----------------------
//  타입 정의
// ----------------------

export type SignupFormFields = z.infer<typeof signupSchema>;

export type RequestSignupDto = {
  user_name: string;
  user_number: string;
  user_email: string;
  user_password: string;
};

export type ResponseSignupDto = CommonResponse<{
  name: string;
  studentId: string;
  email: string;
  password: string;
}>;

export type RequestSigninDto = {
  user_email: string;
  user_password: string;
};

export type ResponseSigninDto = CommonResponse<{
  accessToken: string;
  refreshToken: string;
  user: {
    userId: number;
    name: string;
    email: string;
    studentId: string;
  };
}>;

// ----------------------
//  매핑 함수
// ----------------------

export const toRequestSignupDto = (form: SignupFormFields): RequestSignupDto => ({
  user_name: form.name,
  user_number: form.studentId,
  user_email: form.email,
  user_password: form.password,
});
