# 技术栈

## 过去的技术栈

- nestjs
- mongoose
- mongodb
- react-js
- webpack
- antd
- echarts
- blitz
- 无状态管理
- 上传组件
- full-text editor(react-quill)
- weather-api(高德)

## 新的技术栈

- nestjs
- prisma
- postgres
- react-ts
- vite
- mui && styled-components
- echarts
- d3.js
- redux && rtk
- 上传组件(自己封装或者找社区的)
- full-text editor(unknown)
- weather-api

## 数据交互

```json
{
    "message": "获取分类列表成功",
    "status": 0,
    "data": []
}
```

使用响应拦截器实现，20000代表请求成功，其他都代表请求失败

由于数据库改变了，所以之前使用的数据格式报废。另外，要使用ts，之前的前台基本报废。

# 前台实现

## 一、根据tutorial生成模板

## 二、自定义dataProvider

`dataProvider.ts`

```tsx
// in src/dataProvider.ts
import {
    DataProvider,
    RaRecord,
    UpdateParams,
    UpdateResult,
    fetchUtils,
} from 'react-admin'
import { stringify } from 'query-string'
import { v4 as uuidv4 } from 'uuid'
import axios from 'axios'

const apiUrl = 'http://localhost:8000'

// const httpClient = fetchUtils.fetchJson
const fetchOptions: fetchUtils.Options = {
    user: {
        authenticated: true,
        token: `Bearer ${
            localStorage.getItem('jwt_token') as string | undefined
        }`,
    },
}
const httpClient = async (url = '', options = {}) => {
    const { status, headers, body, json } = await fetchUtils.fetchJson(url, {
        ...options,
        ...fetchOptions,
    })
    // console.log('fetchJson result', { status, headers, body, json })
    return { status, headers, body, json }
}

// TypeScript users must reference the type `DataProvider`
export const dataProvider: DataProvider = {
    getList: (resource, params) => {
        const { page, perPage } = params.pagination
        const { field, order } = params.sort
        const query = {
            sort: JSON.stringify([field, order]),
            range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
            filter: JSON.stringify(params.filter),
        }
        const url = `${apiUrl}/${resource}?${stringify(query)}`

        return httpClient(url).then(({ headers, json }) => {
            return {
                data: json.data,
                total: json.total,
            }
        })
    },

    getOne: (resource, params) =>
        httpClient(`${apiUrl}/${resource}/${params.id}`).then(({ json }) => ({
            data: json,
        })),

    getMany: (resource, params) => {
        const query = {
            filter: JSON.stringify({ id: params.ids }),
        }
        const url = `${apiUrl}/${resource}/ids?${stringify(query)}`
        return httpClient(url).then(({ json }) => ({ data: json }))
    },

    getManyReference: (resource, params) => {
        const { page, perPage } = params.pagination
        const { field, order } = params.sort
        const query = {
            sort: JSON.stringify([field, order]),
            range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
            filter: JSON.stringify({
                ...params.filter,
                [params.target]: params.id,
            }),
        }
        const url = `${apiUrl}/${resource}?${stringify(query)}`

        return httpClient(url).then(({ headers, json }) => ({
            data: json.data,
            total: json.total,
        }))
    },

    update: (resource, params) => {
        return httpClient(`${apiUrl}/${resource}/${params.id}`, {
            method: 'PUT',
            body: JSON.stringify(params.data),
        }).then(({ json }) => ({ data: json }))
    },

    updateMany: (resource, params) => {
        const query = {
            filter: JSON.stringify({ id: params.ids }),
        }
        return httpClient(`${apiUrl}/${resource}?${stringify(query)}`, {
            method: 'PUT',
            body: JSON.stringify(params.data),
        }).then(({ json }) => ({ data: json }))
    },

    create: (resource, params) => {
        return httpClient(`${apiUrl}/${resource}`, {
            method: 'POST',
            body: JSON.stringify(params.data),
        }).then(({ json }) => ({
            data: json,
        }))
    },

    delete: (resource, params) =>
        httpClient(`${apiUrl}/${resource}/${params.id}`, {
            method: 'DELETE',
        }).then(({ json }) => ({ data: json })),

    deleteMany: (resource, params) => {
        const query = {
            filter: JSON.stringify({ id: params.ids }),
        }
        return httpClient(`${apiUrl}/${resource}?${stringify(query)}`, {
            method: 'DELETE',
        }).then(({ json }) => ({ data: json }))
    },
}

interface MyDataProvider<ResourceType extends string = string>
    extends DataProvider {
    updateStatus: <RecordType extends RaRecord = any>(
        resource: ResourceType,
        params: UpdateParams
    ) => Promise<UpdateResult<RecordType>>
}

export const myDataProvider: MyDataProvider = {
    ...dataProvider,
    create: (resource, params) => {
        if (resource !== 'products') {
            return dataProvider.create(resource, params)
        }

        const newPictures = params.data.pictures.filter(
            (p: any) => p.rawFile instanceof File
        )
        const formerPictures = params.data.pictures.filter(
            (p: any) => !(p.rawFile instanceof File)
        )

        return Promise.all(newPictures.map(convertFileToBase64))
            .then((base64Pictures) =>
                base64Pictures.map((picture64) => ({
                    src: picture64,
                    title: uuidv4(),
                }))
            )
            .then((transformedNewPictures) =>
                dataProvider.create(resource, {
                    data: {
                        ...params.data,
                        pictures: [
                            ...transformedNewPictures,
                            ...formerPictures,
                        ],
                    },
                })
            )
    },
    update: (resource, params) => {
        if (resource !== 'products') {
            return dataProvider.update(resource, params)
        }

        const newPictures = params.data.pictures.filter(
            (p: any) => p.rawFile instanceof File
        )
        const formerPictures = params.data.pictures.filter(
            (p: any) => !(p.rawFile instanceof File)
        )

        return Promise.all(newPictures.map(convertFileToBase64))
            .then((base64Pictures) =>
                base64Pictures.map((picture64) => ({
                    src: picture64,
                    title: uuidv4(),
                }))
            )
            .then((transformedNewPictures) =>
                dataProvider.update(resource, {
                    id: params.id,
                    data: {
                        ...params.data,
                        pictures: [
                            ...transformedNewPictures,
                            ...formerPictures,
                        ],
                    },
                    previousData: {},
                })
            )
    },

    updateStatus: (resource, params) => {
        return httpClient(`${apiUrl}/${resource}/${params.id}`, {
            method: 'PATCH',
            body: JSON.stringify(params.data),
        }).then(({ json }) => ({ data: json }))
    },
}

const convertFileToBase64 = (file: any) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.onerror = reject

        reader.readAsDataURL(file.rawFile)
    })

```



## 三、自定义TextField和TextInput

### 1. customize the TextInput

`MyStatusInput.tsx`

```tsx
// in SexInput.js
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { useInput } from 'react-admin'
import { Button, FormControl, InputLabel } from '@mui/material'

const MyStatusInput = (props) => {
    const {
        field,
        fieldState: { isTouched, invalid, error },
        formState: { isSubmitted },
    } = useInput(props)

    return (
        <FormControl sx={{ m: 1, minWidth: 250, marginBottom: 4 }}>
            <Button variant='outlined' size='small'>
                商品状态
            </Button>
            <Select
                id='grouped-product-status-select'
                {...field}
                sx={{ height: 40 }}
            >
                <MenuItem sx={{ fontWeight: 'bold' }} key={1} value={1}>
                    上架
                </MenuItem>
                <MenuItem sx={{ fontWeight: 'bold' }} key={2} value={2}>
                    下架
                </MenuItem>
            </Select>
        </FormControl>
    )
}
export default MyStatusInput

```

### 2. customize the TextField

`MyStatusField.tsx`

```tsx
// in src/MyUrlField.tsx
import { useRecordContext } from 'react-admin'
import { Button } from '@mui/material'
import React, { useState } from 'react'
import { myDataProvider } from '@/api/dataProvider'

type MyStatusFieldProps = {
    source: string
}

const MyStatusField = ({ source }: MyStatusFieldProps) => {
    const [flag, setFlag] = useState(1)
    const record = useRecordContext()

    const handleButton = async (e: React.MouseEvent) => {
        e.stopPropagation()
        myDataProvider.updateStatus('products', {
            id: record.id,
            data: {
                id: record.id,
                status: record[source] === 1 ? 2 : 1,
            },
            previousData: {
                id: record.id,
                status: record[source],
            },
        })
        setFlag(flag === 1 ? 2 : 1)
       
    }

    return record ? (
        <>
            {record[source] === flag ? (
                <Button
                    variant='contained'
                    color='primary'
                    onClick={handleButton}
                >
                    上 架
                </Button>
            ) : (
                <Button
                    variant='outlined'
                    color='secondary'
                    onClick={handleButton}
                >
                    下 架
                </Button>
            )}
        </>
    ) : null
}

export default MyStatusField

```

## 四、Rich Text Editor

使用了`react-quill`和`emoji-mart`这两个库

`MyRichTextInput.tsx`

```tsx
import { Button, FormControl, InputLabel } from '@mui/material'
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import React, { useEffect, useRef, useState } from 'react'
import { useInput } from 'react-admin'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

const MyRichTextInput = (props) => {
    const quillRef = useRef<ReactQuill>(null)
    const { field } = useInput(props)
    const [showEmojiPicker, setShowEmojiPicker] = useState(false)

    const modules = {
        toolbar: [
            [{ header: [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [
                { list: 'ordered' },
                { list: 'bullet' },
                { indent: '-1' },
                { indent: '+1' },
            ],
            ['link', 'image'],
            ['clean'],
        ],
    }

    const formats = [
        'header',
        'bold',
        'italic',
        'underline',
        'strike',
        'blockquote',
        'list',
        'bullet',
        'indent',
        'link',
        'image',
    ]

    const handleClickHeader = () => {
        quillRef.current?.editor?.focus()
    }

    const handleEmojiButtonClick = (e: React.MouseEvent) => {
        e.preventDefault()
        setShowEmojiPicker(!showEmojiPicker)
    }

    useEffect(() => {
        return () => {}
    }, [])

    return (
        <FormControl sx={{ m: 1, minWidth: 300, display: 'flex' }}>
            <Button
                variant='outlined'
                color='primary'
                size='small'
                onClick={handleClickHeader}
            >
                商品详情
            </Button>
            <ReactQuill
                value={field.value}
                onChange={field.onChange}
                ref={quillRef}
                modules={modules}
                formats={formats}
                style={{ height: 200, marginBottom: 50 }}
                placeholder='Write something amazing...'
            />
            {showEmojiPicker && (
                <Picker
                    data={data}
                    onEmojiSelect={(data) => {
                        quillRef.current
                            ?.getEditor()
                            .updateContents([{ insert: data.native }])
                        console.log(
                            quillRef.current?.getEditor().getContents().ops
                        )
                    }}
                />
            )}
            <button onClick={handleEmojiButtonClick}>😀</button>
        </FormControl>
    )
}

export default MyRichTextInput

```

## 五、File Upload

在更新和新增时，用base64对图片进行编码

```tsx
export const myDataProvider: MyDataProvider = {
    ...dataProvider,
    create: (resource, params) => {
      //...略，与update()相比，在于没有id
    },
    update: (resource, params) => {
        if (resource !== 'products') {
            return dataProvider.update(resource, params)
        }

        const newPictures = params.data.pictures.filter(
            (p: any) => p.rawFile instanceof File
        )
        const formerPictures = params.data.pictures.filter(
            (p: any) => !(p.rawFile instanceof File)
        )

        return Promise.all(newPictures.map(convertFileToBase64))
            .then((base64Pictures) =>
                base64Pictures.map((picture64) => ({
                    src: picture64,
                    title: uuidv4(),
                }))
            )
            .then((transformedNewPictures) =>
                dataProvider.update(resource, {
                    id: params.id,
                    data: {
                        ...params.data,
                        pictures: [
                            ...transformedNewPictures,
                            ...formerPictures,
                        ],
                    },
                    previousData: {},
                })
            )
    },
}

//转码
const convertFileToBase64 = (file: any) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.onerror = reject

        reader.readAsDataURL(file.rawFile)
    })

```

## 六、 Axios

`utils/request.ts`

```tsx
// index.ts

import axios, { InternalAxiosRequestConfig } from 'axios'

import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

type Result<T> = {
    status: number

    message: string

    data: T
}

// 导出Request类，可以用来自定义传递配置来创建实例

export class Request {
    // axios 实例

    instance: AxiosInstance // 基础配置，url和超时时间

    baseConfig: AxiosRequestConfig = { baseURL: '/api', timeout: 60000 }

    constructor(config: AxiosRequestConfig) {
        // 使用axios.create创建axios实例

        this.instance = axios.create(Object.assign(this.baseConfig, config))

        this.instance.interceptors.request.use(
            (config: InternalAxiosRequestConfig) => {
                // 一般会请求拦截里面加token，用于后端的验证

                const token = localStorage.getItem('jwt_token') as string

                if (token) {
                    config.headers!.Authorization = token
                }

                return config
            },

            (err: any) => {
                // 请求错误，这里可以用全局提示框进行提示

                return Promise.reject(err)
            }
        )

        this.instance.interceptors.response.use(
            (res: AxiosResponse) => {
                // 直接返回res，当然你也可以只返回res.data

                // 系统如果有自定义code也可以在这里处理

                return res
            },

            (err: any) => {
                // 这里用来处理http常见错误，进行全局提示

                let message = ''

                switch (err.response.status) {
                    case 400:
                        message = '请求错误(400)'

                        break

                    case 401:
                        message = '未授权，请重新登录(401)' // 这里可以做清空storage并跳转到登录页的操作

                        break

                    case 403:
                        message = '拒绝访问(403)'

                        break

                    case 404:
                        message = '请求出错(404)'

                        break

                    case 408:
                        message = '请求超时(408)'

                        break

                    case 500:
                        message = '服务器错误(500)'

                        break

                    case 501:
                        message = '服务未实现(501)'

                        break

                    case 502:
                        message = '网络错误(502)'

                        break

                    case 503:
                        message = '服务不可用(503)'

                        break

                    case 504:
                        message = '网络超时(504)'

                        break

                    case 505:
                        message = 'HTTP版本不受支持(505)'

                        break

                    default:
                        message = `连接出错(${err.response.status})!`
                } // 这里错误消息可以使用全局弹框展示出来 // 比如element plus 可以使用 ElMessage // ElMessage({ //   showClose: true, //   message: `${message}，请检查网络或联系管理员！`, //   type: "error", // }); // 这里是AxiosError类型，所以一般我们只reject我们需要的响应即可

                return Promise.reject(err.response)
            }
        )
    } // 定义请求方法

    public request(config: AxiosRequestConfig): Promise<AxiosResponse> {
        return this.instance.request(config)
    }

    public get<T = any>(
        url: string,

        config?: AxiosRequestConfig
    ): Promise<AxiosResponse<Result<T>>> {
        return this.instance.get(url, config)
    }

    public post<T = any>(
        url: string,

        data?: any,

        config?: AxiosRequestConfig
    ): Promise<AxiosResponse<Result<T>>> {
        return this.instance.post(url, data, config)
    }

    public put<T = any>(
        url: string,

        data?: any,

        config?: AxiosRequestConfig
    ): Promise<AxiosResponse<Result<T>>> {
        return this.instance.put(url, data, config)
    }

    public patch<T = any>(
        url: string,

        data?: any,

        config?: AxiosRequestConfig
    ): Promise<AxiosResponse<Result<T>>> {
        return this.instance.patch(url, data, config)
    }

    public delete<T = any>(
        url: string,

        config?: AxiosRequestConfig
    ): Promise<AxiosResponse<Result<T>>> {
        return this.instance.delete(url, config)
    }
}

// 默认导出Request实例

export default new Request({})

```

## 七、 State Management

(略)

## 八、自定义hooks

### 1. demo

```tsx
import React, { useState } from 'react'

function useCounter(initialValue: number) {
    const [count, setCount] = useState(initialValue)

    const increment = () => {
        setCount(count + 1)
    }

    const decrement = () => {
        setCount(count - 1)
    }

    return [count, increment, decrement]
}

export { useCounter }

```

### 2. useCategory()

在创建需要选择类别的组件前调用

```tsx
import categoryApi from '@/api/categoryApi'
import { useAppDispatch } from '@/store/hook'
import { initCategoryList } from '@/store/services/categorySlice'
import { useEffect, useState } from 'react'

function useCategorys() {
    const [categorys, setCategorys] = useState([])
    const dispatch = useAppDispatch()

    const reqCategorys = async () => {
        const res = await categoryApi.reqCategorys()
        if (res.status === 200) {
            const { data: tmpCategorys } = res.data
            setCategorys(categorys)
            dispatch(initCategoryList(tmpCategorys))
        }
    }

    useEffect(() => {
        reqCategorys()
        return () => {}
    }, [])

    return categorys
}

export { useCategorys }

```

### 3. useDate()

```tsx
import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs'

// const formattedDate = dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss');
// console.log(formattedDate);

function useDate() {
    const [date, setDate] = useState(
        dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss')
    )
    const [isNight, setIsNight] = useState<boolean>(false)
    let intervalId: number

    useEffect(() => {
        intervalId = setInterval(() => {
            const date = new Date()
            setDate(dayjs(date).format('YYYY-MM-DD HH:mm:ss  A'))
            if (date.getHours() > 6 && date.getHours() <= 18) {
                setIsNight(true)
            }
        }, 1000)

        return () => {
            clearInterval(intervalId)
        }
    }, [])

    return [date, isNight]
}

export { useDate }

```



# 后台实现

## 一、下载模板

nestjs只提供了和graphql组装的prisma

直接搜出来的是graphql+prisma+auth

这里选择到prisma-examples下

https://github.com/prisma/prisma-examples

https://github.com/prisma/prisma-examples/tree/latest/typescript/rest-nestjs

## 二、定义数据结构

### mongodb schema

`category.schema.ts`

```tsx
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CategoryDocument = Category & Document;

@Schema()
export class Category {

  @Prop({ required: true })
  name: String;

  @Prop({ required: true, default: '0' })
  parentId: String;

}

export const CategorySchema = SchemaFactory.createForClass(Category);

```

`product.schema.ts`

```tsx
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// categoryId: {type: String, required: true}, // 所属分类的id
//   pCategoryId: {type: String, required: true}, // 所属分类的父分类id
//   name: {type: String, required: true}, // 名称
//   price: {type: Number, required: true}, // 价格
//   desc: {type: String},
//   status: {type: Number, default: 1}, // 商品状态: 1:在售, 2: 下架了
//   imgs: {type: Array, default: []}, // n个图片文件名的json字符串
//   detail: {type: String}
export type ProductDocument = Product & Document;


@Schema()
export class Product {
  @Prop({ required: true, ref: 'categorys' })
  categoryId: String;

  @Prop({ required: true, ref: 'categorys' })
  pCategoryId: String;

  @Prop({ required: true })
  name: String;
  @Prop()
  price: Number;

  @Prop()
  desc: String;

  @Prop({ default: 1 })
  status: Number;

  @Prop({ default: [] })
  imgs: Array<string>;

  @Prop()
  detail: String;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

```

`role.schema.ts`

```tsx
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// name: {type: String, required: true}, // 角色名称
// auth_name: String, // 授权人
// auth_time: Number, // 授权时间
// create_time: {type: Number, default: Date.now}, // 创建时间
// menus: Array // 所有有权限操作的菜单path的数组

export type RoleDocument = Role & Document;

@Schema()
export class Role {
  @Prop({ required: true })
  name: String;

  @Prop()
  auth_name: String;

  @Prop()
  auth_time: Number;
  @Prop({ default: Date.now() })
  create_time: Number;

  @Prop()
  menus: Array<string>;
}

export const RoleSchema = SchemaFactory.createForClass(Role);

```

`user.schema.ts`

```tsx
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// username: {type: String, required: true}, // 用户名
//   password: {type: String, required: true}, // 密码
//   phone: String,
//   email: String,
//   create_time: {type: Number, default: Date.now},
//   role_id: String

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  username: String;

  @Prop({ required: true })
  password: String;

  @Prop()
  phone: String;
  @Prop()
  email: String;

  @Prop({ default: Date.now() })
  create_time: Number;

  @Prop({ ref: 'roles'})
  role_id: String;
}

export const UserSchema = SchemaFactory.createForClass(User);

```



### prisma schema

所有有关键的外键，都会强制在被关联的一方上生成Array类型的属性.

最后完全放弃外键，手动查吧，数据初始阶段过不去。

```js
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id       String   @id @default(uuid())
  username String
  password String
  phone    String?
  email    String?
  createAt DateTime @default(now())
  updateAt DateTime @updatedAt
  roleId   String?

}

// 这里的authName && authTime 指的是授权人和授权时间，理论上应该有多个， 但是既然原本只有一个就只有一个吧
model Role {
  id       String   @id @default(uuid())
  name     String
  authName String?
  authTime DateTime @default(now())
  menus    String[] @default([])
  createAt DateTime @default(now())
  updateAt DateTime @updatedAt
}

model Category {
  id       String    @id @default(uuid())
  name     String
  parentId String    @default("0")
}

// pCategoryId 在这里是不需要的，因为可以关联查询找出去，然后拼接一个dto给前端
model Product {
  id         String   @id @default(uuid())
  name       String?
  price      Int?
  desc       String?
  status     Int      @default(1)
  imgs       String[] @default([])
  detail     String   @default("长风破浪会有时，直挂云帆济沧海")
  categoryId String?

  @@index([categoryId])
}

```

## 三、 mongodb → postgres

由于之前的mongodb数据存在脏数据，指如果视为外键来理解却缺省的数据，所以不管是修改prisma-schema还是在数据库直接添加外键都会报错。想要添加外键必须清理掉脏数据。

```js
Environment variables loaded from ..\.env
Prisma schema loaded from schema.prisma
Datasource "db": PostgreSQL database "guigu-back-2023", schema "public" at "8.134.187.237:5432"
Error: insert or update on table "User" violates foreign key constraint "User_roleId_fkey"
   0: sql_migration_connector::apply_migration::migration_step
           with step=AddForeignKey { foreign_key_id: ForeignKeyId(0) }
             at migration-engine\connectors\sql-migration-connector\src\apply_migration.rs:21
   1: sql_migration_connector::apply_migration::apply_migration
             at migration-engine\connectors\sql-migration-connector\src\apply_migration.rs:10
   2: migration_core::state::SchemaPush
             at migration-engine\core\src\state.rs:433
```



`seed.ts`

本质是通过ts-node执行一个文件，使用mongoose连接mongodb，定义schema和查询方法，通过PrismaClient注入数据。

```tsx
import { PrismaClient, Prisma } from '@prisma/client';
import mongoose from 'mongoose';
const { Schema } = mongoose;

const categorySchema = new Schema(
  {
    name: String,
    parentId: String,
  },
  {
    statics: {
      findAll() {
        return this.find({});
      },
    },
  },
);
const productSchema = new Schema(
  {
    categoryId: String,
    pCategoryId: String,
    name: String,
    price: Number,
    desc: String,
    status: Number,
    imgs: [String],
    detail: String,
  },
  {
    statics: {
      findAll() {
        return this.find({});
      },
    },
  },
);
const roleSchema = new Schema(
  {
    name: String,
    auth_name: String,
    auth_time: Date,
    create_time: Date,
    menus: [String],
  },
  {
    statics: {
      findAll() {
        return this.find({});
      },
    },
  },
);
const userSchema = new Schema(
  {
    username: String,
    password: String,
    phone: String,
    email: String,
    create_time: Date,
    role_id: String,
  },
  {
    statics: {
      findAll() {
        return this.find({});
      },
    },
  },
);

const prisma = new PrismaClient();
const categoryData: Prisma.CategoryUncheckedCreateInput[] = [];
const userData: Prisma.UserUncheckedCreateInput[] = [];
const roleData: Prisma.RoleUncheckedCreateInput[] = [];
const productData: Prisma.ProductUncheckedCreateInput[] = [];


async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/server_db2');
  const Category = mongoose.model('categorys', categorySchema);
  const categories = await Category.findAll();
  categories.forEach((c) => {
    categoryData.push({
      id: c._id.toString(),
      name: c.name,
      parentId: c.parentId,
    });
  });
  for (const c of categoryData) {
    console.log(categoryData);
    const category = await prisma.category.create({
      data: c,
    });
  }

  const Role = mongoose.model('roles', roleSchema);
  const roles = await Role.findAll();
  roles.forEach((r) => {
    roleData.push({
      id: r._id.toString(),
      name: r.name,
      authName: r.auth_name,
      authTime: r.auth_time,
      createAt: r.create_time,
      menus: r.menus,
    });
  });
  for (const r of roleData) {
    const role = await prisma.role.create({
      data: r,
    });
  }
  console.log(roleData);

  const User = mongoose.model('users', userSchema);
  const users = await User.findAll();
  users.forEach((u) => {
    userData.push({
      id: u._id.toString(),
      username: u.username,
      password: u.password,
      phone: u.phone,
      email: u.email,
      roleId: u.role_id,
      createAt: u.create_time,
    });
  });
  for (const u of userData) {
    const user = await prisma.user.create({
      data: u,
    });
  }
  // console.log(userData);

  

  const Product = mongoose.model('products', productSchema);
  const products = await Product.findAll();
  products.forEach((p) => {
    productData.push({
      id: p._id.toString(),
      categoryId: p.categoryId,
      name: p.name,
      price: p.price,
      desc: p.desc,
      status: p.status,
      imgs: p.imgs,
      detail: p.detail,
    });
  });
  for (const p of productData) {
    const product = await prisma.product.create({
      data: p,
    });
  }

}

main()
  .then(async () => {
    await prisma.$disconnect();
    await mongoose.disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    await mongoose.disconnect();
    process.exit(1);
  });

```

## 四、swagger

`swagger.ts`

```tsx
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

function initSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Guigu back-system 2023')
    .setDescription('The back-system API description')
    .setVersion('1.0')
    .addTag('CMS')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
}

export default initSwagger;

```

## 五、全局异常处理

## 六、响应拦截器

## 七、中间件

## 八、跨域

## 九、自定义响应结果

`result.ts`

```tsx
import { identity } from 'rxjs';

class Result<T> {
  data: T;
  status: number;
  message: String;

  constructor(data: T, status: number, message: string) {
    this.data = data;
    this.status = status;
    this.message = message;
  }

  static ok<T>(data?: T, status?: number, message?: string) {
    status = !status ? 200 : status;
    return new Result<T>(data, status, message);
  }

  static fail<T>(status?: number, message?: string) {
    status = !status ? 500 : status;
    return new Result<T>(null, 500, message);
  }
}

export default Result;

```

## 十、 完成各个模块基本的CURD功能

分页结果需要自己拼接

`page.result.ts`

```tsx
class PageResult<T> {
  records: T[];
  current: number;
  size: number;
  pages: number;
  total: number;
}

export default PageResult;
```

```tsx
// ...
async findAll(current: number = 1, size: number = 3) {
    const products = await this.prismaService.product.findMany({
        skip: +((current - 1) * size),
        take: +size,
        select: {
            id: true,
            name: true,
            category: true,
            price: true,
            detail: true,
            desc: true,
            status: true,
            imgs: true,
        },
    });
    const count = await this.prismaService.product.count();
    const productPage: PageResult<(typeof products)[0]> = {
        records: products,
        current: +current,
        size: +size,
        pages: Math.ceil(count / size),
        total: count,
    };
    return Result.ok(productPage, null, '商品列表分页查询成功');
}

```



## 十一、 查询天气API

导入 `@nestjs/axios`，使用HttpModule模块

`weather.module.ts`

```tsx
import { Module } from '@nestjs/common';
import { WeathersService } from './weathers.service';
import { WeathersController } from './weathers.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  controllers: [WeathersController],
  providers: [ WeathersService],
  exports:[HttpModule]
})
export class WeathersModule {}
```

`weather.service.ts`

```tsx
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { HttpModule, HttpService } from '@nestjs/axios';
import { Observable } from 'rxjs/internal/Observable';
import weatherConstants from 'src/common/constants/weather.constants';
import Result from 'src/common/base/result';

@Injectable()
export class WeathersService {
  constructor(private readonly httpService: HttpService) {}

  async getWeather() {
    const { appKey, cityCode } = weatherConstants;
    const res = await this.httpService.axiosRef.get(
      `https://restapi.amap.com/v3/weather/weatherInfo?key=${appKey}&city=${cityCode}&extensions=all`,
    );
    if (res.status === 200) {
      return Result.ok(res.data, null, '查询天气成功');
    }
  }
}
```

## 十二、根据前台dataProvider的规范修改后台接口

## 十三、 认证模块

参考官方demo.

需要对返回值做一些处理。

## 十四、根据前台规范修改接口

### 前台规范

| Action              | Expected API request                                         |
| :------------------ | :----------------------------------------------------------- |
| Get list            | `GET http://my.api.url/posts?sort=["title","ASC"]&range=[0, 24]&filter={"title":"bar"}` |
| Get one record      | `GET http://my.api.url/posts/123`                            |
| Get several records | `GET http://my.api.url/posts?filter={"id":[123,456,789]}`    |
| Get related records | `GET http://my.api.url/posts?filter={"author_id":345}`       |
| Create a record     | `POST http://my.api.url/posts`                               |
| Update a record     | `PUT http://my.api.url/posts/123`                            |
| Update records      | `PUT http://my.api.url/posts?filter={"id":[123,124,125]}`    |
| Delete a record     | `DELETE http://my.api.url/posts/123`                         |
| Delete records      | `DELETE http://my.api.url/posts?filter={"id":[123,124,125]}` |

```tsx
// in src/dataProvider.ts
import { fetchUtils } from "react-admin";
import { stringify } from "query-string";

const apiUrl = 'https://my.api.com/';
const httpClient = fetchUtils.fetchJson;

// TypeScript users must reference the type `DataProvider`
export const dataProvider = {
    getList: (resource, params) => {
        const { page, perPage } = params.pagination;
        const { field, order } = params.sort;
        const query = {
            sort: JSON.stringify([field, order]),
            range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
            filter: JSON.stringify(params.filter),
        };
        const url = `${apiUrl}/${resource}?${stringify(query)}`;

        return httpClient(url).then(({ headers, json }) => ({
            data: json,
            total: parseInt((headers.get('content-range') || "0").split('/').pop() || 0, 10),
        }));
    },

    getOne: (resource, params) =>
        httpClient(`${apiUrl}/${resource}/${params.id}`).then(({ json }) => ({
            data: json,
        })),

    getMany: (resource, params) => {
        const query = {
            filter: JSON.stringify({ id: params.ids }),
        };
        const url = `${apiUrl}/${resource}?${stringify(query)}`;
        return httpClient(url).then(({ json }) => ({ data: json }));
    },

    getManyReference: (resource, params) => {
        const { page, perPage } = params.pagination;
        const { field, order } = params.sort;
        const query = {
            sort: JSON.stringify([field, order]),
            range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
            filter: JSON.stringify({
                ...params.filter,
                [params.target]: params.id,
            }),
        };
        const url = `${apiUrl}/${resource}?${stringify(query)}`;

        return httpClient(url).then(({ headers, json }) => ({
            data: json,
            total: parseInt((headers.get('content-range') || "0").split('/').pop() || 0, 10),
        }));
    },

    update: (resource, params) =>
        httpClient(`${apiUrl}/${resource}/${params.id}`, {
            method: 'PUT',
            body: JSON.stringify(params.data),
        }).then(({ json }) => ({ data: json })),

    updateMany: (resource, params) => {
        const query = {
            filter: JSON.stringify({ id: params.ids}),
        };
        return httpClient(`${apiUrl}/${resource}?${stringify(query)}`, {
            method: 'PUT',
            body: JSON.stringify(params.data),
        }).then(({ json }) => ({ data: json }));
    },

    create: (resource, params) =>
        httpClient(`${apiUrl}/${resource}`, {
            method: 'POST',
            body: JSON.stringify(params.data),
        }).then(({ json }) => ({
            data: { ...params.data, id: json.id },
        })),

    delete: (resource, params) =>
        httpClient(`${apiUrl}/${resource}/${params.id}`, {
            method: 'DELETE',
        }).then(({ json }) => ({ data: json })),

    deleteMany: (resource, params) => {
        const query = {
            filter: JSON.stringify({ id: params.ids}),
        };
        return httpClient(`${apiUrl}/${resource}?${stringify(query)}`, {
            method: 'DELETE',
        }).then(({ json }) => ({ data: json }));
    }
};
```

### 后台规范

`paramUtils.ts`

```tsx
import { Sort } from 'src/types/sort';
import { PageQuery, PageQueryDto } from 'src/types/query';

const convertRawParamToObject = (pageQuery: PageQuery): PageQueryDto => {
  const sortArr = JSON.parse(pageQuery.sort);
  const rangeArr = JSON.parse(pageQuery.range);
  const pageQueryDto: PageQueryDto = {
    sort: {
      field: sortArr[0],
      order: (sortArr[1] as string).toLocaleLowerCase(),
    },
    range: {
      from: rangeArr[0],
      to: rangeArr[1],
    },
    filter: Object.keys(pageQuery).includes('filter')
      ? JSON.parse(pageQuery.filter)
      : {},
  };
  return pageQueryDto;
};

const constructWhereArgs = (filter: object) => {
  const whereArgs = {};
  if (Object.keys(filter).length > 0) {
    Object.keys(filter).forEach((key) =>
      Object.defineProperty(whereArgs, key, {
        value: filter[key],
        writable: true,
        enumerable: true,
        configurable: true,
      }),
    );
    // Object.defineProperty(whereArgs, Object.keys(filter)[0], {
    //   value: filter[Object.keys(filter)[0]],
    //   writable: true,
    //   enumerable: true,
    //   configurable: true,
    // });
  }
  return whereArgs;
};

const constructOrderByArgs = (sort: Sort) => {
  const orderByArgs = {};
  Object.defineProperty(orderByArgs, sort.field, {
    value: sort.order,
    writable: true,
    enumerable: true,
    configurable: true,
  });
  return orderByArgs;
};

export default {
  convertRawParamToObject,
  constructWhereArgs,
  constructOrderByArgs,
};

```

`category.controller.ts`

```tsx
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Put,
} from '@nestjs/common';
import { CategorysService } from './categorys.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { ApiTags } from '@nestjs/swagger';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { FilterObj, PageQuery } from 'src/types/query';
import paramUtils from 'src/utils/paramUtils';

@ApiTags('categorys')
@Controller('categorys')
export class CategorysController {
  constructor(private readonly categorysService: CategorysService) {}

  @Get('ids')
  getMany(@Query() filterObj: FilterObj) {
    return this.categorysService.getMany(JSON.parse(filterObj.filter));
  }

  @Get()
  getList(@Query() pageQuery: PageQuery) {
    const pageQueryDto = paramUtils.convertRawParamToObject(pageQuery);
    const res = this.categorysService.getList(pageQueryDto);
    return res;
  }

  @Get('all')
  findAll() {
    return this.categorysService.findAll();
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.categorysService.getOne(id);
  }

  @Post()
  create(@Body() createCateogoryDto: CreateCategoryDto) {
    return this.categorysService.create(createCateogoryDto);
  }

  @Put(':id')
  updateOne(
    @Param('id') id: string,
    @Body() categoryUpdateArgs: UpdateCategoryDto,
  ) {
    return this.categorysService.updateOne(id, categoryUpdateArgs);
  }

  @Delete(':id')
  deleteOne(@Param('id') id: string) {
    return this.categorysService.deleteOne(id);
  }

  @Delete()
  deleteMany(@Query() filterObj: FilterObj) {
    return this.categorysService.deleteMany(JSON.parse(filterObj.filter));
  }
}

```

`category.service.ts`

```tsx
import { Injectable, Logger, Res } from '@nestjs/common';
import Result from 'src/common/base/result';
import { PrismaService } from 'src/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { FilterIds, PageQueryDto } from 'src/types/query';
import paramUtils from 'src/utils/paramUtils';
import { CategoryDto } from 'src/types/category';

@Injectable()
export class CategorysService {
  async deleteMany(filterIds: FilterIds) {
    this.logger.log('ids = ', JSON.stringify(filterIds));
    const res = await this.prismaService.category.deleteMany({
      where: {
        id: {
          in: filterIds.id,
        },
      },
    });
    this.logger.log('res = ', res);
    return [];
  }
  async getOne(id: string) {
    this.logger.log('id = ', JSON.stringify(id));
    const category = await this.prismaService.category.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        parentId: true,
      },
    });
    const parentCategory = await this.prismaService.category.findUnique({
      where: { id: category.parentId },
    });
    const categoryDto: CategoryDto = {
      id: category.id,
      name: category.name,
      parentId: parentCategory.id,
      parentName: parentCategory.name,
    };
    this.logger.log('role = ', JSON.stringify(category));
    return categoryDto;
  }
  async getList(pageQueryDto: PageQueryDto) {
    this.logger.log('pageQueryDto = ', JSON.stringify(pageQueryDto));
    const whereArgs = paramUtils.constructWhereArgs(pageQueryDto.filter);
    const orderByArgs = paramUtils.constructOrderByArgs(pageQueryDto.sort);
    const count = await this.prismaService.category.count({ where: whereArgs });
    const categorys = await this.prismaService.category.findMany({
      skip: pageQueryDto.range.from,
      take: pageQueryDto.range.to - pageQueryDto.range.from,
      orderBy: orderByArgs,
      where: whereArgs,
      select: {
        id: true,
        name: true,
        parentId: true,
      },
    });
    const parentCategorys = await this.prismaService.category.findMany({
      where: { parentId: '0' },
    });
    const categoryMap = parentCategorys.reduce((map, obj) => {
      map.set(obj.id, obj.name);
      return map;
    }, new Map());
    const categoryDtos: CategoryDto[] = categorys.map((c) => ({
      id: c.id,
      name: c.name,
      parentId: c.parentId,
      parentName: categoryMap.get(c.parentId),
    }));
    this.logger.log('count = ', JSON.stringify(count));
    return { data: categoryDtos.filter((c) => c.id !== '0'), total: count };
  }

  async getMany(filterIds: FilterIds) {
    this.logger.log('ids = ', JSON.stringify(filterIds));
    const categorys = await this.prismaService.category.findMany({
      where: {
        id: {
          in: filterIds.id,
        },
      },
      select: {
        id: true,
        name: true,
        parentId: true,
      },
    });
    const parentCategorys = await this.prismaService.category.findMany({
      where: { parentId: '0' },
    });
    const categoryMap = parentCategorys.reduce((map, obj) => {
      map.set(obj.id, obj.name);
      return map;
    }, new Map());
    const categoryDtos: CategoryDto[] = categorys.map((c) => ({
      id: c.id,
      name: c.name,
      parentId: c.parentId,
      parentName: categoryMap.get(c.parentId),
    }));
    return categoryDtos.filter((c) => c.id !== '0');
  }

  async create(categoryCreateDto: CreateCategoryDto) {
    this.logger.log('categoryCreateDto = ', categoryCreateDto);
    const resCategory = await this.prismaService.category.create({
      data: categoryCreateDto,
    });
    this.logger.log('resCategory.id = ', resCategory.id);
    return resCategory;
  }

  async findAll() {
    const categorys = await this.prismaService.category.findMany({
      select: {
        id: true,
        name: true,
        parentId: true,
      },
      orderBy: [
        {
          parentId: 'asc',
        },
        {
          id: 'asc',
        },
      ],
    });
    const parentCategorys = await this.prismaService.category.findMany({
      where: { parentId: '0' },
    });
    const categoryMap = parentCategorys.reduce((map, obj) => {
      map.set(obj.id, obj.name);
      return map;
    }, new Map());
    const categoryDtos: CategoryDto[] = categorys.map((c) => ({
      id: c.id,
      name: c.name,
      parentId: c.parentId,
      parentName: categoryMap.get(c.parentId),
    }));
    return Result.ok(categoryDtos, null, '类别列表查询成功');
  }

  async findOne(id: string) {
    const res = await this.prismaService.category.findFirst({
      where: { id },
    });
    return Result.ok(res, null, '类别查询成功');
  }

  async updateOne(id: string, updateCategoryDto: UpdateCategoryDto) {
    delete updateCategoryDto.parentName;
    this.logger.log('updateCategoryDto =', updateCategoryDto);
    const res = await this.prismaService.category.update({
      data: updateCategoryDto,
      where: { id },
    });
    return res;
  }

  async deleteOne(id: string) {
    this.logger.log('id = ', id);
    const count = await this.prismaService.product.count({ where: { id } });
    if (count > 0) {
      throw new Error('分类被商品引用，无法删除');
    }
    const res = await this.prismaService.category.delete({
      where: { id },
    });
    this.logger.log('res = ', JSON.stringify(res));
    return res;
  }

  private readonly logger: Logger = new Logger(CategorysService.name);
  constructor(private prismaService: PrismaService) {}
}

```

## 十五、文件上传

### 1. bodyParser解除size limit

`main.ts`

```tsx
import type { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
  });

  app.useBodyParser('json', { limit: '10mb' });
  app.useBodyParser('urlencoded', { limit: '10mb' });

  await app.listen(8000);
}
bootstrap();

```

### 2. 文件处理工具类

`fileUtils.ts`

```tsx
import * as fs from 'fs';
import * as path from 'path';

const transferToDisk = async (base64Data: string, filepath: string) => {
  const buffer = Buffer.from(
    base64Data
      .replace(
        /^\s*data:([a-z]+\/[a-z0-9-+.]+(;[a-z-]+=[a-z0-9-]+)?)?(;base64)?,/,
        ' ',
      )
      .trim(),
    'base64',
  );
  fs.writeFileSync(filepath, buffer);
};

const removeFileOnDisk = async (filepath: string) => {
  console.log(`remove ${filepath}`);
  fs.rm(filepath, () => console.log('remove successfully'));
};

export default {
  transferToDisk,
  removeFileOnDisk,
};
```

### 3. minIo

#### upload util 

`minioUitls.ts`

```tsx
import Minio from 'minio';
import * as Fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { minioBucket } from 'src/common/constants/minio.constants';

const uploadToMinio = async (
  filename: string,
  path: string,
  s3Client: Minio.Client,
) => {
  const metaData = {
    'Content-Type': 'image/jpeg',
    'X-Amz-Meta-Testing': 1234,
    example: 5678,
  };

  // Upload a stream
  const file = filename;
  const fileStream = Fs.createReadStream(file);
  const fileStat = Fs.stat(file, function (e, stat) {
    if (e) {
      return console.log(e);
    }
    s3Client.putObject(
      minioBucket,
      `${path}/${filename}`,
      fileStream,
      stat.size,
      metaData,
      function (e) {
        if (e) {
          return console.log(e);
        }
        console.log('Successfully uploaded the stream');
      },
    );
  });
};

export default { uploadToMinio };

```

#### **minIoClient DI**

`products.module.ts`

```tsx
import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PrismaService } from 'src/prisma.service';
import * as Minio from 'minio';
import {minioConstants} from 'src/common/constants/minio.constants';
const MinioClient = Minio.Client;

const minioProvider = {
  provide: 'MINIO_CLIENT',
  useFactory: () => {
    return new MinioClient({ ...minioConstants });
  },
};

@Module({
  imports: [],
  controllers: [ProductsController],
  providers: [ProductsService, PrismaService, minioProvider],
})
export class ProductsModule {}

```

`product.service.ts`

```tsx
  constructor(
    @Inject('MINIO_CLIENT') private readonly minioClient: Minio.Client,
  ) {}
```

#### upload process

```tsx
  async update(id: string, updateProductDto: UpdateProductDto) {
    this.uploadFile(updateProductDto);
    const res = await this.prismaService.product.update({
      data: updateProductDto,
      where: { id },
    });
    return { id, data: res };
  }

  private uploadFile(updateProductDto: UpdateProductDto) {
    const { endPoint, port } = minioConstants;
    const date = new Date();
    const path = `${date.getMonth() + 1}/${date.getDate()}`;
    const picUrlArr = updateProductDto.pictures.map((pic) => {
      const { src: base64Data, title: originFilename } = pic;
      if (base64Data.startsWith('http')) {
        return base64Data;
      }
      const filename = originFilename + '.jpg';
      const filepath = './' + filename;
      fileUtils
        .transferToDisk(base64Data, filepath)
        .then(() => {
          minioUtils.uploadToMinio(filename, path, this.minioClient);
        })
        .then(() => fileUtils.removeFileOnDisk(filepath));
      return `http://${endPoint}:${port}/${minioBucket}/${path}/${filename}`;
    });
    updateProductDto.imgs = picUrlArr;
    delete updateProductDto.pictures;
  }
```

## 十六、使用httpmodule发请求

参考官方demo和官方文档

# 总结

## 前台

1. 嵌套sidebar得付费，自己学学怎么做吧
2. 没有搜索和过滤功能
3. 没有个人展示页
4. 没有接入 `data visualization ` 组件
5. 缺少面包屑
6. 没有自定义登录页
7. 缺少鉴权

## 后台

1. 先看前台规范，再开始编写api
2. 以后处理文件基本使用minio.
3. ssl协议
4. 缺少鉴权
5. 没有学会写裸sql
6. 没有自定义数据转换,导致必须用`+str`的形式
