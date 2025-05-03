import React, { useState } from "react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import Todo from "./components/Todo";
import { ToggleGroup, ToggleGroupItem } from "./components/ui/toggle-group";

// Define the todo type
export type Todos = {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  storyPoints?: number;
};

const possibleStoryPoints = ["1", "2", "3", "5", "8", "13"];

type TodosById = { [id: string]: Todos };

function App() {
  const [todosById, setTodosById] = useState<TodosById>({});
  const [todoIds, setTodoIds] = useState<string[]>([]);
  const [newTodo, setNewTodo] = useState<string>("");
  const [storyPoint, setStoryPoint] = useState<string>("1");

  // Add a new todo
  const addTodo = () => {
    const text = newTodo.trim();
    if (!text) return;
    const id = Date.now().toString();
    const todo: Todos = {
      id,
      text,
      completed: false,
      createdAt: Date.now(),
      storyPoints: Number(storyPoint) || 1,
    };
    setTodosById((prev) => ({ ...prev, [id]: todo }));
    setTodoIds((prev) => [...prev, id]);
    setNewTodo("");
    setStoryPoint("1");
  };

  // Toggle todo completion
  const toggleTodo = (id: string, completed: boolean) => {
    setTodosById((prev) => ({
      ...prev,
      [id]: { ...prev[id], completed: !completed },
    }));
  };

  // Delete a todo
  const deleteTodo = (id: string) => {
    setTodosById((prev) => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });
    setTodoIds((prev) => prev.filter((tid) => tid !== id));
  };

  // Sorted todos (by createdAt asc)
  const todos = todoIds
    .map((id) => todosById[id])
    .filter(Boolean)
    .sort((a, b) => a.createdAt - b.createdAt);

  return (
    <>
      <div className="flex gap-4 flex-col">
        <form
          className="h-32 flex items-center gap-4 flex-grow"
          onSubmit={(e) => {
            e.preventDefault();
            addTodo();
          }}
        >
          <Input
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new todo..."
            className="flex-grow"
          />
          <Button className="w-32" type="submit">
            Quick Add
          </Button>
        </form>
        <form className="flex-col gap-4">
          <label className="flex flex-col justify-stretch gap-2">
            <span className="text-sm text-secondary-foreground">Story Points</span>
            <ToggleGroup
              type="single"
              variant={"outline"}
              value={storyPoint}
              onValueChange={(val) => setStoryPoint(val || "1")}
              className="flex w-auto"
            >
              {possibleStoryPoints.map((val) => (
                <ToggleGroupItem
                  key={val}
                  value={val}
                  className="flex items-center justify-center"
                >
                  {val}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </label>
        </form>
      </div>

      <div className="flex flex-col flex-grow gap-4">
        {todos.length === 0 ? (
          <p className="text-center text-gray-500">
            No todos yet. Add one above!
          </p>
        ) : (
          todos.map((todo) => (
            <Todo
              key={todo.id}
              todo={todo}
              toggleTodo={toggleTodo}
              deleteTodo={deleteTodo}
            />
          ))
        )}
      </div>
    </>
  );
}

export default App;
