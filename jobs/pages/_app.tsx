import React, {useEffect,useState} from 'react'
import '../styles/globals.css'
import 'react-datetime-picker/dist/DateTimePicker.css'
import 'react-calendar/dist/Calendar.css'
import 'react-clock/dist/Clock.css'
import {convertName} from '../src/common/utils'
import AppContext from '../contexts/AppContext'

import type { AppProps } from 'next/app'
import axios from 'axios'

function MyApp({ Component, pageProps }: AppProps) {
  const [collegeData, setCollegeData] = useState<any>([]);
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
  return (
    <AppContext.Provider value={{collegeData}}>
    <Component {...pageProps} />
  </AppContext.Provider>
  )
}

export default MyApp
