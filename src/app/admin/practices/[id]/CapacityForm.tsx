"use client";

import { useState } from "react";

type Props = {
    action: (payload: FormData) => void;
    title: string;
    description: string;
    buttonText: string;
    defaultCapacity?: number | null;
    className?: string;
};

export default function CapacityForm({ action, title, description, buttonText, defaultCapacity, className = "" }: Props) {
    const [calcType, setCalcType] = useState<"direct" | "calculate">("direct");

    const [totalCapacity, setTotalCapacity] = useState<number | "">("");
    const [memberCount, setMemberCount] = useState<number | "">("");
    const [specialGuestCount, setSpecialGuestCount] = useState<number | "">(0);

    const calculatedCapacity =
        (Number(totalCapacity) || 0) - (Number(memberCount) || 0) - (Number(specialGuestCount) || 0);

    return (
        <form action={action} className={`bg-black/20 p-6 rounded-lg border border-blue-400 ${className}`}>
            <h3 className="text-blue-400 mb-3">{title}</h3>
            <p className="text-sm text-gray-300 mb-4">{description}</p>

            <div className="mb-6 space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                        type="radio"
                        name="calcType"
                        value="direct"
                        checked={calcType === "direct"}
                        onChange={() => setCalcType("direct")}
                        className="w-4 h-4 text-blue-500 bg-transparent border-gray-500 focus:ring-blue-500 focus:ring-2"
                    />
                    <span className="text-sm font-medium">ビジターのみの定員数（直接入力）</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                        type="radio"
                        name="calcType"
                        value="calculate"
                        checked={calcType === "calculate"}
                        onChange={() => setCalcType("calculate")}
                        className="w-4 h-4 text-blue-500 bg-transparent border-gray-500 focus:ring-blue-500 focus:ring-2"
                    />
                    <span className="text-sm font-medium">全体定員数、KSB人数、ビジター特別枠人数からビジター定員数を算出する</span>
                </label>
            </div>

            <div className="flex flex-col md:flex-row gap-4 md:items-end">
                {calcType === "direct" ? (
                    <div className="flex-1 w-full">
                        <label className="form-label text-sm mb-2 block text-gray-200">
                            ビジター定員数
                        </label>
                        <input
                            type="number"
                            name="capacity"
                            className="form-control w-full"
                            defaultValue={defaultCapacity ?? ""}
                            required
                        />
                    </div>
                ) : (
                    <div className="flex-1 w-full space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="form-label text-xs mb-1 block text-gray-300">全体定員数 <span className="text-red-400">*</span></label>
                                <input
                                    type="number"
                                    className="form-control w-full text-sm"
                                    value={totalCapacity}
                                    onChange={(e) => setTotalCapacity(e.target.value === "" ? "" : Number(e.target.value))}
                                    min="0"
                                    required
                                />
                            </div>
                            <div>
                                <label className="form-label text-xs mb-1 block text-gray-300">KSB人数 <span className="text-red-400">*</span></label>
                                <input
                                    type="number"
                                    className="form-control w-full text-sm"
                                    value={memberCount}
                                    onChange={(e) => setMemberCount(e.target.value === "" ? "" : Number(e.target.value))}
                                    min="0"
                                    required
                                />
                            </div>
                            <div>
                                <label className="form-label text-xs mb-1 block text-gray-300">ビジター特別枠人数</label>
                                <input
                                    type="number"
                                    className="form-control w-full text-sm"
                                    value={specialGuestCount}
                                    onChange={(e) => setSpecialGuestCount(e.target.value === "" ? "" : Number(e.target.value))}
                                    min="0"
                                />
                            </div>
                        </div>
                        <div className="px-4 py-3 bg-blue-500/10 border border-blue-500/30 rounded-lg flex items-center justify-between">
                            <span className="text-sm text-gray-300">算出されたビジター定員:</span>
                            <span className="text-xl font-bold text-blue-400">{Math.max(0, calculatedCapacity)} 名</span>
                        </div>
                        {/* サーバーアクションへ送信する値 */}
                        <input type="hidden" name="capacity" value={Math.max(0, calculatedCapacity)} />
                    </div>
                )}

                <button type="submit" className="btn btn-primary whitespace-nowrap w-full md:w-auto mt-4 md:mt-0 self-end h-[42px]">
                    {buttonText}
                </button>
            </div>
        </form>
    );
}
