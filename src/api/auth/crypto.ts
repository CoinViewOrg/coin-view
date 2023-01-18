import CryptoJS from "crypto-js";

const SECRET = process.env.NEXTAUTH_SECRET;

export const encryptWithAES = (text: string) => {
  if (!SECRET) {
    throw new Error("No secret for encryption found!");
  }
  return CryptoJS.AES.encrypt(text, SECRET).toString();
};

export const decryptWithAES = (ciphertext: string) => {
  if (!SECRET) {
    throw new Error("No secret for descryption found!");
  }
  const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET);
  const originalText = bytes.toString(CryptoJS.enc.Utf8);
  return originalText;
};
