
export interface TeamRecord {
    teamId: number;
    teamName: string;
    abbreviation: string;
    conference: string;
    conferenceRank: number;
    wins: number;
    losses: number;
    winPercentage: number;
    streak: string;
}

type StandingsResponse = Record<string, TeamRecord[]>;

export async function getStandings(
    season: number
): Promise<TeamRecord[]> {
    const response = await fetch(
        `http://localhost:8080/api/teams/standings?season=${season}`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch standings");
    }

    const data: StandingsResponse = await response.json();

    return Object.values(data).flat();
}
