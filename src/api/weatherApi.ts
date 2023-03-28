import { Category } from '@/types/category'
import { Weather } from '@/types/weather'
import request from '@/utils/request'

const reqWeatherApi = () => request.get<Weather>('/weathers')
export default {
    reqWeatherApi,
}
