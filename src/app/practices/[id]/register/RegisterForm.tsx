"use client"

import { useState } from "react"
import { registerApplicationAction } from "./actions"

export default function RegisterForm({ practiceId }: { practiceId: string }) {
    const [headcount, setHeadcount] = useState(1)

    const actionWithId = registerApplicationAction.bind(null, practiceId)

    return (
        <form action={actionWithId}>
            <div className="form-group">
                <label className="form-label">参加人数</label>
                <select
                    name="headcount"
                    className="form-control"
                    value={headcount}
                    onChange={(e) => setHeadcount(parseInt(e.target.value, 10))}
                >
                    {[1, 2, 3, 4, 5, 6].map(n => (
                        <option key={n} value={n}>{n}名</option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label className="form-label">参加者氏名</label>
                {Array.from({ length: headcount }).map((_, i) => (
                    <input
                        key={i}
                        type="text"
                        name="name"
                        className="form-control"
                        placeholder={i === 0 ? "代表者氏名" : `同行者氏名 ${i}`}
                        required
                        style={{ marginBottom: "0.5rem" }}
                    />
                ))}
            </div>

            <div className="form-group">
                <label className="form-label">確認・変更用パスワード</label>
                <input
                    type="password"
                    name="password"
                    className="form-control"
                    placeholder="半角英数字"
                    required
                    minLength={4}
                />
                <small style={{ color: "var(--text-secondary)", marginTop: "0.5rem", display: "block" }}>
                    申し込み後の内容変更や、抽選結果の確認に必要となります。忘れないようにしてください。
                </small>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "1.5rem" }}>
                登録を確認する
            </button>
        </form>
    )
}
