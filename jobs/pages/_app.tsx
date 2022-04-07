import React, {useEffect,useState} from 'react'
import { SessionProvider, } from "next-auth/react"

import '../styles/globals.css'
import "antd/dist/antd.css";
import 'react-calendar/dist/Calendar.css'
import 'react-clock/dist/Clock.css'
import 'simplebar/dist/simplebar.min.css';

import {convertName} from '../src/common/utils'
import AppContext from '../contexts/AppContext'
import type { AppProps } from 'next/app'
import axios from 'axios'
import {
  Provider as AlertProvider,
  positions,
} from 'react-alert'


import AlertTemplate from '../src/common/AlertTemplate'

function MyApp({ Component, pageProps:{session, ...pageProps}}: AppProps) {
  const [collegeData, setCollegeData] = useState<Map<string, any>>(new Map());
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
    <AlertProvider template={AlertTemplate} position={positions.TOP_CENTER}>
    <SessionProvider session={session}>
    <AppContext.Provider value={{collegeData, setEdit: editSend, editableData:edit}}>
    <Component {...pageProps} />
    </AppContext.Provider>
    </SessionProvider>
    </AlertProvider>
  
  )
}

export default MyApp
