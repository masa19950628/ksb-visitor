import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const sessionCookie = request.cookies.get("__session")?.value;
    // セッションクッキーがない場合はログインページにリダイレクト
    if (!sessionCookie) {
        return NextResponse.redirect(new URL("/login", request.url));
    }
    // セッションクッキーがある場合は指定ページに遷移
    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|api|privacy|login|admin/login).*)",
    ],
};
