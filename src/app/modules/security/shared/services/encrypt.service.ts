import { Injectable } from '@angular/core';
import * as CryptoJS from "crypto-js";

@Injectable({
  providedIn: 'root'
})
export class EncryptService {

  constructor() { }

  encrypt (textEncrypt, key): string {
    const keySize = 256;
    const salt = CryptoJS.lib.WordArray.random(16);
    const keyCrypto = CryptoJS.PBKDF2(key, salt, {
      keySize: keySize / 32,
      iterations: 100
    });
    const iv = CryptoJS.lib.WordArray.random(128 / 8);
    const encrypted = CryptoJS.AES.encrypt(textEncrypt, keyCrypto, {
      iv: iv,
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC
    });

    return CryptoJS.enc.Base64.stringify(salt.concat(iv).concat(encrypted.ciphertext));
  }
}
