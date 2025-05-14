// SignupComplete.tsx
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import checkicon from '../assets/checkicon.png';

const SignupComplete = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const name = location.state?.name;

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login');
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-white px-4">
      <button onClick={() => navigate('/login')}>
        <img src={checkicon} alt="checkicon" className="w-24 h-24 mb-4" />
      </button>
      <div>
        <p className="text-lg font-semibold text-[#0F35B0]">{name} 학우님, 환영합니다!</p>
      </div>
    </div>
  );
};

export default SignupComplete;
