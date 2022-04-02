import React, {useEffect,useState} from 'react'

import '../styles/globals.css'
import "antd/dist/antd.css";
import 'react-calendar/dist/Calendar.css'
import 'react-clock/dist/Clock.css'
import {convertName} from '../src/common/utils'
import AppContext from '../contexts/AppContext'

import type { AppProps } from 'next/app'
import axios from 'axios'

function MyApp({ Component, pageProps }: AppProps) {
  const [collegeData, setCollegeData] = useState<any>([]);
  const [edit, setEdit] = useState<any>({});
    useEffect(() => {
      axios.get('/api/colleges')
        .then(res => {
          let data:any[] = res.data
          var result = data.reduce(function(map:any, obj:any) {
            map[convertName(obj.name)] = obj;
            return map;
        }, {});
       
            setCollegeData(result)
        })
    
  }, [])

  const editSend = (data:any) => {
    setEdit(data)
  }

  return (
    <AppContext.Provider value={{collegeData, setEdit: editSend, editableData:edit}}>
    <Component {...pageProps} />
  </AppContext.Provider>
  )
}

export default MyApp
