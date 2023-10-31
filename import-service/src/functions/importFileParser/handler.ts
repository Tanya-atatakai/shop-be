import { S3Event } from "aws-lambda";
import { S3, SQS } from "aws-sdk";
import csvParser from "csv-parser";

const s3 = new S3({ region: process.env.REGION });
const sqs = new SQS({ region: process.env.REGION });

export const main = async (event: S3Event): Promise<void> => {
  try {
    const { Records } = event;

    for (const record of Records) {
      const { s3: s3Event } = record;
      const { bucket, object } = s3Event;
      const { key } = object;

      const s3Stream = s3
        .getObject({ Bucket: bucket.name, Key: key })
        .createReadStream();

      await new Promise<void>((resolve, reject) => {
        s3Stream
          .pipe(csvParser())
          .on("data", async (row) => {
            try {
              const params = {
                MessageBody: JSON.stringify(row),
                QueueUrl: process.env.SQS_URL,
              };

              await sqs.sendMessage(params).promise();
            } catch (error) {
              console.error("Error sending message to SQS:", error);
              reject(error);
            }
          })
          .on("end", () => {
            console.log("CSV parsing completed.");
            resolve();
          })
          .on("error", (error) => {
            console.error("Error parsing CSV:", error);
            reject(error);
          });
      });

      // Move parsed file
      const parsedKey = key.replace("uploaded", "parsed");
      await s3
        .copyObject({
          Bucket: bucket.name,
          CopySource: `/${bucket.name}/${key}`,
          Key: parsedKey,
        })
        .promise();

      await s3
        .deleteObject({
          Bucket: bucket.name,
          Key: key,
        })
        .promise();

      console.log(`File moved to parsed folder: ${parsedKey}`);
    }
  } catch (error) {
    console.error("Error processing CSV:", error);
  }
};
