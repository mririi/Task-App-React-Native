import Env from "../../constants/Env";
import Task from "../../models/Task";

//Exporting action types
export const SET_TASKS = "SET_TASKS";
export const CREATE_TASK = "CREATE_TASK";
export const DELETE_TASK = "DELETE_TASK";

//Declaring the fetchTasks action
export const fetchTasks = () => {
  return async (dispatch) => {
    try {
      //Fetching the tasks from the backend
      const response = await fetch(Env.url + "/tasks"); 
      //Handling errors
      if (!response.ok) {
        throw new Error("Something went wrong!");
      }
      //Loading tasks to the state
      const resData = await response.json();
      const loadedTasks = [];
      for (const key in resData) {
        loadedTasks.push(new Task(resData[key].id, resData[key].title,resData[key].userid));
      }
      //Dispatching SET_TASKS action
      dispatch({
        type: SET_TASKS,
        tasks: loadedTasks,
      });
    } catch (error) {
      console.log(error.message);
    }
  };
};

//Declaring createTask action
export const createTask = (title) => {
  return async (dispatch, getState) => {
    //Getting data saved in the state
    const token = getState().auth.token;
    const userId = getState().auth.userId;
    //Creating task
    const response = await fetch(
      `${Env.url}/tasks`, 
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          title: title,
          userid: userId,
        }),
      }
    );
    //Dispatching CREATE_TASK action
    const resData = await response.json();
    dispatch({
      type: CREATE_TASK,
      taskData: {
        id: resData.id,
        title: title,
        userid: userId,
      },
    });
  };
};

//Declaring deleteTask action
export const deleteTask = (taskId) => {
  return async (dispatch, getState) => {
    //Getting token from the state
    const token = getState().auth.token;
    //Deleting task
    const response = await fetch(
      `${Env.url}/tasks/${taskId}`, 
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );
    //Handling errors
    if (!response.ok) {
      throw new Error("Something went wrong!");
    }
    //Dispatching DELETE_TASK action
    dispatch({
      type: DELETE_TASK,
      tid: taskId,
    });
  };
};
