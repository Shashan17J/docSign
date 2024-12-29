// components/DocuSignForm.tsx
"use client";

import { initiateSigningProcess } from "@/app/api/docuSignApis";
import React, { useState } from "react";
import toast from "react-hot-toast";

const DocuSignForm: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [signerName, setSignerName] = useState<string>("");
  const [templateId, setTemplateId] = useState<string>("");
  const [isNotary, setIsNotary] = useState<boolean>(false);

  const validateEmail = (email: string) => {
    const emailRegex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(email);
  };
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (validateEmail(email) && templateId.length == 36) {
      const toastId = toast.loading("Sending envelope...");
      try {
        const response = await initiateSigningProcess({
          email,
          signerName,
          templateId,
          signingType: isNotary ? "notary" : "regular",
        });
        toast.success("Envelope Sent Successfully");
      } catch (error: any) {
        toast.error(error.message);
        console.log("Failed to send envelope. Please try again.", error);
      }
      toast.dismiss(toastId);
    } else {
      toast.error("Enter Valid Email or Template ID");
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen justify-center bg-slate-900">
      <div className="max-w-md w-full mx-auto px-4">
        <h2 className="text-4xl font-serif mb-10 text-center text-white">
          Sign With DocuSign
        </h2>
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-lg p-8 space-y-6"
        >
          {/* <h3 className="text-2xl font-bold text-center text-black">
            Signer Details
          </h3> */}

          <div>
            <label
              htmlFor="templateId"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Template ID
            </label>
            <input
              type="text"
              id="templateId"
              placeholder="Enter Template ID"
              value={templateId}
              onChange={(e) => setTemplateId(e.target.value)}
              className="w-full px-3 py-2 text-black placeholder-gray-400 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition duration-150 ease-in-out"
              required
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 text-black placeholder-gray-400 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition duration-150 ease-in-out"
              required
            />
          </div>

          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              placeholder="Enter Name"
              value={signerName}
              onChange={(e) => setSignerName(e.target.value)}
              className="w-full px-3 py-2 text-black placeholder-gray-400 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition duration-150 ease-in-out"
              required
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="notary-signing"
              checked={isNotary}
              onChange={(e) => setIsNotary(e.target.checked)}
              className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
            />
            <label
              htmlFor="notary-signing"
              className="ml-2 block text-sm text-gray-900"
            >
              Notary Signing
            </label>
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition duration-150 ease-in-out"
          >
            Send Envelope
          </button>
        </form>
      </div>
    </div>
  );
};

export default DocuSignForm;
