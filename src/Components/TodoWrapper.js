import React, { useEffect, useState } from "react";
import { Todo } from "./Todo";
import { TodoForm } from "./TodoForm";
import { v4 as uuidv4 } from "uuid";
import { EditTodoForm } from "./EditTodoForm";

// drag and drop
import { rem, Text } from "@mantine/core";
import { useListState } from "@mantine/hooks";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { IconGripVertical } from "@tabler/icons-react";

function saveTasks(tasks) {
  console.log("saveTasks ran", tasks);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

export const TodoWrapper = () => {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    function loadTasks() {
      let loadedTasks = localStorage.getItem("tasks");

      let tasks = JSON.parse(loadedTasks);

      if (tasks) {
        setTodos(tasks);
      }
    }
    loadTasks();
  }, []);

  const addTodo = (todo) => {
    const tasks = [
      ...todos,
      { id: uuidv4(), task: todo, completed: false, isEditing: false },
    ];
    setTodos(tasks);
    saveTasks(tasks);
  };

  const deleteTodo = (id) => {
    const tasks = todos.filter((todo) => todo.id !== id);
    setTodos(tasks);
    saveTasks(tasks);
  };

  const toggleComplete = (id) => {
    const tasks = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(tasks);
    saveTasks(tasks);
  };

  const editTodo = (id) => {
    const tasks = todos.map((todo) =>
      todo.id === id ? { ...todo, isEditing: !todo.isEditing } : todo
    );
    setTodos(tasks);
    saveTasks(tasks);
  };

  const editTask = (task, id) => {
    const tasks = todos.map((todo) =>
      todo.id === id ? { ...todo, task, isEditing: !todo.isEditing } : todo
    );
    setTodos(tasks);
    saveTasks(tasks);
  };

  // const data = todos;
  // console.log("data", data);
  const data_ = todos;
  console.log("data_", data_);
  const [state, handlers] = useListState(data_);
  console.log("state", state);
  console.log("todos", todos);

  const items = todos.map((todo, index) => (
    <Draggable key={todo.id} index={index} draggableId={todo.id}>
      {(provided, snapshot) => (
        <div ref={provided.innerRef} {...provided.draggableProps}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              position: "relative",
              marginLeft: "300px",
            }}
          >
            {/* <div className="Todo"> */}
            <div {...provided.dragHandleProps}>
              <IconGripVertical
                style={{ width: rem(18), height: rem(18) }}
                stroke={1.5}
              />
            </div>
            <div>
              {/* display todos */ console.log("items changed")}

              {todo.isEditing ? (
                <EditTodoForm editTodo={editTask} task={todo} />
              ) : (
                <Todo
                  key={todo.id}
                  task={todo}
                  deleteTodo={deleteTodo}
                  editTodo={editTodo}
                  toggleComplete={toggleComplete}
                />
              )}
            </div>

            {/* {todos.map((todo) =>
              todo.isEditing ? (
                <EditTodoForm editTodo={editTask} task={todo} />
              ) : (
                <Todo
                  key={todo.id}
                  task={todo}
                  deleteTodo={deleteTodo}
                  editTodo={editTodo}
                  toggleComplete={toggleComplete}
                />
              )
            )} */}
          </div>
        </div>
      )}
    </Draggable>
  ));

  return (
    <>
      <h1>Get Things Done !</h1>
      <TodoForm addTodo={addTodo} />
      <DragDropContext
        onDragEnd={({ destination, source }) =>
          handlers.reorder({ from: source.index, to: destination?.index || 0 })
        }
      >
        <Droppable droppableId="dnd-list" direction="vertical">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {items}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </>
  );
};
