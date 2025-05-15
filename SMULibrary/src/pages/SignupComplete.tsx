// SignupComplete.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import checkicon from '../assets/checkicon.png';
import { useAuth } from '../context/AuthContext';

const SignupComplete = () => {
  const navigate = useNavigate();

  // // location 말고 다른 방법 써야할 듯
  // const location = useLocation();
  // const name = location.state?.name;

  // user 이름 안받아와짐
  const { user } = useAuth();

  // 3초 대기 후 로그인 화면으로 이동
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login');
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-white px-4">
      <button onClick={() => navigate('/login')}>
        <img src={checkicon} alt="checkicon" className="w-24 h-28 mb-4" />
      </button>
      <div>
        {/* 사용자 이름 및 환영 문구 */}
        {user && <p className="text-lg font-semibold text-[#0F35B0]">{user.name}님, 환영합니다!</p>}
      </div>
    </div>
  );
};

export default SignupComplete;
