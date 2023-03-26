import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import { getDefaultMiddleware } from '@reduxjs/toolkit'
import taskReducer from '../store/services/taskSlice'
import categoryReducer from '@/store/services/categorySlice'
import { enableMapSet } from 'immer'

enableMapSet()

export const store = configureStore({
    reducer: {
        task: taskReducer,
        category: categoryReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false }),
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>
