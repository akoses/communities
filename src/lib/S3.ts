import {S3Client} from "@aws-sdk/client-s3";

const config = {
    region: 'ca-central-1',
    credentials: {
         accessKeyId: process.env.S3_AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.S3_AWS_SECRET_ACCESS_KEY || '',
    }
   
}
const S3 = new S3Client(config);

export default S3;
