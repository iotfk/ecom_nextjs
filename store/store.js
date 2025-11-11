import persistStore from "redux-persist/es/persistStore";
import authReducer from "./reducer/authReducer";
import localStorage from "redux-persist/es/storage";

const { combineReducers, configureStore } = require("@reduxjs/toolkit");
const { default: persistReducer } = require("redux-persist/es/persistReducer");


const rootReducer = combineReducers({
     authStore: authReducer
})

const persistConfig = {
    key: 'root',
    storage: localStorage
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({serializableCheck: false})
})

export const persistor = persistStore(store)