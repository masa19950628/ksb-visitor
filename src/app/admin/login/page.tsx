"use client";
export const fetchCache = "force-no-store";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebaseClient";

export default function AdminLoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");


    async function handleLogin() {
        setLoading(true);
        setError("");

        try {
            // 入力された email にドメインを付ける
            const fullEmail = email.includes("@")
                ? email
                : `${email}@example.com`; // ← 好きなドメインに変更
            // ① Firebase Auth（クライアント）でログイン
            const user = await signInWithEmailAndPassword(
                auth,
                fullEmail,
                password
            );

            // ② ID トークンを取得
            const idToken = await user.user.getIdToken(true);

            // ③ API に送ってセッション Cookie を発行
            const res = await fetch("/api/login/admin", {
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

            // ④ ログイン成功
            window.location.href = "/admin";
        } catch (e) {
            console.error(e);
            setError("ログインに失敗しました");
            setLoading(false);
        }
    }

    return (
        <div className="max-w-sm mx-auto mt-16 px-4">
            <div className="glass-panel p-6 rounded-xl">
                <h1 className="page-title text-center mb-6">管理者ログイン</h1>

                <div className="form-group mb-4">
                    <label className="form-label block mb-1">ログインID</label>
                    <input
                        type="email"
                        placeholder="ログインID"
                        className="form-control w-full"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group mb-6">
                    <label className="form-label block mb-1">パスワード</label>
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
                    className="btn btn-primary w-full py-2"
                >
                    {loading ? "ログイン中..." : "ログイン"}
                </button>

                {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
            </div>
        </div>
    );
}
