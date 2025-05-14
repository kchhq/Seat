import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useForm from '../hooks/useForm';
import { UserSignupInformation, validateSignin } from '../utils/validate';

const LoginPage = () => {
  const navigate = useNavigate();
  const [autoLogin, setAutoLogin] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'login' | 'signup'>('login');

  const { values, errors, touched, handleChange, handleBlur } = useForm<UserSignupInformation>({
    initialValue: {
      email: '',
      password: '',
    },
    validate: validateSignin,
  });

  const isDisabled =
    Object.values(errors || {}).some((error) => error.length > 0) ||
    Object.values(values).some((value) => value === '');

  const handleLogin = () => {
    if (values.email && values.password && !isDisabled) {
      navigate('/MainPage');
    }
  };

  return (
    <div className="min-h-screen bg-white px-8 pt-20">
      {/* 탭 영역 */}
      <div className="flex mb-16">
        <div className="mr-6 cursor-pointer" onClick={() => setSelectedTab('login')}>
          <p
            className={`text-base ${
              selectedTab === 'login' ? 'text-blue-800 font-bold' : 'text-gray-400'
            }`}
          >
            LOGIN
          </p>
          {selectedTab === 'login' && <div className="w-full h-0.5 bg-blue-800 mt-1" />}
        </div>
        <div
          className="cursor-pointer"
          onClick={() => {
            setSelectedTab('signup');
            navigate('/signup');
          }}
        >
          <p
            className={`text-base ${
              selectedTab === 'signup' ? 'text-blue-800 font-bold' : 'text-gray-400'
            }`}
          >
            SIGN UP
          </p>
          {selectedTab === 'signup' && <div className="w-full h-0.5 bg-blue-800 mt-1" />}
        </div>
      </div>

      {/* 입력 폼 */}
      <div className="flex flex-col gap-2">
        <input
          type="email"
          value={values.email}
          onChange={handleChange('email')}
          onBlur={handleBlur('email')}
          placeholder="이메일을 입력하세요."
          className={`h-12 rounded-full border px-4 ${
            errors.email && touched.email ? 'border-red-600' : 'border-gray-300'
          }`}
        />
        <p className="flex flex-start text-xs text-red-600 min-h-[16px] mb-1">
          {errors.email && touched.email && errors.email}
        </p>

        <input
          type="password"
          value={values.password}
          onChange={handleChange('password')}
          onBlur={handleBlur('password')}
          placeholder="비밀번호를 입력하세요."
          className={`h-12 rounded-full border px-4 ${
            errors.password && touched.password ? 'border-red-600' : 'border-gray-300'
          }`}
        />
        <p className="flex flex-start text-xs text-red-600 min-h-[16px] mb-4">
          {errors.password && touched.password && errors.password}
        </p>

        <div className="flex justify-between mb-5">
          <span
            onClick={() => setAutoLogin(!autoLogin)}
            className="text-sm text-gray-600 cursor-pointer"
          >
            {autoLogin ? '☑' : '☐'} 로그인 유지
          </span>
          <span className="text-sm text-gray-600">아이디 / 비밀번호 찾기</span>
        </div>

        <button
          className={`h-12 rounded-full text-white font-bold text-base mb-3 ${
            isDisabled ? 'bg-gray-300 opacity-60' : 'bg-blue-800'
          }`}
          onClick={handleLogin}
          disabled={isDisabled}
        >
          로그인
        </button>

        <button className="h-12 rounded-full border border-blue-800 text-blue-800 font-semibold">
          카카오 자동로그인
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
