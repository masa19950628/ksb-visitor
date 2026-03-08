import { getPracticeById, getApplicationById } from "@/lib/firestore"
import Link from "next/link"
import { verifyApplicationAction } from "../edit/actions"

export const dynamic = 'force-dynamic'

export default async function ResultApplicationPage({
    params,
    searchParams
}: {
    params: Promise<{ id: string }>
    searchParams: Promise<{ error?: string, appId?: string, token?: string }>
}) {
    const { id } = await params
    const { error, appId, token } = await searchParams

    const practice = await getPracticeById(id)
    if (!practice || practice.status !== "PUBLISHED") {
        return (
            <div className="max-w-md mx-auto mt-16 px-4 text-center">
                <h1 className="text-xl font-semibold mb-4">結果発表前</h1>

                <p className="text-gray-300 mb-8">
                    この練習会の抽選結果はまだ公開されていません。
                </p>

                <Link href="/" className="btn btn-primary">
                    一覧へ戻る
                </Link>
            </div>
        )
    }

    if (appId && token) {
        const app = await getApplicationById(appId)

        if (app && app.password === token) {
            // Fetch participants for result display
            const appsWithParticipants = await getPracticeById(id);
            const appWithParticipants = appsWithParticipants?.applications?.find(a => a.id === appId);

            if (appWithParticipants) {
                const isWinner = appWithParticipants.isWinner === true;
                return (
                    <div className="max-w-md mx-auto mt-16 px-4 text-center">
                        <div
                            className={`
      glass-panel p-8 rounded-xl border-2
      ${isWinner ? "border-green-400 bg-green-500/5" : "border-red-400 bg-red-500/5"}
    `}
                        >
                            <h1
                                className={`
        text-4xl font-bold mb-4
        ${isWinner ? "text-green-400" : "text-red-400"}
      `}
                            >
                                {isWinner ? "🎉 当選 🎉" : "😢 落選"}
                            </h1>

                            <p className="text-white text-lg mb-8">
                                {appWithParticipants.participants[0]?.name}（{appWithParticipants.headcount}名）
                            </p>

                            {isWinner ? (
                                <p className="text-gray-300 mb-8 leading-relaxed">
                                    おめでとうございます！練習会への参加が確定しました。<br />
                                    当日は気をつけてお越しください。
                                </p>
                            ) : (
                                <p className="text-gray-300 mb-8 leading-relaxed">
                                    誠に残念ながら、今回は定員を上回るお申し込みがあり、<br />
                                    厳正なる抽選の結果、落選となりました。<br />
                                    またのご参加をお待ちしております。
                                </p>
                            )}

                            <Link href="/" className="btn btn-secondary w-full">
                                一覧へ戻る
                            </Link>
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
                <h1 className="page-title" style={{ textAlign: "center", marginBottom: "1rem", fontSize: "1.5rem" }}>本人確認 (結果確認)</h1>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "2rem", textAlign: "center" }}>
                    抽選結果を確認するには、登録時の代表者氏名とパスワードを入力してください。
                </p>

                {error && (
                    <div style={{ padding: "0.75rem", background: "rgba(239, 68, 68, 0.2)", border: "1px solid #ef4444", borderRadius: "8px", color: "#fca5a5", marginBottom: "1.5rem", textAlign: "center" }}>
                        {error}
                    </div>
                )}

                <form action={verifyAction}>
                    <input type="hidden" name="actionType" value="result" />
                    <div className="form-group">
                        <label className="form-label">代表者氏名</label>
                        <input type="text" name="name" className="form-control" required />
                    </div>
                    <div className="form-group">
                        <label className="form-label">パスワード</label>
                        <input type="password" name="password" className="form-control" required />
                    </div>
                    <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
                        <Link href="/" className="btn btn-secondary" style={{ flex: 1 }}>キャンセル</Link>
                        <button type="submit" className="btn btn-primary" style={{ flex: 1, background: "linear-gradient(135deg, #8b5cf6, #ec4899)" }}>結果を見る</button>
                    </div>
                </form>
            </div>
        </div>
    )
}
