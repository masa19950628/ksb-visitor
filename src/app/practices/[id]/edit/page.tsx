import { getPracticeById, verifyEditSession } from "@/lib/firestore"
import Link from "next/link"
import { verifyApplicationAction } from "./actions"
import EditForm from "./EditForm"

export const dynamic = 'force-dynamic'

export default async function EditApplicationPage({
    params,
    searchParams
}: {
    params: Promise<{ id: string }>,
    searchParams: Promise<{ error?: string, appId?: string, session?: string, name?: string }>
}) {
    const { id } = await params
    const searchParamsObj = await searchParams
    const { error, appId, session, name } = searchParamsObj

    const practice = await getPracticeById(id)
    if (!practice || practice.status !== "DRAFT") {
        return (
            <div className="max-w-md mx-auto mt-16 px-4 text-center">
                <h1 className="text-xl font-semibold mb-4">変更受付終了</h1>

                <p className="text-gray-300 mb-8">
                    この練習会はすでに公開済みの為、変更や削除はできません。
                </p>

                <Link href="/" className="btn btn-primary">
                    一覧へ戻る
                </Link>
            </div>
        )
    }

    if (appId && session) {
        const ok = await verifyEditSession(session, appId, id);
        if (ok) {
            // Fetch participants for EditForm
            const appsWithParticipants = await getPracticeById(id);
            const appWithParticipants = appsWithParticipants?.applications?.find(a => a.id === appId);

            if (appWithParticipants) {
                return (
                    <div className="max-w-xl mx-auto my-8 px-4">
                        <h1 className="page-title text-center mb-8">申し込み内容の変更・削除</h1>

                        <div className="glass-panel p-6 rounded-xl">
                            <EditForm application={appWithParticipants} editSessionId={session} />
                        </div>
                    </div>

                )
            }
        }
    }

    const verifyAction = verifyApplicationAction.bind(null, id)

    return (
        <div className="max-w-md mx-auto mt-16 px-4">
            <div className="glass-panel p-6 rounded-xl">
                <h1 className="page-title text-center text-xl mb-4">
                    本人確認 (変更・削除)
                </h1>

                <p className="text-gray-300 text-sm text-center mb-8">
                    申し込み内容を変更・削除するには、登録時の代表者氏名とパスワードを入力してください。
                </p>

                {error && (
                    <div className="p-3 mb-6 rounded-lg border border-red-500 bg-red-500/20 text-red-300 text-center">
                        {error}
                    </div>
                )}

                <form action={verifyAction}>
                    <input type="hidden" name="actionType" value="edit" />

                    <div className="form-group mb-4">
                        <label className="form-label block mb-1">代表者氏名</label>
                        <input
                            type="text"
                            name="name"
                            className="form-control w-full"
                            defaultValue={name || ""}
                            required
                        />
                    </div>

                    <div className="form-group mb-6">
                        <label className="form-label block mb-1">パスワード</label>
                        <input
                            type="password"
                            name="password"
                            className="form-control w-full"
                            autoFocus
                            required
                        />
                    </div>

                    <div className="flex gap-4">
                        <Link href="/" className="btn btn-secondary flex-1 text-center">
                            キャンセル
                        </Link>
                        <button type="submit" className="btn btn-primary flex-1">
                            認証する
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
