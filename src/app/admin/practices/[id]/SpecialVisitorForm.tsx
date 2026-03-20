"use client"

import { useState } from "react"
import { registerSpecialVisitorAction } from "./actions"

export default function SpecialVisitorForm({ practiceId }: { practiceId: string }) {
    const [headcount, setHeadcount] = useState(1)

    const actionWithId = registerSpecialVisitorAction.bind(null, practiceId)

    return (
        <form action={actionWithId} className="bg-black/20 p-6 rounded-lg border border-purple-400">
            <h3 className="text-purple-400 mb-3">特別枠の登録</h3>
            <p className="text-sm text-gray-300 mb-4">
                受付を介さずに、抽選で「当選確定」となる特別枠の参加者を登録します。<br />
                ※公開済みの練習には登録できません。
            </p>

            <div className="flex flex-col md:flex-row gap-6 mb-2">
                {/* 参加人数 */}
                <div className="form-group w-full md:w-1/3">
                    <label className="form-label text-sm mb-1 block">参加人数</label>
                    <select
                        name="headcount"
                        className="form-control w-full"
                        value={headcount}
                        onChange={(e) => setHeadcount(parseInt(e.target.value, 10))}
                    >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                            <option key={n} value={n}>
                                {n}名
                            </option>
                        ))}
                    </select>
                </div>

                {/* 参加者氏名 */}
                <div className="form-group w-full md:w-2/3">
                    <label className="form-label text-sm mb-2 block">参加者氏名</label>

                    {Array.from({ length: headcount }).map((_, i) => (
                        <input
                            key={i}
                            type="text"
                            name="name"
                            className="form-control w-full mb-2"
                            placeholder={i === 0 ? "代表者氏名" : `同行者氏名 ${i}`}
                            required
                        />
                    ))}
                </div>
            </div>

            {/* 送信ボタン */}
            <div className="text-right mt-2">
                <button type="submit" className="btn btn-primary px-8">
                    特別枠として登録する
                </button>
            </div>
        </form>
    )
}
