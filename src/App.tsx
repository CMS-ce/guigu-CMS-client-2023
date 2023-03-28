// in src/App.tsx
import { Admin, Resource } from 'react-admin'
import { UserCreate, UserEdit, UserList } from './views/users'
import UserIcon from '@mui/icons-material/Group'
import { authProvider } from './auth/authProvider'
import { myDataProvider } from './api/dataProvider'
import { RoleCreate, RoleEdit, RoleList } from './views/roles'
import { ProductCreate, ProductEdit, ProductList } from './views/products'
import { CategoryCreate, CategoryEdit, CategoryList } from './views/categorys'
import DashBoard from './views/dashboard'

// const dataProvider = jsonServerProvider('https://jsonplaceholder.typicode.com')

const App = () => (
    <Admin
        authProvider={authProvider}
        dataProvider={myDataProvider}
        dashboard={DashBoard}
    >
        <Resource
            name='users'
            list={UserList}
            edit={UserEdit}
            create={UserCreate}
            icon={UserIcon}
        />
        <Resource
            name='roles'
            recordRepresentation='name'
            list={RoleList}
            edit={RoleEdit}
            create={RoleCreate}
        />
        <Resource
            name='products'
            list={ProductList}
            edit={ProductEdit}
            create={ProductCreate}
        />
        <Resource
            name='categorys'
            recordRepresentation='name'
            list={CategoryList}
            edit={CategoryEdit}
            create={CategoryCreate}
        />
        {/* <Resource
            name='posts'
            list={PostList}
            edit={PostEdit}
            create={PostCreate}
            icon={PostIcon}
        /> */}
    </Admin>
)

export default App
