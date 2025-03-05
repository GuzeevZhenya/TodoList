import React from 'react';
import { List, Button } from 'antd';
import { Todolist } from '../api/todolistsApi.types';

interface TodoItemProps {
  task: Todolist;
  onEdit: (task: Todolist) => void;
  onDelete: (id: string) => void;
  onToggleCompletion: (id: string) => void;
  isUpdating: boolean;
  isRemoving: boolean;
}

export const TodoItem: React.FC<TodoItemProps> = ({ task, onEdit, onDelete, onToggleCompletion, isUpdating, isRemoving }) => {
  return (
    <List.Item
      actions={[
        <Button onClick={(e) => { e.stopPropagation(); onEdit(task); }} disabled={isUpdating}>
          Обновить
        </Button>,
        <Button danger onClick={(e) => { e.stopPropagation(); onDelete(task.id); }} disabled={isRemoving}>
          Удалить
        </Button>,
      ]}
      style={{
        textAlign: 'center',
        width: '100%',
        cursor: 'pointer',
        padding: 0,
        textDecoration: task.isCompleted === false ? 'none' : 'line-through',
      }}
    >
      <span onClick={() => onToggleCompletion(task.id)}>
        {task.title}
      </span>
    </List.Item>
  );
};

