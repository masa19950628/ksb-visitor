"use client"

import { useState } from "react"
import { registerSpecialVisitorAction } from "./actions"
import { Role } from "@/lib/firestore"

export default function SpecialVisitorForm({ practiceId, role }: { practiceId: string, role: Role }) {
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

            {/* パスワード設定 */}
            <div className="form-group mb-6 max-w-xs">
                <label className="form-label text-sm mb-1 block text-purple-300">
                    パスワード設定 {role === 'MEMBER' && <span className="text-red-400">*</span>}
                    {role === 'ADMIN' && <span className="text-gray-400 text-[10px] ml-2">(任意)</span>}
                </label>
                <input
                    type="password"
                    name="password"
                    className="form-control w-full"
                    placeholder={role === 'ADMIN' ? "管理者用パスワードを使用" : "英数字4桁以上を推奨"}
                    required={role === 'MEMBER'}
                    minLength={role === 'MEMBER' ? 4 : undefined}
                />
                <p className="text-[10px] text-gray-400 mt-1">
                    {role === 'ADMIN' 
                        ? "※未入力の場合はデフォルトの管理者パスワードが設定されます。"
                        : "※登録後に自分（参加者）で修正・取消を行う際に必要となります。"
                    }
                </p>
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
