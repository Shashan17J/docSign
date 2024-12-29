export interface SigningInputType {
  email: string;
  signerName: any;
  templateId: string;
  signingType: "regular" | "notary";
}

interface TemplateRole {
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
  allowRemoteNotarization?: boolean;
}
