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
    <div className="max-w-3xl mx-auto mt-10 px-4">
      {/* タイトル */}
      <div className="text-center mb-12">
        <h1 className="page-title text-4xl mb-4 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          KSB練習<br />ビジター参加申し込み
        </h1>
        <p className="text-secondary text-lg">
          参加を希望する日程を選んでお申し込みください。
        </p>
      </div>

      {/* 練習会リスト */}
      <div className="grid gap-6">
        {practices.length === 0 ? (
          <div className="glass-panel text-center py-12">
            <p className="text-secondary text-lg">
              現在募集中の練習会はありません。
            </p>
          </div>
        ) : (
          practices.map((practice) => {
            const isPublished = practice.status === "PUBLISHED"

            return (
              <div
                key={practice.id}
                className={`
              glass-panel p-6 rounded-xl border-l-4
              flex flex-col md:flex-row md:justify-between md:items-center
              gap-4 md:gap-0
              ${isPublished ? "border-purple-500" : "border-blue-500"}
            `}
              >
                {/* 左側：日付・場所 */}
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-white mb-2">
                    {practice.date.toLocaleDateString("ja-JP")} ({practice.time})
                  </h2>

                  <div className="text-secondary text-sm flex flex-wrap gap-4">
                    <span>📍 {practice.location}</span>

                    <span
                      className={`px-2 py-1 rounded-md text-xs ${isPublished
                          ? "bg-purple-500/20 text-purple-300"
                          : "bg-blue-500/20 text-blue-300"
                        }`}
                    >
                      {isPublished ? "抽選結果発表中" : "参加者募集中"}
                    </span>
                  </div>
                </div>

                {/* 右側：ボタン */}
                <div className="flex flex-col gap-2 w-full md:w-auto">
                  <Link
                    href={`/practices/${practice.id}`}
                    className="btn btn-primary w-full text-center"
                  >
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
