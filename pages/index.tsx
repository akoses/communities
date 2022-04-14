import { useEffect,useState } from 'react'
import type { NextPage } from 'next'

import Head from 'next/head'
import styles from '../styles/Home.module.scss'
import College from '../src/common/College'
import { fetchFeaturedColleges } from '../src/lib/fetch'
import Navigation from '../src/common/Navigation'
import {Colleges} from '@prisma/client'
import SimpleBar from 'simplebar-react'
import Content from '../src/common/Content'
import Footer from '../src/common/Footer'
import Router from 'next/router'
import {useSession} from 'next-auth/react'
import CollegeModal from '../src/common/modal/CollegeModal';
import AuthModal from '../src/common/modal/AuthModal';
import Link from 'next/link';
import {BiSearchAlt} from 'react-icons/bi';

export async function getServerSideProps() {
  const colleges = await fetchFeaturedColleges();
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
     Router.push('/create-community')
    }
    else {
      setIsOpen(true);
    }
  }
  
  useEffect(() => {
    setColleges(colleges.map(mapColleges))
    let path = Router.asPath.split('/')
    if (path[1] === 'create-community'){
      if (status === 'authenticated'){
      setIsCollegeOpen(true);
      setIsOpen(false)
      Router.push('/')
    }
    
    else if (status === 'unauthenticated'){
      setIsOpen(true);
    }
    }
  },[colleges, status])
  return (
    <div className={styles.container}>
      <Head>
        <title>Akose</title>
				<meta name="description" content="Akose is where you can build online communities for your career." />
				<meta property="og:title" content="Akose" />
				<meta property="og:description" content="Akose is where you can build online communities for your career." />
				<meta property="og:image" content="https://d18px979babcec.cloudfront.net/static/logo.png" />
				<meta property="og:url" content="https://akose.ca" />
				<meta property="og:type" content="website" />
				<meta property="og:site_name" content="Akose Communitities" />
				<meta property="og:locale" content="en_US" />
				<meta property="og:locale:alternate" content="en_US" />
        <link rel="icon" href="/favicon.ico" />

      </Head>
      <Navigation />
      <div className={styles.header}>
        <div className={styles.overlay}>
            <h1>Join the right community for your career.</h1>
            </div>
          </div>
      <main>
      <div className={styles.featured}>
          <h1>Featured Communities</h1>
        </div>

       {reactColleges.length > 0 && <SimpleBar className={styles.scroll} forceVisible="y" autoHide={false} style={{maxHeight: 420}}>
        <Link href='/all-communities'><a className={styles.viewAll}><BiSearchAlt />  View All Communities</a></Link>
        {reactColleges}
        </SimpleBar>}
        {reactColleges.length === 0 && <><br/><br /></>}
          <div className={styles.contents}>

            <Content title="Find Your Next Hub"
            description="Join an Akose community to find opportunities, events and resources, related to your interests. Never miss out on a new opportunity, event or resource. "
            link="/all-communities"
            linkDescription='Find your communities'
            imgsrc='https://d18px979babcec.cloudfront.net/static/find-community.png'
            
            reversed
            />
            <Content title="Build a Community For Your People"
            description="By starting an Akose Community, you can create a place where people with similar interests can come together to provide career related support."
            linkDescription='Create a Community'
            link='/'
            imgsrc='https://d18px979babcec.cloudfront.net/static/community.png'
            reversed={false}
            func={newCollege}
            className={styles.leftAlign}
            />
            <Content title="Post Opportunities For Your Organization"
            description="Are you an organization looking to hire? Post an opportunity into communities with similar interests to help your organization find the right people." 
            link="/all-communities"
            linkDescription='See all communities'
            vidsrc='/opportunity.mp4'
            className={styles.video}
            reversed
            />

        </div>
      </main>
      <AuthModal callBackUrl={'/create-community'} type={'Login'} setOpen={setIsOpen} isOpen={isOpen} />
      <CollegeModal isOpen={isCollegeOpen} setOpen={setIsCollegeOpen} type={'create'}/>
    <Footer />
    </div>
  )
}

export default Home
