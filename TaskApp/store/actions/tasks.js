import config from "../../config";
import Task from "../../models/Task";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

//Exporting action types
export const SET_TASKS = "SET_TASKS";
export const CREATE_TASK = "CREATE_TASK";
export const DELETE_TASK = "DELETE_TASK";

//Declaring the fetchTasks action
export const fetchTasks = () => {
  return async (dispatch) => {
    const userData = await AsyncStorage.getItem("userData");
    const transformedData = JSON.parse(userData);
    const { token } = transformedData;
    //Fetching the tasks from the backend
    axios
      .get(config.API_URL + "/tasks", {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((response) => {
        const resData = response.data;
        const loadedTasks = [];
        for (const key in resData) {
          loadedTasks.push(
            new Task(resData[key].id, resData[key].title, resData[key].userid)
          );
        }
        //Dispatching SET_TASKS action
        dispatch({
          type: SET_TASKS,
          tasks: loadedTasks,
        });
      })
      .catch((error) => console.log(error));
  };
};

//Declaring createTask action
export const createTask = (title) => {
  return async (dispatch, getState) => {
    const userData = await AsyncStorage.getItem("userData");
    const transformedData = JSON.parse(userData);
    const { token } = transformedData;
    const userId = getState().auth.userId;
    //Creating task
    axios
      .post(
        `${config.API_URL}/tasks`,
        {
          title: title,
          userid: userId,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      )
      .then((response) => {
        const resData = response.data;
        console.log(resData)
        dispatch({
          type: CREATE_TASK,
          taskData: {
            id: resData.id,
            title: title,
            userid: userId,
          },
        });
      });
  };
};

//Declaring deleteTask action
export const deleteTask = (taskId) => {
  return async (dispatch) => {
    //Getting token from the state
    const userData = await AsyncStorage.getItem("userData");
    const transformedData = JSON.parse(userData);
    const { token } = transformedData;
    //Deleting task
    axios
      .delete(`${config.API_URL}/tasks/${taskId}`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .catch((error) => console.log(error.message));
    //Dispatching DELETE_TASK action
    dispatch({
      type: DELETE_TASK,
      tid: taskId,
    });
  };
};
