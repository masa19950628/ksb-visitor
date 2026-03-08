import { getPracticeById } from "@/lib/firestore"
import { notFound } from "next/navigation"
import Link from "next/link"
import RegisterForm from "./RegisterForm"

export const dynamic = 'force-dynamic'

export default async function RegisterPage({
    params,
    searchParams
}: {
    params: Promise<{ id: string }>
    searchParams: Promise<{ error?: string }>
}) {
    const { id } = await params
    const { error } = await searchParams

    const practice = await getPracticeById(id)

    if (!practice || practice.status !== "DRAFT") {
        return (
            <div style={{ maxWidth: "600px", margin: "4rem auto", textAlign: "center" }}>
                <h1 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>受付終了</h1>
                <p style={{ color: "var(--text-secondary)", marginBottom: "2rem" }}>この練習会の申し込みは終了しているか、存在しません。</p>
                <Link href="/" className="btn btn-primary">一覧へ戻る</Link>
            </div>
        )
    }

    return (
        <div style={{ maxWidth: "600px", margin: "2rem auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                <h1 className="page-title" style={{ margin: 0 }}>参加申し込み</h1>
                <Link href="/" className="btn btn-secondary">キャンセル</Link>
            </div>

            {error && (
                <div style={{ padding: "0.75rem", background: "rgba(239, 68, 68, 0.2)", border: "1px solid #ef4444", borderRadius: "8px", color: "#fca5a5", marginBottom: "1.5rem" }}>
                    {error}
                </div>
            )}

            <div className="glass-panel" style={{ marginBottom: "2rem" }}>
                <h2 style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>
                    {practice.date.toLocaleDateString("ja-JP")} ({practice.time})
                </h2>
                <p style={{ color: "var(--text-secondary)" }}>📍 {practice.location}</p>
            </div>

            <div className="glass-panel">
                <RegisterForm practiceId={practice.id} />
            </div>
        </div>
    )
}
