// in SexInput.js
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { useInput } from 'react-admin'
import { Button, FormControl, InputLabel } from '@mui/material'

const MyStatusInput = (props) => {
    const {
        field,
        fieldState: { isTouched, invalid, error },
        formState: { isSubmitted },
    } = useInput(props)

    return (
        <FormControl sx={{ m: 1, minWidth: 250, marginBottom: 4 }}>
            {/* <InputLabel htmlFor='grouped-product-status-select'>
                商品状态
            </InputLabel> */}
            <Button variant='outlined' size='small'>
                商品状态
            </Button>
            <Select
                id='grouped-product-status-select'
                {...field}
                sx={{ height: 40 }}
            >
                <MenuItem sx={{ fontWeight: 'bold' }} key={1} value={1}>
                    上架
                </MenuItem>
                <MenuItem sx={{ fontWeight: 'bold' }} key={2} value={2}>
                    下架
                </MenuItem>
            </Select>
        </FormControl>
    )
}
export default MyStatusInput
