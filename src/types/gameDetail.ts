import type { Game } from "./game";

export interface TeamMatchup {
    teamId: number;
    teamName: string;

    // Season record
    seasonRecord: string | null;
    winPercentage: number;

    // Scoring
    ppg: number;

    // Rebounds
    rpg: number;
    offensiveRpg: number;
    defensiveRpg: number;

    // Other averages
    apg: number;
    spg: number;
    bpg: number;
    turnovers: number;
    plusMinus: number;

    // Shooting percentages
    fgPct: number;
    fg3Pct: number;
    ftPct: number;

    // Recent performance
    last5Record: string;
    h2hRecord: string;
}

export interface GameMatchup {
    gameId: number;
    homeTeam: TeamMatchup;
    visitorTeam: TeamMatchup;
}

export interface GameDetail {
    game: Game;
    matchup: GameMatchup | null;
    spreadHome: number | null;
}