import 'antd/dist/reset.css';
import './App.css';
import { TodoListLogger as Todolist } from '../feature/todo/ui/TodoList';

function App() {
  return (
    <div className="App">
      <Todolist />
    </div>
  );
}

export default App;
