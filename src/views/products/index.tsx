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

export const ProductList = () => {
    return (
        <List resource='products'>
            <Datagrid rowClick='edit'>
                {/* <TextField source='id' /> */}
                <TextField source='name' label='商品名称' />
                <TextField source='price' label='商品描述' />
                <TextField source='desc' label='价格' />
                <TextField source='status' label='状态' />
                <ReferenceField
                    label='类别'
                    source='categoryId'
                    reference='categorys'
                />
                {/* <TextField source='categoryId' label='类别' /> */}
                {/* <TextField source='detail' /> */}
                <EditButton />
            </Datagrid>
        </List>
    )
}

const ProductTitle = () => {
    const record = useRecordContext()
    return <span>Product {record ? `"${record.name}"` : ''}</span>
}

export const ProductEdit = () => (
    <Edit title={<ProductTitle />}>
        <SimpleForm>
            <TextInput source='name' />
            <TextInput source='desc' />
            <TextInput source='price' type='number' />
            <ReferenceInput
                label='类别'
                source='categoryId'
                reference='categorys'
            />
            <TextInput source='detail' multiline rows={5} />
        </SimpleForm>
    </Edit>
)

export const ProductCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput source='name' />
            <TextInput source='desc' />
            <TextInput source='price' type='number' />
            <ReferenceInput
                label='类别'
                source='categoryId'
                reference='categorys'
            />
            <TextInput source='detail' multiline rows={5} />
        </SimpleForm>
    </Create>
)
