"use server"

import { getPracticeById, runLottery, deletePractice, recalculateWinnersByRank, deleteApplication } from "@/lib/firestore"
import { checkAdminAuth } from "@/lib/adminAuth"
import { redirect } from "next/navigation"

export async function publishAndRunLottery(practiceId: string, formData: FormData) {
    await checkAdminAuth()

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
    await checkAdminAuth()
    await deletePractice(practiceId)
    redirect("/admin")
}

export async function updateCapacityOnly(practiceId: string, formData: FormData) {
    await checkAdminAuth();

    const capacityStr = formData.get("capacity") as string;
    if (!capacityStr) return;

    const capacity = parseInt(capacityStr, 10);

    await recalculateWinnersByRank(practiceId, capacity);

    redirect(`/admin/practices/${practiceId}`);
}

import { createSpecialApplication } from "@/lib/firestore"

export async function registerSpecialVisitorAction(practiceId: string, formData: FormData) {
    await checkAdminAuth()

    const headcountStr = formData.get("headcount") as string
    const names = formData.getAll("name") as string[]

    if (!headcountStr || names.length === 0) {
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
            password: process.env.ADMIN_APPLICATION_ADMIN_PASSWORD!, // 管理者登録なので固定
        },
        names.filter(n => n.trim() !== "")
    )

    redirect(`/admin/practices/${practiceId}?success=registered`)
}

export async function deleteApplicationAction(practiceId: string, applicationId: string) {
    await checkAdminAuth();
    await deleteApplication(applicationId);
    redirect(`/admin/practices/${practiceId}?success=deleted`);
}
