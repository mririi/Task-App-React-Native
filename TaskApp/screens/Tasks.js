import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useReducer, useState } from "react";
import { Keyboard, Modal, Pressable } from "react-native";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import CustomButton from "../components/CustomButton";
import CustomTextInput from "../components/CustomTextInput";
import TaskItem from "../components/TaskItem";
import colors from "../constants/colors";
import * as authActions from "../store/actions/auth";
import * as taskActions from "../store/actions/tasks";

const FORM_INPUT_UPDATE = "FORM_INPUT_UPDATE";

const formReducer = (state, action) => {
  if (action.type === FORM_INPUT_UPDATE) {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value,
    };
    const updatedValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid,
    };
    let updatedFormIsValid = true;
    for (const key in updatedValidities) {
      updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
    }
    return {
      formIsValid: updatedFormIsValid,
      inputValidities: updatedValidities,
      inputValues: updatedValues,
    };
  }
  return state;
};
const Tasks = (props) => {
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [idToDelete, setIdToDelete] = useState();
  const userid = useSelector((state) => state.auth.userId);
  const fullname = useSelector((state) => state.auth.fullname);
  const tasks = useSelector((state) =>
    state.tasks.availableTasks.filter((task) => task.userid === userid)
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      Alert.alert("An error occurred!", error, [{ text: "Ok" }]);
    }
  }, [error]);
  /*const retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem("userData");
      if (value !== null) {
        // We have data!!
        const data = JSON.parse(value);
        setFullname(data.fullname);
      }
    } catch (error) {
      // Error retrieving data
    }
  };*/
  //retrieveData();
  //const fullname = useSelector((state) => state.auth.userId);

  const loadTasks = useCallback(async () => {
    try {
      setError(null);
      setIsRefreshing(true);
      dispatch(taskActions.fetchTasks());
    } catch (err) {
      setError(err.message);
    }
    setIsRefreshing(false);
  }, [dispatch, setIsRefreshing, setError]);
  // init
  useEffect(() => {
    setIsLoading(true);
    loadTasks().then(() => setIsLoading(false));
  }, [dispatch, loadTasks]);

  /*const restvalues = () => {
    useReducer(formReducer, {
      inputValues: {
        title: "",
      },
      inputValidities: {
        title: false,
      },
      formIsValid: false,
    });
  };*/
  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      title: "",
    },
    inputValidities: {
      title: false,
    },
    formIsValid: false,
  });

  const submitHandler = async () => {
    Keyboard.dismiss();
    if (!formState.inputValues.title) {
      Alert.alert("Form Invald!", "Task field can't be empty");
      return;
    }
    const action = taskActions.createTask(formState.inputValues.title);
    setError(null);
    setIsLoading(true);
    try {
      dispatch(action);
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };
  const inputChangeHandler = useCallback(
    (inputIdentifier, inputValue, inputValidity) => {
      dispatchFormState({
        type: FORM_INPUT_UPDATE,
        value: inputValue,
        isValid: inputValidity,
        input: inputIdentifier,
      });
    },
    [dispatchFormState]
  );
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={30}
      style={styles.container}
      enabled={false}
    >
      <View style={styles.blueblock}>
        <Image source={require("../assets/shapeTask.png")} />
        <Image style={styles.profile} source={require("../assets/Logo.png")} />
        <Text style={styles.welcome}>Welcome, {fullname} </Text>
      </View>
      <View style={styles.taskform}>
        <CustomTextInput
          id="title"
          required
          style={styles.input}
          errorText="Task is required"
          onInputChange={inputChangeHandler}
          placeholder="Enter your task"
        />
        {isLoading ? (
          <ActivityIndicator size="small" color={colors.primary} />
        ) : (
          <CustomButton
            title="ADD"
            style={styles.button}
            onPress={submitHandler}
          />
        )}
      </View>
      <Text style={styles.title1}>Tasks List</Text>
      <View style={styles.card}>
        <Text style={styles.title2}>Tasks List</Text>
        <FlatList
          onRefresh={loadTasks}
          refreshing={isRefreshing}
          style={styles.flatlist}
          data={tasks}
          renderItem={(itemData) => (
            <TaskItem
              key={itemData.item.id}
              title={itemData.item.title}
              onValueChange={() => {
                setIdToDelete(itemData.item.id);
                setModalVisible(true);
              }}
            />
          )}
        />
        <View style={styles.centeredView}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              Alert.alert("Modal has been closed.");
              setModalVisible(!modalVisible);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>This task is Done ?</Text>
                <View style={styles.buttonContainer}>
                  <Pressable
                    style={styles.buttonNotYet}
                    onPress={async () => {
                      setModalVisible(!modalVisible);
                    }}
                  >
                    <Text style={styles.textStyle}>Not Yet</Text>
                  </Pressable>
                  <Pressable
                    style={styles.buttonYes}
                    onPress={async () => {
                      await dispatch(taskActions.deleteTask(idToDelete));
                      loadTasks();
                      setModalVisible(!modalVisible);
                    }}
                  >
                    <Text style={styles.textStyle}>Yes</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </View>
      <View style={{ alignItems: "center" }}>
        <Text
          style={styles.logout}
          onPress={() => {
            dispatch(authActions.logout());
            props.navigation.navigate("Authentification");
          }}
        >
          LOGOUT
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  blueblock: {
    backgroundColor: colors.button,
    height: "37%",
  },

  profile: {
    width: 100,
    height: 100,
    marginTop: -40,
    marginLeft: 141,
    borderWidth: 3,
    borderRadius: 100,
    borderColor: "#2B8E94",
  },
  welcome: {
    fontFamily: "poppins-bold",
    fontSize: 18,
    fontWeight: "600",
    lineHeight: 20.82,
    letterSpacing: 1,
    marginLeft: 76,
    marginTop: 20,
    color: "#FFFFFF",
  },
  taskarea: {
    height: "63%",
  },
  taskform: {
    alignItems: "center",
  },
  tasks: {
    alignItems: "center",
  },
  button: {
    marginTop: 15,
    height: 45,
    width: 296,
  },
  title1: {
    color: "#000000BF",
    fontFamily: "poppins-bold",
    fontSize: 18,
    lineHeight: 20.82,
    fontWeight: "600",
    letterSpacing: 1,
    marginLeft: 28,
    marginTop: 15,
  },
  card: {
    backgroundColor: "#FFFFFF",
    width: 323,
    height: "30%",
    borderRadius: 24,
    marginTop: 20,
    marginLeft: 32,
    elevation: 15,
    shadowColor: "#00000040",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    overflow: "hidden",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  flatlist: {
    marginRight: 34,
    marginBottom: 20,
  },
  title2: {
    marginTop: 26,
    marginLeft: 21,
    fontFamily: "poppins-regular",
    fontWeight: "400",
    fontSize: 14,
    lineHeight: 16.2,
    letterSpacing: 1,
  },
  logout: {
    color: "#D24141",
    fontWeight: "400",
    lineHeight: 16.2,
    textAlign: "center",
    fontSize: 14,
    marginTop: 23,
    fontFamily: "poppins-regular",
    letterSpacing: 1,
    width: "16.2%",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "#BAEEF3",
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    height: 105,
    width: 240,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonContainer: {
    justifyContent: "space-around",
    flexDirection: "row",
    top: 10,
  },
  buttonYes: {
    borderRadius: 10,
    backgroundColor: "#35A7B2",
    height: 35,
    width: 90,
    elevation: 2,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
  buttonNotYet: {
    borderRadius: 10,
    backgroundColor: "#D24141",
    height: 35,
    width: 90,
    elevation: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  textStyle: {
    color: "#ffffff",
    textAlign: "center",
    fontSize: 15,
  },
  modalText: {
    marginBottom: 15,
    fontFamily: "poppins-regular",
    fontWeight: "400",
    textAlign: "center",
    top: 15,
    fontSize: 18,
  },
});
export default Tasks;
