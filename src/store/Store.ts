import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";
// import { formsApi } from "../api/formsApi";

// const STORAGE_KEY = "persistentState";

// function saveToLocalStorage(state: RootState) {
//   try {
//     const serialisedState = JSON.stringify(state);
//     localStorage.setItem(STORAGE_KEY, serialisedState);
//   } catch (e) {
//     console.warn("Could not save state", e);
//   }
// }

// function loadFromLocalStorage() {
//   try {
//     const serialisedState = localStorage.getItem(STORAGE_KEY);
//     if (serialisedState === null) return undefined;
//     return JSON.parse(serialisedState);
//   } catch (e) {
//     console.warn("Could not load state", e);
//     return undefined;
//   }
// }

// const preloadedState = loadFromLocalStorage();

const Store = configureStore({
  reducer: rootReducer,
  // reducer: {
  //   ...rootReducer,
  //   [formsApi.reducerPath]: formsApi.reducer,
  // },
  // middleware: (getDefaultMiddleware) =>
  //   getDefaultMiddleware().concat(formsApi.middleware),
  // preloadedState,
});

// let saveTimeout: number | null = null;

// Store.subscribe(() => {
//   if (saveTimeout) {
//     clearTimeout(saveTimeout);
//   }

//   saveTimeout = window.setTimeout(() => {
//     saveToLocalStorage(Store.getState());
//   }, 1000); // 1 second delay
// });

// export type AppDispatch = typeof Store.dispatch;
export default Store;
export type AppDispatch = typeof Store.dispatch;
