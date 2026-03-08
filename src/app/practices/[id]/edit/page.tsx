import { getPracticeById, getApplicationById } from "@/lib/firestore"
import Link from "next/link"
import { verifyApplicationAction } from "./actions"
import EditForm from "./EditForm"

export const dynamic = 'force-dynamic'

export default async function EditApplicationPage({
    params,
    searchParams
}: {
    params: Promise<{ id: string }>,
    searchParams: Promise<{ error?: string, appId?: string, token?: string, name?: string }>
}) {
    const { id } = await params
    const searchParamsObj = await searchParams
    const { error, appId, token, name } = searchParamsObj

    const practice = await getPracticeById(id)
    if (!practice || practice.status !== "DRAFT") {
        return (
            <div style={{ maxWidth: "600px", margin: "4rem auto", textAlign: "center" }}>
                <h1 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>変更受付終了</h1>
                <p style={{ color: "var(--text-secondary)", marginBottom: "2rem" }}>この練習会はすでに公開済みの為、変更や削除はできません。</p>
                <Link href="/" className="btn btn-primary">一覧へ戻る</Link>
            </div>
        )
    }

    if (appId && token) {
        const app = await getApplicationById(appId)

        if (app && app.password === token) {
            // Fetch participants for EditForm
            const appsWithParticipants = await getPracticeById(id);
            const appWithParticipants = appsWithParticipants?.applications?.find(a => a.id === appId);

            if (appWithParticipants) {
                return (
                    <div style={{ maxWidth: "600px", margin: "2rem auto" }}>
                        <h1 className="page-title" style={{ textAlign: "center", marginBottom: "2rem" }}>申し込み内容の変更・削除</h1>
                        <div className="glass-panel">
                            <EditForm application={appWithParticipants} />
                        </div>
                    </div>
                )
            }
        }
    }

    const verifyAction = verifyApplicationAction.bind(null, id)

    return (
        <div style={{ maxWidth: "400px", margin: "4rem auto" }}>
            <div className="glass-panel">
                <h1 className="page-title" style={{ textAlign: "center", marginBottom: "1rem", fontSize: "1.5rem" }}>本人確認 (変更・削除)</h1>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "2rem", textAlign: "center" }}>
                    申し込み内容を変更・削除するには、登録時の代表者氏名とパスワードを入力してください。
                </p>

                {error && (
                    <div style={{ padding: "0.75rem", background: "rgba(239, 68, 68, 0.2)", border: "1px solid #ef4444", borderRadius: "8px", color: "#fca5a5", marginBottom: "1.5rem", textAlign: "center" }}>
                        {error}
                    </div>
                )}

                <form action={verifyAction}>
                    <input type="hidden" name="actionType" value="edit" />
                    <div className="form-group">
                        <label className="form-label">代表者氏名</label>
                        <input type="text" name="name" className="form-control" defaultValue={name || ""} required />
                    </div>
                    <div className="form-group">
                        <label className="form-label">パスワード</label>
                        <input type="password" name="password" className="form-control" autoFocus required />
                    </div>
                    <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
                        <Link href="/" className="btn btn-secondary" style={{ flex: 1 }}>キャンセル</Link>
                        <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>認証する</button>
                    </div>
                </form>
            </div>
        </div>
    )
}
