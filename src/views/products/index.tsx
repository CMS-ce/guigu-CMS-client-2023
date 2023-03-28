// in src/BookList.jsx
import FullTextEditor from '@/components/FullTextEditor'
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
    NumberInput,
    NumberField,
    ImageField,
    ImageInput,
} from 'react-admin'
import { RichTextInput } from 'ra-input-rich-text'
import MyRichTextInput from '@/components/MyRichTextInput'
import { MyTextInput } from '@/components/MyTextInput'
import AllCategorySelect from '@/components/AllCategorySelect'
import { useCategorys } from '@/hooks/useCategorys'
import MyStatusField from '@/components/MyStatusField'
import MyStatusInput from '@/components/MyStatusInput'
import { Button } from '@mui/material'

export const ProductList = () => {
    return (
        <List resource='products'>
            <Datagrid rowClick='edit'>
                {/* <TextField source='id' /> */}
                <TextField source='name' label='商品名称' />
                <TextField source='desc' label='商品描述' />
                <NumberField source='price' label='价格' />
                <MyStatusField source='status' />
                {/* <TextField source='status' label='状态' /> */}
                <ReferenceField
                    label='类别'
                    source='categoryId'
                    reference='categorys'
                />
                {/* <TextField source='categoryId' label='类别' /> */}
                {/* <TextField source='detail' /> */}
                {/* <EditButton /> */}
            </Datagrid>
        </List>
    )
}

const ProductTitle = () => {
    const record = useRecordContext()
    return <span>Product {record ? `"${record.name}"` : ''}</span>
}

export const ProductEdit = () => {
    useCategorys()

    return (
        <Edit title={<ProductTitle />}>
            <SimpleForm>
                <TextInput source='name' />
                <TextInput source='desc' />
                {/* <TextInput source='status' label='商品状态' /> */}
                {/* <MyTextInput source='status' label='商品状态' /> */}
                <MyStatusInput source='status' />
                <NumberInput source='price' label='价格'/>
                <ImageInput
                    source='pictures'
                    label='商品图片'
                    accept='image/*'
                    multiple
                >
                    <ImageField source='src' title='title' />
                </ImageInput>
                <AllCategorySelect
                    source='categoryId'
                    // format={(formValue) => formValue}
                    // parse={(inputValue) => inputValue}
                />
                {/* <ReferenceInput
                    label='类别'
                    source='categoryId'
                    reference='categorys'
                /> */}
                <MyRichTextInput source='detail' />
            </SimpleForm>
        </Edit>
    )
}

export const ProductCreate = () => {
    useCategorys()

    return (
        <Create>
            <SimpleForm>
                <TextInput source='name' label='商品名称' />
                <TextInput source='desc' label='商品描述' />
                {/* <TextInput source='status' label='商品状态' /> */}
                <MyStatusInput source='status' />
                <NumberInput source='price' defaultValue={100} label='价格'/>
                <ImageInput
                    source='pictures'
                    label={
                        <Button
                            variant='outlined'
                            size='small'
                            sx={{ minWidth: '100%' }}
                        >
                            商 品 图 片
                        </Button>
                    }
                    accept='image/*'
                    multiple
                >
                    <ImageField source='src' title='title' />
                </ImageInput>
                <AllCategorySelect source='categoryId' defaultValue={'0'} />
                {/* <ReferenceInput
                    label='类别'
                    source='categoryId'
                    reference='categorys'
                /> */}
                <MyRichTextInput source='detail' />
            </SimpleForm>
        </Create>
    )
}
