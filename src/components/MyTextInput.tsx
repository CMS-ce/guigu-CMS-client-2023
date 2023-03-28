import { FormControl, TextField } from '@mui/material'
import React from 'react'
import { useInput } from 'react-admin'
import { TextInput } from 'react-admin'

export const MyTextInput = (props) => {
    const { field } = useInput(props)
    return (
        <FormControl sx={{ marginBottom: 4 }}>
            <TextField
                value={field.value}
                onChange={field.onChange}
                id='filled-basic'
                label='商品状态'
                variant='filled'
            />
            {/* // <input
            //     value={field.value}
            //     onChange={field.onChange}
            // /> */}
        </FormControl>
    )
}
