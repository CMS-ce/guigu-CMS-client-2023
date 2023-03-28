// in src/MyUrlField.tsx
import { useRecordContext } from 'react-admin'
import { Button } from '@mui/material'
import React, { useState } from 'react'
import { myDataProvider } from '@/api/dataProvider'

type MyStatusFieldProps = {
    source: string
}

const MyStatusField = ({ source }: MyStatusFieldProps) => {
    const [flag, setFlag] = useState(1)
    const record = useRecordContext()

    const handleButton = async (e: React.MouseEvent) => {
        e.stopPropagation()
        myDataProvider.updateStatus('products', {
            id: record.id,
            data: {
                id: record.id,
                status: record[source] === 1 ? 2 : 1,
            },
            previousData: {
                id: record.id,
                status: record[source],
            },
        })
        setFlag(flag === 1 ? 2 : 1)
       
    }

    return record ? (
        <>
            {record[source] === flag ? (
                <Button
                    variant='contained'
                    color='primary'
                    onClick={handleButton}
                >
                    上 架
                </Button>
            ) : (
                <Button
                    variant='outlined'
                    color='secondary'
                    onClick={handleButton}
                >
                    下 架
                </Button>
            )}
        </>
    ) : null
}

export default MyStatusField
