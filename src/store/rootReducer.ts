import { combineReducers } from "redux";
import questionsSlice from "./questionsSlice";
import formSlice from "./formSlice";

const rootReducer = combineReducers({
  questions: questionsSlice.reducer,
  form: formSlice.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
