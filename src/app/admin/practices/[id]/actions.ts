"use server"

import { getPracticeById, runLottery, deletePractice, recalculateWinnersByRank, createEditSession, getApplicationWithParticipants } from "@/lib/firestore"
import { checkAdminAuth } from "@/lib/adminAuth"
import { redirect } from "next/navigation"

export async function publishAndRunLottery(practiceId: string, formData: FormData) {
    const { role } = await checkAdminAuth()
    if (role !== 'ADMIN') return;

    const capacityStr = formData.get("capacity") as string
    if (!capacityStr) return

    const capacity = parseInt(capacityStr, 10)

    const practice = await getPracticeById(practiceId)
    if (!practice || practice.status === "PUBLISHED") {
        redirect(`/admin/practices/${practiceId}?error=公開済みの練習です`)
    }

    await runLottery(practiceId, capacity)

    redirect(`/admin/practices/${practiceId}`)
}

export async function deletePracticeAction(practiceId: string) {
    const { role } = await checkAdminAuth()
    if (role !== 'ADMIN') return;

    await deletePractice(practiceId)
    redirect("/admin")
}

export async function updateCapacityOnly(practiceId: string, formData: FormData) {
    const { role } = await checkAdminAuth();
    if (role !== 'ADMIN') return;

    const capacityStr = formData.get("capacity") as string;
    if (!capacityStr) return;

    const capacity = parseInt(capacityStr, 10);

    await recalculateWinnersByRank(practiceId, capacity);

    redirect(`/admin/practices/${practiceId}`);
}

import { createSpecialApplication } from "@/lib/firestore"

export async function registerSpecialVisitorAction(practiceId: string, formData: FormData) {
    const { role } = await checkAdminAuth()

    const headcountStr = formData.get("headcount") as string
    const names = formData.getAll("name") as string[]
    let password = formData.get("password") as string

    // MEMBER の場合はパスワード必須
    if (role === 'MEMBER' && !password) {
        redirect(`/admin/practices/${practiceId}?error=${encodeURIComponent("パスワードを入力してください")}`)
    }

    // ADMIN でパスワード未入力の場合はデフォルトを使用
    if (role === 'ADMIN' && !password) {
        password = process.env.ADMIN_APPLICATION_ADMIN_PASSWORD!
    }

    if (!headcountStr || names.length === 0 || !password) {
        redirect(`/admin/practices/${practiceId}?error=${encodeURIComponent("必須項目が入力されていません")}`)
    }

    const headcount = parseInt(headcountStr, 10)

    const practice = await getPracticeById(practiceId)
    // 公開済みの練習には追加できないようにする
    if (!practice || practice.status === "PUBLISHED") {
        redirect(`/admin/practices/${practiceId}?error=${encodeURIComponent("公開済みの練習には特別枠を追加できません")}`)
    }

    await createSpecialApplication(
        practiceId,
        {
            headcount,
            password: password,
        },
        names.filter(n => n.trim() !== "")
    )

    redirect(`/admin/practices/${practiceId}?success=registered`)
}

export async function editApplicationByAdminAction(practiceId: string, applicationId: string) {
    const { role } = await checkAdminAuth();

    const app = await getApplicationWithParticipants(applicationId);
    const representativeName = app?.participants[0]?.name || "";
    const nameParam = representativeName ? `&name=${encodeURIComponent(representativeName)}` : "";

    if (role === 'ADMIN') {
        // ADMIN は編集セッションを作成して即座にリダイレクト
        // 管理者画面に戻れるよう admin=true を付与
        const sessionId = await createEditSession(applicationId, practiceId);
        redirect(`/practices/${practiceId}/edit?appId=${applicationId}&session=${sessionId}&admin=true${nameParam}`);
    } else if (role === 'MEMBER') {
        // MEMBER はセッションなしでリダイレクト（パスワード入力を求める）
        // 管理者画面に戻れるよう admin=true を付与
        redirect(`/practices/${practiceId}/edit?appId=${applicationId}&admin=true${nameParam}`);
    }
}
