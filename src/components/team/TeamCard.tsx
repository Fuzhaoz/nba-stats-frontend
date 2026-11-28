import { Link, useLocation } from "react-router-dom";
import type { Team } from "../../api/teamApi";
import { getTeamLogo } from "../../utils/teamUtils";

interface TeamCardProps {
    team: Team;
}

export default function TeamCard({ team }: TeamCardProps) {
    const location = useLocation();

    return (
        <Link
            to={`/teams/${team.teamId}`}
            state={{
                from: location.pathname + location.search
            }}
            className="flex flex-col items-center gap-3 rounded-xl
                       border border-gray-800 bg-gray-900 p-4
                       transition-colors hover:border-orange-400
                       sm:p-6"
        >
            <img
                src={getTeamLogo(team.abbreviation)}
                alt={`${team.fullName} logo`}
                className="h-16 w-16 object-contain sm:h-24 sm:w-24"
            />

            <h2 className="text-center text-sm font-semibold text-white
                           sm:text-lg">
                {team.fullName}
            </h2>

            <p className="text-center text-xs text-gray-400 sm:text-sm">
                {team.conference} · {team.division}
            </p>
        </Link>
    );
}