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
    homeTeamId: number;
    visitorTeamId: number;
    // Quarter scores
    homeQ1: number | null;
    homeQ2: number | null;
    homeQ3: number | null;
    homeQ4: number | null;

    awayQ1: number | null;
    awayQ2: number | null;
    awayQ3: number | null;
    awayQ4: number | null;

// Overtime scores
    homeOt1: number | null;
    homeOt2: number | null;
    homeOt3: number | null;

    awayOt1: number | null;
    awayOt2: number | null;
    awayOt3: number | null;

    postseason: boolean | null;
    winner: string | null;
    boxScoreSynced: boolean | null;
}