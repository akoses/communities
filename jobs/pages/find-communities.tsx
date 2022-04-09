import { useEffect,useState } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.scss'
import College from '../src/common/College'
import { fetchColleges } from '../src/lib/fetch'
import Navigation from '../src/common/Navigation'
import {Colleges} from '@prisma/client'
import {useSession} from 'next-auth/react'
import SimpleBar from 'simplebar-react'
import CollegeModal from '../src/common/modal/CollegeModal';
import AuthModal from '../src/common/modal/AuthModal';

export async function getServerSideProps() {
  const colleges = await fetchColleges();
  return {
    props: {
      colleges: colleges || []
    }
  }
  
}

const Home: NextPage = ({colleges}:any) => {
  const [reactColleges, setColleges] = useState<JSX.Element[]>([])
  const {data: session, status} = useSession();
  const [isCollegeOpen, setIsCollegeOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const filterColleges = (e:any) => {
  let colls = colleges.filter((college:any) => {
    return college.name.toLowerCase().includes(e.target.value.toLowerCase())
  })
  setColleges(colls.map(mapColleges))
  }

  const mapColleges = (college:Colleges) => {
   return <College 
      key={college.name}
      name={college.name}
      description={college.description}
      logo={college.logo}
      id={college.id}
    />
  }

  const newCollege =() => {
    if (status === 'authenticated'){
      setIsCollegeOpen(true);
    }
    else {
      setIsOpen(true);
    }
  }
  
  useEffect(() => {
    setColleges(colleges.map(mapColleges))
  },[colleges])
  return (
    <div className={styles.container}>
      <Head>
        <title>Find Communities</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navigation />
      <main>
        <div className={`${styles.title} ${styles.findCollegeTitle}`}>
          <input onChange={filterColleges} type="text" placeholder="Search for an Akose commmunity" />
        </div>
        <p className={styles.dont}>Don&apos;t see a community that fits your needs? <span className={styles.createSearch} onClick={newCollege}>Create a new community.</span></p>
        {reactColleges.length > 0 && <SimpleBar className={styles.scrollFind} forceVisible="y" autoHide={false}>
        {reactColleges}
        </SimpleBar>}
      </main>
      <AuthModal callBackUrl={'/create-college'} type={'Login'} setOpen={setIsOpen} isOpen={isOpen} />
      <CollegeModal isOpen={isCollegeOpen} setOpen={setIsCollegeOpen} type={'create'}/>
     <br />
    </div>
  )
}

export default Home
