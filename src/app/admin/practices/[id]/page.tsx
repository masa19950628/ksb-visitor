import { getPracticeById } from "@/lib/firestore"
import Link from "next/link"
import { publishAndRunLottery, deletePracticeAction, updateCapacityOnly, deleteApplicationAction } from "./actions"
import { notFound } from "next/navigation"
import DeleteButton from "@/components/DeleteButton"
import { checkAdminAuth } from "@/lib/adminAuth"
import WinnerListToggle from "./WinnerListToggle";
import CapacityForm from "./CapacityForm";
import SpecialVisitorForm from "./SpecialVisitorForm";



export const dynamic = 'force-dynamic'

export default async function AdminPracticeDetails({
    params,
    searchParams
}: {
    params: Promise<{ id: string }>
    searchParams: Promise<{ error?: string, success?: string }>
}) {
    // adminチェック
    await checkAdminAuth()
    const { id } = await params
    const { error, success } = await searchParams

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
        <div className="max-w-3xl mx-auto my-8 px-4">
            {/* タイトル行 */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
                <h1 className="page-title m-0">練習詳細</h1>
                <Link href="/admin" className="btn btn-secondary w-full sm:w-auto text-center">
                    一覧へ戻る
                </Link>
            </div>

            {/* メッセージ表示 */}
            {error && (
                <div className="p-3 mb-6 rounded-lg border border-red-500 bg-red-500/20 text-red-300">
                    {error}
                </div>
            )}
            {success === 'registered' && (
                <div className="p-3 mb-6 rounded-lg border border-green-500 bg-green-500/20 text-green-300">
                    特別枠を登録しました
                </div>
            )}
            {success === 'deleted' && (
                <div className="p-3 mb-6 rounded-lg border border-red-500 bg-red-500/20 text-red-300">
                    特別枠を削除しました
                </div>
            )}

            {/* 基本情報 */}
            <div className="glass-panel mb-8 p-6 rounded-xl">
                <h2 className="text-xl font-semibold mb-4">
                    {practice.date.toLocaleDateString("ja-JP")} ({practice.time})
                </h2>

                <div className="flex flex-wrap gap-4 text-gray-300 mb-6 break-words">
                    <span>📍 {practice.location}</span>
                    <span>👥 設定定員: {practice.capacity ? `${practice.capacity}名` : "未定"}</span>
                    <span>📝 申込者合計: {totalApplicants}名 ({applications.length}組)</span>

                    <span
                        className={`px-2 py-1 rounded text-sm font-semibold ${isPublished
                            ? "bg-green-500/20 text-green-400"
                            : "bg-amber-500/20 text-amber-400"
                            }`}
                    >
                        {isPublished ? "公開済 (結果発表)" : "募集受付中"}
                    </span>
                </div>

                {/* 抽選フォーム or 結果 */}
                {!isPublished ? (
                    <div className="space-y-6">
                        <SpecialVisitorForm practiceId={practice.id} />
                        <CapacityForm
                            action={publishAction}
                            title="抽選の実行と結果公開"
                            description="現在の申し込み状況からランダムに当選者を決定し、結果を公開します。"
                            buttonText="抽選して公開する"
                            defaultCapacity={practice.capacity}
                        />
                    </div>
                ) : (
                    <div className="p-4 rounded-lg border border-green-500/40 bg-green-500/10">
                        <h3 className="text-green-400 mb-1">🎉 抽選完了</h3>
                        <p className="text-sm">
                            当選者合計: {totalWinnersCount}名 / 落選者合計: {totalApplicants - totalWinnersCount}名
                        </p>
                    </div>
                )}
            </div>
            {/* ★ 公開済み定員変更フォーム */}
            {isPublished && (
                <CapacityForm
                    action={updateCapacityOnly.bind(null, practice.id)}
                    title="定員の再設定"
                    description="既存の順位に従って当選者を再判定します。抽選は行いません。"
                    buttonText="定員を更新する"
                    defaultCapacity={practice.capacity}
                    className="mt-6"
                />
            )}

            {isPublished && <WinnerListToggle winners={winners} />}

            {/* 当選者・落選者 or 申込者一覧 */}
            <div className="glass-panel p-6 rounded-xl mb-8">
                {isPublished ? (
                    <>
                        {/* 当選者 */}
                        <h2 className="text-green-400 mb-6">当選者一覧 ({winners.length}組)</h2>

                        <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(250px,1fr))] mb-12">
                            {winners.map((app) => (
                                <div
                                    key={app.id}
                                    className="relative p-4 rounded-lg bg-white/5 border-l-4 border-green-400 break-words"
                                >
                                    <div className="absolute top-2 right-2 bg-green-500/20 px-2 py-1 rounded text-xs font-bold text-green-300">
                                        {app.rank === 0 ? "特別" : app.rank}
                                    </div>

                                    <div className="font-bold text-white mb-1">
                                        代表: {app.participants[0]?.name} ({app.headcount}名)
                                    </div>

                                    <div className="text-sm text-gray-300">
                                        同行者: {app.participants.slice(1).map((p) => p.name).join(", ") || "なし"}
                                    </div>

                                    {app.rank === 0 && (
                                        <div className="mt-4 pt-4 border-t border-white/10 text-right">
                                            <form action={deleteApplicationAction.bind(null, practice.id, app.id)}>
                                                <button type="submit" className="text-xs text-red-400 hover:text-red-300 flex items-center justify-end ml-auto gap-1">
                                                    <span>🗑️</span> 特別枠を削除
                                                </button>
                                            </form>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* 落選者 */}
                        <h2 className="text-red-400 mb-6">落選者一覧 ({losers.length}組)</h2>

                        <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(250px,1fr))]">
                            {losers.map((app) => (
                                <div
                                    key={app.id}
                                    className="relative p-4 rounded-lg bg-white/5 border-l-4 border-red-400 break-words"
                                >
                                    <div className="absolute top-2 right-2 bg-red-500/20 px-2 py-1 rounded text-xs font-bold text-red-300">
                                        {app.rank}
                                    </div>

                                    <div className="font-bold text-white mb-1">
                                        代表: {app.participants[0]?.name} ({app.headcount}名)
                                    </div>

                                    <div className="text-sm text-gray-300">
                                        同行者: {app.participants.slice(1).map((p) => p.name).join(", ") || "なし"}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <>
                        <h2 className="mb-6">現在の申し込み一覧 ({applications.length}組)</h2>

                        <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(250px,1fr))]">
                            {applications.map((app) => (
                                <div
                                    key={app.id}
                                    className="p-4 rounded-lg bg-white/5 border-l-4 border-blue-400 break-words"
                                >
                                    <div className="font-bold text-white mb-1">
                                        代表: {app.participants[0]?.name} ({app.headcount}名)
                                    </div>

                                    <div className="text-sm text-gray-300">
                                        同行者: {app.participants.slice(1).map((p) => p.name).join(", ") || "なし"}
                                    </div>

                                    {app.rank === 0 && (
                                        <div className="mt-4 pt-4 border-t border-white/10 text-right">
                                            <form action={deleteApplicationAction.bind(null, practice.id, app.id)}>
                                                <button type="submit" className="text-xs text-red-400 hover:text-red-300 flex items-center justify-end ml-auto gap-1">
                                                    <span>🗑️</span> 特別枠を削除
                                                </button>
                                            </form>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* 削除ボタン */}
            <div className="text-right">
                <form action={deleteAction}>
                    <DeleteButton />
                </form>
            </div>
        </div>
    )
}
