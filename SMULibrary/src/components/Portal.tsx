//  [Portal 컴포넌트]
// 이 컴포넌트는 children을 React Portal 방식으로 별도의 DOM 노드(#modal-root)에 렌더링합니다.
// 일반적인 컴포넌트 트리 밖에서 UI 요소(모달, 툴팁 등)를 그릴 수 있어 레이아웃 충돌을 방지합니다.

import ReactDOM from 'react-dom';

const Portal = ({ children }: { children: React.ReactNode }) => {
  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) return null;
  return ReactDOM.createPortal(children, modalRoot);
};

export default Portal;
