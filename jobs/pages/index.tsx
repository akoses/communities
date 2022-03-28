import { useEffect,useState } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.scss'
import College from '../src/common/College'
import { fetchColleges } from '../lib/fetch'


export async function getStaticProps() {
	  const colleges = await fetchColleges()
  return {
	props: {
	  colleges
	},
  }
}

const Home: NextPage = ({colleges}:any) => {
  const [reactColleges, setColleges] = useState<JSX.Element[]>([])
  useEffect(() => {
    setColleges(colleges.map((college:any) => <College 
      key={college.name}
      name={college.name}
      description={college.description}
      logo={college.logo}
      id={college.id}
    />))
  },[colleges])
  return (
    <div className={styles.container}>
      <Head>
        <title>Akose Jobs</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className={styles.title}>
        <h1 >Colleges</h1>
        <p>Looking for an internship or new grad role? Check out the Akose colleges related to your degree or interests.</p>
        </div>
        {reactColleges}
      </main>
      <div className={styles.request}>
        <h2>Want to start your own college?</h2>
        <a href="mailto:info@akose.ca?subject=New College Request">Request a new college</a>
      </div>
    </div>
  )
}

export default Home
