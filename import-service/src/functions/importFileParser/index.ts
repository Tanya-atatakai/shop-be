import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      s3: {
        bucket: "${self:custom.bucket}",
        event: "s3:ObjectCreated:*",
        rules: [{ suffix: ".csv" }, { prefix: "uploaded/" }],
        existing: true,
        forceDeploy: true,
      },
    },
  ],
};
