import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAuth } from "firebase-admin/auth";

export async function verifySession() {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("__session")?.value;

    if (!sessionCookie) return null;

    try {
        const decoded = await getAuth().verifySessionCookie(sessionCookie, true);
        return decoded; // uid, email, customClaims など
    } catch {
        return null;
    }
}