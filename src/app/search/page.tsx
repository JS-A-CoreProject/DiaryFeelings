'use client'

import React, { ChangeEvent, useEffect, forwardRef, useState } from 'react'
import axios from 'axios'
import { IDiary } from '../types/type'
import { useSearchParams } from 'next/navigation'
import DatePicker from 'react-datepicker'
import { ko } from 'date-fns/esm/locale'
import DiaryLayout from './_component/DiaryLayout'
import Pagination from '../diary/_components/Pagination'
import { useRecoilState } from 'recoil'
import { userInfo } from '@/app/lib/atoms/atom'

const Search = () => {
  const params = useSearchParams()
  const curDate = new Date()
  curDate.setFullYear(curDate.getFullYear() - 1)
  const [startDate, setStartDate] = useState<Date>(curDate)
  const [endDate, setEndDate] = useState<Date>(new Date())
  const [user, setUser] = useRecoilState(userInfo)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(6)
  const [view, setView] = useState<IDiary[]>([])
  const [search, setSearch] = useState(false)
  const curPage = params.get('page') as string

  const id = params.get('userId') as string
  const keyword = params.get('keyword') as string

  useEffect(() => {
    setPage((prev) => Number(curPage))
  }, [curPage])

  const getDiary = async () => {
    const result = await axios.get(
      `/api/search?userId=${id}&keyword=${keyword}`,
    )
    const data = result.data
    console.log('data', data)
    setTotal((prev) => data.total)
    setView((prev) => data.result)
    console.log('data', data.result)
    data.result.length != 0 ? setSearch(true) : setSearch(false)
  }
  //   useEffect(() => {
  //     if (startDate > endDate) {
  //       alert('잘못된 날짜 선택이에요.')
  //       setStartDate((prev) => endDate)
  //     }
  //   }, [startDate, endDate])

  useEffect(() => {
    getDiary()
  }, [])

  const CalendarInput = forwardRef(({ value, onClick }: any, ref: any) => (
    <div className="flex">
      <span>{value}</span>
      <img
        src="./calendar-regular.svg"
        className="w-[20px] h-[20px] ml-[20px] cursor-pointer"
        onClick={onClick}
        ref={ref}
      />
    </div>
  ))
  return (
    <div className="w-full h-full mt-[20px] flex flex-col justify-center items-center">
      <div>"{keyword}"에 대한 검색 결과</div>
      <div className=" h-[50px] rounded-md flex justify-around items-center self-start ml-[335px] mb-[50px]">
        {/*  <div className="flex items-center px-[60px]">
          <DatePicker
            selected={startDate}
            locale={ko}
            dateFormat="yyyy. MM. dd"
            closeOnScroll={true}
            onChange={(date: Date) => setStartDate(date)}
            customInput={<CalendarInput />}
          />
        </div>
        <div>
          <span> ~ </span>
        </div>
        <div className="flex items-center px-[60px]">
          <DatePicker
            selected={endDate}
            locale={ko}
            dateFormat="yyyy. MM. dd"
            closeOnScroll={true}
            onChange={(date: Date) => setEndDate(date)}
            customInput={<CalendarInput />}
          />
        </div> */}
      </div>
      <div className="flex flex-wrap w-[1280px] justify-start mt-[30px]">
        {search ? (
          view.map((data: IDiary, index: number) => (
            <DiaryLayout key={data.diary_number} data={data} />
          ))
        ) : (
          <div>검색 결과가 없어요😥 검색어를 다시 한 번 확인해 주세요</div>
        )}
      </div>
      {/* <Pagination total={total} limit={6} page={page} /> */}
    </div>
  )
}
export default Search
