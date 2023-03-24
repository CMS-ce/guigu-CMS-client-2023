import {
    Datagrid,
    List,
    ReferenceField,
    TextField,
    EditButton,
    Create,
    useRecordContext,
} from 'react-admin'
import { Edit, ReferenceInput, SimpleForm, TextInput } from 'react-admin'

const postFilters = [
    <TextInput source='q' label='Search' alwaysOn />,
    <ReferenceInput source='userId' label='User' reference='users' />,
]

export const PostList = () => (
    <List filters={postFilters}>
        <Datagrid rowClick='edit'>
            <ReferenceField source='userId' reference='users' />
            <TextField source='id' />
            <TextField source='title' />
            <TextField source='body' />
            <EditButton />
        </Datagrid>
    </List>
)

const PostTitle = () => {
    const record = useRecordContext()
    return <span>Post {record ? `"${record.title}"` : ''}</span>
}

export const PostEdit = () => (
    <Edit title={<PostTitle />}>
        <SimpleForm>
            <TextInput source='id' disabled />
            <ReferenceInput source='userId' reference='users' />
            <TextInput source='title' />
            <TextInput source='body' multiline rows={5} />
        </SimpleForm>
    </Edit>
)

export const PostCreate = () => (
    <Create>
        <SimpleForm>
            <ReferenceInput source='userId' reference='users' />
            <TextInput source='title' />
            <TextInput source='body' multiline rows={5} />
        </SimpleForm>
    </Create>
)
