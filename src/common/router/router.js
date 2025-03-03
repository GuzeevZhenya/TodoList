import {createBrowserRouter} from 'react-router-dom';
import {RegistrationForm} from '../../feature/auth/ui/RegistrationForm';
import {LoginPage} from '../../feature/auth/ui/LoggIn';
import {ProtectedRoute} from './ProtectedRoute';
import {TodoListLogger as Todolist} from '../../feature/todo/ui/TodoList';
import {App} from '../../app/App';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/register',
        element: <RegistrationForm />,
      },
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: '/',
            element: <Todolist />,
          },
        ],
      },
    ],
  },
]);
