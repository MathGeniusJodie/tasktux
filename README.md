# 🐧 Task Tux

simple opinionated todo application with quick advanced tagging

# testing
```sh
yarn dev
```

# Usage

- Tasks are automatically sorted, you should simply do the task at the top of your list first.
- Quick add todo with `Enter`. Quick add marks todos as untagged so you remember to tag them later.
- Prioritize tasks on a simple scale. (Backburner, Normal, Frog) "Frog" is a nod to the popular productivity concept of "eating the frog" coined by Nicolas Chamfort (tackling your most challenging task first).
- Story points are a concept from Agile methodologies, they represent how big the task is.
- Some tasks can't be started right away, you can give them a start date in the future and they will be at the bottom of your list until that date.
- When the story points or priority input is focused, you can press `1`, `2`, `3` etc. to quickly set the value and move to the next input. You should be able to input a long todo list without touching the mouse.
- Todos are saved in local storage, export and sync functionality is coming soon.