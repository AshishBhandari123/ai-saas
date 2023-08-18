"use client";

import { useEffect } from "react";
import { Crisp } from "crisp-sdk-web";

export const CrispChat = () => {
  useEffect(() => {
    Crisp.configure("521d717b-85d9-442b-8bf9-41a551978238");
  }, []);

  return null;
};