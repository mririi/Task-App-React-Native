import Env from "../../constants/Env";
import Task from "../../models/Task";

export const SET_TASKS = "SET_TASKS";
export const CREATE_TASK = "CREATE_TASK";
export const DELETE_TASK = "DELETE_TASK";

export const fetchTasks = () => {
  return async (dispatch) => {
    try {
      const response = await fetch(Env.url + "/tasks"); 
      if (!response.ok) {
        throw new Error("Something went wrong!");
      }
      const resData = await response.json();
      const loadedTasks = [];
      for (const key in resData) {
        loadedTasks.push(new Task(resData[key].id, resData[key].title,resData[key].userid));
      }
      dispatch({
        type: SET_TASKS,
        tasks: loadedTasks,
      });
    } catch (error) {
      console.log(error.message);
    }
  };
};
export const createTask = (title) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const userId = getState().auth.userId;
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
export const deleteTask = (taskId) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    console.log(taskId);
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

    if (!response.ok) {
      throw new Error("Something went wrong!");
    }
    dispatch({
      type: DELETE_TASK,
      tid: taskId,
    });
  };
};
