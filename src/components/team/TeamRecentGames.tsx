
import { Link } from "react-router-dom";
import type { RecentGame } from "../../api/teamApi";
import { getTeamLogo } from "../../utils/teamUtils";

interface TeamRecentGamesProps {
    teamId: number;
    recentGames: RecentGame[];
}

export default function TeamRecentGames({
                                            teamId,
                                            recentGames,
                                        }: TeamRecentGamesProps) {
    const recentWins = recentGames.filter((game) => {
        const isHome = game.homeTeamId === teamId;

        const teamScore = isHome
            ? game.homeTeamScore
            : game.visitorTeamScore;

        const opponentScore = isHome
            ? game.visitorTeamScore
            : game.homeTeamScore;

        return (
            teamScore != null &&
            opponentScore != null &&
            teamScore > opponentScore
        );
    }).length;

    const recentLosses = recentGames.length - recentWins;

    return (
        <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">
                Last 5 Games
            </h2>

            <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
                {recentGames.length > 0 ? (
                    <>
                        {/* Recent Form */}
                        <div className="mb-6 flex flex-wrap items-center gap-3">
              <span className="text-sm text-gray-400">
                Recent Form
              </span>

                            <div className="flex gap-2">
                                {[...recentGames].reverse().map((game) => {
                                    const isHome = game.homeTeamId === teamId;

                                    const teamScore = isHome
                                        ? game.homeTeamScore
                                        : game.visitorTeamScore;

                                    const opponentScore = isHome
                                        ? game.visitorTeamScore
                                        : game.homeTeamScore;

                                    const isWin =
                                        teamScore != null &&
                                        opponentScore != null &&
                                        teamScore > opponentScore;

                                    return (
                                        <span
                                            key={game.gameId}
                                            className={`flex h-7 w-7 items-center justify-center rounded-md text-xs font-bold ${
                                                isWin
                                                    ? "bg-emerald-500/15 text-emerald-400"
                                                    : "bg-red-500/15 text-red-400"
                                            }`}
                                        >
                      {isWin ? "W" : "L"}
                    </span>
                                    );
                                })}
                            </div>

                            <span className="ml-auto text-sm font-semibold text-white">
                {recentWins}–{recentLosses}
              </span>
                        </div>

                        {/* Game List */}
                        <div className="divide-y divide-gray-800">
                            {recentGames.map((game) => {
                                const isHome = game.homeTeamId === teamId;

                                const opponentName = isHome
                                    ? game.visitorTeamName
                                    : game.homeTeamName;

                                const opponentAbbreviation = isHome
                                    ? game.visitorTeamAbbreviation
                                    : game.homeTeamAbbreviation;

                                const teamScore = isHome
                                    ? game.homeTeamScore
                                    : game.visitorTeamScore;

                                const opponentScore = isHome
                                    ? game.visitorTeamScore
                                    : game.homeTeamScore;

                                const isWin =
                                    teamScore != null &&
                                    opponentScore != null &&
                                    teamScore > opponentScore;

                                return (
                                    <Link
                                        key={game.gameId}
                                        to={`/games/${game.gameId}`}
                                        className="flex items-center justify-between gap-4 rounded-lg px-3 py-4 transition-colors hover:bg-gray-800/60"
                                    >
                                        {/* Date */}
                                        <span className="w-20 shrink-0 text-xs text-gray-400">
                      {game.date}
                    </span>

                                        {/* Opponent */}
                                        <div className="flex flex-1 items-center gap-3">
                                            <img
                                                src={getTeamLogo(opponentAbbreviation)}
                                                alt={`${opponentName} logo`}
                                                className="h-9 w-9 object-contain"
                                            />

                                            <div>
                                                <p className="text-sm font-semibold text-white">
                                                    {isHome ? "vs" : "@"} {opponentAbbreviation}
                                                </p>

                                                <p className="text-xs text-gray-400">
                                                    {opponentName}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Score */}
                                        <span className="text-sm font-semibold tabular-nums text-white">
                      {teamScore ?? "—"} - {opponentScore ?? "—"}
                    </span>

                                        {/* Win / Loss */}
                                        <span
                                            className={`w-8 rounded-md py-1 text-center text-xs font-bold ${
                                                isWin
                                                    ? "bg-emerald-500/15 text-emerald-400"
                                                    : "bg-red-500/15 text-red-400"
                                            }`}
                                        >
                      {isWin ? "W" : "L"}
                    </span>
                                    </Link>
                                );
                            })}
                        </div>
                    </>
                ) : (
                    <p className="text-sm text-gray-400">
                        No recent games available.
                    </p>
                )}
            </div>
        </section>
    );
}
