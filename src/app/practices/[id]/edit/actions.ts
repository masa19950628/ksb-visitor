"use server"

import { verifyApplication as verifyApp, getApplicationById, updateApplication, deleteApplication, getPracticeById } from "@/lib/firestore"
import { redirect } from "next/navigation"


export async function verifyApplicationAction(practiceId: string, formData: FormData) {
    const name = formData.get("name") as string
    const password = formData.get("password") as string
    const actionType = formData.get("actionType") as string // "edit" or "result"

    if (!name || !password) {
        redirect(`/practices/${practiceId}/${actionType}?error=${encodeURIComponent("氏名とパスワードを入力してください")}`)
    }

    const app = await verifyApp(practiceId, name, password)

    if (!app) {
        redirect(`/practices/${practiceId}/${actionType}?error=${encodeURIComponent("一致する申し込み情報が見つかりません")}`)
    }

    redirect(`/practices/${practiceId}/${actionType}?appId=${app.id}&token=${password}`)
}

export async function updateApplicationAction(appId: string, formData: FormData) {
    const headcountStr = formData.get("headcount") as string
    const password = formData.get("password") as string
    const names = formData.getAll("name") as string[]

    if (!headcountStr || !password || names.length === 0) {
        redirect(`?appId=${appId}&token=${password}&error=${encodeURIComponent("必須項目が入力されていません")}`)
    }

    const headcount = parseInt(headcountStr, 10)

    const app = await getApplicationById(appId)
    if (!app) {
        redirect(`/?error=${encodeURIComponent("申し込みが見つかりません")}`)
    }

    const practice = await getPracticeById(app.practiceId)
    if (!practice || practice.status !== "DRAFT") {
        redirect(`/?error=${encodeURIComponent("この練習会は現在変更を受け付けていません")}`)
    }

    await updateApplication(
        appId,
        {
            headcount,
            password,
        },
        names.filter(n => n.trim() !== "")
    )

    redirect("/?success=updated")
}

export async function deleteApplicationAction(appId: string, passwordToken: string) {
    const app = await getApplicationById(appId)
    if (!app) {
        redirect(`/?error=${encodeURIComponent("申し込みが見つかりません")}`)
    }

    const practice = await getPracticeById(app.practiceId)
    if (!practice || practice.status !== "DRAFT") {
        redirect(`/?error=${encodeURIComponent("この練習会は現在変更を受け付けていません")}`)
    }

    await deleteApplication(appId)
    redirect("/?success=deleted")
}
