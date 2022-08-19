import axios from "axios";
import config from "../../config";
import AsyncStorage from "@react-native-async-storage/async-storage";

//Exporting action types
export const SET_TASKS = "SET_TASKS";
export const CREATE_TASK = "CREATE_TASK";
export const DELETE_TASK = "DELETE_TASK";

//Declaring the fetchTasks action
export const fetchTasks = () => {
  return async (dispatch) => {
    const userData = await AsyncStorage.getItem("userData");
    const { token } = JSON.parse(userData);
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
          loadedTasks.push({
            id: resData[key].id,
            title: resData[key].title,
            userid: resData[key].userid,
          });
        }
        //Dispatching SET_TASKS action
        dispatch({
          type: SET_TASKS,
          tasks: loadedTasks,
        });
      })
      .catch((error) => {
        let message = "Something went wrong!";
        if (error.response.data.message) {
          message = error.response.data.message;
        }
        throw new Error(message);
      });
  };
};

//Declaring createTask action
export const createTask = (title) => {
  return async (dispatch) => {
    const userData = await AsyncStorage.getItem("userData");
    const { token } = JSON.parse(userData);
    //Creating task
    axios
      .post(
        `${config.API_URL}/tasks`,
        {
          title: title,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      )
      .then((response) => {
        const resData = response.data;
        dispatch({
          type: CREATE_TASK,
          taskData: {
            id: resData.id,
            title: title,
            userid: resData.userId,
          },
        });
      })
      .catch((error) => {
        let message = "Something went wrong!";
        if (error.response.data.message) {
          message = error.response.data.message;
        }
        throw new Error(message);
      });
  };
};

//Declaring deleteTask action
export const deleteTask = (taskId) => {
  return async (dispatch) => {
    const userData = await AsyncStorage.getItem("userData");
    const { token } = JSON.parse(userData);
    //Deleting task
    axios
      .delete(`${config.API_URL}/tasks/${taskId}`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .catch((error) => {
        let message = "Something went wrong!";
        if (error.response.data.message) {
          message = error.response.data.message;
        }
        throw new Error(message);
      });
    //Dispatching DELETE_TASK action
    dispatch({
      type: DELETE_TASK,
      tid: taskId,
    });
  };
};
