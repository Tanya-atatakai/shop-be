import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { S3 } from "aws-sdk";
import {
  formatBadRequestResponse,
  formatJSONResponse,
  formatServerErrorResponse,
} from "../../../../shared/helpers/formatResponse";

const BUCKET_NAME = process.env.BUCKET;
const s3 = new S3({ region: process.env.REGION });

export const main = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const { name } = event.queryStringParameters || {};

    if (!name) {
      return formatBadRequestResponse(
        "Missing name parameter in the query string"
      );
    }

    const fileName = `uploaded/${name}`;
    const params = {
      Bucket: BUCKET_NAME,
      Key: fileName,
      Expires: 60,
      ContentType: "text/csv",
    };

    const url = await s3.getSignedUrlPromise("putObject", params);

    return formatJSONResponse({ url });
  } catch (error) {
    console.error("Error generating signed URL:", error);
    return formatServerErrorResponse();
  }
};
