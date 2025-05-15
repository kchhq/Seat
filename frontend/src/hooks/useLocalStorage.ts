// 브라우저의 로컬스토리지에 값을 저장/가져오기/삭제하는 기능을 제공하는 커스텀 훅.
// => 로그인 토큰이나 사용자 설정 같은 데이터를 클라이언트에 영구적으로 저장할 때 사용한다.

// 매개변수로 key(저장할 항목 이름)를 받아서 해당 key 기준으로 동작함
export const useLocalStorage = (key: string) => {
  // 1. 로컬스토리지에 값 저장
  const setItem = (value: unknown) => {
    try {
      // value(값)를 문자열로 변환해서 저장 (객체도 저장 가능)
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.log(error); // 저장 중 오류 발생 시 콘솔에 출력
    }
  };

  // 2. 로컬 스토리지에서 값 불러오기
  const getItem = () => {
    try {
      const item = window.localStorage.getItem(key); // 문자열로 저장된 값 가져오기

      return item ? JSON.parse(item) : null; // 문자열을 다시 원래 형태로 변환
    } catch (e) {
      console.log(e); // 파싱 중 오류 발생 시 콘솔에 출력
    }
  };

  // 3. 로컬 스토리지에서 값 삭제
  const removeItem = () => {
    try {
      window.localStorage.removeItem(key); // 해당 key에 저장된 항목 삭제
    } catch (error) {
      console.log(error); // 삭제 중 오류 발생 시 콘솔에 출력
    }
  };

  return { setItem, getItem, removeItem }; // 세 가지 기능을 객체로 반환
};
