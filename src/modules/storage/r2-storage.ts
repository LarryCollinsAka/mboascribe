import { HeadObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import type { ObjectStorage, PresignedUpload } from "./object-storage";
function required(name:string){const value=process.env[name];if(!value)throw new Error(`${name} is not configured`);return value;}
export class R2Storage implements ObjectStorage {
  private client=new S3Client({region:"auto",endpoint:required("R2_ENDPOINT"),credentials:{accessKeyId:required("R2_ACCESS_KEY_ID"),secretAccessKey:required("R2_SECRET_ACCESS_KEY")}});
  private bucket=required("R2_BUCKET_NAME");
  async createPresignedUpload(input:{objectKey:string;contentType:string;expiresInSeconds?:number}):Promise<PresignedUpload>{const expiresInSeconds=input.expiresInSeconds??300;const command=new PutObjectCommand({Bucket:this.bucket,Key:input.objectKey,ContentType:input.contentType});const uploadUrl=await getSignedUrl(this.client,command,{expiresIn:expiresInSeconds});return{uploadUrl,objectKey:input.objectKey,expiresInSeconds};}
  async exists(objectKey:string){try{await this.client.send(new HeadObjectCommand({Bucket:this.bucket,Key:objectKey}));return true;}catch(error){const status=(error as {$metadata?:{httpStatusCode?:number}})?.$metadata?.httpStatusCode;if(status===404)return false;throw error;}}
}
export const objectStorage:ObjectStorage=new R2Storage();
