import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import { RequestSigninDto } from '../types/auth';
import { LOCAL_STORAGE_KEY } from '../constants/key';
import { postSignin, postLogout, getMyInfo } from '../apis/auth';
import { useLocalStorage } from '../hooks/useLocalStorage';

// 1. Context에서 사용할 타입 정의
interface AuthContextType {
  accessToken: string | null; // 로그인한 사용자의 액세스 토큰 (로그인하지 않은 경우 null)
  refreshToken: string | null; // 리프레시 토큰 (토큰 만료 시 재발급 요청용)
  user: { id: number; name: string } | null;
  login: (signInDate: RequestSigninDto) => Promise<void>; // 로그인 함수: 사용자 정보(email, password)를 받아 로그인 처리(비동기 함수)
  logout: () => Promise<void>; // 로그아웃 함수: 서버 로그아웃 + 클라이언트 상태 초기화
}

// 2. Context 생성
// 초기값은 null 또는 빈 함수들로 설정됨 -> 실제로 사용되지는 않지만 타입 맞추기 위해서 설정함
// (실제 구현은 Provider 안에서)
export const AuthContext = createContext<AuthContextType>({
  accessToken: null,
  refreshToken: null,
  user: null,
  login: async () => {}, // 기본 로그인 함수
  logout: async () => {}, // 기본 로그아웃 함수
});

// 3.Context를 공급해주는 Provider 컴포넌트 정의
export const AuthProvider = ({ children }: PropsWithChildren) => {
  // accessToken을 로컬스토리지에서 get/set/remove 하는 훅 사용
  const {
    getItem: getAcessTokenFromStorage,
    setItem: setAcessTokenInStorage,
    removeItem: removeAcessTokenFromStorage,
  } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);

  // refreshToken도 마찬가지로 로컬스토리지 훅으로 관리
  const {
    getItem: getRefreshTokenFromStorage,
    setItem: setRefreshTokenInStorage,
    removeItem: removeRefreshTokenFromStorage,
  } = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);

  // accessToken 상태 설정
  // useState를 통해서 accessToken이라는 상태를 선언하고, 초기값을 getAcessTokenFromStorage()의 반환값으로 설정
  // 페이지가 처음 로드될 때 로컬스토리지에 accessToken이 있으면 그걸 상태값으로 설정하고, 없으면 null
  const [accessToken, setAccessToken] = useState<string | null>(getAcessTokenFromStorage());

  // refreshToken도 상태 관리 : 초기값을 로컬스토리지에서 꺼낸 값으로 설정.
  // 로그인이 되면 이 값을 새로 세팅(setRefreshToken), 로그아웃하면 null로 리셋.
  const [refreshToken, setRefreshToken] = useState<string | null>(getRefreshTokenFromStorage());

  // 사용자 이름 상태 -> 로그인 후 새로고침 후 getmyinfo로 채워짐
  const [user, setUser] = useState<{ id: number; name: string } | null>(null);

  // 로그인 함수
  const login = async (signinData: RequestSigninDto) => {
    try {
      // 1. 로그인 API 요청 : 사용자가 입력한 이메일/비밀번호를 서버에 전송
      const { data } = await postSignin(signinData);
      if (data) {
        // 응답에 데이터가 존재할 경우(로그인 성공 시)
        // 1. data에서 토큰을 추출
        const newAccessToken = data.accessToken;
        const newRefreshToken = data.refreshToken;
        const userName = data.user.name;
        const userId = data.user.userId;

        // 2. 토큰 로컬스토리지에 저장
        setAcessTokenInStorage(newAccessToken);
        setRefreshTokenInStorage(newRefreshToken);

        // 3. 상태로도 저장 (Context로 공유되게 함)
        setAccessToken(newAccessToken);
        setRefreshToken(newRefreshToken);
        setUser({ id: userId, name: userName });

        alert('로그인 성공');
        window.location.href = '/mypage'; // 로그인 후 마이페이지로 이동
      }
    } catch (error) {
      console.error('로그인 오류', error);
      alert('로그인 실패');
    }
  };

  // 로그아웃 함수
  const logout = async () => {
    try {
      await postLogout(); // 서버에 로그아웃 API 요청

      // 로컬스토리지에 저장되어 있던 토큰 값을 제거함
      removeAcessTokenFromStorage();
      removeRefreshTokenFromStorage();

      // react 내부 상태도 초기화함
      setAccessToken(null);
      setRefreshToken(null);
      setUser(null);

      alert('로그아웃 성공');
    } catch (error) {
      console.error('로그아웃 오류', error);
      alert('로그아웃 실패');
    }
  };

  // accessToken이 존재하면
  // 사용자 정보를 서버에서 다시 가져옴 -> 페이지 새로고침 시 유용
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (accessToken && !user) {
        try {
          const { data } = await getMyInfo(); // /v1/users/me 등에서 사용자 이름 받아옴
          setUser({ id: data.id, name: data.name }); // 받아온 이름으로 user 상태 채움
        } catch (error) {
          console.error('사용자 정보 불러오기 실패', error);
        }
      }
    };

    fetchUserInfo();
  }, [accessToken]); // accessToken 변경될 때마다 실행됨

  // Provider : context의 공급자 역할을 하는 컴포넌트
  return (
    <AuthContext.Provider value={{ accessToken, refreshToken, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Context를 더 편하게 사용하기 위한 커스텀 훅
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    // 에러 헨들링
    throw new Error('AuthContext를 찾을 수 없습니다.');
  }

  return context;
};
