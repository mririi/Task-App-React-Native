import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StyleSheet } from "react-native";
import Bienvenue from "./screens/Bienvenue";
import Inscription from "./screens/Inscription";
import * as Font from "expo-font";
import { useCallback, useEffect, useState } from "react";
import Authentification from "./screens/Authentification";
import Tasks from "./screens/Tasks";
import { Provider } from "react-redux";
import { combineReducers, createStore, applyMiddleware } from "redux";
import ReduxThunk from "redux-thunk";
import tasksReducer from "./store/reducers/tasks";
import authReducer from "./store/reducers/auth";
import StartUpScreen from "./screens/StartUpScreen";

//Declaring the root reducer
const rootReducer = combineReducers({
  auth: authReducer,
  tasks: tasksReducer,
});

//Declaring the store
const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  //Loading fonts
  useEffect(() => {
    async function prepare() {
      try {
        await Font.loadAsync({
          "poppins-regular": require("./assets/fonts/Poppins-Regular.ttf"),
          "poppins-bold": require("./assets/fonts/Poppins-Bold.ttf"),
        });
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }
    prepare();
  }, []);
  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }
  //Declaring the stack navigator
  const Stack = createStackNavigator();
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="StartUpScreen" component={StartUpScreen} />
          <Stack.Screen name="Bienvenue" component={Bienvenue} />
          <Stack.Screen name="Inscription" component={Inscription} />
          <Stack.Screen name="Authentification" component={Authentification} />
          <Stack.Screen name="Tasks" component={Tasks} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
