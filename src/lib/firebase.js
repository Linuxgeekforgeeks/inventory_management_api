import admin from "firebase-admin";
import { createRequire } from "module";
const require = createRequire(import.meta.url);

const serviceAccount = require("../configs/firebaseAdmin.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "inventory-app-71323.appspot.com",
  });
}

export const db = admin.firestore();
export const bucket = admin.storage().bucket();
export const auth = admin.auth();
