import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './layout/Layout';
import LoginPage from './pages/Login';
import StartPage from './pages/StartPage';
import SignupPage from './pages/Signup';
import MainPage from './pages/MainPage';
import SignupComplete from './pages/SignupComplete';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <div>404 에러 발생 관리자에게 문의하세요!</div>,
    children: [
      {
        path: '',
        element: <StartPage />,
      },
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/signup',
        element: <SignupPage />,
      },
      {
        path: `/signupComplete`,
        element: <SignupComplete />,
      },
      {
        path: 'mainPage',
        element: <MainPage />,
      },
    ],
  },
]);
function App() {
  return <RouterProvider router={router} />;
}

export default App;
