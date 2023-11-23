import React, { useState, useEffect, useRef } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import moment from 'moment'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import './cal.css'
import { useTheme } from '../context/themeContext'
import { View } from 'react-calendar/dist/cjs/shared/types'

type ValuePiece = Date | null
type Value = ValuePiece | [ValuePiece, ValuePiece]

interface YourEmotionDataItem {
  user_id: string
  date: string
  diary_emotion: string | { [key: string]: string }
}

const ModalCalendar = ({ isOpen, closeModal }: any) => {
  const { theme } = useTheme()
  const [emotionData, setEmotionData] = useState<YourEmotionDataItem[]>([])
  const [value, onChange] = useState<Value>(new Date())
  const router = useRouter()

  const fetchDataFromDatabase = async () => {
    try {
      const response = await axios.get<{ result: YourEmotionDataItem[] }>(
        '/api/cal',
      )
      const { result } = response.data
      const emotionDataArray = result || []
      setEmotionData(
        emotionDataArray.map((item: any) => ({
          ...item,
          date: moment(item.diary_userDate).format('YYYY-MM-DD'),
          diary_emotion:
            typeof item.diary_emotion === 'string'
              ? JSON.parse(item.diary_emotion)
              : item.diary_emotion,
        })),
      )
    } catch (error) {
      console.error('데이터베이스에서 데이터를 가져오는 중 오류 발생:', error)
    }
  }

  useEffect(() => {
    fetchDataFromDatabase()
  }, [])

  const getDestinationUrl = (formattedDate: string) => {
    const matchingEmotion = emotionData.find((x) => x.date === formattedDate)
    return matchingEmotion
      ? `/diary?date=${formattedDate}`
      : `/write?date=${formattedDate}`
  }

  const dayClick = (
    value: Date,
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.stopPropagation();
    const formattedDate = moment(value).format('YYYY-MM-DD');
    const destinationUrl = getDestinationUrl(formattedDate);
    router.push(destinationUrl);
  
    // Call closeModal to close the modal calendar
    closeModal();
  
    // Optionally, you can still reset the calendar's value state if needed
    onChange(null); // or any other value you want to reset to
  }

  const handleMarking = (
    date: Date,
    view: 'month' | 'year' | 'decade' | 'century',
  ) => {
    // "century" 값을 포함한 다른 view 값에 대한 처리를 제외합니다.
    if (view !== 'month') {
      return null
    }

    const formattedDate = moment(date).format('YYYY-MM-DD')
    const matchingEmotion = emotionData.find((x) => x.date === formattedDate)

    if (matchingEmotion) {
      const emotionValue = matchingEmotion.diary_emotion
      if (typeof emotionValue === 'object') {
        const key = Object.keys(emotionValue)[0]
        const emotionImages: { [key: string]: string } = {
          행복: './happy.png',
          분노: './angry.png',
          우울: './depress.png',
          슬픔: './sad.png',
          불안: './nervous.png',
          중립: './nothinking.png',
          기쁨: './joy.png',
          사랑: './3_love.png',
        }

        if (emotionImages[key]) {
          return (
            <div className="dot" key={formattedDate}>
              <img src={emotionImages[key]} alt={`${formattedDate}의 이미지`} />
            </div>
          )
        }
      }
    }

    return null
  }

  // useRef를 사용하여 달력 외부를 클릭했는지 확인할 ref 생성
  const calendarRef = useRef<HTMLDivElement | null>(null)

  // 달력 외부 클릭 시 달력을 닫도록 처리하는 함수
  const handleOutsideClick = (event: MouseEvent) => {
    if (
      calendarRef.current &&
      !calendarRef.current.contains(event.target as Node) &&
      value
    ) {
      console.log('달력 외부 클릭됨')
      onChange(null)
    }
  }

  useEffect(() => {
    fetchDataFromDatabase()
  }, [])

  useEffect(() => {
    if (value) {
      document.addEventListener(
        'mousedown',
        handleOutsideClick as EventListener,
      )
      return () => {
        document.removeEventListener(
          'mousedown',
          handleOutsideClick as EventListener,
        )
      }
    }
  }, [value])

  const closeCalendar = () => {
    onChange(null) // 달력 상태를 null로 설정하여 달력을 닫습니다.
  }

  return (
    <div onClick={closeModal}>
      <div
        className={`absolute w-full h-full top-20 left-0 flex justify-center items-center`}
        ref={calendarRef}
        onClick={(e) => {
          closeModal
        }}
      >
        <div
          className="calendar-container"
          onClick={(e) => {
            e.stopPropagation()
            closeModal
          }}
        >
          {' '}
          <button className="close-button" onClick={closeModal}>
            X
          </button>
        </div>
        <Calendar
          onChange={onChange}
          value={value}
          locale="ko"
          calendarType="gregory"
          formatDay={(locale, date) => moment(date).format('DD')}
          onClickDay={(value, e) => dayClick(value, e)}
          showNeighboringMonth={false}
          tileContent={({ date, view }) => handleMarking(date, view)}
          onClickDecade={(_, e) => e.stopPropagation()}
          onClickMonth={(_, e) => e.stopPropagation()}
          onClickWeekNumber={(_, __, e) => e.stopPropagation()}
          onClickYear={(_, e) => e.stopPropagation()}
        />
      </div>
    </div>
  )
}

export default ModalCalendar
