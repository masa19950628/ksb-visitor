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
        <div className="max-w-xl mx-auto my-8 px-4">
            {/* タイトル行 */}
            <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
                <h1 className="page-title m-0">練習 新規作成</h1>
                <Link href="/admin" className="btn btn-secondary">
                    キャンセル
                </Link>
            </div>

            <div className="glass-panel p-6 rounded-xl">
                {/* エラー表示 */}
                {params?.error && (
                    <div className="p-3 mb-6 rounded-lg border border-red-500 bg-red-500/20 text-red-300">
                        {params.error}
                    </div>
                )}

                <form action={createPracticeAction}>
                    {/* 日付 */}
                    <div className="form-group mb-4">
                        <label className="form-label block mb-1">日付</label>
                        <input
                            type="date"
                            name="date"
                            className="form-control w-full"
                            required
                            autoFocus
                        />
                    </div>

                    {/* 時間 */}
                    <div className="form-group mb-4">
                        <label className="form-label block mb-1">時間 (例: 19:00 - 21:00)</label>
                        <input
                            type="text"
                            name="time"
                            className="form-control w-full"
                            list="time-options"
                            placeholder="12:30 - 17:00"
                            required
                        />
                        <datalist id="time-options">
                            <option value="12:30 - 17:00" />
                            <option value="15:00 - 19:00" />
                        </datalist>
                    </div>

                    {/* 場所 */}
                    <div className="form-group mb-6">
                        <label className="form-label block mb-1">練習場所</label>
                        <input
                            type="text"
                            name="location"
                            className="form-control w-full"
                            list="location-options"
                            placeholder="例: 市民体育館"
                            required
                        />
                        <datalist id="location-options">
                            <option value="亀高小学校" />
                            <option value="四砂中学校" />
                        </datalist>
                    </div>

                    {/* 登録ボタン */}
                    <button
                        type="submit"
                        className="btn btn-primary w-full py-2"
                    >
                        登録
                    </button>
                </form>
            </div>
        </div>
    )
}
