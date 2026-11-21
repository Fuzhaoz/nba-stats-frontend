import { useState } from "react";
import { getTodayDate } from "../utils/dateUtils";

interface WeekCalendarProps {
    selectedDate: string;
    onDateChange: (date: string) => void;
}

export default function WeekCalendar({
                                         selectedDate,
                                         onDateChange
                                     }: WeekCalendarProps) {

    const [weekStart, setWeekStart] = useState(
        getStartOfWeek(selectedDate)
    );

    const days = Array.from({ length: 7 }, (_, index) =>
        addDays(weekStart, index)
    );

    return (
        <div className="rounded-xl bg-slate-900 p-5">

            <div className="mb-5 flex items-center justify-between">

                {/* Previous week */}
                <button
                    onClick={() => setWeekStart(addDays(weekStart, -7))}
                >
                    ←
                </button>

                {/* Current month */}
                <h2 className="text-lg font-semibold text-white">
                    {formatMonth(weekStart)}
                </h2>

                {/* Today and next week */}
                <div className="flex items-center gap-3">

                    <button
                        onClick={() => {
                            const today = getTodayDate();

                            setWeekStart(getStartOfWeek(today));
                            onDateChange(today);
                        }}
                        className="rounded-lg bg-orange-500 px-3 py-1 text-sm font-semibold text-white hover:bg-orange-600"
                    >
                        Today
                    </button>

                    <button
                        onClick={() => setWeekStart(addDays(weekStart, 7))}
                    >
                        →
                    </button>

                </div>
            </div>

            <div className="grid grid-cols-7 gap-2">
                {days.map((date) => (
                    <button
                        key={date}
                        onClick={() => onDateChange(date)}
                        className={`rounded-lg p-3 text-center ${
                            date === selectedDate
                                ? "bg-orange-500 text-white"
                                : "text-slate-300 hover:bg-slate-800"
                        }`}
                    >
                        <div className="text-sm">
                            {formatWeekday(date)}
                        </div>

                        <div className="mt-2 text-lg font-bold">
                            {Number(date.slice(8))}
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}

function addDays(date: string, amount: number): string {
    const result = new Date(`${date}T12:00:00Z`);
    result.setUTCDate(result.getUTCDate() + amount);
    return result.toISOString().slice(0, 10);
}

function getStartOfWeek(date: string): string {
    const day = new Date(`${date}T12:00:00Z`).getUTCDay();
    return addDays(date, -day);
}

function formatMonth(date: string): string {
    return new Date(`${date}T12:00:00Z`).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
        timeZone: "UTC"
    });
}

function formatWeekday(date: string): string {
    return new Date(`${date}T12:00:00Z`).toLocaleDateString("en-US", {
        weekday: "short",
        timeZone: "UTC"
    });
}

export function formatGameTime(datetime: string): string {
    return new Date(datetime).toLocaleTimeString(undefined, {
        hour: "numeric",
        minute: "2-digit"
    });
}