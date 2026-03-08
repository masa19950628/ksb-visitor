import { createPracticeAction } from "./actions"
import Link from "next/link"
import { checkAdminAuth } from "@/lib/adminAuth"

export default async function NewPracticePage({
    searchParams,
}: {
    searchParams: Promise<{ error?: string }>
}) {
    // adminチェック
    await checkAdminAuth()

    const params = await searchParams;

    return (
        <div style={{ maxWidth: "600px", margin: "2rem auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                <h1 className="page-title" style={{ margin: 0 }}>練習 新規作成</h1>
                <Link href="/admin" className="btn btn-secondary">
                    キャンセル
                </Link>
            </div>

            <div className="glass-panel">
                {params?.error && (
                    <div style={{ padding: "0.75rem", background: "rgba(239, 68, 68, 0.2)", border: "1px solid #ef4444", borderRadius: "8px", color: "#fca5a5", marginBottom: "1.5rem" }}>
                        {params.error}
                    </div>
                )}

                <form action={createPracticeAction}>
                    <div className="form-group">
                        <label className="form-label">日付</label>
                        <input type="date" name="date" className="form-control" required autoFocus />
                    </div>
                    <div className="form-group">
                        <label className="form-label">時間 (例: 19:00 - 21:00)</label>
                        <input
                            type="text"
                            name="time"
                            className="form-control"
                            list="time-options"
                            placeholder="12:30 - 17:00"
                            required
                        />
                        <datalist id="time-options">
                            <option value="12:30 - 17:00" />
                            <option value="15:00 - 19:00" />
                        </datalist>
                    </div>
                    <div className="form-group">
                        <label className="form-label">練習場所</label>
                        <input
                            type="text"
                            name="location"
                            className="form-control"
                            list="location-options"
                            placeholder="例: 市民体育館"
                            required
                        />
                        <datalist id="location-options">
                            <option value="亀高小学校" />
                            <option value="四砂中学校" />
                        </datalist>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "1.5rem" }}>
                        登録
                    </button>
                </form>
            </div>
        </div>
    )
}
