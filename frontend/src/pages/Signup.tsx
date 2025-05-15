import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { postSignup } from '../apis/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

// ✅ Zod 유효성 스키마
const schema = z
  .object({
    USER_name: z.string().min(1, { message: '이름을 입력해주세요.' }),
    USER_studentid: z.coerce
      .number({ invalid_type_error: '숫자만 입력하세요.' })
      .int({ message: '정수만 입력하세요.' }),
    USER_email: z.string().email({ message: '올바른 이메일 형식이 아닙니다.' }),
    USER_password: z
      .string()
      .min(8, { message: '비밀번호는 8자 이상이어야 합니다.' })
      .max(20, { message: '비밀번호는 20자 이하여야 합니다.' }),
    passwordCheck: z
      .string()
      .min(8, { message: '비밀번호를 다시 입력해주세요.' })
      .max(20, { message: '비밀번호는 20자 이하여야 합니다.' }),
  })
  .refine((data) => data.USER_password === data.passwordCheck, {
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
      USER_name: '',
      USER_studentid: 0,
      USER_email: '',
      USER_password: '',
      passwordCheck: '',
    },
    resolver: zodResolver(schema),
    mode: 'onBlur',
  });

  const nextStep = async () => {
    let valid = false;
    if (step === 1) valid = await trigger(['USER_name', 'USER_studentid']);
    if (step === 2) valid = await trigger('USER_email');
    if (valid && step < 3) setStep((prev) => prev + 1);
  };

  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

const onSubmit: SubmitHandler<FormFields> = async (data) => {
  const { passwordCheck: _, ...rest } = data;

  try {
    await postSignup(rest); // rest에는 passwordCheck 제외됨
    alert('회원가입에 성공했습니다!');
    navigate('/login');
  } catch (error) {
    if (error instanceof Error) alert(error.message);
    else alert('회원가입에 실패했습니다.');
  }
};


  const isFinalStepDisabled =
    isSubmitting ||
    !getValues('USER_password') ||
    !getValues('passwordCheck') ||
    !!errors.USER_password ||
    !!errors.passwordCheck;

  return (
    <div className="min-h-screen bg-white px-[30px] pt-[80px]">
      <div className="flex flex-row mb-[40px]">
        <button onClick={() => navigate('/login')} className="mr-[24px] text-[16px] text-gray-300">
          LOGIN
        </button>
        <div>
          <p className="text-[16px] font-bold text-[#0F35B0]">SIGN UP</p>
          <div className="w-full h-[2px] bg-[#0F35B0] mt-[4px]" />
        </div>
      </div>

      <p className="text-[16px] font-bold text-[#0F35B0] mb-[40px] text-right">{step} / 3</p>

      <form className="flex flex-col gap-[30px]" onSubmit={handleSubmit(onSubmit)}>
        {step === 1 && (
          <>
            <Controller
              name="USER_name"
              control={control}
              render={({ field }) => (
                <input
                  type="text"
                  placeholder="이름을 입력하세요."
                  className={`h-[48px] rounded-full border px-4 ${
                    errors.USER_name ? 'border-[#C20003]' : 'border-[#ccc]'
                  }`}
                  {...field}
                />
              )}
            />
            {errors.USER_name && (
              <p className="text-[12px] text-[#C20003] -mt-[24px]">
                {errors.USER_name.message}
              </p>
            )}

            <Controller
              name="USER_studentid"
              control={control}
              render={({ field }) => (
                <input
                  type="number"
                  placeholder="학번을 입력하세요."
                  className={`h-[48px] rounded-full border px-4 ${
                    errors.USER_studentid ? 'border-[#C20003]' : 'border-[#ccc]'
                  }`}
                  {...field}
                />
              )}
            />
            {errors.USER_studentid && (
              <p className="text-[12px] text-[#C20003] -mt-[24px]">
                {errors.USER_studentid.message}
              </p>
            )}
          </>
        )}

        {step === 2 && (
          <>
            <Controller
              name="USER_email"
              control={control}
              render={({ field }) => (
                <input
                  type="email"
                  placeholder="이메일을 입력하세요."
                  className={`h-[48px] rounded-full border px-4 ${
                    errors.USER_email ? 'border-[#C20003]' : 'border-[#ccc]'
                  }`}
                  {...field}
                />
              )}
            />
            {errors.USER_email && (
              <p className="text-[12px] text-[#C20003] -mt-[24px]">
                {errors.USER_email.message}
              </p>
            )}
          </>
        )}

        {step === 3 && (
          <>
            <Controller
              name="USER_password"
              control={control}
              render={({ field }) => (
                <input
                  type="password"
                  placeholder="비밀번호를 입력하세요."
                  className={`h-[48px] rounded-full border px-4 ${
                    errors.USER_password ? 'border-[#C20003]' : 'border-[#ccc]'
                  }`}
                  {...field}
                />
              )}
            />
            {errors.USER_password && (
              <p className="text-[12px] text-[#C20003] -mt-[24px]">
                {errors.USER_password.message}
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

      <div className="flex justify-between mt-[40px] text-[32px] text-[#0F35B0] font-bold">
        {step > 1 ? <button onClick={prevStep}>←</button> : <div />}
        {step < 3 && <button onClick={nextStep}>→</button>}
      </div>
    </div>
  );
};

export default SignupPage;
