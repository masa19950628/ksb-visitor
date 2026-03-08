export const runtime = "nodejs";
export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { adminAuth } from "../../../../lib/firebaseAdmin";

export async function POST(req: Request) {
    const { sessionCookie } = await req.json();

    try {
        const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
        return NextResponse.json({ ok: true, decoded });
    } catch {
        return NextResponse.json({ ok: false });
    }
}
