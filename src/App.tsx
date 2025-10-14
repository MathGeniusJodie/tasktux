import React, { useState } from "react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Todo, TodoListItem } from "./components/Todo";
import { ToggleGroup, ToggleGroupItem } from "./components/ui/toggle-group";
import { Switch } from "./components/ui/switch";
import { useLocalStorage } from "@uidotdev/usehooks";
import { Calendar } from "./components/ui/calendar";
import { penguinQuotes } from "./penguinQuotes";
import { Settings, Download, Import } from "lucide-react";
import { add } from "date-fns";

const possibleStoryPoints = ["🤷", "1", "2", "3", "5", "8"];

const randomQuote =
  penguinQuotes[Math.floor(Math.random() * penguinQuotes.length)];

type TodosById = { [id: string]: Todo };

function App() {
  const [todosById, setTodosById] = useLocalStorage("todos", {} as TodosById);
  const [todoIds, setTodoIds] = useState<string[]>(Object.keys(todosById));
  const [newTodo, setNewTodo] = useState<string>("");
  const [storyPoint, setStoryPoint] = useState<string|undefined>(undefined);
  const [priority, setPriority] = useState<string | undefined>(undefined);
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
      priority: Number(priority),
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    };

    setTodosById((prev) => ({ ...prev, [id]: todo }));
    setTodoIds((prev) => [...prev, id]);
    setPriority(undefined);
    setNewTodo("");
    setStoryPoint(undefined);
    setStartDate(undefined);
    setEndDate(undefined);
    // Focus back to input
    document.getElementById("new-todo-title-input")?.focus();
  };

  const quickAddTodo = () => {
    // add untagged todo
    const text = newTodo.trim();
    if (!text) return;
    const id = Date.now().toString();
    const todo: Todo = {
      id,
      text,
      completed: false,
      createdAt: Date.now(),
    };

    setTodosById((prev) => ({ ...prev, [id]: todo }));
    setTodoIds((prev) => [...prev, id]);
    setNewTodo("");
    setPriority(undefined);
    setStoryPoint(undefined);
    // Focus back to input
    document.getElementById("new-todo-title-input")?.focus();
  };

  // Toggle todo completion
  const toggleTodo = (id: string, completed: boolean) => {
    setTodosById((prev) => ({
      ...prev,
      [id]: { ...prev[id], completed: !completed },
    }));
  };

  const updateTodo = (id: string, updates: Partial<Todo>) => {
    setTodosById((prev) => ({
      ...prev,
      [id]: { ...prev[id], ...updates },
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
    .sort((a, b) => {
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1; // incomplete first
      }
      // sort by priority first, then by createdAt
      if ("priority" in a && "priority" in b) {
        if (a.priority !== b.priority) {
          return (b.priority ?? 1) - (a.priority ?? 1); // higher priority first
        }
      } else if ("priority" in a) {
        return 1 - (a.priority ?? 1);
      } else if ("priority" in b) {
        return (b.priority ?? 1) - 1;
      }
      return a.createdAt - b.createdAt;
    });
  
  const quickStoryPoints = (e: React.KeyboardEvent) => {
    const key = e.key;
    if (possibleStoryPoints.includes(key)) {
      setStoryPoint(key);
      document.getElementById("normal-priority")?.focus();
      e.preventDefault();
    }
  }
  const quickPriority = (e: React.KeyboardEvent) => {
    const key = e.key;
    if( key === "1"){
      setPriority("0");
      addTodo();
    }else if( key === "2"){
      setPriority("1");
      addTodo();
    }else if( key === "3"){
      setPriority("2");
      addTodo();
    }
    e.preventDefault();
  }

  return (
    <>
      <header className="flex flex-col items-center gap-2 py-6 w-full">
        <div className="flex items-center gap-4 flex-row-reverse justify-between w-full">
          {/*<button>
            <Settings className="h-6 w-6 dark:text-yellow-500" />
          </button>*/}
          <div className="flex gap-2 flex-col">
            <Button onClick={() => {
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = '.json';
              input.onchange = (e: any) => {
                const file = e.target.files[0];
                const reader = new FileReader();
                reader.onload = (event) => {
                  try {
                    const importedTodos = JSON.parse(event.target?.result as string);
                    setTodosById(importedTodos.todos);
                    setTodoIds(Object.keys(importedTodos.todos));
                  } catch (error) {
                    console.error("Error importing todos:", error);
                  }
                };
                reader.readAsText(file);
              };
              input.click();
            }}>
              Import
            </Button>
            <Button onClick={() => {
              const downloadAnchorNode = document.createElement('a');
              const obj = {todos: todosById};
              downloadAnchorNode.setAttribute("href", "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(obj)));
              downloadAnchorNode.setAttribute("download", "todos.json");
              document.body.appendChild(downloadAnchorNode); // required for firefox
              downloadAnchorNode.click();
              downloadAnchorNode.remove();
            }}>
              Export
            </Button>
          </div>
          <div className="flex items-center flex-row-reverse gap-4">
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
          <div className="text-center font-bold">
            <div>Points:</div>
            <div className="font-mono text-3xl">{todos.reduce((acc, todo) => acc + (todo.completed ? "storyPoints" in todo && todo.storyPoints || 1 : 0), 0)}</div>
          </div>
        </div>
      </header>

      
      
      {(todos.length > 0 && todos[0].completed === false)?
      <>
      <div className="text-xl dark:border-white border-orange-700 border-3 dark:bg-black bg-white px-3 rounded-xl relative font-bold -mb-15 -mx-10 w-max">Do This First!</div>
      <TodoListItem
        todo={todos[0]}
        toggleTodo={toggleTodo}
        deleteTodo={deleteTodo}
        updateTodo={updateTodo}
        //box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
        className="border-4 rounded-lg my-10 border-orange-700 dark:border-white -mx-14 h-28 p-8 gap-6 dark:shadow-[0_0_30px_var(--color-yellow-900)] dark:inset-shadow-[0_0_30px_var(--color-yellow-900)]"
        labelClassName="text-2xl"
        checkClassName="size-8 border-3 border-foreground dark:border-white"
      />
      </> : <p className="mb-4">You have no undone todos! </p>}

      <div className="flex gap-4 flex-col border-4 p-4 rounded-lg mb-4 border-yellow-400">
        <form
          className="flex items-center gap-4 flex-grow"
          onSubmit={(e) => {
            e.preventDefault();
            quickAddTodo(); // todo: add quick todo event to generate untagged todo
          }}
        >
          <Input
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new todo..."
            className="flex-grow"
            id="new-todo-title-input"
            autoFocus
          />
          <Button className="w-32" type="submit" tabIndex={-1}>
            Quick Add
          </Button>
        </form>
        <form
          className="flex flex-col gap-4 pt-4"
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
              onValueChange={(val) => setStoryPoint(val || "🤷")}
              className="flex w-auto"
              onKeyDown={quickStoryPoints}
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
              onValueChange={(val) => setPriority(val)}
              className="flex w-auto"
              onKeyDown={quickPriority}
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
                id="normal-priority"
              >
                Normal
              </ToggleGroupItem>
              <ToggleGroupItem
                value="2"
                className="flex items-center justify-center"
              >
                Frog
              </ToggleGroupItem>
            </ToggleGroup>
          </label>
          <details hidden>
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
          todos.map((todo,index) => (
            index?
            <TodoListItem
              key={todo.id}
              todo={todo}
              toggleTodo={toggleTodo}
              deleteTodo={deleteTodo}
              updateTodo={updateTodo}
            />
            : null
          ))
        )}
      </div>
    </>
  );
}

export default App;
