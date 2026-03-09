"use client";
export const fetchCache = "force-no-store";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebaseClient";

export default function UserLoginPage() {

    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleLogin() {
        setLoading(true);
        setError("");

        try {
            // ① Firebase Auth（クライアント）でログイン
            const suffix = process.env.NEXT_PUBLIC_PASSWORD_SUFFIX ?? "";
            const user = await signInWithEmailAndPassword(
                auth,
                "user@example.com",
                password + suffix
            );

            // ② ID トークンを取得
            const idToken = await user.user.getIdToken(true);

            // ③ API に送ってセッション Cookie を発行
            const res = await fetch("/api/login/user", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ idToken }),
            });

            const data = await res.json();

            if (!data.ok) {
                setError("ログインに失敗しました");
                setLoading(false);
                return;
            }

            window.location.href = "/";
        } catch (e) {
            console.error(e);
            setError("ログインに失敗しました");
            setLoading(false);
        }
    }

    return (
        <div className="max-w-sm mx-auto mt-20 px-4">
            <div className="glass-panel rounded-xl">
                <h1 className="page-title text-center mb-8">ログイン</h1>

                <div className="form-group">
                    <label className="form-label">共通パスワード</label>
                    <input
                        type="password"
                        placeholder="パスワード"
                        className="form-control w-full"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button
                    type="button"
                    onClick={handleLogin}
                    className="btn btn-primary w-full py-3 mt-4"
                >
                    {loading ? "ログイン中..." : "ログイン"}
                </button>

                {error && (
                    <p className="text-red-500 text-sm mt-4 text-center">{error}</p>
                )}
            </div>
        </div>

    );
}
