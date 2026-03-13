import { initializeApp, getApps } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import { toDate } from "./date"
import { randomUUID } from "crypto"



function convertTimestamps(obj: unknown): unknown {
    if (obj === null || typeof obj !== "object") return obj;

    if (obj instanceof Timestamp) {
        return obj.toDate();
    }

    if (Array.isArray(obj)) {
        return obj.map(convertTimestamps);
    }

    const newObj: Record<string, unknown> = {};
    for (const key in obj as Record<string, unknown>) {
        newObj[key] = convertTimestamps((obj as Record<string, unknown>)[key]);
    }

    return newObj;
}


// Lazy initialization to avoid build-time errors
function getDb() {
    if (!getApps().length) {
        initializeApp();
    }
    return getFirestore();
}


export interface Admin {
    id: string;
    username: string;
    passwordHash: string;
    createdAt: Date;
    updatedAt: Date;
}

export const collections = {
    admins: 'admins',
    practices: 'practices',
    applications: 'applications',
    participants: 'participants',
    sessions: 'editSessions',
};

// 簡易認証用のセッションを作成
type EditSession = {
    applicationId: string;
    practiceId: string;
    purpose: "edit";
    expiresAt: number;
    createdAt: number;
};
export const createEditSession = async (
    applicationId: string,
    practiceId: string,
): Promise<string> => {
    const db = getDb();
    const sessionId = randomUUID();

    const session: EditSession = {
        applicationId,
        practiceId,
        purpose: "edit",
        createdAt: Date.now(),
        expiresAt: Date.now() + 30 * 60 * 1000, // 30分
    };

    await db.collection(collections.sessions).doc(sessionId).set(session);

    return sessionId;
};
export async function deleteEditSession(sessionId: string): Promise<void> {
    const db = getDb();
    await db.collection(collections.sessions).doc(sessionId).delete();
}

export interface Practice {
    id: string;
    date: Date;
    time: string;
    location: string;
    capacity: number | null;
    status: 'DRAFT' | 'PUBLISHED';
    createdAt: Date;
    updatedAt: Date;
    applicationCount?: number;
    applications?: (Application & { participants: Participant[] })[];
}

export interface Application {
    id: string;
    practiceId: string;
    headcount: number;
    password: string;
    isWinner: boolean | null;
    rank?: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface Participant {
    id: string;
    applicationId: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
}

// Practice Operations
export async function getPractices() {
    const db = getDb();
    const snapshot = await db
        .collection(collections.practices)
        .orderBy('date', 'desc')
        .get();

    return Promise.all(
        snapshot.docs.map(async (doc) => {
            const data = doc.data();

            const appSnapshot = await db
                .collection(collections.applications)
                .where('practiceId', '==', doc.id)
                .count()
                .get();

            const practice: Practice = {
                id: doc.id,
                date: toDate(data.date),
                time: data.time,
                location: data.location,
                capacity: data.capacity ?? null,
                status: data.status,
                createdAt: toDate(data.createdAt),
                updatedAt: toDate(data.updatedAt),
                applicationCount: appSnapshot.data().count,
            };

            return practice;
        })
    );
}

export async function getPracticeById(id: string) {
    const db = getDb();
    const doc = await db.collection(collections.practices).doc(id).get();
    if (!doc.exists) return null;
    const data = convertTimestamps(doc.data()!) as Record<string, unknown>;
    const practice = {
        id: doc.id,
        ...data,
    } as Practice;

    // Get applications with participants
    const apps = await getApplicationsForPractice(id);
    practice.applications = apps;

    return practice;
}

export async function createPractice(data: Omit<Practice, 'id' | 'createdAt' | 'updatedAt'>) {
    const db = getDb();
    const now = new Date();
    const docRef = await db.collection(collections.practices).add({
        ...data,
        createdAt: now,
        updatedAt: now,
    });
    return docRef.id;
}

export async function updatePractice(id: string, data: Partial<Omit<Practice, 'id' | 'createdAt'>>) {
    const db = getDb();
    await db.collection(collections.practices).doc(id).update({
        ...data,
        updatedAt: new Date(),
    });
}

export async function deletePractice(id: string) {
    const db = getDb();
    const batch = db.batch();
    const practiceRef = db.collection(collections.practices).doc(id);
    batch.delete(practiceRef);

    // Delete applications and participants
    const appsSnapshot = await db.collection(collections.applications)
        .where('practiceId', '==', id)
        .get();

    for (const appDoc of appsSnapshot.docs) {
        batch.delete(appDoc.ref);
        const pSnapshot = await db.collection(collections.participants)
            .where('applicationId', '==', appDoc.id)
            .get();
        pSnapshot.docs.forEach(pDoc => batch.delete(pDoc.ref));
    }

    await batch.commit();
}

export async function runLottery(practiceId: string, capacity: number) {
    const db = getDb();
    const batch = db.batch();

    const appsSnapshot = await db.collection(collections.applications)
        .where('practiceId', '==', practiceId)
        .get();

    const applications = appsSnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
    })) as Application[];

    // Shuffle
    const shuffled = [...applications].sort(() => Math.random() - 0.5);

    let currentTotal = 0;
    const winners: { id: string; rank: number }[] = [];
    const losers: { id: string; rank: number }[] = [];

    shuffled.forEach((app, index) => {
        const rank = index + 1; // ← 抽選順位

        if (currentTotal < capacity) {
            winners.push({ id: app.id, rank });
            currentTotal += app.headcount;
        } else {
            losers.push({ id: app.id, rank });
        }
    });

    // Update practice
    const practiceRef = db.collection(collections.practices).doc(practiceId);
    batch.update(practiceRef, {
        status: 'PUBLISHED',
        capacity,
        updatedAt: new Date(),
    });

    // Update winners
    winners.forEach(({ id, rank }) => {
        batch.update(db.collection(collections.applications).doc(id), {
            isWinner: true,
            rank,
            updatedAt: new Date(),
        });
    });

    // Update losers
    losers.forEach(({ id, rank }) => {
        batch.update(db.collection(collections.applications).doc(id), {
            isWinner: false,
            rank,
            updatedAt: new Date(),
        });
    });

    await batch.commit();
}


// 既存の抽選結果を、capacity に合わせて再計算する
export async function recalculateWinnersByRank(practiceId: string, capacity: number) {
    const db = getDb();
    const batch = db.batch();

    const appsSnapshot = await db.collection(collections.applications)
        .where('practiceId', '==', practiceId)
        .get();

    const applications = appsSnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
    })) as Application[];

    // 既存 rank の昇順で並べる
    const sorted = applications.sort((a, b) => (a.rank ?? 9999) - (b.rank ?? 9999));

    let currentTotal = 0;
    const winners: { id: string; rank: number }[] = [];
    const losers: { id: string; rank: number }[] = [];

    sorted.forEach(app => {
        const rank = app.rank ?? 9999;

        if (currentTotal < capacity) {
            winners.push({ id: app.id, rank });
            currentTotal += app.headcount;
        } else {
            losers.push({ id: app.id, rank });
        }
    });

    // Update practice
    const practiceRef = db.collection(collections.practices).doc(practiceId);
    batch.update(practiceRef, {
        capacity,
        updatedAt: new Date(),
        status: "PUBLISHED", // 公開状態は維持
    });

    // Update winners
    winners.forEach(({ id, rank }) => {
        batch.update(db.collection(collections.applications).doc(id), {
            isWinner: true,
            rank, // 既存 rank をそのまま使う
            updatedAt: new Date(),
        });
    });

    // Update losers
    losers.forEach(({ id, rank }) => {
        batch.update(db.collection(collections.applications).doc(id), {
            isWinner: false,
            rank,
            updatedAt: new Date(),
        });
    });

    await batch.commit();
}

// Admin Operations
export async function getAdminByUsername(username: string) {
    const db = getDb();
    const snapshot = await db.collection(collections.admins)
        .where('username', '==', username)
        .limit(1)
        .get();

    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    const raw = doc.data();
    const data = convertTimestamps(raw) as Record<string, unknown>;
    return {
        ...data,
        id: doc.id,
    } as Admin;
}

// Application Operations
export async function getApplicationsForPractice(practiceId: string) {
    const db = getDb();
    const snapshot = await db.collection(collections.applications)
        .where('practiceId', '==', practiceId)
        .orderBy('createdAt', 'desc')
        .get();

    const apps = await Promise.all(snapshot.docs.map(async doc => {
        const raw = doc.data();
        const data = convertTimestamps(raw) as Record<string, unknown>;
        const app = {
            ...data,
            id: doc.id,
        } as Application;

        // Get participants
        const participantsSnapshot = await db.collection(collections.participants)
            .where('applicationId', '==', app.id)
            .get();
        const participantsRaw = participantsSnapshot.docs.map((pDoc) => ({
            id: pDoc.id,
            ...pDoc.data(),
        }));
        const participants = convertTimestamps(participantsRaw) as Participant[];

        return { ...app, participants };
    }));

    return apps;
}

// Helper to delete all participants for an application
async function deleteParticipantsForApplication(batch: FirebaseFirestore.WriteBatch, appId: string) {
    const db = getDb();
    const participantsSnapshot = await db.collection(collections.participants)
        .where('applicationId', '==', appId)
        .get();
    participantsSnapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
    });
}

export async function createApplication(
    practiceId: string,
    data: Omit<Application, 'id' | 'practiceId' | 'createdAt' | 'updatedAt' | 'isWinner'>,
    participants: string[]
) {
    const db = getDb();
    const now = new Date();
    const batch = db.batch();

    const appRef = db.collection(collections.applications).doc();
    batch.set(appRef, {
        ...data,
        practiceId,
        isWinner: null,
        createdAt: now,
        updatedAt: now,
    });

    participants.forEach(name => {
        const pRef = db.collection(collections.participants).doc();
        batch.set(pRef, {
            applicationId: appRef.id,
            name,
            createdAt: now,
            updatedAt: now,
        });
    });

    await batch.commit();
    return appRef.id;
}

type VerifyApplicationResult =
    | {
        ok: true;
        application: Application;
        editSessionId: string;
    }
    | {
        ok: false;
        application: null;
        editSessionId: null;
    };
export async function verifyApplication(
    practiceId: string,
    name: string,
    password: string,
): Promise<VerifyApplicationResult> {
    const db = getDb();

    const appSnapshot = await db
        .collection(collections.applications)
        .where("practiceId", "==", practiceId)
        .where("password", "==", password)
        .get();

    for (const appDoc of appSnapshot.docs) {
        const pSnapshot = await db
            .collection(collections.participants)
            .where("applicationId", "==", appDoc.id)
            .where("name", "==", name)
            .limit(1)
            .get();

        if (!pSnapshot.empty) {
            const raw = appDoc.data();
            const data = convertTimestamps(raw) as Record<string, unknown>;

            const application = {
                id: appDoc.id,
                ...data,
            } as Application;

            const editSessionId = await createEditSession(appDoc.id, practiceId);

            return {
                ok: true,
                application,
                editSessionId,
            };
        }
    }

    return {
        ok: false,
        application: null,
        editSessionId: null,
    };
}

type EditSessionDoc = {
    applicationId: string;
    practiceId: string;
    purpose: "edit";
    expiresAt: number;
    createdAt: number;
};

export async function verifyEditSession(
    sessionId: string,
    applicationId: string,
    practiceId: string,
): Promise<boolean> {
    const db = getDb();

    const sessionDoc = await db.collection(collections.sessions).doc(sessionId).get();
    if (!sessionDoc.exists) return false;

    const data = sessionDoc.data() as EditSessionDoc | undefined;
    if (!data) return false;

    if (data.purpose !== "edit") return false;
    if (data.applicationId !== applicationId) return false;
    if (data.practiceId !== practiceId) return false;
    if (data.expiresAt < Date.now()) return false;

    return true;
}

export async function getApplicationById(id: string) {
    const db = getDb();
    const doc = await db.collection(collections.applications).doc(id).get();
    if (!doc.exists) return null;
    const data = convertTimestamps(doc.data()!) as Record<string, unknown>;
    return {
        id: doc.id,
        ...data,
    } as Application;
}

export async function updateApplication(
    appId: string,
    data: Omit<Partial<Application>, 'id' | 'createdAt' | 'updatedAt'>,
    participants?: string[]
) {
    const db = getDb();
    const now = new Date();
    const batch = db.batch();

    const appRef = db.collection(collections.applications).doc(appId);
    batch.update(appRef, {
        ...data,
        updatedAt: now,
    });

    if (participants) {
        // Delete existing and recreate
        await deleteParticipantsForApplication(batch, appId);
        participants.forEach(name => {
            const pRef = db.collection(collections.participants).doc();
            batch.set(pRef, {
                applicationId: appId,
                name,
                createdAt: now,
                updatedAt: now,
            });
        });
    }

    await batch.commit();
}

export async function deleteApplication(appId: string) {
    const db = getDb();
    const batch = db.batch();
    const appRef = db.collection(collections.applications).doc(appId);
    batch.delete(appRef);
    await deleteParticipantsForApplication(batch, appId);
    await batch.commit();
}
