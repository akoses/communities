/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
import Modal from 'react-modal';
import React, {useEffect} from 'react'
import styles from "../../../styles/modal.module.scss"
import axios from 'axios'
import {useSession} from 'next-auth/react'
import Router from 'next/router';
import { convertName } from '../utils';
import {useAlert} from 'react-alert';
import { validateText } from '../create/Resource';
import { BiX } from 'react-icons/bi';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
	padding: '0px',
	border: 'none',
	width: '95vw',
	maxHeight: '90vh',
	maxWidth: '900px',
  },
  overlay: {zIndex: 20000,
	opacity: 1,
	backgroundColor: 'rgba(0, 0, 0, 0.5)'}
};

Modal.setAppElement('#modal-spot');

type ModalType ='edit' | 'create'


interface ModalProps{
	isOpen: boolean
	college?: any
	setOpen: (isOpen: boolean) => void;
	type: ModalType
}

const CollegeModal:React.FC<ModalProps> = ({setOpen, isOpen, college, type}) => {
	const [modalIsOpen, setIsOpen] = React.useState(isOpen);
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

	const {data:session} = useSession();
	const alert = useAlert();
	useEffect(() => {
		setIsOpen(isOpen)
		setOpen(isOpen)
	}, [isOpen, logo, banner])

  function closeModal() {
    setIsOpen(!isOpen);
	setOpen(!isOpen);
  }

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

  const submitCollege = async () => {	
	  let locLogo;
	  let locBanner;
	  if (!logoFile || !bannerFile || !validName || name.length === 0) {
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
	switch (type) {
		case 'edit':
			await axios.put(`/api/colleges`, {
			name: name.replace(/\s\s+/g, ' ').trim(),
			description,
			logo: locLogo?.location || college?.logo,
			banner: locBanner?.location || college?.banner,
			id: college?.id,
			})
			break;
		case 'create':
			await axios.post(`/api/colleges`, {
			name: name.replace(/\s\s+/g, ' ').trim(),
			description,
			logo: locLogo?.location || '',
			banner: locBanner?.location || '',
			//@ts-ignore
			userId: session?.user?.id || ''
			})
			Router.push('/' + convertName(name.replace(/\s\s+/g, ' ').trim()));
			closeModal();
			return;
	}
	
	closeModal();
	
	window.location.href = window.location.origin + `/${name.replace(/\s+/g, '-').replace(/,/g, '').toLowerCase()}`
  }

  return (
    
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel={`College Modal`}
      >
		<div className={styles.editModal}>
		<div className={styles.collegeExit} onClick={closeModal}>
			<BiX />
		</div>
		<img className={styles.banner}  src={banner} alt="banner"/>
		<img className={styles.logo}  src={logo} alt="logo"/>
		<h2 className={styles.question}>{type === 'edit'?'Edit Community Information':"Create New Community"}</h2>
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
			<input className={styles.cancel} type="submit" value="Cancel" onClick={closeModal}/>
			</div>
		</div>
		</div>
      </Modal>
   
  );
}

export default CollegeModal