/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */

import React, {useEffect, useState} from 'react'
import styles from "../../styles/modal.module.scss"
import style from "../../styles/community.module.scss"
import axios from 'axios'
import {useSession} from 'next-auth/react'
import Router from 'next/router';
import { convertName } from '../../src/common/utils';
import {useAlert} from 'react-alert';
import { validateText } from '../../src/common/create/Resource';
import Navigation from '../../src/common/Navigation';
import CommunityPreview from '../../src/common/CommunityPreview';
import {fetchCollege} from '../../src/lib/fetch'
import Head from 'next/head';

interface ModalProps{
	college?: any
}


const EditCommunity:React.FC<ModalProps> = ({college}) => {
	const [banner, setBanner] = React.useState(college?.banner || '/default_banner.jpg');
	const [name, setName] = React.useState(college?.name || '');
	const [description, setDescription] = React.useState(college?.description || '');
	const [logo, setLogo] = React.useState(college?.logo || '/default.png')
	const [nameCount, setNameCount] = React.useState(college?.name.length || 0);
	const [descriptionCount, setDescriptionCount] = React.useState(college?.description.length || 0);
	const [bannerFile, setBannerFile] = React.useState<any>(college?.logo || null)
	const [logoFile, setLogoFile] = React.useState<any>(college?.logo || null)
	const [validName, setValidName] = React.useState(true);
	const [noBlank, setNoBlank] = React.useState<string>('');
	const [noBlankBanner, setNoBlankBanner] = React.useState<string>('');
	const [checkingName, setCheckingName] = React.useState(false);
	const [page, setPage] = React.useState<number>(1);
	
	const [instagram, setInstagram] = React.useState(college?.instagram || '');
	const [linkedin, setLinkedin] = React.useState(college?.linkedin || '');
	const [youtube, setYoutube] = React.useState(college?.youtube || '');
	const [discord, setDiscord] = React.useState(college?.discord || '');
	const [reddit, setReddit] = React.useState(college?.reddit || '');
	const [facebook, setFacebook] = React.useState(college?.facebook || '');
	const [slack, setSlack] = React.useState(college?.slack || '');
	const [twitter, setTwitter] = React.useState(college?.twitter || '');
	const [personal, setPersonal] = React.useState(college?.personal || '');
	const [tiktok, setTiktok] = React.useState(college?.personal || '');

	useSession({
		required: true,	
		onUnauthenticated: () => {
			Router.push('/')
		}	
	});

	const alert = useAlert();
	const [size, setSize] = useState<number>(0)
	useEffect(() => {
		setSize(window.innerWidth)
		window.addEventListener('resize', () => {
			setSize(window.innerWidth)
		})
	}, [])

  const isOnlyAlphaNumeric = (name: string) => {
	  if (name.length === 0) 
		  return true
	return /^([a-zA-Z0-9 _]+)$/.test(name);
  }

  const onInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
	  let val = e.target.value
	  if (isOnlyAlphaNumeric(e.target.value)){
		validateText(e, setName)
	  	setNameCount(val.length)
		  setValidName(true)
	  }
	  setCheckingName(true)
	
  	}

	  const checkName = async (e: any) => {
		if (isOnlyAlphaNumeric(e.target.value)){
			if (college && college.name === e.target.value) {
				setValidName(true)
				return
			}
		try {
			if (e.target.value.length === 0) {
				setValidName(false)
				e.target.classList.add('errorInput')
				return	
			}
			await axios.get(`/api/colleges/name`, {params: {name: e.target.value.trim()}})
			setValidName(true)
			e.target.classList.remove('errorInput')
		} catch (error) {
			setValidName(false)
			e.target.classList.add('errorInput')
			}
		}
		setCheckingName(false)
	  }
	  
	
  const onBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
	let file = e.target.files![0]
	if (file.size > 2000000) {
		alert.error('File size is too large.', {timeout: 3000})
		return
	}
	setBannerFile(file);
	setNoBlankBanner('')
	let url = URL.createObjectURL(e.target.files![0]);
	setBanner(url);
  }

  const onLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
	let file = e.target.files![0]
	if (file.size > 2000000) {
		alert.error('File size is too large.', {timeout: 3000})
		return
	}
	setLogoFile(file);
	setNoBlank('')
	let url = URL.createObjectURL(e.target.files![0]);
	setLogo(url);
	
  }

  const submitCollege = async (e:any) => {	
	  e.preventDefault()
	  let locLogo;
	  let locBanner;
	  if (checkingName) {
		  return;
	  }
	  if (!logoFile || !bannerFile || !validName || name.length === 0 ) {
		  if (!logoFile && !college) {
			  setNoBlank('A community logo is required.')
		  }

		  if (!bannerFile && !college) {
			  setNoBlankBanner('A community banner is required.')
		  }

		  if (name.length === 0) {
			  setValidName(false)
		  }
		  return
	  }
	  let keyName: string;
	  try {
		keyName = new URL(logo).pathname
	  }
	  catch (error) {
		  keyName = "";
	  }
	
	if (keyName !== college?.logo && logoFile !== null && typeof logoFile !== "string") {
		await axios.delete('/api/file', {
			params: {
				keyName
			}
		})
		let form = new FormData();
		form.append('file', logoFile);
		let res = await axios.post('/api/file', form, {
			headers: {"Content-Type": "multipart/form-data"}
		})
		locLogo = res.data;
	}
	try {
		keyName = new URL(banner).pathname
	}catch {
		keyName = "";
	}
	

	if (keyName !== college?.banner && bannerFile !== null && typeof bannerFile !== "string") {
		let form = new FormData();
		form.append('file', bannerFile);
		let res = await axios.post('/api/file', form, {
			headers: {"Content-Type": "multipart/form-data"}
		})
		locBanner = res.data;
	}


	await axios.put(`/api/colleges`, {
		name: name.replace(/\s\s+/g, ' ').trim(),
		description,
		logo: locLogo?.location || college?.logo,
		banner: locBanner?.location || college?.banner,
		id: college?.id,
		socials:{
			instagram,
			reddit,
			twitter,
			discord,
			youtube,
			linkedin,
			personal,
			facebook,
			slack,
			tiktok
		}
		})
		alert.success('College updated successfully.', {timeout: 3000})
		Router.push('/' + convertName(name.replace(/\s\s+/g, ' ').trim()));

	
  }

  return (
	<div className={style.body}>
	<Head>
		<title>Edit Community </title>
	</Head>
<Navigation />
<div className={style.header}>
	<h1>Edit Community</h1>
</div>
<div className={style.fullSpace}>
<div className={style.communityContainer}>
  <div className={styles.editModal}>
	  
  {size < 768 && <><img className={styles.banner}  src={banner} alt="banner"/>
  <img className={styles.logo}  src={logo} alt="logo"/></>}
  
  <div className={styles.inputs}>
	  <div style={{display:page === 1?"block":"none"}}>
		  
  <h2>General Information</h2>
	  <label> <div>Community Logo <span className="required">*</span></div> </label>
	  <input accept="image/jpeg, image/png" type='file' onChange={onLogoChange} />
	  <div className={styles.chooseFile}>Choose Image</div>
	  <p className={styles.invalid}>{noBlank}</p>
	  <div className={styles.rules}>Max file size is 2 MB.</div>
	  <label><div>Community Banner <span className="required">*</span></div></label>
	  <input type='file' accept="image/jpeg, image/png" onChange={onBannerChange}/>
	  <div className={styles.chooseFile}>Choose Image</div>
	  <p className={styles.invalid}>{noBlankBanner}</p>
	  <div className={styles.rules}>Max file size is 2 MB.</div>
	  <label><div>Community Name <span className="required">*</span></div> <div className={styles.counter}>{nameCount}/30</div></label>
	  <input className={styles.input} maxLength={30} type="text" placeholder="Name" value={name} onBlur={checkName} onChange={onInputChange}/>
	  <p className={styles.invalid} style={{display:!validName?"block":'none'}}>{name.length === 0? 'Name cannot be blank.':'This name is not available.'}</p>
	  <div className={styles.rules}>Only alphanumeric characters are allowed.</div>
	  <label>Community Description <div className={styles.counter}>{descriptionCount}/300</div></label>
	  <textarea className={styles.input} maxLength={300} placeholder="Description" value={description} onChange={(e) => {setDescription(e.target.value); setDescriptionCount(e.target.value.length)}}/>
	  <div className={styles.rules}>Feel free to additionally add any contact information for your community here.</div>
	  </div>
	  <form onSubmit={submitCollege} style={{display:page === 2?"block":"none"}}>
	  <div className={style.socialLinks} >
	  <h2>Social Links</h2>
	  <div className={style.socialLink}>
		  <label htmlFor={'instagram'}>Instagram</label>
		  <input value={instagram} onChange={(e) => setInstagram(e.target.value)} name='instagram' className={style.link} type="text" placeholder="https://instagram.com/name"/>
		  <label htmlFor={'facebook'}>Facebook</label>
		  <input value={facebook} onChange={(e) => setFacebook(e.target.value)} name='facebook' className={style.link} type="text" placeholder="https://www.facebook.com"/>
		  <label htmlFor={'reddit'}>Reddit</label>
		  <input value={reddit} onChange={(e) => setReddit(e.target.value)} name='reddit' className={style.link} type="text"  placeholder="https:/reddit.com/r/akose" />
		  <label  htmlFor={'linkedin'}>Linkedin</label>
		  <input value={linkedin} onChange={(e) => setLinkedin(e.target.value)} name='linkedin' className={style.link} type="text"  placeholder="https://www.linkedin.com/in/username"/>
		  <label  htmlFor={'youtube'}>Youtube</label>
		  <input value={youtube} onChange={(e) => setYoutube(e.target.value)} name='youtube' className={style.link} type="text"  placeholder="https://www.youtube.com/" />
		  <label htmlFor={'discord'}>Discord</label>
		  <input value={discord} onChange={(e) => setDiscord(e.target.value)} name='discord' className={style.link} type="text" placeholder="https://www.discord.gg" />
		  <label htmlFor={'slack'}>Slack</label>
		  <input value={slack} onChange={(e) => setSlack(e.target.value)} name='slack' className={style.link} type="text" placeholder="https://www.slack.com" />
		  <label htmlFor={'personal'}>Personal Website</label>
		  <input value={personal} onChange={(e) => setPersonal(e.target.value)} name='personal' className={style.link} type="text" placeholder="https://www.yoursite.com" />	
		  <label htmlFor={'twitter'}>Twitter</label>
		  <input value={twitter} onChange={(e) => setTwitter(e.target.value)} name='twitter' className={style.link} type="text" placeholder="https://www.twitter.com" />	
		  <label htmlFor={'tiktok'}>TikTok</label>
		  <input value={tiktok} onChange={(e) => setTiktok(e.target.value)} name='tiktok' className={style.link} type="text" placeholder="https://www.tiktok.com" />	
	  </div>
	  </div>
	  <div className={styles.buttons}><input className={styles.submit} type="submit" value="Submit" />
	  </div>
	  </form>
	  <div className={style.pages}>
	  <button onClick={() => setPage(1)} style={{opacity:page === 1?0.7:1, pointerEvents:page===2?'visible':'none'}}>
		  Back
	  </button>
	  <button onClick={() => setPage(2)} style={{opacity:page === 2?0.7:1, pointerEvents:page===1?'visible':'none'}} >
		  Next
	  </button>
	  </div>
  </div>
  </div>
  </div>
  <div className={style.random}>
  <CommunityPreview  college={
	  {
		  name,
		  description,
		  logo,
		  banner, 
		  socials:{
			  instagram,
			  reddit,
			  twitter,
			  discord,
			  youtube,
			  linkedin,
			  personal,
			  facebook,
			  slack,
			  tiktok
		  }
	  }
  }/>
  </div>
  </div>
  </div>

   
  );
}

export async function getServerSideProps({ params, req}:any) {
	
	// Call an external API endpoint to get jobs
	
	const collegeInfo = await fetchCollege(params.community);
   

  
	if (!collegeInfo)

	  return { 
		  notFound: true
	  };


	return {
	  props: {
		  key:collegeInfo.id,

		college:collegeInfo,

	  
	  },
	  // By returning the value of the `nextUpdate` key here,
	  // Next.js will optimize the page away if no data needs to be refreshed.
	}

}	

export default EditCommunity