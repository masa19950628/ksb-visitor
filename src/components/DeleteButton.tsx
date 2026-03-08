"use client";
import { useFormStatus } from 'react-dom';

export default function DeleteButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            className="btn btn-danger"
            style={{ padding: "0.5rem 1rem", fontSize: "0.85rem" }}
            disabled={pending}
            onClick={(e) => {
                if (!confirm("本当に削除しますか？関連する申し込み情報も全て削除されます。")) {
                    e.preventDefault();
                }
            }}
        >
            {pending ? "削除中..." : "この練習会を削除"}
        </button>
    );
}
