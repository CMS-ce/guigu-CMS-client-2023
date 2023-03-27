import React from 'react'
import { useInput } from 'react-admin'
import { TextInput } from 'react-admin'

export const MyTextInput = (props) => {
    const { field } = useInput(props)
    return (
        <input
            value={field.value}
            onChange={field.onChange}
        />
    )
}
