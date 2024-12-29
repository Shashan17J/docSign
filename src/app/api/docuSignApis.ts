import axios from "axios";
import jwt from "jsonwebtoken";
import { InitiateSigningRequestType, SigningInputType } from "@/types/types";
require("dotenv").config();

const createJwtToken = async () => {
  const iat = Math.floor(Date.now() / 1000); // Current time in seconds
  const exp = iat + 600; // Token expiration in 10 minutes

  const header = {
    alg: "RS256",
    typ: "JWT",
  };
  const privateKey = process.env.NEXT_PUBLIC_RSA_PRIVATE_KEY;

  if (!privateKey) return "Invalid Private Key";

  // JWT Payload
  const payload = {
    iss: process.env.NEXT_PUBLIC_INTEGRATION_KEY,
    sub: process.env.NEXT_PUBLIC_USER_ID,
    aud: "account-d.docusign.com",
    iat: iat,
    exp: exp,
    scope: "signature",
  };

  // Sign the JWT with RS256
  const token = jwt.sign(payload, privateKey, {
    algorithm: "RS256",
    header,
  });

  return token;
};

const getAccessToken = async () => {
  const assertion = await createJwtToken();

  const formData = new FormData();
  formData.append("grant_type", "urn:ietf:params:oauth:grant-type:jwt-bearer");
  formData.append("assertion", assertion);
  const requestConfig = {
    method: "post",
    url: "https://account-d.docusign.com/oauth/token",
    headers: {
      "Content-Type": "multipart/form-data",
      // "Access-Control-Allow-Origin":
      //   "*",
    },

    data: formData,
  };

  try {
    const response = await axios(requestConfig);
    const accessToken = response.data.access_token;
    return accessToken;
  } catch (error: any) {
    console.error(
      "Error fetching access token:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const initiateSigningProcess = async ({
  email,
  signerName,
  templateId,
  signingType,
}: SigningInputType) => {
  const accessToken = await getAccessToken();

  const headers = {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };

  const body: InitiateSigningRequestType = {
    templateId: templateId,
    emailSubject: "Simple Signing Example2",
    templateRoles: [
      {
        email: email,
        name: signerName,
        roleName: "signer",
        routingOrder: "1",
      },
    ],
    status: "sent",
  };

  if (signingType === "notary") {
    body.allowRemoteNotarization = true;
  }

  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_DOCUSIGN_API_BASE_URL}/restapi/v2.1/accounts/${process.env.NEXT_PUBLIC_API_ACCOUNT_ID}/envelopes`,
      body,
      { headers }
    );

    return response.data.envelopeId;
  } catch (error: any) {
    throw error;
  }
};
