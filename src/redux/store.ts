import { configureStore, combineReducers } from '@reduxjs/toolkit';
import cartSlice from './cartReducer';
import dataSlice from './dataReducer';
import tokenSlice from './tokenReducer';
import pageSlice from './pageReducer';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';

const persistConfig = {
  key: 'root',
  storage,
  version: 1
}

const rootReducer = combineReducers({
  cartSlice,
  dataSlice,
  tokenSlice,
  pageSlice
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore(
  {
    reducer: {
      persistedReducer
    }
  });

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export const persistor = persistStore(store)

