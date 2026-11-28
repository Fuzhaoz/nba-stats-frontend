
import type { Game } from "../types/game";
import { formatGameTime } from "../utils/dateUtils";
import { getTeamLogo } from "../utils/teamUtils";
import { Link, useLocation } from "react-router-dom";


interface GameCardProps {
    game: Game;
}

export default function GameCard({ game }: GameCardProps) {
    const location = useLocation();
    return (
        <Link
            to={`/games/${game.id}`}
            state={{
                from: location.pathname + location.search
            }}
            className="block rounded-xl border border-slate-800 bg-slate-900 p-6 transition-colors hover:border-orange-500 hover:bg-slate-800"
        >

            {/* Game status */}
            <div className="mb-5 flex justify-end">
                <span className="text-sm font-semibold text-orange-400">
                    {game.status}
                </span>
            </div>

            <div className="grid grid-cols-3 items-center gap-3">

                {/* Away team */}
                <div className="flex flex-col items-center gap-2 text-center">
                    <img
                        src={getTeamLogo(game.awayTeamAbbreviation)}
                        alt={`${game.awayTeam} logo`}
                        className="h-16 w-16 bg-transparent object-contain"
                    />

                    <p className="text-sm font-medium text-white">
                        {game.awayTeam}
                    </p>

                    <p className="text-sm text-slate-400">
                        {game.awayTeamRecord ?? "--"}
                    </p>
                </div>

                {/* Game time or score */}
                <div className="text-center">
                    {game.status === "Upcoming" ? (
                        <p className="text-xl font-bold text-white">
                            {formatGameTime(game.datetime)}
                        </p>
                    ) : (
                        <p className="text-2xl font-bold text-white">
                            {game.awayScore ?? "-"} : {game.homeScore ?? "-"}
                        </p>
                    )}
                </div>

                {/* Home team */}
                <div className="flex flex-col items-center gap-2 text-center">
                    <img
                        src={getTeamLogo(game.homeTeamAbbreviation)}
                        alt={`${game.homeTeam} logo`}
                        className="h-16 w-16 bg-transparent object-contain"
                    />

                    <p className="text-sm font-medium text-white">
                        {game.homeTeam}
                    </p>

                    <p className="text-sm text-slate-400">
                        {game.homeTeamRecord ?? "--"}
                    </p>
                </div>

            </div>
        </Link>
    );
}
