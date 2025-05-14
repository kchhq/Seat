import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { postSignup } from '../apis/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';

// Zod 유효성 스키마
const schema = z
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

type FormFields = z.infer<typeof schema>;

const SignupPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const {
    control,
    handleSubmit,
    trigger,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    defaultValues: {
      name: '',
      studentId: '',
      email: '',
      password: '',
      passwordCheck: '',
    },
    resolver: zodResolver(schema),
    mode: 'onBlur',
  });

  const nextStep = async () => {
    let valid = false;
    if (step === 1) valid = await trigger(['name', 'studentId']);
    if (step === 2) valid = await trigger('email');
    if (valid && step < 3) setStep((prev) => prev + 1);
  };

  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    const { passwordCheck: _, ...rest } = data;
    try {
      await postSignup(rest);
      alert('회원가입에 성공했습니다!');
      navigate('/login');
    } catch (error) {
      if (error instanceof Error) alert(error.message);
      else alert('회원가입에 실패했습니다.');
    }
  };

  const isFinalStepDisabled =
    isSubmitting ||
    !getValues('password') ||
    !getValues('passwordCheck') ||
    !!errors.password ||
    !!errors.passwordCheck;

  return (
    <div className="min-h-screen bg-white px-[30px] pt-[80px]">
      {/* 로그인 / 회원가입 탭 */}
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
              <p className="flex flex-start text-[12px] text-[#C20003] min-h-[16px] -mt-[24px]">
                {errors.name.message}
              </p>
            )}

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
              <p className="flex flex-start text-[12px] text-[#C20003] min-h-[16px] -mt-[24px]">
                {errors.studentId.message}
              </p>
            )}
          </>
        )}

        {step === 2 && (
          <>
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
              <p className="flex flex-start text-[12px] text-[#C20003] min-h-[16px] -mt-[24px]">
                {errors.email.message}
              </p>
            )}
          </>
        )}

        {step === 3 && (
          <>
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
              <p className="flex flex-start text-[12px] text-[#C20003] min-h-[16px] -mt-[24px]">
                {errors.password.message}
              </p>
            )}

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
              <p className=" flex flex-start text-[12px] text-[#C20003] min-h-[16px] -mt-[24px]">
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
