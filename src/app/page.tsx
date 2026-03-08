import { getPractices } from "@/lib/firestore"
import Link from "next/link"
import { verifySession } from "@/lib/auth";
import { redirect } from "next/navigation"

export const dynamic = 'force-dynamic'

export default async function UserHomepage() {
  // セッションチェック
  const session = await verifySession();
  if (!session) redirect("/login");
  const practices = await getPractices()

  return (
    <div style={{ maxWidth: "800px", margin: "2rem auto" }}>
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <h1 className="page-title" style={{ fontSize: "2.5rem", marginBottom: "1rem", background: "linear-gradient(135deg, var(--accent-blue), var(--accent-purple))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          KSB練習<br />ビジター参加申し込み
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem" }}>
          参加を希望する日程を選んでお申し込みください。
        </p>
      </div>

      <div style={{ display: "grid", gap: "1.5rem" }}>
        {practices.length === 0 ? (
          <div className="glass-panel" style={{ textAlign: "center", padding: "3rem" }}>
            <p style={{ color: "var(--text-secondary)", fontSize: "1.2rem" }}>現在募集中の練習会はありません。</p>
          </div>
        ) : (
          practices.map((practice) => {
            const isPublished = practice.status === "PUBLISHED"
            return (
              <div
                key={practice.id}
                className="glass-panel"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "1.5rem 2rem",
                  transition: "transform 0.3s ease",
                  borderLeft: isPublished ? "4px solid #8b5cf6" : "4px solid #3b82f6"
                }}
              >
                <div>
                  <h2 style={{ fontSize: "1.5rem", marginBottom: "0.5rem", color: "white" }}>
                    {practice.date.toLocaleDateString("ja-JP")} ({practice.time})
                  </h2>
                  <div style={{ color: "var(--text-secondary)", fontSize: "1rem", display: "flex", gap: "1.5rem" }}>
                    <span>📍 {practice.location}</span>
                    <span style={{
                      padding: "0.2rem 0.6rem",
                      borderRadius: "6px",
                      fontSize: "0.85rem",
                      background: isPublished ? "rgba(139, 92, 246, 0.2)" : "rgba(59, 130, 246, 0.2)",
                      color: isPublished ? "#c4b5fd" : "#93c5fd"
                    }}>
                      {isPublished ? '抽選結果発表中' : '参加者募集中'}
                    </span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "0.75rem", flexDirection: "column", minWidth: "160px" }}>
                  <Link href={`/practices/${practice.id}`} className="btn btn-primary" style={{ width: "100%" }}>
                    {isPublished ? "抽選結果へ" : "詳細・申し込みへ"}
                  </Link>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
