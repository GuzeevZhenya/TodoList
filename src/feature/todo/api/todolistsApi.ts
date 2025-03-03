import {instance} from '../../auth/api/apiClient';

export const getTodolistAPI = () => {
  return instance.get('/todos');
};

export const addTodolistAPI = (data: any) => {
  console.log(data);
  return instance.post('/todos', data);
};

export const deleteTodolistAPI = (id: string) => {
  return instance.delete(`/todos/${id}`);
};

export const updateTodolistAPI = (id: string, title: string) => {
  return instance.patch(`/todos/${id}`, {title});
};
