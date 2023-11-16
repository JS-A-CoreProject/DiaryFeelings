// Page.tsx
'use client'
import React, { useState } from 'react'
import Modal from 'react-modal'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import moment from 'moment'
import { useRouter } from 'next/navigation'
import './test.css'

type ValuePiece = Date | null
type Value = ValuePiece | [ValuePiece, ValuePiece]

const ModalCalendar: React.FC<{ isOpen: boolean; closeModal: () => void }> = ({
  isOpen,
  closeModal,
}) => {
  const [value, onChange] = useState<Value>(new Date())
  const mark = [
    '2023-11-24',
    '2023-12-18',
    '2024-01-03',
    '2024-02-04',
    '2024-04-14',
    '2024-07-20',
    '2024-07-28',
  ]
  const router = useRouter()

  const dayClick = (value: Date, event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const formattedDate = moment(value).format('YYYY-MM-DD');
    router.push(`/write?date=${formattedDate}`);
    closeModal(); // 이동 후 모달을 닫습니다.
  }


  const handleMarking = (date: Date, view: any) => {
    const imagesByDate: { [key: string]: string } = {
      '2023-11-15': './happy.png',
      '2023-11-16': './angry.png',
      '2023-11-17': './depress.png',
      '2023-11-25': './sad.png',
      '2023-12-18': './sad.png',
      '2024-01-03': './sad.png',
      // 필요에 따라 더 많은 날짜-이미지 매핑 추가
    }

    const html = []
    const formattedDate = moment(date).format('YYYY-MM-DD')

    if (imagesByDate[formattedDate]) {
      html.push(
        <div className="dot" key={formattedDate}>
          <img
            src={imagesByDate[formattedDate]}
            alt={`${formattedDate}의 이미지`}
            onClick={() => handleImageClick(formattedDate)}
          />
        </div>,
      )
    }

    return <div className="dot-img">{html}</div>
  }
  const handleImageClick = (date: string) => {
    // 만약 오늘 날짜라면 write 페이지로 이동
    if (date === moment().format('YYYY-MM-DD')) {
      router.push(`/write?date=${date}`)
     
    }
    // 오늘 날짜가 아니라면 추가적인 처리가 필요하다면 여기에 추가
  }
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      contentLabel="Calendar Modal"
    >
      <div>
        <Calendar
          onChange={onChange}
          value={value}
          locale="ko"
          calendarType="gregory"
          formatDay={(locale, date) => moment(date).format('DD')}
          onClickDay={(value, event) => dayClick(value, event)}
          showNeighboringMonth={false}
          tileContent={({ date, view }) => handleMarking(date, view)}
        />
      </div>

      <button
        className="text-2xl p-4"
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
        }}
        onClick={closeModal}
      >
        x
      </button>
    </Modal>
  )
}

const Page: React.FC = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false)

  const openModal = () => {
    setModalIsOpen(true)
  }

  const closeModal = () => {
    setModalIsOpen(false)
  }

  return (
    <div>
      <button className="text-2xl p-4" onClick={openModal}>
        달력 열기
      </button>

      <ModalCalendar isOpen={modalIsOpen} closeModal={closeModal} />
    </div>
  )
}

export default Page
