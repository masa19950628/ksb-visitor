import { checkAdminAuth } from "@/lib/adminAuth"
import { getPractices } from "@/lib/firestore"
import Link from "next/link"

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
    // adminチェック
    await checkAdminAuth()

    const practices = await getPractices()

    return (
        <div className="flex flex-col gap-4">
            {practices.map((practice) => {
                const isPublished = practice.status === "PUBLISHED"

                return (
                    <div
                        key={practice.id}
                        className={`
          glass-panel p-6 rounded-xl border-l-4
          flex flex-col md:flex-row md:justify-between md:items-center
          gap-4 md:gap-0
          ${isPublished ? "border-purple-400" : "border-blue-400"}
        `}
                    >
                        {/* 左側：練習情報 */}
                        <div className="flex-1">
                            <h3 className="text-xl font-semibold text-white mb-2">
                                {practice.date.toLocaleDateString("ja-JP")} ({practice.time})
                            </h3>

                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300">
                                <span className="flex items-center space-x-1">
                                    <span>📍</span>
                                    <span>{practice.location}</span>
                                </span>

                                <span className="flex items-center space-x-1">
                                    <span>👥</span>
                                    <span>定員: {practice.capacity}名</span>
                                </span>

                                <span className="flex items-center space-x-1">
                                    <span>📝</span>
                                    <span>申込組数: {practice.applicationCount}組</span>
                                </span>

                                <span
                                    className={`
                px-2 py-1 rounded-md text-xs font-bold tracking-wide
                ${isPublished
                                            ? "bg-purple-500/20 text-purple-200"
                                            : "bg-blue-500/20 text-blue-200"}
              `}
                                >
                                    {isPublished ? "公開済 (結果発表)" : "募集受付中"}
                                </span>
                            </div>
                        </div>

                        {/* 右側：ボタン */}
                        <div className="flex flex-col gap-2 w-full md:w-auto">
                            <Link
                                href={`/admin/practices/${practice.id}`}
                                className="btn btn-secondary w-full text-center"
                            >
                                確認 / 抽選管理
                            </Link>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
