// import AppError from "../errors/AppError";
// import axios from "axios";

// const SendEmail = async (body: any) => {
//   const API_URL = "https://api.zeptomail.sa/v1.1/email";
//   const API_KEY = process.env.ZEPTO_API_KEY;

//   const emailPayload = {
//     ...body,
//     from: {
//       address: process.env.BILLING_EMAIL,
//       name: "billing",
//     },
//   };

//   try {
//     const response = await axios.post(API_URL, emailPayload, {
//       headers: {
//         Accept: "application/json",
//         "Content-Type": "application/json",
//         Authorization: `Zoho-enczapikey ${API_KEY}`,
//       },
//     });

//     console.log("Email sent successfully:", response.data);
//   } catch (e) {
//     // @ts-ignore
//     console.error(
//       "Error sending email:",
//       e.response?.data.error.details || e.message.error.details
//     );
//     throw new AppError("ERR_SEND_EMAIL");
//   }
// };

// export default SendEmail;
