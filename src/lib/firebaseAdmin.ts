import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const apps = getApps();

// default app を探す
let app = apps.find(a => a.name === "[DEFAULT]");

if (!app) {
    app = initializeApp({
        credential: cert({
            projectId: process.env.ADMIN_PROJECT_ID,
            clientEmail: process.env.ADMIN_CLIENT_EMAIL,
            privateKey: process.env.ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        }),
    });
}

export const adminAuth = getAuth(app);