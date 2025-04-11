// scripts/generate-sw.js
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const ENV = process.env;

const configReplacements = {
  '__API_KEY__': ENV.VITE_FIREBASE_API_KEY,
  '__AUTH_DOMAIN__': ENV.VITE_FIREBASE_AUTHDOMAIN,
  '__PROJECT_ID__': ENV.VITE_FIREBASE_PROJECT_ID,
  '__STORAGE_BUCKET__': ENV.VITE_FIREBASE_STORAGE_BUCKET,
  '__MESSAGING_SENDER_ID__': ENV.VITE_FIREBASE_MESSAGING_SENDER_ID,
  '__APP_ID__': ENV.VITE_FIREBASE_APP_ID,
  '__MEASUREMENT_ID__': ENV.VITE_FIREBASE_MEASUREMENT_ID,
};

const swTemplate = fs.readFileSync(path.resolve('scripts/firebase-sw-template.js'), 'utf-8');
let filledConfig = swTemplate;

for (const [key, val] of Object.entries(configReplacements)) {
  filledConfig = filledConfig.replace(new RegExp(key, 'g'), val || '');
}

const baseLogic = fs.readFileSync(path.resolve('scripts/firebase-sw-base.js'), 'utf-8');

const finalSW = filledConfig + '\n' + baseLogic;

fs.writeFileSync(path.resolve('public/firebase-messaging-sw.js'), finalSW, 'utf-8');

console.log('✅ firebase-messaging-sw.js generated securely.');
