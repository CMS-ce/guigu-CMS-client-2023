// in src/Dashboard.js
import weatherApi from '@/api/weatherApi'
import { Cast } from '@/types/weather'
import { Button } from '@mui/material'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { useEffect, useState } from 'react'
import { Title } from 'react-admin'
import dayjs from 'dayjs'
import { useDate } from '@/hooks/useDate'

const DashBoard = () => {
    const [weather, setWeather] = useState<Cast>()
    const [currentTime, isNight] = useDate()

    useEffect(() => {
        const reqWeather = async () => {
            const res = await weatherApi.reqWeatherApi()
            setWeather(res.data.data.forecasts[0].casts[0])
        }

        reqWeather()
    }, [])

    return (
        <Card>
            <Title title='Welcome to the administration' />
            <CardContent sx={{ m: 2 }}>
                <Button variant='text' color='primary' size='small'>
                    {currentTime}&nbsp;&nbsp;
                </Button>
                {!isNight ? (
                    <Button variant='text' color='secondary' size='small'>
                        {weather?.dayweather}&nbsp;&nbsp;
                        {weather?.daytemp_float}&nbsp;&nbsp;
                        {weather?.daywind}风
                    </Button>
                ) : (
                    <Button variant='text' color='secondary' size='small'>
                        {weather?.nightweather}&nbsp;&nbsp;
                        {weather?.nighttemp_float}&nbsp;&nbsp;
                        {weather?.nightwind}风
                    </Button>
                )}
            </CardContent>
            <CardContent>Lorem ipsum sic dolor amet...</CardContent>
        </Card>
    )
}

export default DashBoard
