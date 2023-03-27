import React, { useState } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { useInput } from 'react-admin'
import { FormControl } from '@mui/material'

const FullTextEditor = () => {
    const [text, setText] = useState('')
    const [showEmojiPicker, setShowEmojiPicker] = useState(false)

    //   const modules = {
    //     toolbar: [
    //       [{ 'header': [1, 2, false] }],
    //       ['bold', 'italic', 'underline','strike', 'blockquote'],
    //       [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
    //       ['link', 'image'],
    //       ['clean']
    //     ],
    //   };
    const modules = {
        toolbar: [
            [{ header: [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [
                { list: 'ordered' },
                { list: 'bullet' },
                { indent: '-1' },
                { indent: '+1' },
            ],
            ['link', 'image'],
            ['clean'],
            [{ emoji: true }],
        ],
    }

    const formats = [
        'header',
        'bold',
        'italic',
        'underline',
        'strike',
        'blockquote',
        'list',
        'bullet',
        'indent',
        'link',
        'image',
    ]

    const handleEmojiButtonClick = () => {
        setShowEmojiPicker(!showEmojiPicker)
    }

    return (
        <FormControl sx={{ m: 1, minWidth: 300 }}>
            <ReactQuill
                value={text}
                onChange={setText}
                // value={value}
                // onChange={onChange}
                modules={modules}
                formats={formats}
                style={{ height: '300px' }}
                placeholder='Write something amazing...'
            />
            {showEmojiPicker && (
                <Picker
                    data={data}
                    onEmojiSelect={(data) => setText(text + data.native)}
                />
            )}
            <button onClick={handleEmojiButtonClick}>😀</button>
        </FormControl>
    )
}

export default FullTextEditor
