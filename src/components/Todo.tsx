import React from "react";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";

export type TodoDocType = {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  storyPoints?: number; // Add storyPoints as optional
};

type TodoProps = {
  todo: TodoDocType;
  toggleTodo: (id: string, completed: boolean) => void;
  deleteTodo: (id: string) => void;
};

const Todo: React.FC<TodoProps> = ({ todo, toggleTodo, deleteTodo }) => (
  <div
    className="flex items-center border rounded h-18 gap-4 px-4 bg-white"
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
          ? "line-through text-gray-500 flex-grow h-16"
          : "flex-grow h-20"
      }
    >
      {todo.text}
      <span className="ml-2 text-xs text-gray-400">[SP: {todo.storyPoints ?? 1}]</span>
    </Label>
    <Button
      variant="ghost"
      size="sm"
      onClick={() => deleteTodo(todo.id)}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  </div>
);

export default Todo;