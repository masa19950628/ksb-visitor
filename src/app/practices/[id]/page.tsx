import { getPracticeById } from "@/lib/firestore"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Timestamp } from "firebase-admin/firestore";

export const dynamic = 'force-dynamic'

export default async function PracticeDetailPage({
    params,
    searchParams
}: {
    params: Promise<{ id: string }>
    searchParams: Promise<{ success?: string }>
}) {
    const { id } = await params
    const { success } = await searchParams

    const practice = await getPracticeById(id)

    if (!practice) notFound()

    const applications = practice.applications || []
    const isPublished = practice.status === "PUBLISHED"

    return (
        <div style={{ maxWidth: "800px", margin: "2rem auto" }}>
            {success === "completed" && (
                <div
                    style={{
                        padding: "1rem",
                        marginBottom: "1.5rem",
                        background: "rgba(16, 185, 129, 0.15)",
                        border: "1px solid rgba(16, 185, 129, 0.4)",
                        borderRadius: "8px",
                        color: "#34d399",
                        fontWeight: "bold",
                        textAlign: "center",
                    }}
                >
                    申し込みが完了しました
                </div>
            )}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                <h1 className="page-title" style={{ margin: 0 }}>練習 詳細</h1>
                <Link href="/" className="btn btn-secondary">一覧へ戻る</Link>
            </div>

            <div className="glass-panel" style={{ marginBottom: "2rem", borderLeft: isPublished ? "4px solid #8b5cf6" : "4px solid #3b82f6" }}>
                <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>{practice.date.toLocaleDateString("ja-JP")} ({practice.time})</h2>
                <div style={{ color: "var(--text-secondary)", marginBottom: "1.5rem", display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
                    <span>📍 {practice.location}</span>
                    <span>📝 現在の申込組数: {applications.length}組</span>
                    <span style={{
                        padding: "0.2rem 0.6rem",
                        borderRadius: "4px",
                        background: isPublished ? "rgba(139, 92, 246, 0.2)" : "rgba(59, 130, 246, 0.2)",
                        color: isPublished ? "#c4b5fd" : "#93c5fd"
                    }}>
                        {isPublished ? '抽選結果発表中' : '参加者募集中'}
                    </span>
                </div>

                <div style={{ display: "flex", gap: "1rem" }}>
                    {!isPublished && (
                        <Link href={`/practices/${practice.id}/register`} className="btn btn-primary">
                            新しく申し込む
                        </Link>
                    )}
                </div>
            </div>

            <h2 style={{ fontSize: "1.3rem", marginBottom: "1.5rem" }}>
                {isPublished ? "当選者一覧" : "現在の申し込み一覧"}
            </h2>

            {applications.filter(app => !isPublished || app.isWinner).length === 0 ? (
                <div className="glass-panel" style={{ textAlign: "center", padding: "2rem" }}>
                    <p style={{ color: "var(--text-secondary)" }}>
                        {isPublished ? "該当する申し込みはありません。" : "まだ申し込みはありません。"}
                    </p>
                </div>
            ) : (
                <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
                    {applications.filter(app => !isPublished || app.isWinner).map((app) => (
                        <div key={app.id} className="glass-panel" style={{ padding: "1.5rem", position: "relative" }}>
                            <div style={{ fontWeight: "bold", fontSize: "1.1rem", marginBottom: "0.5rem", color: "white" }}>
                                {app.participants[0]?.name}
                            </div>
                            <div style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
                                参加人数: {app.headcount}名
                            </div>

                            {!isPublished ? (
                                <Link
                                    href={`/practices/${practice.id}/edit?name=${encodeURIComponent(app.participants[0]?.name || "")}`}
                                    className="btn btn-secondary"
                                    style={{ width: "100%", fontSize: "0.85rem", padding: "0.5rem" }}
                                >
                                    編集・キャンセル
                                </Link>
                            ) : (
                                <div style={{
                                    fontSize: "0.95rem",
                                    fontWeight: "bold",
                                    color: app.isWinner ? "#34d399" : "#ef4444",
                                    textAlign: "center",
                                    padding: "0.5rem",
                                    border: `1px solid ${app.isWinner ? "rgba(52, 211, 153, 0.3)" : "rgba(239, 68, 68, 0.3)"}`,
                                    background: app.isWinner ? "rgba(52, 211, 153, 0.1)" : "rgba(239, 68, 68, 0.1)",
                                    borderRadius: "4px"
                                }}>
                                    {app.isWinner ? "🎉 当選" : "😔 落選"}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
