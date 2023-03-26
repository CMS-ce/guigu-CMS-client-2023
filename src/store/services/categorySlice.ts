import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { RootState, AppThunk } from '../store'
import { Category } from '@/types/category'

export interface categoryState {
    categoryList: Category[]
}

const initialState: categoryState = {
    categoryList: [],
}

export const categorySlice = createSlice({
    name: 'category', // 独一无二不重复的名字语义化 // 定义初始化的数据

    initialState,

    reducers: {
        // action为一个对象 对象中有一个固定的属性叫做payload 为传递过来的参数

        initCategoryList(state, action: PayloadAction<Category[]>) {
            state.categoryList = action.payload
        },
    },
})

// 生成修改数据的方法导出

export const { initCategoryList } = categorySlice.actions

export const selectCategoryList = (state: RootState) =>
    state.category.categoryList

// 生成reducer 导出 供index.js做组合模块

export default categorySlice.reducer
