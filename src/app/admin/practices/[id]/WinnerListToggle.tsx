"use client";

import { useState } from "react";
import type { Application, Participant } from "@/lib/firestore";

interface WinnerListToggleProps {
    winners: (Application & { participants: Participant[] })[];
}

export default function WinnerListToggle({ winners }: WinnerListToggleProps) {
    const [open, setOpen] = useState(false);

    return (
        <div className="mt-6">
            <button
                onClick={() => setOpen(!open)}
                className="btn btn-secondary mb-4"
            >
                {open ? "当選者リストを閉じる" : "当選者リストを表示する"}
            </button>

            {open && (
                <div className="mt-4">
                    <h3 className="text-green-300 mb-3 font-semibold">当選者リスト</h3>

                    <div className="p-4 rounded-lg bg-gray-800/40 border border-gray-700">
                        <ul className="space-y-2 text-gray-200 text-sm">
                            {winners.flatMap((app) =>
                                app.participants.map((p) => (
                                    <li
                                        key={p.id}
                                        className="py-1 border-b border-gray-700/50 last:border-0 last:pb-0"
                                    >
                                        {p.name}
                                    </li>
                                ))
                            )}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}