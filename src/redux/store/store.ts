// src/store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "../slice/themeSlice";
import { unitsApi } from "../endpoints/unitApi";
import { propertyApi } from "../endpoints/propertyApi";
import { organizationApi } from "../endpoints/organizationApi";

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    [unitsApi.reducerPath]: unitsApi.reducer,
    [propertyApi.reducerPath]: propertyApi.reducer,
    [organizationApi.reducerPath]: organizationApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for serializability check
        ignoredActions: ["persist/PERSIST"],
      },
    }).concat(
      unitsApi.middleware,
      propertyApi.middleware,
      organizationApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
