export interface Game {
    id: number;
    date: string;
    status: "Upcoming" | "Live" | "Final";

    homeTeam: string;
    homeTeamAbbreviation: string;
    homeScore: number | null;

    awayTeam: string;
    awayTeamAbbreviation: string;
    awayScore: number | null;
    datetime: string;
    homeTeamRecord?: string;
    awayTeamRecord?: string;
}