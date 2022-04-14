/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */

import React, {useEffect, useState} from 'react'
import styles from "../styles/modal.module.scss"
import style from "../styles/community.module.scss"
import axios from 'axios'
import {useSession} from 'next-auth/react'
import Router from 'next/router';
import { convertName } from '../src/common/utils';
import {useAlert} from 'react-alert';
import { validateText } from '../src/common/create/Resource';
import Navigation from '../src/common/Navigation';
import CommunityPreview from '../src/common/CommunityPreview';
import Head from 'next/head';
import AuthModal from '../src/common/modal/AuthModal';
import { useBeforeunload } from 'react-beforeunload';
import { RiRestaurantLine } from 'react-icons/ri'

interface ModalProps{
	isOpen: boolean
	college?: any
	setOpen: (isOpen: boolean) => void;
}

function setCookie(name:string,value:string,days:number) {
	if (typeof window !== "undefined") {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}}
function getCookie(name:string) {
	if (typeof window !== "undefined") {
		// your code with access to window or document object here 
	
    var nameEQ = name + "=";
    var ca = document?.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
}
function eraseCookie(name:string) {   
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

const CreateCommunity:React.FC<ModalProps> = ({college}) => {
	const [banner, setBanner] = React.useState('/default_banner.jpg');
	const [name, setName] = React.useState<string>('');
	const [description, setDescription] = React.useState<string>('');
	const [logo, setLogo] = React.useState('/default.png')
	const [nameCount, setNameCount] = React.useState<number>(0);
	const [descriptionCount, setDescriptionCount] = React.useState<number>(0);
	const [bannerFile, setBannerFile] = React.useState<any>(null);
	const [logoFile, setLogoFile] = React.useState<any>(null);
	const [validName, setValidName] = React.useState(true);
	const [noBlank, setNoBlank] = React.useState<string>('');
	const [noBlankBanner, setNoBlankBanner] = React.useState<string>('');
	const [checkingName, setCheckingName] = React.useState(false);
	const [isOpen, setOpen] = React.useState(false);

	const {data:session} = useSession({
		required: true
	});
	const alert = useAlert();
	const [size, setSize] = useState<number>(0)
	useEffect(() => {
		setSize(window.innerWidth);
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
		return;
	}

	setBannerFile(file);
	setNoBlankBanner('');
	let url = URL.createObjectURL(e.target.files![0]);
	setBanner(url);
  }

  const onLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
	let file = e.target.files![0]
	if (file.size > 2000000) {
		alert.error('File size is too large.', {timeout: 3000})
		return;
	}
	
	setLogoFile(file);
	setNoBlank('')
	let url = URL.createObjectURL(e.target.files![0]);
	setLogo(url);
	
  }

  const submitCollege = async () => {
	if (!(logoFile) || !(bannerFile) || !validName || name.length === 0) {
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


	  let locLogo;
	  let locBanner;
	  if (checkingName) {
		return;
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

		await axios.post(`/api/colleges`, {
		name: name.replace(/\s\s+/g, ' ').trim(),
		description,
		logo: locLogo?.location || getCookie('college-logo') || '',
		banner: locBanner?.location || getCookie('college-banner') || '',
		//@ts-ignore
		userId: session?.user?.id || ''
		})
		Router.push('/' + convertName(name.replace(/\s\s+/g, ' ').trim()));

	window.location.href = window.location.origin + `/${name.replace(/\s+/g, '-').replace(/,/g, '').toLowerCase()}`
  }

  const goBack = () => {
	Router.back();
  }

  return (
	  <div className={style.body}>
		  <Head>
			  <title>Create Community</title>
		  </Head>
	  <Navigation />
	  <div className={style.header}>
		  <h1>Create Community</h1>
	  </div>
	  <div className={style.fullSpace}>
	<div className={style.communityContainer}>
		<div className={styles.editModal}>
			
		{size < 768 && <><img className={styles.banner}  src={banner} alt="banner"/>
		<img className={styles.logo}  src={logo} alt="logo"/></>}
		
		<div className={styles.inputs}>
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
			<div className={styles.buttons}><input className={styles.submit} type="submit" value="Submit" onClick={submitCollege}/>
			<input className={styles.cancel} type="submit" value="Cancel" onClick={goBack}/>
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
				banner
			}
		}/>
		<AuthModal type={'Login'} setOpen={setOpen} isOpen={isOpen} />
		</div>
		</div>
		</div>
   
  );
}

export default CreateCommunity