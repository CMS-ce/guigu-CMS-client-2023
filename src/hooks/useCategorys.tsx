import categoryApi from '@/api/categoryApi'
import { useAppDispatch } from '@/store/hook'
import { initCategoryList } from '@/store/services/categorySlice'
import { useEffect, useState } from 'react'

function useCategorys() {
    const [categorys, setCategorys] = useState([])
    const dispatch = useAppDispatch()

    const reqCategorys = async () => {
        const res = await categoryApi.reqCategorys()
        if (res.status === 200) {
            const { data: tmpCategorys } = res.data
            setCategorys(categorys)
            dispatch(initCategoryList(tmpCategorys))
        }
    }

    useEffect(() => {
        reqCategorys()
        return () => {}
    }, [])

    return categorys
}

export { useCategorys }
