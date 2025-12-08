// import { Logging } from "@google-cloud/logging";

// const credential = JSON.parse(
//   Buffer.from(process.env.GCP_CREDENTIALS!, "base64")
//     .toString()
//     .replace(/\n/g, "")
// );

// const logging = new Logging({
//   projectId: process.env.PROJECTID,
//   credentials: {
//     client_email: credential.client_email,
//     private_key: credential.private_key,
//   },
// });

// const log = logging.log("errorsLogs");

interface ErrorMeta {
  url?: string;
  body?: string;
  key?: string;
  env?: string;
  uid?: string | number;
  agent?: string;
  code?: number;
  message?: string;
}

interface MessageMeta {
  url?: string;
  body?: string;
  key?: string;
  env?: string;
  uid?: string | number;
  agent?: string;
  code?: number;
  message?: string;
}

// const LogError = async (meta: ErrorMeta) => {
//   const metadata = { resource: { type: "global" } };

//   const entry = log.entry(metadata, meta);

//   await log.error(entry);
// };

// const LogMessage = async (meta: MessageMeta) => {
//   const metadata = { resource: { type: "global" } };

//   const entry = log.entry(metadata, meta);

//   await log.info(entry);
// };

export { ErrorMeta };
