import { Category } from '@/types/category'
import request from '@/utils/request'

const reqCategorys = () => request.get<Category[]>('/categorys/all')
export default {
    reqCategorys,
}
