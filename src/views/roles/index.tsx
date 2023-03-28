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
} from 'react-admin'

export const RoleList = () => {
    return (
        <List resource='roles'>
            <Datagrid rowClick='edit'>
                {/* <TextField source='id' /> */}
                <TextField source='name' label='角色名称' />
                <TextField source='createAt' label='创建时间' />
                <TextField source='authName' label='授权人' />
                <TextField source='authTime' label='授权时间' />
                <EditButton />
            </Datagrid>
        </List>
    )
}

const RoleTitle = () => {
    const record = useRecordContext()
    return <span>Role {record ? `"${record.name}"` : ''}</span>
}

export const RoleEdit = () => (
    <Edit title={<RoleTitle />}>
        <SimpleForm>
            <TextInput source='name' label='角色名称' />
            <TextInput source='menus' multiline rows={5} disabled />
        </SimpleForm>
    </Edit>
)

export const RoleCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput source='name' label='角色名称' />
            <TextInput source='menus' multiline rows={5} disabled />
        </SimpleForm>
    </Create>
)
