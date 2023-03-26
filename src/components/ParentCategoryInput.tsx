// in SexInput.js
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { useInput } from 'react-admin'
import { useAppSelector } from '@/store/hook'
import { selectCategoryList } from '@/store/services/categorySlice'
import { FormControl, InputLabel } from '@mui/material'

const ParentCategoryInput = (props) => {
    const categoryList = useAppSelector(selectCategoryList).filter(
        (c) => c.parentId === '0'
    )

    const {
        field,
        fieldState: { isTouched, invalid, error },
        formState: { isSubmitted },
    } = useInput(props)

    return (
        <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel htmlFor='grouped-parentCategory-select'>
                父级分类
            </InputLabel>
            <Select id='grouped-parentCategory-select' {...field}>
                {(categoryList ?? []).map((category) => {
                    return category.id !== '0' ? (
                        <MenuItem
                            sx={{
                                fontWeight: 'bolder',
                            }}
                            key={category.id}
                            value={category.id}
                        >
                            {category.name}
                        </MenuItem>
                    ) : (
                        <MenuItem
                            sx={{
                                bgcolor: 'blueviolet',
                                fontWeight: 'bolder',
                            }}
                            key={category.id}
                            value={category.id}
                        >
                            {category.name}
                        </MenuItem>
                    )
                })}
            </Select>
        </FormControl>
    )
}
export default ParentCategoryInput
