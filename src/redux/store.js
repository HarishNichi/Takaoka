import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import { persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import rootReducer from './rootReducer';

import rootSaga from "@/middleware/rootSaga";

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      thunk: false,
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).prepend(sagaMiddleware);
  },
});

export const persistor = persistStore(store);

sagaMiddleware.run(rootSaga);

// Listen for changes in localStorage and update Redux store accordingly
if (typeof window !== 'undefined') {
  window.addEventListener('storage', event => {
    if (event.key === 'redux-persist-root') {
      persistor.rehydrate(); // Rehydrate the store with updated state from localStorage
    }
  });
}
