import type { Timestamp } from "firebase-admin/firestore";

export function toDate(
    val: Timestamp | string | Date
): Date {
    if (typeof val === "object" && "toDate" in val) {
        return val.toDate();
    }
    if (typeof val === "string") {
        return new Date(val);
    }
    return val;
}
