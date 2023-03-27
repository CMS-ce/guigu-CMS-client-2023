import { Button, FormControl, InputLabel } from '@mui/material'
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import React, { useEffect, useRef, useState } from 'react'
import { useInput } from 'react-admin'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

// const MyRichTextInput = ({ source, record = {}, label }) => {
//     const quillRef = useRef<ReactQuill>(null)
//     const [text, setText] = useState('')

//     const handleChange = (value) => {
//         setText(value)
//     }

//     const modules = {
//         toolbar: [
//             [{ header: [1, 2, false] }],
//             ['bold', 'italic', 'underline', 'strike', 'blockquote'],
//             [
//                 { list: 'ordered' },
//                 { list: 'bullet' },
//                 { indent: '-1' },
//                 { indent: '+1' },
//             ],
//             ['link', 'image'],
//             ['clean'],
//         ],
//     }

//     const formats = [
//         'header',
//         'bold',
//         'italic',
//         'underline',
//         'strike',
//         'blockquote',
//         'list',
//         'bullet',
//         'indent',
//         'link',
//         'image',
//     ]

//     const handleClickHeader = () => {
//         quillRef.current?.editor?.focus()
//     }

//     useEffect(() => {
//         console.log(source)
//         console.log(label)

//         return () => {}
//     }, [])

//     return (
//         <FormControl sx={{ m: 1, minWidth: 300, display: 'flex' }}>
//             <Button
//                 variant='outlined'
//                 color='primary'
//                 size='small'
//                 onClick={handleClickHeader}
//             >
//                 商品详情
//             </Button>
//             <ReactQuill
//                 ref={quillRef}
//                 value={text}
//                 onChange={handleChange}
//                 modules={modules}
//                 formats={formats}
//                 placeholder='Write something amazing...'
//             />
//         </FormControl>
//     )
// }

// export default MyRichTextInput

const MyRichTextInput = (props) => {
    const quillRef = useRef<ReactQuill>(null)
    const { field } = useInput(props)
    const [showEmojiPicker, setShowEmojiPicker] = useState(false)

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

    const handleClickHeader = () => {
        quillRef.current?.editor?.focus()
    }

    const handleEmojiButtonClick = (e) => {
        e.preventDefault()
        setShowEmojiPicker(!showEmojiPicker)
    }

    useEffect(() => {
        return () => {}
    }, [])

    return (
        <FormControl sx={{ m: 1, minWidth: 300, display: 'flex' }}>
            <Button
                variant='outlined'
                color='primary'
                size='small'
                onClick={handleClickHeader}
            >
                商品详情
            </Button>
            <ReactQuill
                value={field.value}
                onChange={field.onChange}
                ref={quillRef}
                modules={modules}
                formats={formats}
                style={{ height: 200, marginBottom: 50 }}
                placeholder='Write something amazing...'
            />
            {showEmojiPicker && (
                <Picker
                    data={data}
                    onEmojiSelect={(data) => {
                        quillRef.current
                            ?.getEditor()
                            .updateContents([{ insert: data.native }])
                        console.log(
                            quillRef.current?.getEditor().getContents().ops
                        )
                        // quillRef.current
                        //     ?.getEditor()
                        //     .setContents([{ insert: `${field.value}`}])
                        // console.log(
                        //     quillRef.current
                        //         ?.getEditor()
                        //         .root.innerHTML.concat(data.native)
                        // )
                    }}
                />
            )}
            <button onClick={handleEmojiButtonClick}>😀</button>
        </FormControl>
    )
}

export default MyRichTextInput
