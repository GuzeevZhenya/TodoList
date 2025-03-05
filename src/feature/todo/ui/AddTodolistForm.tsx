import React, { useState, KeyboardEvent } from 'react';
import { Input, Button, Form, Space } from 'antd';

interface AddTodoFormProps {
  onAdd: (title: string) => void;
  isAdding: boolean;
  error: string | null;
  setError: (error: string | null) => void;
}

export const AddTodoForm: React.FC<AddTodoFormProps> = ({ onAdd, isAdding, error, setError }) => {
  const [newTask, setNewTask] = useState('');


  const handleAddTask = () => {
    if (newTask.trim()) {
      onAdd(newTask);
      setNewTask('');
    } else {
      setError('Title is required');
    }
  };

  const addItemOnKeyUpHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleAddTask();
    }
  };

  return (
    <Space style={{ marginBottom: '24px' }}>
      <Form.Item validateStatus={error ? 'error' : ''} help={error} style={{ margin: 0 }}>
        <Input
          placeholder="Новая задача"
          value={newTask}
          onChange={(e) => {
            setNewTask(e.target.value);
            setError(null);
          }}
          onKeyUp={addItemOnKeyUpHandler}
        />
      </Form.Item>
      <Button type="primary" onClick={handleAddTask} disabled={isAdding}>
        Добавить задачу
      </Button>
    </Space>
  );
}
