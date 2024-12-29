export interface Signer {
  email: string;
  name: string;
}

export interface SendEnvelopeRequest {
  signerEmails: Signer[];
  isNotary: boolean;
}
interface Recipients {
  signers: Signer[];
  isNotary: boolean;
}

export interface SigningInputType {
  email: string;
  signerName: any;
  templateId: string;
  signingType: any;
}

export interface TemplateRole {
  email: string;
  name: string;
  roleName: string;
  routingOrder: string;
}

export interface InitiateSigningRequestType {
  templateId: string;
  emailSubject: string;
  templateRoles: TemplateRole[];
  status: string;
  allowRemoteNotarization?: boolean; // Optional for notary signing
}
