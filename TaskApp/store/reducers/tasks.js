import Task from "../../models/Task";
import {
  DELETE_TASK,
  CREATE_TASK,
  SET_TASKS,
} from "../actions/tasks";

const initialState = {
  availableTasks: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_TASKS:
      return {
        availableTasks: action.tasks,
      };
    case CREATE_TASK:
      const newTask = new Task(
        action.taskData.id,
        action.taskData.title,
        action.taskData.userid
      );
      return {
        ...state,
        availableTasks: state.availableTasks.concat(newTask),
      };
      case DELETE_TASK:
      return {
        ...state,
        availableProducts: state.availableTasks.filter(
          task => task.id !== action.tid
        )
      };
  }
  return state;
};
