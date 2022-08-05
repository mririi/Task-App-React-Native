import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useReducer, useState } from "react";
import { Dimensions, Keyboard, Modal, Pressable } from "react-native";
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
import CustomTitle from "../components/CustomTitle";
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
        <CustomTitle style={styles.welcome} title={"Welcome, " + fullname} />
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
      <CustomTitle style={styles.title1} title="Tasks List" />
      <View style={styles.card}>
        <CustomTitle style={styles.title2} title="Tasks List" />
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
    height: Dimensions.get("screen").height * 0.37,
  },

  profile: {
    width: Dimensions.get("screen").width * 0.254,
    height: Dimensions.get("screen").height * 0.12,
    marginTop: -(Dimensions.get("screen").height * 0.0482),
    marginLeft: Dimensions.get("screen").width * 0.359,
    borderWidth: 3,
    borderRadius: Dimensions.get("screen").height * 0.12,
    borderColor: "#2B8E94",
  },
  welcome: {
    marginTop: Dimensions.get("screen").height * 0.024,
    color: "#FFFFFF",
  },
  taskarea: {
    height: Dimensions.get("screen").height * 0.63,
  },
  taskform: {
    alignItems: "center",
  },
  tasks: {
    alignItems: "center",
  },
  button: {
    marginTop: Dimensions.get("screen").height * 0.018,
    height: Dimensions.get("screen").height * 0.054,
    width: Dimensions.get("screen").width * 0.753,
  },
  title1: {
    marginTop: Dimensions.get("screen").height * 0.018,
  },
  card: {
    backgroundColor: "#FFFFFF",
    width: Dimensions.get("screen").width * 0.822,
    height: Dimensions.get("screen").height * 0.3,
    borderRadius: 24,
    marginTop: Dimensions.get("screen").height * 0.0241,
    marginLeft: Dimensions.get("screen").width * 0.0814,
    elevation: Dimensions.get("screen").height * 0.018,
    shadowColor: "#00000040",
    shadowOpacity: 0.26,
    shadowOffset: {
      width: 0,
      height: Dimensions.get("screen").height * 0.00482,
    },
    shadowRadius: 10,
    overflow: "hidden",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  flatlist: {
    marginRight: Dimensions.get("screen").width * 0.086,
    marginBottom: Dimensions.get("screen").height * 0.024,
  },
  title2: {
    marginTop: Dimensions.get("screen").height * 0.031,
    marginLeft: Dimensions.get("screen").width * 0.0534,
  },
  logout: {
    color: "#D24141",
    fontWeight: "400",
    lineHeight: Dimensions.get("screen").height * 0.0195,
    textAlign: "center",
    fontSize: Dimensions.get("screen").height * 0.0156,
    marginTop: Dimensions.get("screen").height * 0.0277,
    fontFamily: "poppins-regular",
    letterSpacing: 1,
    width: Dimensions.get("screen").width * 0.162,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: Dimensions.get("screen").height * 0.026,
  },
  modalView: {
    marginVertical: Dimensions.get("screen").height * 0.024,
    marginHorizontal: Dimensions.get("screen").width * 0.051,
    backgroundColor: "#BAEEF3",
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    height: Dimensions.get("screen").height * 0.126,
    width: Dimensions.get("screen").width * 0.611,
    shadowOffset: {
      width: 0,
      height: Dimensions.get("screen").height * 0.005,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonContainer: {
    justifyContent: "space-around",
    flexDirection: "row",
    top: Dimensions.get("screen").height * 0.012,
  },
  buttonYes: {
    borderRadius: 10,
    backgroundColor: "#35A7B2",
    height: Dimensions.get("screen").height * 0.0422,
    width: Dimensions.get("screen").width * 0.229,
    elevation: 2,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: Dimensions.get("screen").width * 0.0254,
  },
  buttonNotYet: {
    borderRadius: 10,
    backgroundColor: "#D24141",
    height: Dimensions.get("screen").height * 0.0422,
    width: Dimensions.get("screen").width * 0.229,
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
    fontSize: Dimensions.get("screen").height * 0.018,
  },
  modalText: {
    marginBottom: Dimensions.get("screen").height * 0.018,
    fontFamily: "poppins-regular",
    fontWeight: "400",
    textAlign: "center",
    top: Dimensions.get("screen").width * 0.018,
    fontSize: Dimensions.get("screen").width * 0.0217,
  },
});
export default Tasks;
