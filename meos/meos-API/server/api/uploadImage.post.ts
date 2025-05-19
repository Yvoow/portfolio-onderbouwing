import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { authenticate, hashPassword } from "~/utils/auth";

export default defineEventHandler(async (event) => {
  try {
    const user = await authenticate(event);
    if (!user) {
      event.node.res.statusCode = 401;
      return { message: 'Unauthorized' };
    }

    const body = await readBody(event);
    const { fileName, fileType } = body;

    if (!fileName || !fileType) {
      throw createError({
        statusCode: 400,
        message: 'fileName and fileType are required',
      });
    }

    const s3Client = new S3Client({
      region: 'ams3',
      endpoint: 'https://ams3.digitaloceanspaces.com',
      credentials: {
        accessKeyId: process.env.DO_SPACES_KEY || '',
        secretAccessKey: process.env.DO_SPACES_SECRET || '',
      },
    });

    const key = `reports/${user.belongsToServer}/${Date.now()}-${fileName}`;
    const command = new PutObjectCommand({
      Bucket: 'fusionmeos',
      Key: key,
      ContentType: fileType,
      ACL: 'public-read',
    });

    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    
    return {
      uploadUrl: signedUrl,
      fileUrl: `https://fusionmeos.ams3.digitaloceanspaces.com/${key}`,
    };
  } catch (error) {
    console.error('Error generating signed URL:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to generate upload URL',
    });
  }
}); 