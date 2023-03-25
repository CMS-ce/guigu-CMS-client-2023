import {
    Create,
    Datagrid,
    Edit,
    EditButton,
    EmailField,
    List,
    ReferenceField,
    ReferenceInput,
    SimpleForm,
    TextField,
    TextInput,
    useRecordContext,
} from 'react-admin'
import MyUrlField from '../../components/MyUrlField'

export const UserList = () => (
    <List>
        <Datagrid rowClick='edit'>
            {/* <TextField source='id'  /> */}
            <TextField source='username' label='用户名' />
            {/* <EmailField source='email' /> */}
            <TextField source='phone' label='电话号码' />
            <TextField source='email' label='邮箱' />
            {/* <MyUrlField source='website' /> */}
            <TextField source='createAt' label='注册时间' />
            {/* <TextField source='role.id' /> */}
            <ReferenceField label='角色' source='roleId' reference='roles' />
            <EditButton />
        </Datagrid>
    </List>
)

const UserTitle = () => {
    const record = useRecordContext()
    return <span>User {record ? `"${record.username}"` : ''}</span>
}

export const UserEdit = () => (
    <Edit title={<UserTitle />}>
        <SimpleForm>
            {/* <TextInput source='id' disabled /> */}
            <TextInput source='username' label='用户名' />
            <TextInput source='phone' label='手机号' />
            <TextInput source='email' label='邮箱' />
            <ReferenceInput label='角色' source='roleId' reference='roles' />
        </SimpleForm>
    </Edit>
)

export const UserCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput source='username' label='用户名' />
            <TextInput source='password' label='密码' />
            <TextInput source='phone' label='手机号' />
            <TextInput source='email' label='邮箱' />
            <ReferenceInput label='角色' source='roleId' reference='roles' />
        </SimpleForm>
    </Create>
)
