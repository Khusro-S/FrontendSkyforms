import { combineReducers } from "redux";
import formsSlice from "./formsSlice";

const rootReducer = combineReducers({
  forms: formsSlice.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
