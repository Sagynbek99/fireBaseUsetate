import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [todo, setTodos] = useState('');
  const [data, setData] = useState([]);

  function todoChangeHandler(e) {
    setTodos(e.target.value);
  }

  const postTodo = async (e) => {
    e.preventDefault();
    if (todo.length === 0) return;
    try {
      const postTedTodo = await fetch(
        'https://example-f87ba-default-rtdb.asia-southeast1.firebasedatabase.app/todos.json',
        {
          method: 'POST',
          body: JSON.stringify({
            task: todo,
            id: Math.floor(Math.random() * 100),
          }),
          headers: { 'Content-type': 'application/json' },
        }
      );
      console.log(postTedTodo);
    } catch (error) {
      console.error(error.message);
    }
    setTodos('');
  };

  const getTasks = async () => {
    try {
      const data = await fetch(
        'https://example-f87ba-default-rtdb.asia-southeast1.firebasedatabase.app/todos.json'
      );
      const result = await data.json();
      const todos = [];
      for (const key in result) {
        todos.push({
          id: key,
          task: result[key].task,
        });
      }
      setData(todos);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getTasks();
  }, [data]);

  const deleteTask = (id) => {
    return async () => {
      try {
        const response = await fetch(
          `https://example-f87ba-default-rtdb.asia-southeast1.firebasedatabase.app/todos/${id}.json/`,
          {
            method: 'DELETE',
          }
        );
        console.log(response);
      } catch (error) {
        console.error(error);
      }
      getTasks()
    };
  };
  return (
    <div className="App">
      <form onSubmit={postTodo}>
        <input type="text" onChange={todoChangeHandler} value={todo} />
        <button type="submit">Add Todo</button>
      </form>
      <hr />
      {data.length === 0 ? (
        <h1>Нет задач</h1>
      ) : (
        data.map((item) => {
          return (
            <div key={item.id}>
              {item.task} <button onClick={deleteTask(item.id)}>Delete</button>
            </div>
          );
        })
      )}
    </div>
  );
}

export default App;
