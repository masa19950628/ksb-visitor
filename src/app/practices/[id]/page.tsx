import { getPracticeById } from "@/lib/firestore"
import Link from "next/link"
import { notFound } from "next/navigation"

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
        <div className="max-w-4xl mx-auto my-8 px-4">
            {/* 完了メッセージ */}
            {success === "completed" && (
                <div className="p-4 mb-6 text-center font-bold text-green-400 bg-green-500/15 border border-green-500/40 rounded-lg">
                    申し込みが完了しました
                </div>
            )}

            {/* タイトル行 */}
            <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
                <h1 className="page-title m-0">練習 詳細</h1>
                <Link href="/" className="btn btn-secondary">
                    一覧へ戻る
                </Link>
            </div>

            {/* 練習情報 */}
            <div
                className={`
      glass-panel p-6 rounded-xl mb-8 border-l-4
      ${isPublished ? "border-purple-400" : "border-blue-400"}
    `}
            >
                <h2 className="text-xl font-semibold mb-4">
                    {practice.date.toLocaleDateString("ja-JP")} ({practice.time})
                </h2>

                <div className="flex flex-wrap gap-4 text-gray-300 mb-6 break-words">
                    <span>📍 {practice.location}</span>
                    <span>📝 現在の申込組数: {applications.length}組</span>

                    <span
                        className={`
          px-2 py-1 rounded text-sm font-bold tracking-wide
          ${isPublished
                                ? "bg-purple-500/30 text-purple-200"
                                : "bg-blue-500/30 text-blue-200"}
        `}
                    >
                        {isPublished ? "抽選結果発表中" : "参加者募集中"}
                    </span>
                </div>

                {!isPublished && (
                    <div className="flex gap-4">
                        <Link href={`/practices/${practice.id}/register`} className="btn btn-primary">
                            新しく申し込む
                        </Link>
                    </div>
                )}
            </div>

            {/* 見出し */}
            <h2 className="text-lg font-semibold mb-6">
                {isPublished ? "当選者一覧" : "現在の申し込み一覧"}
            </h2>

            {/* 申し込みがない場合 */}
            {applications.filter(app => !isPublished || app.isWinner).length === 0 ? (
                <div className="glass-panel p-8 text-center rounded-xl">
                    <p className="text-gray-300">
                        {isPublished ? "該当する申し込みはありません。" : "まだ申し込みはありません。"}
                    </p>
                </div>
            ) : (
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {applications
                        .filter(app => !isPublished || app.isWinner)
                        .map(app => (
                            <div key={app.id} className="glass-panel p-6 rounded-xl relative break-words">
                                <div className="text-white font-bold text-lg mb-2">
                                    {app.participants[0]?.name}
                                </div>

                                <div className="text-gray-300 text-sm mb-6">
                                    参加人数: {app.headcount}名
                                </div>

                                {!isPublished ? (
                                    <Link
                                        href={`/practices/${practice.id}/edit?name=${encodeURIComponent(
                                            app.participants[0]?.name || ""
                                        )}`}
                                        className="btn btn-secondary w-full text-sm py-2"
                                    >
                                        編集・キャンセル
                                    </Link>
                                ) : (
                                    <div
                                        className={`
                  text-center font-bold text-sm py-2 rounded border
                  ${app.isWinner
                                                ? "text-green-400 bg-green-500/10 border-green-500/30"
                                                : "text-red-400 bg-red-500/10 border-red-500/30"}
                `}
                                    >
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
