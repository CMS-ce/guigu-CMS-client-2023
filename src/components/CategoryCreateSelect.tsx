// in SexInput.js
import Select, { SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { useAppSelector } from '@/store/hook'
import { selectCategoryList } from '@/store/services/categorySlice'
import { FormControl, InputLabel } from '@mui/material'
import { useState } from 'react'
import { useInput } from 'react-admin'

const CategoryCreateSelect = (props) => {
    const categoryList = useAppSelector(selectCategoryList).filter(
        (c) => c.parentId === '0'
    )
    const {
        field,
        fieldState: { isTouched, invalid, error },
        formState: { isSubmitted },
    } = useInput(props)

    return (
        <FormControl sx={{ m: 1, minWidth: 300 }}>
            <InputLabel htmlFor='grouped-parentCategory-select'>
                父级分类
            </InputLabel>
            <Select
                required
                id='grouped-parentCategory-select'
                // value={selectValue}
                // onChange={(e: SelectChangeEvent<string>) =>
                //     setSelectValue(e.target.value)
                // }
                {...field}
            >
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
                                fontWeight: 'bolder',
                                color: 'blueviolet',
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
export default CategoryCreateSelect
