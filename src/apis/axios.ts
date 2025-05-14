import axios, { InternalAxiosRequestConfig } from 'axios'; // axios 라이브러리 import(HTTP 요청 보내는 도구)
import { useLocalStorage } from '../hooks/useLocalStorage';
import { LOCAL_STORAGE_KEY } from '../constants/key';

// 요청 설정 객체에 커스텀 필드(_retry)를 추가한 타입 정의
interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean; // 요청이 재시도 중인지를 나타내는 플래그
}

// 전역 변수로 refresh 요청 Promise를 저장 → 중복 요청 방지
let refreshPromise: Promise<string> | null = null;

// axios 인스턴스 생성
export const axiosInstance = axios.create({
  // .env에 정의된 백엔드 API 주소
  //   baseURL: ,
  withCredentials: true, // 쿠키를 요청에 포함
});

// // axios 인스턴스 생성
// export const axiosInstance = axios.create({
//   baseURL: import.meta.env.VITE_SERVER_API_URL, // .env에 정의된 백엔드 API 주소
//   withCredentials: true, // 쿠키를 요청에 포함
// });

// 요청 인터셉터 설정 (모든 요청 전에 실행됨)
axiosInstance.interceptors.request.use(
  (config) => {
    const { getItem } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
    const accessToken = getItem(); // 로컬스토리지에서 accessToken 가져옴

    //accessToken이 존재하면 Authorization 헤더에 Bearer 토큰 형식으로 추가한다.
    if (accessToken) {
      config.headers = config.headers || {}; // headers가 undefined일 수도 있으므로 초기화
      config.headers.Authorization = `Bearer ${accessToken}`; // Bearer 토큰 형식
    }

    return config; // 수정된 요청 설정을 반환
  },
  (error) => Promise.reject(error), // 요청 인터셉트 자체 실패 시 에러 반환
);

//응답 인터셉터 : 401 에러 발생 -> refresh 토큰을 통한 토큰 갱신을 처리합니다.
axiosInstance.interceptors.response.use(
  (Response) => Response, // 응답이 성공일 경우 그대로 통과

  async (error) => {
    const originalRequest: CustomInternalAxiosRequestConfig = error.config; // 원래 요청 저장

    // 401 에러면서 + 아직 재시도 하지 않은 요청만 처리
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      // refresh 요청에서 401이 난 경우 → 로그아웃 처리
      if (originalRequest.url === '/v1/auth/refresh') {
        const { removeItem: removeAccessToken } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
        const { removeItem: removeRefreshToken } = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);
        removeAccessToken();
        removeRefreshToken();
        window.location.href = '/login'; // 로그인 페이지로 이동
        return Promise.reject(error);
      }

      // 재시도 플래그 설정
      originalRequest._retry = true;

      // refresh 요청이 이미 진행 중인 경우 기존 Promise 재사용
      if (!refreshPromise) {
        refreshPromise = (async () => {
          const { getItem: getRefreshToken } = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);
          const refreshToken = getRefreshToken(); // refreshToken 가져오기

          // 새 토큰을 요청
          const { data } = await axiosInstance.post('/v1/auth/refresh', {
            refresh: refreshToken,
          });

          // 새 토큰이 저장
          const { setItem: setAccessToken } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
          const { setItem: setRefreshToken } = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);
          setAccessToken(data.data.accessToken);
          setRefreshToken(data.data.refreshToken);

          // 새 accessToken을 반환하여 다른 요청들이 이것을 사용할 수 있게 함.
          return data.data.accessToken;
        })()
          .catch((error) => {
            // refresh 자체 실패 → 강제 로그아웃
            const { removeItem: removeAccessToken } = useLocalStorage(
              LOCAL_STORAGE_KEY.accessToken,
            );
            const { removeItem: removeRefreshToken } = useLocalStorage(
              LOCAL_STORAGE_KEY.refreshToken,
            );
            removeAccessToken();
            removeRefreshToken();
          })
          .finally(() => {
            refreshPromise = null; // Promise 재사용 종료
          });
      }

      // 새 토큰 발급이 완료되면
      return refreshPromise.then((newAccessToken) => {
        // 원본 요청의 Authorization 헤더를 갱신된 토큰으로 업데이트
        originalRequest.headers['Authorization'] = `Bearer${newAccessToken}`;

        // 업데이트 된 원본 요청을 재시도
        return axiosInstance.request(originalRequest);
      });
    }
    // 401 외의 에러는 그냥 그대로 반환
    return Promise.reject();
  },
);
