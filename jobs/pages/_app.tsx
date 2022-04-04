import React, {useEffect,useState} from 'react'
import { SessionProvider, } from "next-auth/react"
import { getSession, useSession} from 'next-auth/react'


import App from 'next/app'
import '../styles/globals.css'
import "antd/dist/antd.css";
import 'react-calendar/dist/Calendar.css'
import 'react-clock/dist/Clock.css'
import {convertName} from '../src/common/utils'
import AppContext from '../contexts/AppContext'

import type { AppProps } from 'next/app'
import axios from 'axios'

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
    <SessionProvider session={session}>
    <AppContext.Provider value={{collegeData, setEdit: editSend, editableData:edit}}>
    <Component {...pageProps} />
    </AppContext.Provider>
    </SessionProvider>
  )
}

export default MyApp
