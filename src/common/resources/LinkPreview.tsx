import React from 'react'
import styles from '../../../styles/linkPreview.module.scss'
import Link from 'next/link';

interface LinkPreviewProps {
	url?: string;
	title?: string;
	description?: string;
	image?: string;
}
export function validURL(str: string) {
	var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
	  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
	  '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
	  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
	  '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
	  '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
	return !!pattern.test(str);
  }

  
const LinkPreview: React.FC<LinkPreviewProps> = ({url, title, description, image}) => {
		let descriptionLength = description?.length || 60;

    const linkClick = (e: any) => {
      if (url === '' || !url) {
        e.preventDefault();
        return;
      }
    }
		return (
		
		<Link href={url || ''}><a  target="_blank" onClick={linkClick}><div className={styles.Container}>
			{image && <div
          data-testid='image-container'
          style={{
            borderTopLeftRadius: '5px',
            borderTopRightRadius: '5px',
            backgroundImage: `url(${
             image
            })`,
           
          }}
          className={styles.Image}
        >
		</div>}
		<div className={styles.LowerContainer}>
        {title && <h3 data-testid='title' className={styles.Title}>
          {title}
        </h3>}
        {description && (
          <span
            data-testid='desc'
            className={`${styles.Description} ${styles.Secondary}`}
          >
            {descriptionLength
              ? description.length > descriptionLength
                ? description.slice(0, descriptionLength) + '...'
                : description
              : description}
          </span>
        )}
        <div className={`${styles.SiteDetails} ${styles.Secondary}`}>
          {url && <span>{ validURL(url)? new URL(url)?.hostname + " •": ''}</span>}
        </div>
      </div>
		</div></a></Link>);
}

export default LinkPreview