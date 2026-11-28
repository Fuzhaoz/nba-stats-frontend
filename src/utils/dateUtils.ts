export function getTodayDate(): string {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}
export function getLocalDateRange(dateString: string): {
    from: string;
    to: string;
} {
    const [year, month, day] = dateString.split("-").map(Number);

    const start = new Date(year, month - 1, day);
    const end = new Date(year, month - 1, day + 1);

    return {
        from: start.toISOString(),
        to: end.toISOString()
    };
}


export function formatGameTime(datetime: string): string {
    return new Date(datetime).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true
    });
}

export function getNBASeason(dateString: string): number {
    const [year, month] = dateString.split("-").map(Number);

    return month >= 10 ? year : year - 1;
}

export function formatGameDate(datetime: string): string {
    return new Date(datetime).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
    });
}