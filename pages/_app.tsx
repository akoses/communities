import React, {useEffect,useState} from 'react'
import { SessionProvider, } from "next-auth/react"
import Script from "next/script";
import Head from 'next/head';
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
    <>
    <Head >
			<link rel="shortcut icon" href="/logo.ico" />
      <link rel = "icon" type="image/png" href ="/logo.png"></link>
      <meta name="title" content="Akose"/>
      <meta name="robots" content="index, follow"/>
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8"/>
      <meta name="language" content="English"/>
      <meta name="revisit-after" content="7 days"/>
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"/>
  	</Head>
    <AlertProvider template={AlertTemplate} position={positions.TOP_CENTER}>
    <SessionProvider session={session}>
    <AppContext.Provider value={{collegeData, setEdit: editSend, editableData:edit}}>
    <Component {...pageProps} />
    </AppContext.Provider>
    </SessionProvider>
    </AlertProvider>
    <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-R035V7N4YP"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-R035V7N4YP');
        `}
      </Script>
    </>
  )
}

export default MyApp
