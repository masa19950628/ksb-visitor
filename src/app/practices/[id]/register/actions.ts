"use server"

import { getPracticeById, createApplication } from "@/lib/firestore"
import { redirect } from "next/navigation"

export async function registerApplicationAction(practiceId: string, formData: FormData) {
    const headcountStr = formData.get("headcount") as string
    const password = formData.get("password") as string
    const names = formData.getAll("name") as string[]

    if (!headcountStr || !password || names.length === 0) {
        redirect(`/practices/${practiceId}/register?error=${encodeURIComponent("必須項目が入力されていません")}`)
    }

    const headcount = parseInt(headcountStr, 10)

    const practice = await getPracticeById(practiceId)
    if (!practice || practice.status !== "DRAFT") {
        redirect(`/practices/${practiceId}/register?error=${encodeURIComponent("この練習会は現在募集を受け付けていません")}`)
    }

    await createApplication(
        practiceId,
        {
            headcount,
            password,
        },
        names.filter(n => n.trim() !== "")
    )

    //redirect("/?success=completed")
    redirect(`/practices/${practiceId}?success=completed`)
}
