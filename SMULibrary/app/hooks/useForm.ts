import { useEffect, useState } from "react";

// 커스텀 훅에 전달할 props 타입 정의
interface UseFormProps<T> {
  initialValue: T; // 초기 입력값 객체 (예: { email: "", password: "" })
  validate: (values: T) => Record<keyof T, string>; // 유효성 검사 함수: 입력값을 받아 각 필드별 에러 메시지를 반환
}

// 제네릭 T를 사용해 다양한 입력폼에도 재사용 가능
function useForm<T>({ initialValue, validate }: UseFormProps<T>) {
  // 입력값 상태 (예: { email: "abc@test.com", password: "1234" })
  const [values, setValues] = useState<T>(initialValue);

  // 사용자가 어떤 input을 터치했는지를 저장 (처음엔 아무것도 터치 안 했다고 가정)
  const [touched, setTouched] = useState<Record<keyof T, boolean>>(
    {} as Record<keyof T, boolean>
  );

  // 필드별 에러 메시지를 담는 상태 (예: { email: "이메일 형식이 잘못되었습니다" })
  const [errors, setErrors] = useState<Record<keyof T, string>>(
    {} as Record<keyof T, string>
  );

  // 사용자가 텍스트를 입력할 때 호출할 함수
  // → React Native의 onChangeText에서 사용됨
  const handleChange = (name: keyof T) => (text: string) => {
    setValues((prev) => ({
      ...prev, // 기존 값 유지
      [name]: text, // 현재 필드만 업데이트
    }));
  };

  // 사용자가 해당 필드를 blur(포커스를 잃음)했을 때 호출할 함수
  // → 해당 필드를 touched 상태로 표시
  const handleBlur = (name: keyof T) => {
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
  };

  // 입력값이 변경될 때마다 자동으로 유효성 검사 함수 실행
  useEffect(() => {
    const newErrors = validate(values); // 현재 입력된 값으로 유효성 검사 수행
    setErrors(newErrors); // 검사 결과를 에러 상태에 저장
  }, [values, validate]); // values나 validate 함수가 변경될 때마다 실행

  // 필요한 값들과 함수들을 반환
  return {
    values, //입력값
    errors, //에러 메시지
    touched, //각 필드가 건들여졌는지 여부
    handleChange, // 텍스트 입력 시 호출할 함수
    handleBlur, // 입력창에서 포커스를 잃을 때 호출할 함수
  };
}

export default useForm;
