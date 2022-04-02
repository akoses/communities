/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
import Modal from 'react-modal';
import React, {useEffect} from 'react'
import styles from "../../../styles/modal.module.scss"
import axios from 'axios'
import S3Client from '../../lib/S3';

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


interface ModalProps{
	isOpen: boolean
	college: any
	setOpen: (isOpen: boolean) => void;
}

const EditModal:React.FC<ModalProps> = ({setOpen, isOpen, college}) => {
	const [modalIsOpen, setIsOpen] = React.useState(isOpen);
	const [banner, setBanner] = React.useState(college.banner)
	const [name, setName] = React.useState(college.name)
	const [description, setDescription] = React.useState(college.description)
	const [logo, setLogo] = React.useState(college.logo)
	const [nameCount, setNameCount] = React.useState(college.name.length)
	const [descriptionCount, setDescriptionCount] = React.useState(college.description.length)
	const [bannerFile, setBannerFile] = React.useState<any>(null)
	const [logoFile, setLogoFile] = React.useState<any>(null)
	
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
	if (file.type === "image/jpeg" || file.type === "image/png"){
	setBannerFile(file);
	let url = URL.createObjectURL(e.target.files![0]);
	setBanner(url);
	}
  }

  const onLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
	let file = e.target.files![0]
	setLogoFile(file);
	let url = URL.createObjectURL(e.target.files![0]);
	setLogo(url);
	
  }

  const submitEdit = async () => {	
	  let locLogo;
	  let locBanner;
	let keyName = new URL(logo).pathname
	if (keyName !== college.logo && logoFile !== null){
		await S3Client.deleteFile(keyName)
		locLogo = await S3Client.uploadFile(logoFile, keyName)
	}
	keyName = new URL(banner).pathname

	if (keyName !== college.banner && bannerFile !== null){
		await S3Client.deleteFile(keyName)
		locBanner = await S3Client.uploadFile(bannerFile, keyName)
	}
	await axios.put(`/api/colleges`, {
		name: name.replace(/\s\s+/g, ' ').trim(),
		description,
		logo: locLogo?.location || college.logo,
		banner: locBanner?.location || college.banner,
		id: college.id,
	})
	closeModal();
	
	window.location.href = window.location.origin + `/${name.replace(/\s+/g, '-').replace(/,/g, '').toLowerCase()}`
  }

  return (
    
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel={`Edit College`}
      >
		  <div className={styles.editModal}>
		<img className={styles.banner}  src={banner} alt="banner"/>
		<img className={styles.logo}  src={logo} alt="logo"/>
		<h2 className={styles.question}>Edit College Information</h2>
		<div className={styles.inputs}>
			<label>College Logo</label>
			<input accept="image/jpeg, image/png" type='file' onChange={onLogoChange} />
			<div className={styles.chooseFile}>Choose Image</div>
			<label>College Banner</label>
			<input type='file' onChange={onBannerChange}/>
			<div className={styles.chooseFile}>Choose Image</div>
			<label>College Name <div className={styles.counter}>{nameCount}/50</div></label>
			
			<input className={styles.input} maxLength={50} type="text" placeholder="Name" value={name} onChange={onInputChange}/>
			<div className={styles.rules}>Only alphanumeric characters are allowed.</div>

			<label>College Description <div className={styles.counter}>{descriptionCount}/300</div></label>
			<textarea className={styles.input} maxLength={300} placeholder="Description" value={description} onChange={(e) => {setDescription(e.target.value); setDescriptionCount(e.target.value.length)}}/>
			
			<div className={styles.buttons}><input className={styles.submit} type="submit" value="Submit" onClick={submitEdit}/>
			<input className={styles.cancel} type="submit" value="Cancel" onClick={closeModal}/>
			</div>
		</div>
		</div>
      </Modal>
   
  );
}

export default EditModal