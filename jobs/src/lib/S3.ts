import S3 from 'aws-s3';

const config = {
    bucketName: 'akosejobs',
    dirName: 'logos-images', /* optional */
    region: 'ca-central-1',
 
}
const S3Client = new S3(config);

export default S3Client;
