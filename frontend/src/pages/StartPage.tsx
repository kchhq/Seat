import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png'; // 이미지 경로 조정 필요
import { useEffect } from 'react';

function StartPage() {
  const navigate = useNavigate();

  // 3초 후 로그인 페이지로 이동
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login'); // 로그인 페이지 경로로 이동
    }, 3000);

    return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머 제거
  }, [navigate]);

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-white px-4">
      <button onClick={() => navigate('/login')}>
        <img src={logo} alt="로고" className="w-24 h-24 mb-4" />
      </button>

      <div className="text-left">
        <p className="text-sm font-semibold text-gray-400">상명대학교</p>
        <p className="text-sm text-gray-300">좌석 예약 시스템</p>
      </div>
    </div>
  );
}
export default StartPage;
