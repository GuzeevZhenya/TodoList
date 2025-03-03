import React, { useState, KeyboardEvent, useEffect } from 'react';
import { List, Button, Input, Space, Modal, Form } from 'antd';
import { useAppDispatch, useAppSelectore } from '../../hooks/redux';
import { addTodolist, changeTodolistFilter, removeTodolist, todolistThunk, updateTodolist } from '../model/todoSlice';
import { Todolist } from '../api/todolistsApi.types';
import { withLogging } from '../../../Logger/Logger';
import { Link } from 'react-router-dom';
import { ErrorSnackbar } from '../../../common/components/ErrorSnackbar';

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

  useEffect(() => {
    dispatch(todolistThunk.fetchTodolist())
    console.log(tasks)
  }, [])

  const handleAddTask = async () => {
    if (newTask.trim()) {
      try {
        await dispatch(todolistThunk.addTodolistThunk({ title: newTask })).unwrap();
        setNewTask('');
        logEvent('Add element', { title: newTask });
        setError(null);
      } catch (error) {
        setError(error as string);
      }
    } else {
      setError("Title is required")
    }
  };

  const handleDeleteTask = (id: string) => {
    dispatch(todolistThunk.removeTodolistThunk(id))
    const deletedTask = tasks.find((dl) => dl.id === id);
    logEvent('Удаление элемента', deletedTask);
  };

  const handleSaveEdit = async () => {
    if (editingTask) {
      try {
        await dispatch(todolistThunk.updateTodolistThunk(editingTask)).unwrap();
        setIsModalVisible(false);
        setEditingTask(null);
        logEvent('Изменение элемента', editingTask);
        setError(null);
      } catch (err) {
        setError(err as string);
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

  const addItemOnKeyUpHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleAddTask()
    }
  }

  const changeFilterHandler = (id: string, currentFilter: boolean) => {
    // const newFilter = currentFilter === "active" ? "completed" : "active";
    // dispatch(changeTodolistFilter({ id, filter: newFilter }))
  }

  const editItemOnKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSaveEdit();
    }
  };

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
              textDecoration: task.isCompleted === false ? "none" : "line-through",
            }}
          >
            <span onClick={() => changeFilterHandler(task.id, task.isCompleted)}>
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
      <ErrorSnackbar />
    </div>
  );
}

export const TodoListLogger = withLogging(TodoList);
