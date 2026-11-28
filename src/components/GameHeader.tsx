import type { Game } from "../types/game";
import { getTeamLogo } from "../utils/teamUtils";
import { formatGameTime } from "../utils/dateUtils";
import { formatGameDate } from "../utils/dateUtils";

interface GameHeaderProps {
    game: Game;
}

export default function GameHeader({ game }: GameHeaderProps) {

    const isUpcoming = game.status === "Upcoming";

    const isFinal = game.status === "Final";

    const homeWins =
        isFinal &&
        game.homeScore !== null &&
        game.awayScore !== null &&
        game.homeScore > game.awayScore;

    const awayWins =
        isFinal &&
        game.homeScore !== null &&
        game.awayScore !== null &&
        game.awayScore > game.homeScore;

    return (
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">

            {/* Game information */}
            <div className="mb-6 flex items-center justify-between">
                <div className="text-sm text-gray-400">
                    {formatGameDate(game.datetime)} · {game.postseason ? "Playoffs" : "Regular Season"}
                </div>

                <span className={`text-sm font-semibold ${
                    game.status === "Live"
                        ? "text-red-500"
                        : "text-gray-400"
                }`}>
                    {game.status.toUpperCase()}
                </span>
            </div>

            <div className="grid grid-cols-3 items-center">

                {/* Away team */}
                <div className="flex flex-col items-center gap-2">
                    <img
                        src={getTeamLogo(game.awayTeamAbbreviation)}
                        alt={game.awayTeam}
                        className="h-16 w-16 object-contain md:h-24 md:w-24"
                    />

                    <h2 className="text-xl font-bold">
                        {game.awayTeam}
                    </h2>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                        <span>{game.awayTeamRecord ?? "--"}</span>
                        <span className="text-gray-600">·</span>
                        <span className="text-xs">AWAY</span>
                    </div>
                </div>

                {/* Score or start time */}
                <div className="flex flex-col items-center gap-2">
                    {isUpcoming ? (
                        <>
                            <div className="text-2xl font-bold">
                                {formatGameTime(game.datetime)}
                            </div>

                            <span className="text-sm text-gray-400">
                                Scheduled
                            </span>
                        </>
                    ) : (
                        <div className="flex items-center gap-3 text-3xl font-bold md:text-5xl">
                            <span className={
                                isFinal && !awayWins
                                    ? "text-gray-500"
                                    : "text-white"
                            }>
                                {game.awayScore ?? "-"}
                            </span>

                            <span className="text-gray-500">-</span>

                            <span className={
                                isFinal && !homeWins
                                    ? "text-gray-500"
                                    : "text-white"
                            }>
                                {game.homeScore ?? "-"}
                            </span>
                        </div>
                    )}
                </div>

                {/* Home team */}
                <div className="flex flex-col items-center gap-2">
                    <img
                        src={getTeamLogo(game.homeTeamAbbreviation)}
                        alt={game.homeTeam}
                        className="h-16 w-16 object-contain md:h-24 md:w-24"
                    />

                    <h2 className="text-xl font-bold">
                        {game.homeTeam}
                    </h2>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                        <span>{game.homeTeamRecord ?? "--"}</span>
                        <span className="text-gray-600">·</span>
                        <span className="text-xs">HOME</span>
                    </div>
                </div>

            </div>
        </div>
    );
}