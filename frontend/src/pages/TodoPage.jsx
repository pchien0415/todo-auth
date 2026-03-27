import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../api";

function TodoPage() {
  const [inputValue, setInputValue] = useState("");
  const [todos, setTodos] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await fetch(`${BASE_URL}/todos`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        console.log("Fetch todos response:", data);

        if (!response.ok) {
          alert(data.detail || "Failed to fetch todos");
          return;
        }

        setTodos(data);
      } catch (error) {
        console.error("Fetch todos error:", error);
      }
    };

    if (token) {
      fetchTodos();
    }
  }, [token]);

  const handleAddTodo = async () => {
    if (inputValue.trim() === "") return;

    try {
      const response = await fetch(`${BASE_URL}/todos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          text: inputValue,
        }),
      });

      const data = await response.json();
      console.log("Add todo response:", data);

      if (!response.ok) {
        alert(data.detail || "Add todo failed");
        return;
      }

      setTodos([...todos, data]);
      setInputValue("");
    } catch (error) {
      console.error("Add todo error:", error);
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/todos/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log("Delete response:", data);

      if (!response.ok) {
        alert(data.detail || "Delete todo failed");
        return;
      }

      const newTodos = todos.filter((todo) => todo.id !== id);
      setTodos(newTodos);
    } catch (error) {
      console.error("Delete todo error:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div>
      <h1>My Todos</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAddTodo();
        }}
      >
        <input
          type="text"
          placeholder="Enter a new todo"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>

      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            {todo.text}
            <button onClick={() => handleDeleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default TodoPage;