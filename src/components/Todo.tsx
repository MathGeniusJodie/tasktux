import React from "react";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Trash } from "lucide-react";

type BaseTodo = {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
};

type UntaggedTodo = BaseTodo;
type TaggedTodo = BaseTodo & {
  storyPoints: number;
  priority: number;
};

// Define the todo type
export type Todo = UntaggedTodo | TaggedTodo;

type TodoProps = {
  todo: Todo;
  toggleTodo: (id: string, completed: boolean) => void;
  deleteTodo: (id: string) => void;
};

export const TodoListItem: React.FC<TodoProps> = ({ todo, toggleTodo, deleteTodo }) => (
  <div
    className="flex items-center border rounded h-18 gap-4 px-4"
    style={{ flexShrink: "0" }}
  >
    <Checkbox
      id={`todo-${todo.id}`}
      checked={todo.completed}
      onCheckedChange={() => toggleTodo(todo.id, todo.completed)}
    />
    <Label
      htmlFor={`todo-${todo.id}`}
      className={
        todo.completed
          ? "line-through flex-grow h-16"
          : "flex-grow h-20"
      }
    >
      {todo.text}
    </Label>
    <Button
      variant="ghost"
      size="sm"
      onClick={() => deleteTodo(todo.id)}
    >
      <Trash className="h-4 w-4" />
    </Button>
  </div>
);