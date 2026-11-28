export interface BoxScore {

    // Player information
    playerId: number;
    playerName: string;
    position: string | null;
    teamId: number;
    starter: boolean | null;

    // Basic statistics
    minutes: string | null;
    points: number | null;
    rebounds: number | null;
    assists: number | null;
    steals: number | null;
    blocks: number | null;

    // Field goals
    fgm: number | null;
    fga: number | null;
    fgPct: number | null;

    // Three-point field goals
    fg3m: number | null;
    fg3a: number | null;
    fg3Pct: number | null;

    // Free throws
    ftm: number | null;
    fta: number | null;
    ftPct: number | null;

    // Additional statistics
    offensiveRebounds: number | null;
    defensiveRebounds: number | null;
    turnovers: number | null;
    personalFouls: number | null;
    plusMinus: number | null;
}