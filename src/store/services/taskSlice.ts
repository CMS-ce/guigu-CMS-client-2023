import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { RootState, AppThunk } from '../store'

  

interface TodoItem {

  id: number

  title: string

  done: boolean

}

  

type StrOrNum = string | number

  

export interface TaskState {

  taskList: TodoItem[]

}

  

const initialState: TaskState = {

  taskList: [

    {

      id: 1,

      title: '学习react',

      done: true

    },

    {

      id: 2,

      title: '搞定mobx',

      done: true

    },

    {

      id: 3,

      title: '通关网路侦探',

      done: false

    }

  ]

}

  

export const taskSlice = createSlice({

  name: 'task', // 独一无二不重复的名字语义化

  // 定义初始化的数据

  initialState,

  reducers: {

    // action为一个对象 对象中有一个固定的属性叫做payload 为传递过来的参数

    addTask(state, action: PayloadAction<TodoItem>) {

      state.taskList.push(action.payload)

    },

    delTask(state, action: PayloadAction<string | number>) {

      state.taskList = state.taskList.filter(item => item.id !== action.payload)

    },

    toggleTask(state, action: PayloadAction<StrOrNum>) {

      const item = state.taskList.find(

        item => item.id === action.payload

      ) as TodoItem

      item.done = !item.done

    },

    allCheck(state, action: PayloadAction<boolean>) {

      state.taskList.forEach(item => (item.done = action.payload))

    }

  }

})

  

// 生成修改数据的方法导出

export const { delTask, toggleTask, allCheck, addTask } = taskSlice.actions

  

export const selectTaskList = (state: RootState) => state.task.taskList

  

// 生成reducer 导出 供index.js做组合模块

export default taskSlice.reducer