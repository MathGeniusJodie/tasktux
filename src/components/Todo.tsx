import React from "react";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Trash } from "lucide-react";
import { Pencil } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";

const possibleStoryPoints = ["🤷", "1", "2", "3", "5", "8", "13"];

type BaseTodo = {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
};

type UntaggedTodo = BaseTodo;
type TaggedTodo = BaseTodo & {
  storyPoints?: number;
  priority?: number;
  startDate?: Date;
  endDate?: Date;
};

// Define the todo type
export type Todo = UntaggedTodo | TaggedTodo;

type TodoProps = {
  todo: Todo;
  toggleTodo: (id: string, completed: boolean) => void;
  deleteTodo: (id: string) => void;
  updateTodo: (id: string, updates: Partial<TaggedTodo>) => void;
};

export const TodoListItem: React.FC<TodoProps> = ({ todo, toggleTodo, deleteTodo, updateTodo }) => (
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
    {/* priority indicator if tagged todo */}
    {"priority" in todo && todo.priority === 0 && (
      <div title="Backburner">🍲</div>
    )}
    {"priority" in todo && todo.priority === 2 && (
      <div title="Priority Task!">🐸</div>
    )}
    {// if untagged
      !("priority" in todo) && !("storyPoints" in todo) && (
      <div title="Untagged">🥚</div>
    )}
    {// if start date is in future
      "startDate" in todo && todo.startDate && todo.startDate > new Date() && (
      <div title="Not Ready Yet">⏳</div>
    )}
    {// if end date is past
      "endDate" in todo && todo.endDate && todo.endDate < new Date() && (
      <div title="Overdue">🪦</div>
    )}
    {
      // if end date is within 3 days
      ("endDate" in todo && 
        todo.endDate && 
        todo.endDate >= new Date() && 
        todo.endDate <= new Date(Date.now() + ("storyPoints" in todo && todo.storyPoints ? todo.storyPoints/6+1 : 1) * 24 * 60 * 60 * 1000)) && (
      <div title="Due soon">🔥</div>
    )}
    {/* edit button if tagged todo */}
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm"><Pencil className="h-4 w-4" /></Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <label className="text-sm text-secondary-foreground">Story Points</label>
        <ToggleGroup
          type="single"
          className="mb-4 mt-2 w-full"
          defaultValue={("storyPoints" in todo && todo.storyPoints ? String(todo.storyPoints) : undefined)}
          aria-label="Story Points"
          onValueChange={(value) => {
            const sp = value === "🤷" ? undefined : Number(value);
            updateTodo(todo.id, { storyPoints: sp });
          }}
        >
          {possibleStoryPoints.map((point) => (
            <ToggleGroupItem
              key={point}
              value={point}
              aria-label={point === "🤷" ? "No story points" : `Story points ${point}`}
            >
              {point}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <label className="text-sm text-secondary-foreground">Priority</label>
        <ToggleGroup
          type="single"
          className="w-full mb-4 mt-2"
          defaultValue={("priority" in todo && todo.priority !== undefined ? String(todo.priority) : undefined)}
          aria-label="Priority"
          onValueChange={(value) => {
            const prio = value === undefined ? undefined : Number(value);
            updateTodo(todo.id, { priority: prio });
          }}
        >
          {[0, 1, 2].map((level) => (
            <ToggleGroupItem
              key={level}
              value={String(level)}
              aria-label={`Priority level ${level}`}
            >
              {["Backburner", "Normal", "Frog"][level]}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => deleteTodo(todo.id)}
        >
          Delete Todo
        </Button>
        {/* allow changing title of todo */}
      </PopoverContent>
    </Popover>
  </div>
);