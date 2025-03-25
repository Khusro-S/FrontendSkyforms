import { combineReducers } from "redux";
import formsSlice from "./formsSlice";
import responsesSlice from "./responsesSlice";
import authSlice from "./authSlice";

const rootReducer = combineReducers({
  forms: formsSlice.reducer,
  responses: responsesSlice.reducer,
  auth: authSlice.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
