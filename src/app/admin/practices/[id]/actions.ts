"use server"

import { getPracticeById, runLottery, deletePractice } from "@/lib/firestore"
import { checkAdminAuth } from "@/lib/adminAuth"
import { redirect } from "next/navigation"

export async function publishAndRunLottery(practiceId: string, formData: FormData) {
    await checkAdminAuth()

    const capacityStr = formData.get("capacity") as string
    if (!capacityStr) return

    const capacity = parseInt(capacityStr, 10)

    const practice = await getPracticeById(practiceId)
    if (!practice || practice.status === "PUBLISHED") {
        redirect(`/admin/practices/${practiceId}?error=公開済みの練習会です`)
    }

    await runLottery(practiceId, capacity)

    redirect(`/admin/practices/${practiceId}`)
}

export async function deletePracticeAction(practiceId: string) {
    await checkAdminAuth()
    await deletePractice(practiceId)
    redirect("/admin")
}
