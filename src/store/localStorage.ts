import { RootState } from "./rootReducer";

export const loadState = (): Partial<RootState> | undefined => {
  try {
    const serializedState = localStorage.getItem("questionsFormData");
    if (serializedState === null) {
      return undefined; // Let reducers initialize the state
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error("Could not load state from localStorage:", err);
    return undefined;
  }
};

export const saveState = (state: Partial<RootState>) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("questionsFormData", serializedState);
  } catch (err) {
    console.error("Could not save state to localStorage:", err);
  }
};
