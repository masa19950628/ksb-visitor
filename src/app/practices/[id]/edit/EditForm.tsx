"use client";
import { useState } from "react";
import { updateApplicationAction, deleteApplicationAction } from "./actions";

type Participant = {
    name: string;
};
type ApplicationForEdit = {
    id: string;
    practiceId: string;
    headcount: number;
    participants: Participant[];
};
type EditFormProps = {
    application: ApplicationForEdit;
    editSessionId: string;
    fromAdmin?: boolean;
};


export default function EditForm({ application, editSessionId, fromAdmin }: EditFormProps) {
    const [headcount, setHeadcount] = useState(application.headcount);
    const updateAction = updateApplicationAction.bind(null, application.id);
    const deleteAction = deleteApplicationAction.bind(null, application.id, editSessionId);

    return (
        <div className="max-w-md mx-auto px-4">
            {/* 更新フォーム */}
            <form action={updateAction} className="mb-8">
                <input type="hidden" name="editSessionId" value={editSessionId} />
                {fromAdmin && <input type="hidden" name="fromAdmin" value="true" />}

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
                            defaultValue={application.participants[i]?.name || ""}
                            placeholder={i === 0 ? "代表者氏名" : `同行者氏名 ${i}`}
                            required
                        />
                    ))}
                </div>

                {/* 更新ボタン */}
                <button
                    type="submit"
                    className="btn btn-primary w-full py-2"
                >
                    更新する
                </button>
            </form>

            {/* 削除フォーム */}
            <form
                action={deleteAction}
                onSubmit={(e) => {
                    if (!confirm("本当に申し込みを削除しますか？この操作は取り消せません。"))
                        e.preventDefault();
                }}
            >
                <input type="hidden" name="fromAdmin" value={fromAdmin ? "true" : "false"} />
                <button
                    type="submit"
                    className="btn btn-danger w-full py-2"
                >
                    申し込みを取り消す (削除)
                </button>
            </form>
        </div>
    )
}
