import { combineReducers } from "redux";
import formsSlice from "./formsSlice";
import responsesSlice from "./responsesSlice";

const rootReducer = combineReducers({
  forms: formsSlice.reducer,
  responses: responsesSlice.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
