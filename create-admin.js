const { initializeApp, getApps } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

if (!getApps().length) {
    initializeApp();
}

const db = getFirestore();

async function createAdmin(username, password) {
    const adminRef = db.collection('admins').doc();
    await adminRef.set({
        username,
        passwordHash: password, // In production, use bcrypt!
        createdAt: new Date(),
        updatedAt: new Date(),
    });
    console.log(`Admin user ${username} created!`);
}

const username = process.argv[2];
const password = process.argv[3];

if (!username || !password) {
    console.log('Usage: node create-admin.js <username> <password>');
    process.exit(1);
}

createAdmin(username, password).catch(console.error);
