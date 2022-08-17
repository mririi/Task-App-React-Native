import { combineReducers, createStore, applyMiddleware } from "redux";
import ReduxThunk from "redux-thunk";
import tasksReducer from "../store/reducers/tasks";
import authReducer from "../store/reducers/auth";
//Declaring the root reducer
const rootReducer = combineReducers({
  auth: authReducer,
  tasks: tasksReducer,
});

//Declaring the store

export default function configureStore() {
  const store = createStore(rootReducer, applyMiddleware(ReduxThunk));
  return store;
}
