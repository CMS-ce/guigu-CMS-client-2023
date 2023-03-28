import { Product } from '@/types/product'
import request from '@/utils/request'

const reqUpdateStatus = (id: string, status: number) =>
    request.patch<Product>(`/products/${id}`, { id, status })
export default {
    reqUpdateStatus,
}
