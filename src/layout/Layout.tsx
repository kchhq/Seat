import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div className="relative w-full h-[calc(100vh-66px)] overflow-hidden">
      <Outlet />
    </div>
  );
};
export default Layout;
