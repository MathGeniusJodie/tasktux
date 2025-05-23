import React, { useState } from "react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Todo, TodoListItem } from "./components/Todo";
import { ToggleGroup, ToggleGroupItem } from "./components/ui/toggle-group";
import { Switch } from "./components/ui/switch";
import { useLocalStorage } from "@uidotdev/usehooks";
import { Calendar } from "./components/ui/calendar";
import { penguinQuotes } from "./penguinQuotes";
import { Settings } from "lucide-react";

const possibleStoryPoints = ["🤷", "1", "2", "3", "5", "8", "13"];

const randomQuote =
  penguinQuotes[Math.floor(Math.random() * penguinQuotes.length)];

type TodosById = { [id: string]: Todo };

function App() {
  const [todosById, setTodosById] = useLocalStorage("todos", {} as TodosById);
  const [todoIds, setTodoIds] = useState<string[]>(Object.keys(todosById));
  const [newTodo, setNewTodo] = useState<string>("");
  const [storyPoint, setStoryPoint] = useState<string>("1");
  const [priority, setPriority] = useState<string>("1");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  // Add a new todo
  const addTodo = () => {
    const text = newTodo.trim();
    if (!text) return;
    const id = Date.now().toString();
    const todo: Todo = {
      id,
      text,
      completed: false,
      createdAt: Date.now(),
      storyPoints: Number(storyPoint) || 1,
      priority: Number(priority) || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    };

    setTodosById((prev) => ({ ...prev, [id]: todo }));
    setTodoIds((prev) => [...prev, id]);
    setPriority("1");
    setNewTodo("");
    setStoryPoint("1");
    setStartDate(undefined);
    setEndDate(undefined);
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
      const curr = { ...prev };
      delete curr[id];
      return curr;
    });
    setTodoIds((prev) => prev.filter((todoId) => todoId !== id));
  };

  // Sorted todos (by createdAt asc)
  const todos = todoIds
    .map((id) => todosById[id])
    .filter(Boolean)
    .sort((a, b) => a.createdAt - b.createdAt);

  return (
    <>
      <header className="flex flex-col items-center gap-2 py-6">
        <div className="flex items-center gap-4 flex-row-reverse">
          <button>
            <Settings className="h-6 w-6 text-yellow-500" />
          </button>
          <span
            style={{ fontSize: "4rem" }}
            role="img"
            aria-label="Tux says: "
          >
            🐧
          </span>
          <div className="relative">
            <div className="bg-white border border-gray-300 rounded-xl px-6 py-3 shadow text-lg font-semibold text-gray-800 min-w-[200px] max-w-xs rounded-tr-none">
              {randomQuote}
            </div>
          </div>
        </div>
      </header>

      <div className="flex gap-4 flex-col">
        <form
          className="flex items-center gap-4 flex-grow"
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
        <form
          className="flex flex-col gap-4 py-4"
          onSubmit={(e) => {
            e.preventDefault();
            addTodo();
          }}
        >
          <label className="flex flex-col justify-stretch gap-2">
            <span className="text-sm text-secondary-foreground">
              Story Points
            </span>
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
          <label className="flex flex-col justify-stretch gap-2">
            <span className="text-sm text-secondary-foreground">Priority</span>
            <ToggleGroup
              type="single"
              variant={"outline"}
              value={priority}
              onValueChange={(val) => setPriority(val || "1")}
              className="flex w-auto"
            >
              <ToggleGroupItem
                value="0"
                className="flex items-center justify-center"
              >
                Backburner
              </ToggleGroupItem>
              <ToggleGroupItem
                value="1"
                className="flex items-center justify-center"
              >
                Normal
              </ToggleGroupItem>
              <ToggleGroupItem
                value="2"
                className="flex items-center justify-center"
              >
                Important
              </ToggleGroupItem>
            </ToggleGroup>
          </label>
          <details>
            <summary>Dates</summary>
            <div className="flex items-center gap-2">
              <label className="flex flex-col justify-stretch gap-2">
                <span className="text-sm text-secondary-foreground">Start</span>
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={(date) => {
                    if (date) {
                      setStartDate(date);
                    }
                  }}
                  className="w-auto"
                />
              </label>
              <label className="flex flex-col justify-stretch gap-2">
                <span className="text-sm text-secondary-foreground">
                  Deadline
                </span>
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={(date) => {
                    if (date) {
                      setEndDate(date);
                    }
                  }}
                  className="w-auto"
                />
              </label>
            </div>
          </details>
          <Button type="submit">Add</Button>
        </form>
      </div>

      <div className="flex flex-col flex-grow gap-4">
        {todos.length === 0 ? (
          <p className="text-center text-gray-500">
            No todos yet. Add one above!
          </p>
        ) : (
          todos.map((todo) => (
            <TodoListItem
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
