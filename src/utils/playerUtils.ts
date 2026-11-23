
const NBA_PLAYER_IDS: Record<string, number> = {
    "Stephen Curry": 201939,
    "LeBron James": 2544,
    "Jalen Johnson": 1630552,
};

export function getPlayerHeadshot(
    firstName: string,
    lastName: string
): string {
    const fullName = `${firstName} ${lastName}`;
    const nbaPlayerId = NBA_PLAYER_IDS[fullName];

    if (!nbaPlayerId) {
        return "/images/default-player.png";
    }

    return `https://cdn.nba.com/headshots/nba/latest/260x190/${nbaPlayerId}.png`;
}
