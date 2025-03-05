import React, { useState } from 'react';
import { List, Spin } from 'antd';
import { Todolist } from '../api/todolistsApi.types';
import { withLogging } from '../../../Logger/Logger';
import { useAddTodosMutation, useGetAllTodosQuery, useRemoveTodoMutation, useToggleTodoCompletionMutation, useUpdateTodoTitleMutation } from '../api/todoApi';
import { TodoItem } from './TodoItem';
import { EditTodoModal } from './EditTodoModal';
import { AddTodoForm } from './AddTodolistForm';


interface TodoListProps {
  logEvent: (action: string, data?: any) => void;
}

const TodoList: React.FC<TodoListProps> = ({ logEvent }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Todolist | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { data: tasks, isLoading, isFetching } = useGetAllTodosQuery();

  const [removeTodo, { isLoading: isRemoving }] = useRemoveTodoMutation();
  const [addTodos, { isLoading: isAdding }] = useAddTodosMutation();
  const [updateTodoTitle, { isLoading: isUpdating }] = useUpdateTodoTitleMutation();
  const [toggleTodoCompletion] = useToggleTodoCompletionMutation();

  const handleAddTask = async (title: string) => {
    try {
      const task = { title };
      await addTodos(task).unwrap();
      logEvent('Add element', { title });
      setError(null);
    } catch (error) {
      setError('Ошибка при добавлении задачи');
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await removeTodo(id).unwrap();
      const deletedTask = tasks?.find((dl) => dl.id === id);
      logEvent('Удаление элемента', deletedTask);
    } catch (error) {
      setError('Ошибка при удалении задачи');
    }
  };

  const handleSaveEdit = async () => {
    if (editingTask) {
      try {
        await updateTodoTitle({ id: editingTask.id, title: editingTask.title }).unwrap();
        setIsModalVisible(false);
        setEditingTask(null);
        logEvent('Изменение элемента', editingTask);
        setError(null);
      } catch (err) {
        setError('Ошибка при обновлении задачи');
      }
    } else {
      setError('Title is required');
    }
  };

  const handleEditTask = (task: Todolist) => {
    setEditingTask(task);
    setIsModalVisible(true);
  };

  const handleCancelEdit = () => {
    setIsModalVisible(false);
    setEditingTask(null);
    logEvent('Редактирование отменено');
  };

  const handleToggleCompletion = async (id: string) => {
    try {
      await toggleTodoCompletion({ id }).unwrap();
    } catch (error) {
      setError('Ошибка при изменении статуса задачи');
    }
  };

  if (isLoading || isFetching) {
    return <Spin size="large" tip="Загрузка..." />;
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <AddTodoForm onAdd={handleAddTask} isAdding={isAdding} error={error} setError={setError} />

      <List
        dataSource={tasks}
        renderItem={(task: Todolist) => (
          <TodoItem
            key={task.id}
            task={task}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
            onToggleCompletion={handleToggleCompletion}
            isUpdating={isUpdating}
            isRemoving={isRemoving}
          />
        )}
        style={{
          width: '100%',
          maxWidth: '600px',
        }}
      />

      <EditTodoModal
        isVisible={isModalVisible}
        task={editingTask}
        onSave={handleSaveEdit}
        onCancel={handleCancelEdit}
        onChange={setEditingTask}
        error={error}
      />
    </div>
  );
};

export const TodoListLogger = withLogging(TodoList);