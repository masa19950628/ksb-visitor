"use client"

import { useState } from "react"
import { registerApplicationAction } from "./actions"

export default function RegisterForm({ practiceId }: { practiceId: string }) {
    const [headcount, setHeadcount] = useState(1)

    const actionWithId = registerApplicationAction.bind(null, practiceId)

    return (
        <form action={actionWithId}>
            {/* 参加人数 */}
            <div className="form-group mb-6">
                <label className="form-label block mb-1">参加人数</label>
                <select
                    name="headcount"
                    className="form-control w-full"
                    value={headcount}
                    onChange={(e) => setHeadcount(parseInt(e.target.value, 10))}
                >
                    {[1, 2, 3, 4, 5].map((n) => (
                        <option key={n} value={n}>
                            {n}名
                        </option>
                    ))}
                </select>
            </div>

            {/* 参加者氏名 */}
            <div className="form-group mb-6">
                <label className="form-label block mb-2">参加者氏名</label>

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

            {/* パスワード */}
            <div className="form-group mb-8">
                <label className="form-label block mb-1">確認・変更用パスワード</label>
                <input
                    type="password"
                    name="password"
                    className="form-control w-full"
                    placeholder="半角英数字"
                    required
                    minLength={4}
                />
                <small className="text-gray-300 mt-2 block text-sm">
                    申し込み後の内容変更や、抽選結果の確認に必要となります。忘れないようにしてください。
                </small>
            </div>

            {/* 送信ボタン */}
            <button type="submit" className="btn btn-primary w-full py-2">
                登録を確認する
            </button>
        </form>
    )
}
