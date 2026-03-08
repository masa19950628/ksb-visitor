import { checkAdminAuth } from "@/lib/adminAuth"
import { getPractices } from "@/lib/firestore"
import Link from "next/link"

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
    // adminチェック
    await checkAdminAuth()

    const practices = await getPractices()

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                <h1 className="page-title" style={{ margin: 0 }}>管理ダッシュボード</h1>
                <Link href="/admin/practices/new" className="btn btn-primary">
                    + 練習会を新規作成
                </Link>
            </div>

            <div className="glass-panel">
                <h2 style={{ marginBottom: "1.5rem" }}>練習一覧</h2>

                {practices.length === 0 ? (
                    <p style={{ color: "var(--text-secondary)" }}>登録されている練習はありません。</p>
                ) : (
                    <div style={{ display: "grid", gap: "1rem" }}>
                        {practices.map((practice) => (
                            <div
                                key={practice.id}
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    padding: "1.5rem",
                                    background: "rgba(0,0,0,0.2)",
                                    borderRadius: "12px",
                                    border: "1px solid var(--glass-border)"
                                }}
                            >
                                <div>
                                    <h3 style={{ fontSize: "1.2rem", marginBottom: "0.5rem", color: "white" }}>
                                        {practice.date.toLocaleDateString("ja-JP")} ({practice.time})
                                    </h3>
                                    <div style={{ color: "var(--text-secondary)", fontSize: "0.9rem", display: "flex", gap: "1rem" }}>
                                        <span>📍 {practice.location}</span>
                                        <span>👥 定員: {practice.capacity}名</span>
                                        <span>📝 申込組数: {practice.applicationCount}組</span>
                                        <span style={{
                                            padding: "0.2rem 0.6rem",
                                            borderRadius: "4px",
                                            fontSize: "0.8rem",
                                            background: practice.status === 'PUBLISHED' ? "rgba(16, 185, 129, 0.2)" : "rgba(245, 158, 11, 0.2)",
                                            color: practice.status === 'PUBLISHED' ? "#34d399" : "#fbbf24"
                                        }}>
                                            {practice.status === 'PUBLISHED' ? '公開済 (結果発表)' : '募集受付中'}
                                        </span>
                                    </div>
                                </div>
                                <div style={{ display: "flex", gap: "0.5rem" }}>
                                    <Link href={`/admin/practices/${practice.id}`} className="btn btn-secondary">
                                        確認 / 抽選管理
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
