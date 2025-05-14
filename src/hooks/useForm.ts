import { useEffect, useState } from 'react';

// 커스텀 훅에 전달할 props 타입 정의
interface UseFormProps<T> {
  initialValue: T;
  validate: (values: T) => Record<keyof T, string>;
}

function useForm<T>({ initialValue, validate }: UseFormProps<T>) {
  const [values, setValues] = useState<T>(initialValue);
  const [touched, setTouched] = useState<Record<keyof T, boolean>>({} as Record<keyof T, boolean>);
  const [errors, setErrors] = useState<Record<keyof T, string>>({} as Record<keyof T, string>);

  // event로부터 value 추출
  const handleChange = (name: keyof T) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues((prev) => ({
      ...prev,
      [name]: e.target.value,
    }));
  };

  //  마찬가지로 이벤트 객체 사용
  const handleBlur = (name: keyof T) => (e: React.FocusEvent<HTMLInputElement>) => {
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
  };

  useEffect(() => {
    const newErrors = validate(values);
    setErrors(newErrors);
  }, [values, validate]);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
  };
}

export default useForm;
