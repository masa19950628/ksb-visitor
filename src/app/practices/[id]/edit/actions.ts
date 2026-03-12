"use server"

import { verifyApplication as verifyApp, deleteEditSession, verifyEditSession, getApplicationById, updateApplication, deleteApplication, getPracticeById } from "@/lib/firestore"
import { redirect } from "next/navigation"


export async function verifyApplicationAction(practiceId: string, formData: FormData) {
    const name = formData.get("name") as string
    const password = formData.get("password") as string
    const actionType = formData.get("actionType") as string // "edit" or "result"


    if (!name || !password) {
        redirect(`/practices/${practiceId}/${actionType}?error=${encodeURIComponent("氏名とパスワードを入力してください")}`)
    }

    const result = await verifyApp(practiceId, name, password);

    if (!result.ok) {
        redirect(`/practices/${practiceId}/${actionType}?error=${encodeURIComponent("認証に失敗しました")}`)
    }

    redirect(`/practices/${practiceId}/${actionType}?appId=${result.application.id}&session=${result.editSessionId}`)
}

export async function updateApplicationAction(appId: string, formData: FormData) {
    const headcountStr = formData.get("headcount") as string
    const editSessionId = formData.get("editSessionId") as string
    const names = formData.getAll("name") as string[]

    if (!headcountStr || !editSessionId || names.length === 0) {
        redirect(`?appId=${appId}&session=${encodeURIComponent(editSessionId || "")}&error=${encodeURIComponent("必須項目が入力されていません")}`)
    }

    const headcount = parseInt(headcountStr, 10)

    const app = await getApplicationById(appId)
    if (!app) {
        redirect(`/?error=${encodeURIComponent("申し込みが見つかりません")}`)
    }

    const practice = await getPracticeById(app.practiceId)
    if (!practice || practice.status !== "DRAFT") {
        redirect(`/?error=${encodeURIComponent("この練習は現在変更を受け付けていません")}`)
    }

    const ok = await verifyEditSession(editSessionId, appId, app.practiceId)
    if (!ok) {
        redirect(`/?error=${encodeURIComponent("認証の有効期限が切れたか、認証情報が不正です")}`)
    }

    await updateApplication(
        appId,
        {
            headcount,
        },
        names.filter(n => n.trim() !== "")
    )
    await deleteEditSession(editSessionId)
    redirect(`/practices/${app.practiceId}?success=updated`)
}

export async function deleteApplicationAction(appId: string, editSessionId: string) {
    const app = await getApplicationById(appId)
    if (!app) {
        redirect(`/?error=${encodeURIComponent("申し込みが見つかりません")}`)
    }

    const practice = await getPracticeById(app.practiceId)
    if (!practice || practice.status !== "DRAFT") {
        redirect(`/?error=${encodeURIComponent("この練習は現在変更を受け付けていません")}`)
    }

    const ok = await verifyEditSession(editSessionId, appId, app.practiceId)
    if (!ok) {
        redirect(`/?error=${encodeURIComponent("認証の有効期限が切れたか、認証情報が不正です")}`)
    }

    await deleteApplication(appId)
    await deleteEditSession(editSessionId)

    redirect(`/practices/${app.practiceId}?success=deleted`)
}
