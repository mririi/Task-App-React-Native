import React from "react";
import { useCallback, useEffect, useReducer, useState } from "react";
import {
  Dimensions,
  Keyboard,
  Modal,
  Pressable,
  StatusBar,
} from "react-native";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import CustomButton from "../components/CustomButton";
import CustomTextInput from "../components/CustomTextInput";
import CustomTitle from "../components/CustomTitle";
import TaskItem from "../components/TaskItem";
import colors from "../constants/colors";
import * as authActions from "../store/actions/auth";
import * as taskActions from "../store/actions/tasks";
import { Formik, Field } from "formik";
import * as yup from "yup";

//Declaring height and width of the device
const { height, width } = Dimensions.get("screen");

//Getting the window height of the device
const windowHeight = Dimensions.get("window").height;

//Calculating the height of navigation bar of the device
const navbarHeight = height - windowHeight + StatusBar.currentHeight;

const InputValidationSchema = yup.object().shape({
  title: yup.string().required("Title is required"),
});

const Tasks = (props) => {
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [idToDelete, setIdToDelete] = useState();
  const userData = AsyncStorage.getItem("userData");
  if (!userData) {
    props.navigation.navigate("Bienvenue");
    return;
  }
  //Getting the userId from the state
  const userid = useSelector((state) => state.auth.userId);
  //Getting the fullname from the state
  const fullname = useSelector((state) => state.auth.fullname);
  //Getting all the tasks in the state
  const tasks = useSelector((state) =>
    state.tasks.availableTasks.filter((task) => task.userid === userid)
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      Alert.alert("An error occurred!", error, [{ text: "Ok" }]);
    }
  }, [error]);

  //Loading the tasks
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

  useEffect(() => {
    setIsLoading(true);
    loadTasks().then(() => setIsLoading(false));
  }, [dispatch, loadTasks]);

  //Handling the submit button
  const submitHandler = useCallback(
    async (values) => {
      const action = taskActions.createTask(values.title);
      setError(null);
      setIsLoading(true);
      try {
        await dispatch(action);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    },
    [dispatch]
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
        <Formik
          validationSchema={InputValidationSchema}
          initialValues={{
            title: "",
          }}
          onSubmit={(values, { resetForm }) => {
            submitHandler(values);
            resetForm({ values: "" });
          }}
        >
          {({ handleSubmit, isValid }) => (
            <>
              <Field
                component={CustomTextInput}
                name="title"
                placeholder="Task Title"
              />
              {isLoading ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <CustomButton
                  style={styles.button}
                  title="ADD"
                  onPress={handleSubmit}
                  disabled={!isValid}
                />
              )}
            </>
          )}
        </Formik>
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
                console.log(itemData.item.id)
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
                      dispatch(taskActions.deleteTask(idToDelete));
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
    height: height * 0.37,
  },

  profile: {
    width: width * 0.254,
    height: height * 0.12,
    marginTop: -(height * 0.0482),
    marginLeft: width * 0.359,
    borderWidth: 3,
    borderRadius: height * 0.12,
    borderColor: "#2B8E94",
  },
  welcome: {
    marginTop: height * 0.024,
    color: "#FFFFFF",
  },
  taskarea: {
    height: height * 0.63,
  },
  taskform: {
    alignItems: "center",
  },
  tasks: {
    alignItems: "center",
  },
  button: {
    marginTop: height * 0.018,
    height: height * 0.054,
    width: width * 0.753,
  },
  title1: {
    marginTop: height * 0.018,
    marginLeft: width * 0.071,
    textAlign: "left",
  },
  card: {
    backgroundColor: "#FFFFFF",
    width: width * 0.822,
    height: height * 0.3,
    borderRadius: 24,
    marginTop: height * 0.0241,
    marginLeft: width * 0.0814,
    elevation: height * 0.018,
    shadowColor: "#00000040",
    shadowOpacity: 0.26,
    shadowOffset: {
      width: 0,
      height: height * 0.00482,
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
    marginRight: width * 0.086,
    marginBottom: height * 0.024,
  },
  title2: {
    marginTop: height * 0.031,
    marginLeft: width * 0.0534,
    textAlign: "left",
  },
  logout: {
    color: "#D24141",
    minWidth: 71,
    fontWeight: "400",
    lineHeight: height * 0.0195,
    textAlign: "center",
    fontSize: height * 0.0156,
    marginTop: navbarHeight > 150 ? (height * 0.0277) / 2 : height * 0.0277,
    fontFamily: "poppins-regular",
    letterSpacing: 1,
    width: width * 0.162,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: height * 0.026,
  },
  modalView: {
    marginVertical: height * 0.024,
    marginHorizontal: width * 0.051,
    backgroundColor: "#BAEEF3",
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    height: height * 0.126,
    width: width * 0.611,
    shadowOffset: {
      width: 0,
      height: height * 0.005,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonContainer: {
    justifyContent: "space-around",
    flexDirection: "row",
    top: height * 0.012,
  },
  buttonYes: {
    borderRadius: 10,
    backgroundColor: "#35A7B2",
    height: height * 0.0422,
    width: width * 0.229,
    elevation: 2,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: width * 0.0254,
  },
  buttonNotYet: {
    borderRadius: 10,
    backgroundColor: "#D24141",
    height: height * 0.0422,
    width: width * 0.229,
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
    fontSize: height * 0.018,
  },
  modalText: {
    marginBottom: height * 0.018,
    fontFamily: "poppins-regular",
    fontWeight: "400",
    textAlign: "center",
    top: width * 0.018,
    fontSize: height * 0.0217,
  },
});
export default Tasks;
