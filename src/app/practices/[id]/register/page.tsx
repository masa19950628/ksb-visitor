import { getPracticeById } from "@/lib/firestore"
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
            <div className="max-w-md mx-auto mt-16 px-4 text-center">
                <h1 className="text-xl font-semibold mb-4">受付終了</h1>

                <p className="text-gray-300 mb-8">
                    この練習会の申し込みは終了しているか、存在しません。
                </p>

                <Link href="/" className="btn btn-primary">
                    一覧へ戻る
                </Link>
            </div>
        )
    }

    return (
        <div className="max-w-xl mx-auto my-8 px-4">
            {/* タイトル行 */}
            <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
                <h1 className="page-title m-0">参加申し込み</h1>
                <Link href="/" className="btn btn-secondary">
                    キャンセル
                </Link>
            </div>

            {/* エラー表示 */}
            {error && (
                <div className="p-3 mb-6 rounded-lg border border-red-500 bg-red-500/20 text-red-300">
                    {error}
                </div>
            )}

            {/* 練習情報 */}
            <div className="glass-panel p-6 rounded-xl mb-8">
                <h2 className="text-lg font-semibold mb-2">
                    {practice.date.toLocaleDateString("ja-JP")} ({practice.time})
                </h2>
                <p className="text-gray-300">📍 {practice.location}</p>
            </div>

            {/* 申し込みフォーム */}
            <div className="glass-panel p-6 rounded-xl">
                <RegisterForm practiceId={practice.id} />
            </div>
        </div>
    )
}
