
import { useEffect, useState } from "react";
import { getTeamGames } from "../../api/gameApi";
import type { Game } from "../../types/game";
import { formatGameDate } from "../../utils/dateUtils";
import { Link, useLocation } from "react-router-dom";

interface TeamGamesProps {
    teamId: number;
    season: number;
}

export default function TeamGames({ teamId, season }: TeamGamesProps) {
    const location = useLocation();
    const [games, setGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        async function loadGames() {
            setLoading(true);
            setError(null);

            try {
                const data = await getTeamGames(teamId, season);

                if (!cancelled) {
                    setGames(data);
                }
            } catch {
                if (!cancelled) {
                    setError("Failed to load team games");
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        loadGames();

        return () => {
            cancelled = true;
        };
    }, [teamId, season]);

    if (loading) {
        return <p className="text-gray-400">Loading games...</p>;
    }

    if (error) {
        return <p className="text-red-400">{error}</p>;
    }

    if (games.length === 0) {
        return <p className="text-gray-400">No games available.</p>;
    }

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">
                {season}-{String(season + 1).slice(-2)} Season Games
            </h2>

            <div className="space-y-3">
                {games.map((game) => {
                    const isFinal = game.status === "Final";

                    const isHome = game.homeTeamId === teamId;

                    const opponent = isHome
                        ? game.awayTeamAbbreviation
                        : game.homeTeamAbbreviation;

                    const teamScore = isHome
                        ? game.homeScore
                        : game.awayScore;

                    const opponentScore = isHome
                        ? game.awayScore
                        : game.homeScore;

                    const result =
                        isFinal && teamScore != null && opponentScore != null
                            ? teamScore > opponentScore
                                ? "W"
                                : teamScore < opponentScore
                                    ? "L"
                                    : null
                            : null;



                    return (
                        <Link
                            key={game.id}
                            to={`/games/${game.id}`}
                            state={{
                                from: location.pathname + location.search
                            }}
                            className="block rounded-xl border border-gray-800 bg-gray-900 p-4 transition-colors hover:border-orange-500 hover:bg-gray-800"
                        >
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    {result && (
                                        <span
                                            className={`rounded-md px-3 py-1 text-sm font-bold ${
                                                result === "W"
                                                    ? "bg-green-500/20 text-green-400"
                                                    : "bg-red-500/20 text-red-400"
                                            }`}
                                        >
                        {result}
                    </span>
                                    )}

                                    <div>
                                        <p className="text-sm text-gray-400">
                                            {formatGameDate(game.datetime)}
                                        </p>

                                        <p className="font-semibold text-white">
                                            {isHome ? "vs" : "@"} {opponent}
                                        </p>
                                    </div>
                                </div>

                                <div className="text-right">
                                    {isFinal && teamScore != null && opponentScore != null ? (
                                        <p className="font-bold text-white">
                                            {teamScore} - {opponentScore}
                                        </p>
                                    ) : (
                                        <p className="text-sm text-gray-400">
                                            {game.status}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </Link>
                    );

                })}
            </div>
        </div>
    );
}
