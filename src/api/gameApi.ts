import type { Game } from "../types/game";
import type { BoxScore } from "../types/boxScore";
import type { GameDetail, GameMatchup } from "../types/gameDetail";
import {
    getTodayDate,
    getLocalDateRange
} from "../utils/dateUtils";

interface GameDTO {
    gameId: number;
    date: string;
    status: string;
    homeTeamName: string;
    homeTeamAbbreviation: string;
    homeTeamScore: number | null;
    visitorTeamName: string;
    visitorTeamAbbreviation: string;
    visitorTeamScore: number | null;
    datetime: string;
    homeTeamId: number;
    visitorTeamId: number;
    // Quarter scores
    homeQ1: number | null;
    homeQ2: number | null;
    homeQ3: number | null;
    homeQ4: number | null;

    visitorQ1: number | null;
    visitorQ2: number | null;
    visitorQ3: number | null;
    visitorQ4: number | null;

// Overtime scores
    homeOt1: number | null;
    homeOt2: number | null;
    homeOt3: number | null;

    visitorOt1: number | null;
    visitorOt2: number | null;
    visitorOt3: number | null;

    postseason: boolean | null;
    winner: string | null;
    boxScoreSynced: boolean | null;
}

interface GameDetailDTO {
    game: GameDTO;
    matchup: GameMatchup | null;
    spreadHome: number | null;
}

const BASE_URL = "http://localhost:8080/api/games";

export async function getTodayGames(): Promise<Game[]> {
    return getGamesByDate(getTodayDate());
}
export async function getGamesByDate(date: string): Promise<Game[]> {
    const { from, to } = getLocalDateRange(date);

    const response = await fetch(
        `${BASE_URL}/range?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch games");
    }

    const data: GameDTO[] = await response.json();

    return data.map(mapGame);
}

function mapGame(game: GameDTO): Game {
    return {
        id: game.gameId,
        date: game.date,
        status:
            game.status === "Final"
                ? "Final"
                : game.status === "Live"
                    ? "Live"
                    : "Upcoming",

        homeTeam: game.homeTeamName,
        homeTeamAbbreviation: game.homeTeamAbbreviation,
        homeScore: game.homeTeamScore,

        awayTeam: game.visitorTeamName,
        awayTeamAbbreviation: game.visitorTeamAbbreviation,
        awayScore: game.visitorTeamScore,

        datetime: game.datetime,
        homeTeamId: game.homeTeamId,
        visitorTeamId: game.visitorTeamId,

        // Quarter scores
        homeQ1: game.homeQ1,
        homeQ2: game.homeQ2,
        homeQ3: game.homeQ3,
        homeQ4: game.homeQ4,

        awayQ1: game.visitorQ1,
        awayQ2: game.visitorQ2,
        awayQ3: game.visitorQ3,
        awayQ4: game.visitorQ4,

        // Overtime scores
        homeOt1: game.homeOt1,
        homeOt2: game.homeOt2,
        homeOt3: game.homeOt3,

        awayOt1: game.visitorOt1,
        awayOt2: game.visitorOt2,
        awayOt3: game.visitorOt3,

        postseason: game.postseason,
        winner: game.winner,
        boxScoreSynced: game.boxScoreSynced
    };
}

export async function getTeamGames(
    teamId: number,
    season: number
): Promise<Game[]> {
    const response = await fetch(
        `${BASE_URL}/team/${teamId}?season=${season}`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch team games");
    }

    const data: GameDTO[] = await response.json();

    return data.map(mapGame);
}
    export async function getGameDetail(
        gameId: number
    ): Promise<GameDetail> {
        const response = await fetch(
            `${BASE_URL}/${gameId}/detail`
        );

        if (!response.ok) {
            throw new Error("Failed to fetch game detail");
        }

        const data: GameDetailDTO = await response.json();

        return {
            game: mapGame(data.game),
            matchup: data.matchup,
            spreadHome: data.spreadHome
        };
    }

export async function getBoxScore(
    gameId: number
): Promise<BoxScore[]> {

    const response = await fetch(
        `${BASE_URL}/${gameId}/box-score`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch box score");
    }

    return response.json();
}