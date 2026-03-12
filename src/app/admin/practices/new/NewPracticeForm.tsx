"use client";

import { useState } from "react";
import { createPracticeAction } from "./actions";

export default function NewPracticeForm() {
    const [locationType, setLocationType] = useState("kame");
    const [location, setLocation] = useState("亀高小学校");
    const [time, setTime] = useState("12:30 - 17:00");

    const handleLocationChange = (value: string) => {
        setLocationType(value);

        if (value === "kame") {
            setLocation("亀高小学校");
            setTime("12:30 - 17:00");
        } else if (value === "yonsuna") {
            setLocation("四砂中学校");
            setTime("15:00 - 19:00");
        } else {
            // free
            setLocation("");
            setTime("");
        }
    };

    return (
        <form action={createPracticeAction}>
            {/* 日付 */}
            <div className="form-group mb-4">
                <label className="form-label block mb-1">日付</label>
                <input type="date" name="date" className="form-control w-full" required />
            </div>

            {/* 場所（ラジオ） */}
            <div className="form-group mb-6">
                <label className="form-label block mb-2">練習場所</label>

                <div className="flex flex-col gap-2">
                    <label>
                        <input
                            type="radio"
                            name="locationType"
                            value="kame"
                            checked={locationType === "kame"}
                            onChange={() => handleLocationChange("kame")}
                        />
                        <span className="ml-2">亀高小学校</span>
                    </label>

                    <label>
                        <input
                            type="radio"
                            name="locationType"
                            value="yonsuna"
                            checked={locationType === "yonsuna"}
                            onChange={() => handleLocationChange("yonsuna")}
                        />
                        <span className="ml-2">四砂中学校</span>
                    </label>

                    <label>
                        <input
                            type="radio"
                            name="locationType"
                            value="free"
                            checked={locationType === "free"}
                            onChange={() => handleLocationChange("free")}
                        />
                        <span className="ml-2">フリー入力</span>
                    </label>
                </div>

                {/* フリー欄だけ表示 */}
                {locationType === "free" && (
                    <input
                        type="text"
                        name="location"
                        className="form-control w-full mt-2"
                        placeholder="練習場所"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                    />
                )}

                {/* ラジオ選択時は hidden で送信 */}
                {locationType !== "free" && (
                    <input type="hidden" name="location" value={location} />
                )}
            </div>

            {/* 時間 */}
            <div className="form-group mb-4">
                <label className="form-label block mb-1">時間</label>
                <input
                    type="text"
                    name="time"
                    className="form-control w-full"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required
                />
            </div>

            <button type="submit" className="btn btn-primary w-full py-2">
                登録
            </button>
        </form>
    );
}
