import type { TeamRecord } from "./standingsApi";

export async function getTeamRecord(
    teamId: number,
    season: number
): Promise<TeamRecord> {
    const response = await fetch(
        `http://localhost:8080/api/teams/${teamId}/record?season=${season}`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch team record");
    }

    return response.json();
}

export interface TeamSeasonStats {
    teamId: number;
    season: number;

    ppg: number;
    rpg: number;
    apg: number;

    fgPct: number;
    fg3Pct: number;
    ftPct: number;

    spg: number;
    bpg: number;
    turnovers: number;
    plusMinus: number;
    ppgRank: number | null;
    rpgRank: number | null;
    apgRank: number | null;

    fgPctRank: number | null;
    fg3PctRank: number | null;
    ftPctRank: number | null;

    spgRank: number | null;
    bpgRank: number | null;
    turnoversRank: number | null;
    plusMinusRank: number | null;
}

export async function getTeamStats(
    teamId: number,
    season: number
): Promise<TeamSeasonStats> {

    const response = await fetch(
        `http://localhost:8080/api/team-stats/${teamId}?season=${season}`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch team stats");
    }

    return response.json();
}
export interface RecentGame {
    gameId: number;
    date: string;
    status: string;
    datetime: string;

    homeTeamId: number;
    homeTeamName: string;
    homeTeamAbbreviation: string;
    homeTeamScore: number | null;

    visitorTeamId: number;
    visitorTeamName: string;
    visitorTeamAbbreviation: string;
    visitorTeamScore: number | null;

    winner: string | null;
}

export async function getRecentGames(
    teamId: number,
    limit: number = 5
): Promise<RecentGame[]> {
    const response = await fetch(
        `http://localhost:8080/api/games/recent/${teamId}?limit=${limit}`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch recent games");
    }

    return response.json();
}

export interface TeamRosterPlayer {
    firstName: string;
    lastName: string;
    position: string | null;
    jerseyNumber: string | null;

    height: string | null;
    weight: string | null;

    college: string | null;
    country: string | null;

    draftYear: number | null;
    draftRound: number | null;
    draftNumber: number | null;

    teamName: string;
    teamAbbreviation: string;
}

export async function getTeamRoster(
    teamId: number
): Promise<TeamRosterPlayer[]> {
    const response = await fetch(
        `http://localhost:8080/api/teams/${teamId}/roster`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch team roster");
    }

    return response.json();
}

export interface Team {
    teamId: number;
    name: string;
    fullName: string;
    abbreviation: string;
    city: string;
    conference: "East" | "West";
    division: string;
}

export async function getAllTeams(): Promise<Team[]> {
    const response = await fetch(
        "http://localhost:8080/api/teams"
    );

    if (!response.ok) {
        throw new Error("Failed to fetch teams");
    }

    return response.json();
}