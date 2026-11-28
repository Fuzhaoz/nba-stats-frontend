import { useEffect, useState } from "react";
import type { Game } from "../types/game";
import type { BoxScore as PlayerBoxScore } from "../types/boxScore";
import { getBoxScore } from "../api/gameApi";
import { getTeamLogo } from "../utils/teamUtils";

interface BoxScoreProps {
    game: Game;
}

export default function BoxScore({ game }: BoxScoreProps) {

    const [players, setPlayers] = useState<PlayerBoxScore[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<"away" | "home">("away");

    useEffect(() => {

        if (game.status === "Upcoming") {
            return;
        }

        let cancelled = false;

        async function loadBoxScore() {
            try {
                setLoading(true);
                setError(null);

                const data = await getBoxScore(game.id);

                if (!cancelled) {
                    setPlayers(data);
                }

            } catch {
                if (!cancelled) {
                    setError("Failed to load box score");
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        loadBoxScore();

        return () => {
            cancelled = true;
        };

    }, [game.id, game.status, game.boxScoreSynced]);

    useEffect(() => {
        if (game.status === "Upcoming") return;

        if (
            game.status === "Final" &&
            game.boxScoreSynced === true
        ) return;

        let cancelled = false;

        const interval = setInterval(async () => {
            try {
                const data = await getBoxScore(game.id);

                if (!cancelled) {
                    setPlayers(data);
                }
            } catch (error) {
                console.error("Failed to refresh box score:", error);
            }
        }, 60000);

        return () => {
            cancelled = true;
            clearInterval(interval);
        };
    }, [game.id, game.status, game.boxScoreSynced]);



    if (game.status === "Upcoming") {
        return null;
    }

    if (loading) {
        return <div>Loading box score...</div>;
    }

    if (error) {
        return <div className="text-red-400">{error}</div>;
    }

    if (players.length === 0) {
        return (
            <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
                <h2 className="mb-2 text-lg font-semibold">
                    Box Score
                </h2>
                <p className="text-sm text-gray-400">
                    Box score is not available yet.
                </p>
            </div>
        );
    }

    // Separate players by game-time team
    const awayPlayers = players.filter(
        player => player.teamId === game.visitorTeamId
    );

    const homePlayers = players.filter(
        player => player.teamId === game.homeTeamId
    );

    // Convert playing time into seconds
    function toSeconds(minutes: string | null): number {
        if (minutes === null) {
            return -1;
        }

        const [mins, secs = 0] = minutes.split(":").map(Number);

        return mins * 60 + secs;
    }

    // Sort players by playing time
    function sortByMinutes(teamPlayers: PlayerBoxScore[]) {
        return [...teamPlayers].sort(
            (a, b) => toSeconds(b.minutes) - toSeconds(a.minutes)
        );
    }

    // Format made and attempted shots
    function formatShooting(
        made: number | null,
        attempted: number | null
    ): string {
        if (made === null || attempted === null) {
            return "--";
        }

        return `${made}-${attempted}`;
    }

    // Render an individual player row
    function renderPlayerRow(player: PlayerBoxScore) {

        return (
            <tr
                key={player.playerId}
                className="border-t border-gray-800 hover:bg-gray-800/50"
            >
                <td className="whitespace-nowrap px-3 py-3 text-left font-medium">
                    {player.playerName}
                    <span className="ml-2 text-xs text-gray-500">
                        {player.position}
                    </span>
                </td>

                <td>{player.minutes ?? "--"}</td>

                <td>{player.points ?? "--"}</td>

                <td>{player.rebounds ?? "--"}</td>
                <td>{player.assists ?? "--"}</td>
                <td>{player.steals ?? "--"}</td>
                <td>{player.blocks ?? "--"}</td>

                <td>{formatShooting(player.fgm, player.fga)}</td>
                <td>{formatShooting(player.fg3m, player.fg3a)}</td>
                <td>{formatShooting(player.ftm, player.fta)}</td>

                <td>{player.offensiveRebounds ?? "--"}</td>
                <td>{player.defensiveRebounds ?? "--"}</td>
                <td>{player.turnovers ?? "--"}</td>
                <td>{player.personalFouls ?? "--"}</td>

                <td className={
                    player.plusMinus === null
                        ? "text-gray-400"
                        : player.plusMinus > 0
                            ? "text-green-400"
                            : player.plusMinus < 0
                                ? "text-red-400"
                                : "text-gray-400"
                }>
                    {player.plusMinus === null
                        ? "--"
                        : player.plusMinus > 0
                            ? `+${player.plusMinus}`
                            : player.plusMinus}
                </td>
            </tr>
        );
    }

    // Render a group of players
    function renderGroup(
        title: string,
        group: PlayerBoxScore[]
    ) {
        if (group.length === 0) {
            return null;
        }

        return (
            <>
                <tr className="bg-gray-800/50">
                    <td
                        colSpan={15}
                        className="px-3 py-2 text-left text-xs font-semibold text-gray-400"
                    >
                        {title}
                    </td>
                </tr>

                {sortByMinutes(group).map(renderPlayerRow)}
            </>
        );
    }

    // Render a team box score table
    function renderTeamTable(
        teamPlayers: PlayerBoxScore[]
    ) {

        const didNotPlay = teamPlayers.filter(
            player => toSeconds(player.minutes) === 0
        );

        const activePlayers = teamPlayers.filter(
            player => toSeconds(player.minutes) !== 0
        );

        const starters = activePlayers.filter(
            player => player.starter === true
        );

        const bench = activePlayers.filter(
            player => player.starter === false
        );

        const unknown = activePlayers.filter(
            player => player.starter === null
        );

        const columns = [
            "Player", "MIN", "PTS", "REB", "AST",
            "STL", "BLK", "FG", "3PT", "FT",
            "OREB", "DREB", "TO", "PF", "+/-"
        ];

        return (
            <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">

                {teamPlayers.length === 0 ? (
                    <p className="text-sm text-gray-400">
                        No player statistics available.
                    </p>
                ) : (
                    <div className="overflow-x-auto">

                        <table className="w-full min-w-[1000px] text-center text-sm">

                            <thead className="text-gray-400">
                            <tr>
                                {columns.map((column, index) => (
                                    <th
                                        key={column}
                                        className={`px-3 py-2 ${
                                            index === 0
                                                ? "text-left"
                                                : ""
                                        }`}
                                    >
                                        {column}
                                    </th>
                                ))}
                            </tr>
                            </thead>

                            <tbody>
                            {renderGroup("STARTERS", starters)}
                            {renderGroup("BENCH", bench)}
                            {renderGroup("UNKNOWN LINEUP", unknown)}
                            </tbody>

                        </table>

                    </div>
                )}

                {/* Players with zero recorded minutes */}
                {didNotPlay.length > 0 && (
                    <div className="mt-4 border-t border-gray-800 pt-4">

                        <p className="mb-2 text-xs font-semibold text-gray-500">
                            DID NOT PLAY
                        </p>

                        <p className="text-sm text-gray-400">
                            {didNotPlay
                                .map(player => player.playerName)
                                .join(" · ")}
                        </p>

                    </div>
                )}

            </div>
        );
    }

        return (
            <div className="space-y-4">

                <h2 className="text-xl font-semibold">
                    Box Score
                </h2>

                {/* Team tabs */}
                <div className="flex border-b border-gray-800">

                    <button
                        onClick={() => setActiveTab("away")}
                        className={`flex flex-1 items-center justify-center gap-2 border-b-2 px-4 py-3 ${
                            activeTab === "away"
                                ? "border-orange-500 text-white"
                                : "border-transparent text-gray-400 hover:text-white"
                        }`}
                    >
                        <img
                            src={getTeamLogo(game.awayTeamAbbreviation)}
                            alt={game.awayTeam}
                            className="h-8 w-8 object-contain"
                        />
                        {game.awayTeam}
                    </button>

                    <button
                        onClick={() => setActiveTab("home")}
                        className={`flex flex-1 items-center justify-center gap-2 border-b-2 px-4 py-3 ${
                            activeTab === "home"
                                ? "border-orange-500 text-white"
                                : "border-transparent text-gray-400 hover:text-white"
                        }`}
                    >
                        <img
                            src={getTeamLogo(game.homeTeamAbbreviation)}
                            alt={game.homeTeam}
                            className="h-8 w-8 object-contain"
                        />
                        {game.homeTeam}
                    </button>

                </div>

                {/* Selected team box score */}
                {renderTeamTable(
                    activeTab === "away" ? awayPlayers : homePlayers
                )}

            </div>
        );
}