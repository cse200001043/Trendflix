import alertReducer from "./alertReducer";
import { combineReducers } from "redux";
import authReducer from "./authReducer";
import adminReducer from "./adminReducer";
import mainReducer from "./mainReducer";

const allReducers = combineReducers({
  alert: alertReducer,
  auth: authReducer,
  admin: adminReducer,
  main: mainReducer,
});

export default allReducers;
