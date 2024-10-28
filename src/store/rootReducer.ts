import { combineReducers } from "redux";
import questionsSlice from "./questionsSlice";

const rootReducer = combineReducers({
  questions: questionsSlice.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
