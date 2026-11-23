
export interface Player {
    playerId: number;
    firstName: string;
    lastName: string;
    position: string | null;
    height: string | null;
    weight: string | null;
    jerseyNumber: string | null;
    college: string | null;
    country: string | null;
    teamName: string;
    teamAbbreviation: string;
    draftYear: number | null;
    draftRound: number | null;
    draftNumber: number | null;
    imageUrl: string | null;
}

export async function getTeamRoster(teamId: number): Promise<Player[]> {
    const response = await fetch(
        `http://localhost:8080/api/teams/${teamId}/roster`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch team roster");
    }

    return response.json();
}
