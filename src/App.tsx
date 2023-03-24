// in src/App.tsx
import { Admin, Resource, ListGuesser, EditGuesser } from 'react-admin'
import jsonServerProvider from 'ra-data-json-server'
import { UserList } from './views/users'
import { PostCreate, PostEdit, PostList } from './views/posts'
import PostIcon from '@mui/icons-material/Book'
import UserIcon from '@mui/icons-material/Group'
import { Dashboard } from './views/dashboard'
import { authProvider } from './auth/authProvider'
import MyLoginPage from './views/login/MyLoginPage'

const dataProvider = jsonServerProvider('https://jsonplaceholder.typicode.com')

const App = () => (
    <Admin
        authProvider={authProvider}
        dataProvider={dataProvider}
        dashboard={Dashboard}
    >
        <Resource
            name='users'
            list={UserList}
            recordRepresentation='name'
            icon={UserIcon}
        />
        <Resource
            name='posts'
            list={PostList}
            edit={PostEdit}
            create={PostCreate}
            icon={PostIcon}
        />
    </Admin>
)

export default App
