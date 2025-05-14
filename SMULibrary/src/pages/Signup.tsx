import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

import { signupSchema, SignupFormFields, toRequestSignupDto } from '../types/auth';
import { postSignup } from '../apis/auth';

const SignupPage = () => {
  // 페이지 이동을 위한 훅
  const navigate = useNavigate();

  // 현재 스탭 상태(1-3)
  const [step, setStep] = useState(1);

  // react-hook-form 초기 설정
  const {
    control,
    handleSubmit,
    trigger,
    formState: { errors, isValid, isSubmitting }, // 폼 상태 정보들
  } = useForm<SignupFormFields>({
    defaultValues: {
      name: '',
      studentId: '',
      email: '',
      password: '',
      passwordCheck: '',
    },
    resolver: zodResolver(signupSchema), // zod 스키마 유효성 검사 연결
    mode: 'onChange', // 입력할 때마다 유효성 검사
  });

  // 다음 스텝으로 이동 (필수 필드 유효한 경우에만)
  const nextStep = async () => {
    let valid = false;
    if (step === 1) valid = await trigger(['name', 'studentId']);
    if (step === 2) valid = await trigger('email');
    if (valid && step < 3) setStep((prev) => prev + 1);
  };

  // 이전 스텝으로 이동
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  // 회원가입 제출 -> signupcomplete 페이지(3초) -> login페이지로 이동
  const onSubmit: SubmitHandler<SignupFormFields> = async (data) => {
    try {
      await postSignup(toRequestSignupDto(data));
      navigate('/signupComplete', { state: { name: data.name } });
    } catch (error) {
      if (error instanceof Error) alert(error.message);
      else alert('회원가입에 실패했습니다.');
    }
  };

  // 마지막 스텝에서 버튼 비활성화 조건 (유효성 실패 또는 제출 중)
  const isFinalStepDisabled = isSubmitting || !isValid;

  return (
    <div className="min-h-screen bg-white px-[30px] pt-[80px]">
      {/* 탭 */}
      <div className="flex flex-row mb-[40px]">
        <button onClick={() => navigate('/login')} className="mr-[24px] text-[16px] text-gray-300">
          LOGIN
        </button>
        <div>
          <p className="text-[16px] font-bold text-[#0F35B0]">SIGN UP</p>
          <div className="w-full h-[2px] bg-[#0F35B0] mt-[4px]" />
        </div>
      </div>

      {/* 진행률 */}
      <p className="text-[16px] font-bold text-[#0F35B0] mb-[40px] text-right">{step} / 3</p>

      <form className="flex flex-col gap-[30px]" onSubmit={handleSubmit(onSubmit)}>
        {step === 1 && (
          <>
            {/* 이름 */}
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <input
                  type="text"
                  placeholder="이름을 입력하세요."
                  className={`h-[48px] rounded-full border px-4 ${
                    errors.name ? 'border-[#C20003]' : 'border-[#ccc]'
                  }`}
                  {...field}
                />
              )}
            />
            {errors.name && (
              <p className="text-[12px] text-[#C20003] -mt-[24px]">{errors.name.message}</p>
            )}

            {/* 학번 */}
            <Controller
              name="studentId"
              control={control}
              render={({ field }) => (
                <input
                  type="text"
                  placeholder="학번을 입력하세요."
                  className={`h-[48px] rounded-full border px-4 ${
                    errors.studentId ? 'border-[#C20003]' : 'border-[#ccc]'
                  }`}
                  {...field}
                />
              )}
            />
            {errors.studentId && (
              <p className="text-[12px] text-[#C20003] -mt-[24px]">{errors.studentId.message}</p>
            )}
          </>
        )}

        {step === 2 && (
          <>
            {/* 이메일 */}
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <input
                  type="email"
                  placeholder="이메일을 입력하세요."
                  className={`h-[48px] rounded-full border px-4 ${
                    errors.email ? 'border-[#C20003]' : 'border-[#ccc]'
                  }`}
                  {...field}
                />
              )}
            />
            {errors.email && (
              <p className="text-[12px] text-[#C20003] -mt-[24px]">{errors.email.message}</p>
            )}
          </>
        )}

        {step === 3 && (
          <>
            {/* 비밀번호 */}
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <input
                  type="password"
                  placeholder="비밀번호를 입력하세요."
                  className={`h-[48px] rounded-full border px-4 ${
                    errors.password ? 'border-[#C20003]' : 'border-[#ccc]'
                  }`}
                  {...field}
                />
              )}
            />
            {errors.password && (
              <p className="text-[12px] text-[#C20003] -mt-[24px]">{errors.password.message}</p>
            )}

            {/* 비밀번호 확인 */}
            <Controller
              name="passwordCheck"
              control={control}
              render={({ field }) => (
                <input
                  type="password"
                  placeholder="비밀번호를 다시 입력하세요."
                  className={`h-[48px] rounded-full border px-4 ${
                    errors.passwordCheck ? 'border-[#C20003]' : 'border-[#ccc]'
                  }`}
                  {...field}
                />
              )}
            />
            {errors.passwordCheck && (
              <p className="text-[12px] text-[#C20003] -mt-[24px]">
                {errors.passwordCheck.message}
              </p>
            )}

            <button
              type="submit"
              disabled={isFinalStepDisabled}
              className={`h-[48px] rounded-full font-bold text-white mt-6 ${
                isFinalStepDisabled ? 'bg-[#ccc] opacity-60' : 'bg-[#0F35B0]'
              }`}
            >
              회원가입
            </button>
          </>
        )}
      </form>

      {/* 스텝 이동 */}
      <div className="flex justify-between mt-[40px] text-[32px] text-[#0F35B0] font-bold">
        {step > 1 ? <button onClick={prevStep}>←</button> : <div />}
        {step < 3 && <button onClick={nextStep}>→</button>}
      </div>
    </div>
  );
};

export default SignupPage;
