export function getTodayDate(): string {
    const now = new Date();

    const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: "America/New_York",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        hourCycle: "h23"
    }).formatToParts(now);

    const getPart = (type: string) =>
        parts.find(part => part.type === type)!.value;

    const year = getPart("year");
    const month = getPart("month");
    const day = getPart("day");
    const hour = Number(getPart("hour"));

    const today = `${year}-${month}-${day}`;

    // NBA game day switches at 6 AM New York time.
    if (hour < 6) {
        const date = new Date(`${today}T12:00:00Z`);
        date.setUTCDate(date.getUTCDate() - 1);
        return date.toISOString().slice(0, 10);
    }

    return today;
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