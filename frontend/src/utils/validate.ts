// 사용자 로그인 시 입력받는 정보 타입 정의 (email, password 필드 포함)
export type UserSignupInformation = {
  email: string;
  password: string;
};

// 사용자 로그인 입력값 유효성 검사 함수
function validateUser(values: UserSignupInformation) {
  const errors = {
    email: "",
    password: "",
  };

  // 이메일 형식 정규식 검사 (올바른 이메일이 아니면 오류 메시지 설정)
  if (
    !/^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i.test(
      values.email
    )
  ) {
    errors.email = "올바른 이메일 형식이 아닙니다.";
  }

  // 비밀번호 길이 검사 (8자 이상 20자 이하만 허용)
  if (!(values.password.length >= 8 && values.password.length <= 20)) {
    errors.password = "비밀번호는 8~20자 사이로 입력해주세요.";
  }

  // 에러 메시지 객체 반환 (문제가 없으면 빈 문자열이 유지됨)
  return errors;
}

// validateSignin 함수는 validateUser 함수를 그대로 재사용함
function validateSignin(values: UserSignupInformation) {
  return validateUser(values);
}

export { validateSignin };
