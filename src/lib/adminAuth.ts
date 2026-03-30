import { redirect } from "next/navigation";
import { verifySession } from "@/lib/auth"
import { Role } from "./firestore";


export async function checkAdminAuth() {
    const session = await verifySession()
    if (!session) redirect("/admin/login")

    const ADMIN_UID = process.env.ADMIN_UID
    const MEMBER_UID = process.env.MEMBER_UID
    let role: Role | null = null;

    if (session.uid === ADMIN_UID) {
        // 1. 既存の ADMIN_UID (env) に合致する場合は ADMIN
        role = 'ADMIN';
    } else if (session.uid === MEMBER_UID) {
        // 2. 既存の MEMBER_UID (env) に合致する場合は MEMBER
        role = 'MEMBER';
    } else {
        redirect("/admin/login")
    }

    return {
        ...session,
        role
    }
}
