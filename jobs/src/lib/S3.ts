import S3 from 'aws-s3';

const config = {
    bucketName: 'akosejobs',
    dirName: 'logos-images', /* optional */
    region: 'ca-central-1',
    accessKeyId: 'AKIARF5GI22PLZXSWEL4',
    secretAccessKey: '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',
}
const S3Client = new S3(config);

export default S3Client;