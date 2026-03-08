"use server"

import { createPractice } from "@/lib/firestore"
import { checkAdminAuth } from "@/lib/adminAuth"
import { redirect } from "next/navigation"

export async function createPracticeAction(formData: FormData) {
    // adminチェック
    await checkAdminAuth()


    const dateStr = formData.get("date") as string
    const time = formData.get("time") as string
    const location = formData.get("location") as string

    if (!dateStr || !time || !location) {
        redirect(`/admin/practices/new?error=${encodeURIComponent("全ての項目を入力してください")}`)
    }

    const date = new Date(dateStr)

    await createPractice({
        date,
        time,
        location,
        status: "DRAFT",
        capacity: null
    })

    redirect("/admin")
}
