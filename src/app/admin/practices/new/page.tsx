import Link from "next/link"
import { checkAdminAuth } from "@/lib/adminAuth"
import { redirect } from "next/navigation"
import NewPracticeForm from "./NewPracticeForm";

export default async function NewPracticePage({
    searchParams,
}: {
    searchParams: Promise<{ error?: string }>
}) {
    // adminチェック
    const { role } = await checkAdminAuth()
    if (role !== 'ADMIN') {
        redirect("/admin")
    }

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
                {params?.error && (
                    <div className="p-3 mb-6 rounded-lg border border-red-500 bg-red-500/20 text-red-300">
                        {params.error}
                    </div>
                )}

                <NewPracticeForm />
            </div>
        </div>
    )
}
