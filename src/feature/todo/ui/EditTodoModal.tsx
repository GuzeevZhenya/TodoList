import React, { KeyboardEvent } from 'react';
import { Modal, Form, Input } from 'antd';
import { Todolist } from '../api/todolistsApi.types';

interface EditTodoModalProps {
  isVisible: boolean;
  task: Todolist | null;
  onSave: () => void;
  onCancel: () => void;
  onChange: (task: Todolist) => void;
  error: string | null;
}

export const EditTodoModal: React.FC<EditTodoModalProps> = ({ isVisible, task, onSave, onCancel, onChange, error }) => {
  const editItemOnKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onSave();
    }
  };

  return (
    <Modal
      title="Редактировать задачу"
      visible={isVisible}
      onOk={onSave}
      onCancel={onCancel}
      style={{
        top: '50%',
        transform: 'translateY(-50%)',
      }}
    >
      <Form>
        <Form.Item validateStatus={error ? 'error' : ''} help={error}>
          <Input
            value={task?.title || ''}
            onKeyUp={editItemOnKeyPress}
            onChange={(e) => {
              if (task) {
                onChange({ ...task, title: e.target.value });
              }
            }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

