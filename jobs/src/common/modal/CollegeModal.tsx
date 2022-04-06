/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
import Modal from 'react-modal';
import React, {useEffect} from 'react'
import styles from "../../../styles/modal.module.scss"
import axios from 'axios'
import {useSession} from 'next-auth/react'
import Router from 'next/router';
import { convertName } from '../utils';

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
  },
  overlay: {zIndex: 1000,
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
	const [bannerFile, setBannerFile] = React.useState<any>(null)
	const [logoFile, setLogoFile] = React.useState<any>(null)
	const {data:session} = useSession();
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

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
	if (isOnlyAlphaNumeric(e.target.value)){
	setName(e.target.value);
	setNameCount(e.target.value.length);
  	} 
  }

  const onBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
	let file = e.target.files![0]
	setBannerFile(file);
	let url = URL.createObjectURL(e.target.files![0]);
	setBanner(url);
	
  }

  const onLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
	let file = e.target.files![0]
	setLogoFile(file);
	let url = URL.createObjectURL(e.target.files![0]);
	setLogo(url);
	
  }

  const submitCollege = async () => {	
	  let locLogo;
	  let locBanner;
	let keyName = new URL(logo).pathname
	if (keyName !== college?.logo && logoFile !== null){
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
	keyName = new URL(banner).pathname

	if (keyName !== college?.banner && bannerFile !== null){
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
		<img className={styles.banner}  src={banner} alt="banner"/>
		<img className={styles.logo}  src={logo} alt="logo"/>
		<h2 className={styles.question}>{type === 'edit'?'Edit College Information':"Create College"}</h2>
		<div className={styles.inputs}>
			<label>College Logo</label>
			<input accept="image/jpeg, image/png" type='file' onChange={onLogoChange} />
			<div className={styles.chooseFile}>Choose Image</div>
			<label>College Banner</label>
			<input type='file' accept="image/jpeg, image/png" onChange={onBannerChange}/>
			<div className={styles.chooseFile}>Choose Image</div>
			<label>College Name <div className={styles.counter}>{nameCount}/50</div></label>
			
			<input className={styles.input} maxLength={50} type="text" placeholder="Name" value={name} onChange={onInputChange}/>
			<div className={styles.rules}>Only alphanumeric characters are allowed.</div>

			<label>College Description <div className={styles.counter}>{descriptionCount}/300</div></label>
			<textarea className={styles.input} maxLength={300} placeholder="Description" value={description} onChange={(e) => {setDescription(e.target.value); setDescriptionCount(e.target.value.length)}}/>
			
			<div className={styles.buttons}><input className={styles.submit} type="submit" value="Submit" onClick={submitCollege}/>
			<input className={styles.cancel} type="submit" value="Cancel" onClick={closeModal}/>
			</div>
		</div>
		</div>
      </Modal>
   
  );
}

export default CollegeModal