import { getPracticeById } from "@/lib/firestore"
import Link from "next/link"
import { publishAndRunLottery, deletePracticeAction } from "./actions"
import { notFound } from "next/navigation"
import DeleteButton from "@/components/DeleteButton"
import { checkAdminAuth } from "@/lib/adminAuth"
import { redirect } from "next/navigation"


export const dynamic = 'force-dynamic'

export default async function AdminPracticeDetails({
    params,
    searchParams
}: {
    params: Promise<{ id: string }>
    searchParams: Promise<{ error?: string }>
}) {
    // adminチェック
    await checkAdminAuth()
    const { id } = await params
    const { error } = await searchParams

    const practice = await getPracticeById(id)

    if (!practice) notFound()

    const applications = practice.applications || []
    const isPublished = practice.status === "PUBLISHED"
    const totalApplicants = applications.reduce((acc, app) => acc + app.headcount, 0)

    const winners = applications
        .filter(a => a.isWinner)
        .sort((a, b) => (a.rank ?? 9999) - (b.rank ?? 9999));
    const losers = applications
        .filter(a => a.isWinner === false)
        .sort((a, b) => (a.rank ?? 9999) - (b.rank ?? 9999));
    const totalWinnersCount = winners.reduce((acc, app) => acc + app.headcount, 0)

    // bind actions
    const publishAction = publishAndRunLottery.bind(null, practice.id)
    const deleteAction = deletePracticeAction.bind(null, practice.id)

    return (
        <div style={{ maxWidth: "800px", margin: "2rem auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                <h1 className="page-title" style={{ margin: 0 }}>練習詳細</h1>
                <Link href="/admin" className="btn btn-secondary">一覧へ戻る</Link>
            </div>

            {error && (
                <div style={{ padding: "0.75rem", background: "rgba(239, 68, 68, 0.2)", border: "1px solid #ef4444", borderRadius: "8px", color: "#fca5a5", marginBottom: "1.5rem" }}>
                    {error}
                </div>
            )}

            <div className="glass-panel" style={{ marginBottom: "2rem" }}>
                <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>{practice.date.toLocaleDateString("ja-JP")} ({practice.time})</h2>
                <div style={{ color: "var(--text-secondary)", marginBottom: "1.5rem", display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
                    <span>📍 {practice.location}</span>
                    <span>👥 設定定員: {practice.capacity ? `${practice.capacity}名` : "未定"}</span>
                    <span>📝 申込者合計: {totalApplicants}名 ({applications.length}組)</span>
                    <span style={{
                        padding: "0.2rem 0.6rem",
                        borderRadius: "4px",
                        background: isPublished ? "rgba(16, 185, 129, 0.2)" : "rgba(245, 158, 11, 0.2)",
                        color: isPublished ? "#34d399" : "#fbbf24"
                    }}>
                        {isPublished ? '公開済 (結果発表)' : '募集受付中'}
                    </span>
                </div>

                {!isPublished ? (
                    <form action={publishAction} style={{ background: "rgba(0,0,0,0.2)", padding: "1.5rem", borderRadius: "8px", border: "1px solid var(--accent-blue)" }}>
                        <h3 style={{ marginBottom: "1rem", color: "var(--accent-blue)" }}>抽選の実行と結果公開</h3>
                        <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "1rem" }}>
                            現在の申し込み状況からランダムに当選者を決定し、結果を公開します。一度公開すると元に戻せません。
                        </p>
                        <div style={{ display: "flex", gap: "1rem", alignItems: "flex-end" }}>
                            <div style={{ flex: 1 }}>
                                <label className="form-label">最終定員 (グループ単位で当選するため、この数値を多少オーバーする場合があります)</label>
                                <input type="number" name="capacity" className="form-control" defaultValue={practice.capacity ?? ""} required />
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ whiteSpace: "nowrap" }}>
                                抽選して公開する
                            </button>
                        </div>
                    </form>
                ) : (
                    <div style={{ padding: "1rem", background: "rgba(16, 185, 129, 0.1)", borderRadius: "8px", border: "1px solid rgba(16, 185, 129, 0.3)" }}>
                        <h3 style={{ color: "#34d399", marginBottom: "0.5rem" }}>🎉 抽選完了</h3>
                        <p style={{ fontSize: "0.95rem" }}>当選者合計: {totalWinnersCount}名 / 落選者合計: {totalApplicants - totalWinnersCount}名</p>
                    </div>
                )}
            </div>

            <div className="glass-panel" style={{ marginBottom: "2rem" }}>
                {isPublished ? (
                    <>
                        <h2 style={{ marginBottom: "1.5rem", color: "#34d399" }}>当選者一覧 ({winners.length}組)</h2>
                        <div style={{ display: "grid", gap: "1rem", marginBottom: "3rem" }}>
                            {winners.map(app => (
                                <div key={app.id} style={{ padding: "1rem", background: "rgba(255,255,255,0.05)", borderRadius: "8px", borderLeft: "4px solid #34d399", position: "relative" }}>

                                    {/* rank バッジ */}
                                    <div style={{
                                        position: "absolute",
                                        top: "0.5rem",
                                        right: "0.5rem",
                                        background: "rgba(255,255,255,0.1)",
                                        padding: "0.3rem 0.6rem",
                                        borderRadius: "4px",
                                        fontSize: "0.85rem",
                                        fontWeight: "bold",
                                        color: "white",
                                    }}>
                                        {`${app.rank}`}
                                    </div>

                                    <div style={{ fontWeight: "bold", marginBottom: "0.5rem", color: "white" }}>
                                        代表: {app.participants[0]?.name} ({app.headcount}名)
                                    </div>
                                    <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                                        同行者: {app.participants.slice(1).map(p => p.name).join(", ") || "なし"}
                                    </div>
                                </div>
                            ))}
                            {winners.length === 0 && <p style={{ color: "var(--text-secondary)" }}>当選者はいません。</p>}
                        </div>

                        <h2 style={{ marginBottom: "1.5rem", color: "#ef4444" }}>落選者一覧 ({losers.length}組)</h2>
                        <div style={{ display: "grid", gap: "1rem" }}>
                            {losers.map(app => (
                                <div key={app.id} style={{ padding: "1rem", background: "rgba(255,255,255,0.02)", borderRadius: "8px", borderLeft: "4px solid #ef4444", position: "relative" }}>

                                    {/* rank バッジ */}
                                    <div style={{
                                        position: "absolute",
                                        top: "0.5rem",
                                        right: "0.5rem",
                                        background: "rgba(255,255,255,0.05)",
                                        padding: "0.3rem 0.6rem",
                                        borderRadius: "4px",
                                        fontSize: "0.85rem",
                                        fontWeight: "bold",
                                        color: "#ef4444",
                                    }}>
                                        {`${app.rank}`}
                                    </div>

                                    <div style={{ fontWeight: "bold", marginBottom: "0.5rem", color: "white" }}>
                                        代表: {app.participants[0]?.name} ({app.headcount}名)
                                    </div>
                                    <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                                        同行者: {app.participants.slice(1).map(p => p.name).join(", ") || "なし"}
                                    </div>
                                </div>
                            ))}
                            {losers.length === 0 && <p style={{ color: "var(--text-secondary)" }}>落選者はいません。</p>}
                        </div>
                    </>
                ) : (
                    <>
                        <h2 style={{ marginBottom: "1.5rem" }}>現在の申し込み一覧 ({applications.length}組)</h2>
                        <div style={{ display: "grid", gap: "1rem" }}>
                            {applications.map(app => (
                                <div key={app.id} style={{ padding: "1rem", background: "rgba(255,255,255,0.05)", borderRadius: "8px", borderLeft: "4px solid var(--accent-blue)" }}>
                                    <div style={{ fontWeight: "bold", marginBottom: "0.5rem", color: "white" }}>代表: {app.participants[0]?.name} ({app.headcount}名)</div>
                                    <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                                        同行者: {app.participants.slice(1).map(p => p.name).join(", ") || "なし"}
                                    </div>
                                </div>
                            ))}
                            {applications.length === 0 && <p style={{ color: "var(--text-secondary)" }}>申し込みはまだありません。</p>}
                        </div>
                    </>
                )}
            </div>

            <div style={{ textAlign: "right" }}>
                <form action={deleteAction}>
                    <DeleteButton />
                </form>
            </div>
        </div>
    )
}
