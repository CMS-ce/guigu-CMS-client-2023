// in SexInput.js
import Select, { SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { useAppSelector } from '@/store/hook'
import { selectCategoryList } from '@/store/services/categorySlice'
import { FormControl, InputLabel } from '@mui/material'
import { useEffect, useState } from 'react'
import { useInput } from 'react-admin'

const AllCategorySelect = (props) => {
    const categoryList = useAppSelector(selectCategoryList)

    const {
        field,
        fieldState: { isTouched, invalid, error },
        formState: { isSubmitted },
    } = useInput(props)

    useEffect(() => {
        // console.log(field)
        return () => {}
    }, [])

    return (
        <FormControl sx={{ m: 1, minWidth: 300 }}>
            <InputLabel id='grouped-parentCategory-select'>父级分类</InputLabel>
            <Select
                labelId='grouped-parentCategory-select'
                required
                id='grouped-parentCategory-select'
                // value={selectValue}
                // onChange={(e: SelectChangeEvent<string>) =>
                //     setSelectValue(e.target.value)
                // }
                {...field}
            >
                {(categoryList ?? []).map((category) => {
                    return category.parentId === '0' ? (
                        <MenuItem
                            sx={{
                                fontWeight: 'bolder',
                                color: 'blue',
                            }}
                            key={category.id}
                            value={category.id}
                        >
                            {category.name}
                        </MenuItem>
                    ) : (
                        <MenuItem
                            sx={{
                                fontWeight: 'lighter',
                            }}
                            key={category.id}
                            value={category.id}
                        >
                            {`${category.parentName} / ${category.name}`}
                        </MenuItem>
                    )
                })}
            </Select>
        </FormControl>
    )
}
export default AllCategorySelect
