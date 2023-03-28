import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs'

// const formattedDate = dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss');
// console.log(formattedDate);

function useDate() {
    const [date, setDate] = useState(
        dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss')
    )
    const [isNight, setIsNight] = useState<boolean>(false)
    let intervalId: number

    useEffect(() => {
        intervalId = setInterval(() => {
            const date = new Date()
            setDate(dayjs(date).format('YYYY-MM-DD HH:mm:ss  A'))
            if (date.getHours() > 6 && date.getHours() <= 18) {
                setIsNight(true)
            }
        }, 1000)

        return () => {
            clearInterval(intervalId)
        }
    }, [])

    return [date, isNight]
}

export { useDate }
