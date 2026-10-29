export type PresignedUpload = {
  uploadUrl: string;
  objectKey: string;
  expiresInSeconds: number;
};

export interface ObjectStorage {
  createPresignedUpload(input: {
    objectKey: string;
    contentType: string;
    expiresInSeconds?: number;
  }): Promise<PresignedUpload>;
}
