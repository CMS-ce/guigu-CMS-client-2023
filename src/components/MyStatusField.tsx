// in src/MyUrlField.tsx
import { Resource, useRecordContext } from 'react-admin'
import { Button, Link } from '@mui/material'
import React, { useState } from 'react'
import productApi from '@/api/productApi'
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
        // const res = await productApi.reqUpdateStatus(
        //     record['id'] as string,
        //     record[source]
        // )
        // if (res.status === 200) {
        //     record[source] = !record[source]
        // }
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
