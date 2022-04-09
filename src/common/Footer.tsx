import Link from 'next/link'
import styles from '../../styles/footer.module.scss'
const Footer = () => {
	return (
		<footer className={styles.footer}>
			<div className={styles.content}>
			<div className={styles.legal}>
				<h3>Legal</h3>
				<Link href="/terms"><a>Terms of Use</a></Link>
				<Link href="/privacy-policy"><a>Privacy Policy</a></Link>
			</div>
			<div className={styles.social}>
				<h3>Social Media</h3>
				<div>
				<Link href="https://instagram.com/akose.ig"><a><img alt="instagram logo" id={styles.ig} src="instagram.png"/></a></Link>
				<Link href="https://www.linkedin.com/company/akose"><a><img alt="linkedin logo" src="linkedin.png"/></a></Link>
				<Link href="https://www.tiktok.com/@akose.ca"><a><img alt="linkedin logo" src="tiktok.png"/></a></Link>
				</div>
			</div>
			<div className={styles.email}>
				<h3>Contact Us</h3>
				<Link href="mailto:info@akose.ca"><p>info@akose.ca</p></Link>
			</div>
			</div>
			<div className={styles.copyright}>
				©2022 Akose Inc. All rights reserved.
			</div>
			
		</footer>
	)
}

export default Footer;