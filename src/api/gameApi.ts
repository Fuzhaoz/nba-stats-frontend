import type { Game } from "../types/game";

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
}

const BASE_URL = "http://localhost:8080/api/games";

export async function getTodayGames(): Promise<Game[]> {
    const response = await fetch(`${BASE_URL}/today`);

    if (!response.ok) {
        throw new Error("Failed to fetch games");
    }

    const data: GameDTO[] = await response.json();

    return data.map(mapGame);

}
export async function getGamesByDate(date: string): Promise<Game[]> {
    const response = await fetch(
        `${BASE_URL}?date=${encodeURIComponent(date)}`
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
        datetime: game.datetime,
        awayScore: game.visitorTeamScore
    };
}