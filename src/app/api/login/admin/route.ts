export const runtime = "nodejs";
export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebaseAdmin";
import { cookies } from "next/headers";

export async function POST(req: Request) {
    const { idToken } = await req.json();
    const expiresIn = 60 * 60 * 24 * 5 * 1000;
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });

    const cookieStore = await cookies();

    cookieStore.set("__session", sessionCookie, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
    });

    return NextResponse.json({ ok: true });
}
