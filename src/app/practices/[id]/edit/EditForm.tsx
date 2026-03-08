"use client";
import { useState } from "react";
import { updateApplicationAction, deleteApplicationAction } from "./actions";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function EditForm({ application }: { application: any }) {
    const [headcount, setHeadcount] = useState(application.headcount);
    const updateAction = updateApplicationAction.bind(null, application.id);
    const deleteAction = deleteApplicationAction.bind(null, application.id, application.password);

    return (
        <div>
            <form action={updateAction} style={{ marginBottom: "2rem" }}>
                <input type="hidden" name="password" value={application.password} />

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
                            defaultValue={application.participants[i]?.name || ""}
                            placeholder={i === 0 ? "代表者氏名" : `同行者氏名 ${i}`}
                            required
                            style={{ marginBottom: "0.5rem" }}
                        />
                    ))}
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "1.5rem" }}>
                    更新する
                </button>
            </form>

            <form action={deleteAction} onSubmit={(e) => {
                if (!confirm("本当に申し込みを削除しますか？この操作は取り消せません。")) e.preventDefault();
            }}>
                <button type="submit" className="btn btn-danger" style={{ width: "100%" }}>
                    申し込みを取り消す (削除)
                </button>
            </form>
        </div>
    )
}
