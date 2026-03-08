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
        <div style={{ maxWidth: "400px", margin: "4rem auto" }}>
            <div className="glass-panel">
                <h1 className="page-title" style={{ textAlign: "center", marginBottom: "1rem" }}>管理者ログイン</h1>

                <div className="form-group">
                    <label className="form-label">ログインID</label>
                    <input
                        type="email"
                        placeholder="ログインID"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">パスワード</label>
                    <input
                        type="password"
                        placeholder="パスワード"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>


                <button
                    type="button"
                    onClick={handleLogin}
                    className="btn btn-primary"
                    style={{ width: "100%", marginTop: "1rem" }}
                >
                    {loading ? "ログイン中..." : "ログイン"}
                </button>

                {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
            </div>
        </div>
    );
}
