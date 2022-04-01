

import Document, { Html, Head, Main, NextScript,  } from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(ctx:any) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html lang="en">
        <Head >
			<link rel="shortcut icon" href="/logo.ico" />
      <link rel = "icon" type="image/png" href ="logo.png"></link>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Heebo&family=Noto+Sans&family=Inter&display=swap" rel="stylesheet"/>
      <meta name="title" content="Akose"/>
     <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true"/>
      <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@500&display=swap" rel="stylesheet" />
<meta name="description" content="Akose is a platform for students and new graduates to apply and connect with companies to find the best fit."/>
<meta name="keywords" content="hiring, internships, interns"/>
<meta name="robots" content="index, follow"/>
<meta httpEquiv="Content-Type" content="text/html; charset=utf-8"/>
<meta name="language" content="English"/>
<meta name="revisit-after" content="7 days"/>
<meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests"/> 
  	</Head>
        <body>
          <Main />
          <NextScript />
          <div id='modal-spot'></div>
          <div id='modal-event'></div>
        </body>
      </Html>
    )
  }
}

export default MyDocument