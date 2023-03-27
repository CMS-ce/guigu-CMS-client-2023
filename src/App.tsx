// in src/App.tsx
import { Admin, Resource, ListGuesser, EditGuesser } from 'react-admin'
import jsonServerProvider from 'ra-data-json-server'
import { UserCreate, UserEdit, UserList } from './views/users'
import { PostCreate, PostEdit, PostList } from './views/posts'
import PostIcon from '@mui/icons-material/Book'
import UserIcon from '@mui/icons-material/Group'
import { Dashboard } from './views/dashboard'
import { authProvider } from './auth/authProvider'
import MyLoginPage from './views/login/MyLoginPage'
import { dataProvider, myDataProvider } from './api/dataProvider'
import { RoleCreate, RoleEdit, RoleList } from './views/roles'
import { ProductCreate, ProductEdit, ProductList } from './views/products'
import { CategoryCreate, CategoryEdit, CategoryList } from './views/categorys'

// const dataProvider = jsonServerProvider('https://jsonplaceholder.typicode.com')

const App = () => (
    <Admin
        authProvider={authProvider}
        dataProvider={myDataProvider}
        dashboard={Dashboard}
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
