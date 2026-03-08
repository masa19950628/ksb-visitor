import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAuth } from "firebase-admin/auth";
import { verifySession } from "@/lib/auth"


export async function checkAdminAuth() {
    const session = await verifySession()
    if (!session) redirect("/admin/login")

    const ADMIN_UID = process.env.ADMIN_UID
    if (session.uid !== ADMIN_UID) redirect("/admin/login")

    return session
}
