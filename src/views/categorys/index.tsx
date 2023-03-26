// in src/BookList.jsx
import categoryApi from '@/api/categoryApi'
import CategoryCreateSelect from '@/components/CategoryCreateSelect'
import ParentCategoryInput from '@/components/ParentCategoryInput'
import { useCategorys } from '@/hooks/useCategorys'
import { useCounter } from '@/hooks/useCounter'
import { useAppDispatch, useAppSelector } from '@/store/hook'
import {
    initCategoryList,
    selectCategoryList,
} from '@/store/services/categorySlice'
import { useEffect } from 'react'
import {
    List,
    Datagrid,
    TextField,
    EditButton,
    Create,
    Edit,
    SimpleForm,
    TextInput,
    useRecordContext,
} from 'react-admin'

export const CategoryList = () => {
    const dispatch = useAppDispatch()

    const reqCategorys = async () => {
        const res = await categoryApi.reqCategorys()
        if (res.status === 200) {
            const { data: categorys } = res.data

            dispatch(initCategoryList(categorys))
        }
    }

    useEffect(() => {
        reqCategorys()
        return () => {}
    }, [])

    return (
        <List resource='categorys'>
            <Datagrid rowClick='edit'>
                <TextField source='name' label='分类名称' />
                <TextField source='parentName' label='父级分类' />
                <EditButton />
            </Datagrid>
        </List>
    )
}

const CategoryTitle = () => {
    const record = useRecordContext()
    return <span>Category {record ? `"${record.name}"` : ''}</span>
}

export const CategoryEdit = () => {
    useCategorys()

    return (
        <Edit title={<CategoryTitle />}>
            <SimpleForm>
                <TextInput source='name' />
                <ParentCategoryInput
                    source='parentId'
                    format={(formValue) => formValue}
                    parse={(inputValue) => inputValue}
                />
            </SimpleForm>
        </Edit>
    )
}

export const CategoryCreate = () => {
    useCategorys()

    return (
        <Create>
            <SimpleForm>
                <TextInput source='name' label='分类名称' required />
                <CategoryCreateSelect source='parentId' defaultValue={'0'} />
            </SimpleForm>
        </Create>
    )
}
