// in src/BookList.jsx
import {
    List,
    Datagrid,
    TextField,
    EditButton,
    Create,
    Edit,
    ReferenceInput,
    SimpleForm,
    TextInput,
    useRecordContext,
    ReferenceField,
} from 'react-admin'
import { useParams } from 'react-router-dom'

export const CategoryList = () => {
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

export const CategoryEdit = () => (
    <Edit title={<CategoryTitle />}>
        <SimpleForm>
            <TextInput source='parentName' label='父级分类' disabled />
            <TextInput source='name' />
        </SimpleForm>
    </Edit>
)

export const CategoryCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput source='parentName' label='父级分类' disabled />
            <TextInput source='name' label='分类名称' />
        </SimpleForm>
    </Create>
)
