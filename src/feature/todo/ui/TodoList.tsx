import React, { useState, KeyboardEvent } from 'react';
import { List, Button, Input, Space, Modal, Form } from 'antd';
import { useAppDispatch, useAppSelectore } from '../../hooks/redux';
import { addTodolist, changeTodolistFilter, removeTodolist, updateTodolist } from '../model/todoSlice';
import { FilterValuesType, Todolist } from '../api/todolistsApi.types';
import { withLogging } from '../../../Logger/Logger';

interface TodoListProps {
  logEvent: (action: string, data?: any) => void;
}

const TodoList: React.FC<TodoListProps> = ({ logEvent }) => {
  const tasks = useAppSelectore((state) => state.todo.todo);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Todolist | null>(null);
  const [newTask, setNewTask] = useState('');
  const [error, setError] = useState<string | null>(null)

  const dispatch = useAppDispatch();

  const handleAddTask = () => {
    if (newTask.trim()) {
      const newTaskItem: Todolist = { id: Date.now().toString(), title: newTask, filter: "active" };
      dispatch(addTodolist({ todolist: newTaskItem }));
      setNewTask('');
      logEvent('Add element', newTaskItem);
      setError(null);
    } else {

      setError("Title is required")
    }
  };

  const handleDeleteTask = (id: string) => {
    dispatch(removeTodolist({ id }));
    const deletedTask = tasks.find((dl) => dl.id === id);
    logEvent('Удаление элемента', deletedTask);
  };

  const handleSaveEdit = () => {
    if (editingTask) {
      dispatch(updateTodolist({ todolist: editingTask }));
      setIsModalVisible(false);
      setEditingTask(null);
      logEvent('Изменение элемента', editingTask);
      setError(null);
    } else {
      setError("Title is required");
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

  const addItemOnKeyUpHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleAddTask()
    }
  }

  const changeFilterHandler = (id: string, currentFilter: FilterValuesType) => {
    const newFilter = currentFilter === "active" ? "completed" : "active";
    dispatch(changeTodolistFilter({ id, filter: newFilter }))
  }

  const editItemOnKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSaveEdit();
    }
  };

  return (
    <div
      style={{
        display: 'flex', // Включаем Flexbox
        flexDirection: 'column', // Располагаем элементы вертикально
        alignItems: 'center', // Центрируем по горизонтали
        justifyContent: 'center', // Центрируем по вертикали
        padding: '24px',
      }}
    >

      <Space
        style={{
          marginBottom: '24px',
        }}
      >
        <Form.Item
          validateStatus={error ? 'error' : ''}
          help={error}
          style={{ margin: 0 }}
        >
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
        <Button type="primary" onClick={handleAddTask}>
          Добавить задачу
        </Button>
      </Space>

      <List
        dataSource={tasks}
        renderItem={(task: Todolist) => (
          <List.Item
            actions={[
              <Button onClick={(e) => { e.stopPropagation(); handleEditTask(task); }}>Обновить</Button>,
              <Button danger onClick={(e) => { e.stopPropagation(); handleDeleteTask(task.id); }}>
                Удалить
              </Button>,
            ]}
            style={{
              textAlign: 'center',
              width: '100%',
              cursor: "pointer",
              padding: 0,
              textDecoration: task.filter === "active" ? "none" : "line-through",
            }}
          >
            <span onClick={() => changeFilterHandler(task.id, task.filter)}>
              {task.title}
            </span>
          </List.Item>
        )}
        style={{
          width: '100%',
          maxWidth: '600px',
        }}
      />

      <Modal
        title="Редактировать задачу"
        visible={isModalVisible}
        onOk={handleSaveEdit}
        onCancel={handleCancelEdit}
        style={{
          top: '50%',
          transform: 'translateY(-50%)',
        }}
      >
        <Form>
          <Form.Item
            validateStatus={error ? "error" : ""}
            help={error}
          >
            <Input
              value={editingTask?.title || ''}
              onKeyUp={editItemOnKeyPress}
              onChange={(e) => {
                if (editingTask) {
                  setEditingTask({ ...editingTask, title: e.target.value });
                }
                setError(null);
              }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export const TodoListLogger = withLogging(TodoList);
