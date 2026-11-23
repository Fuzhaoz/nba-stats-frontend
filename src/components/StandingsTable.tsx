
import type { TeamRecord } from "../api/standingsApi";
import { getTeamLogo } from "../utils/teamUtils";
import { Link } from "react-router-dom";

interface StandingsTableProps {
    title: string;
    teams: TeamRecord[];
}

export default function StandingsTable({
                                           title,
                                           teams
                                       }: StandingsTableProps) {
    return (
        <section>
            <div className="mb-5">
                <h2 className="mb-5 text-2xl font-bold text-white">
                    {title}
                </h2>
            </div>

            <table className="w-full text-left">
                <thead>
                <tr className="border-b border-gray-700 text-gray-400">
                    <th className="py-3">RK</th>
                    <th className="py-3">Team</th>
                    <th className="py-3 text-right">W</th>
                    <th className="py-3 text-right">L</th>
                    <th className="py-3 text-right">PCT</th>
                    <th className="py-3 text-right">STRK</th>
                </tr>
                </thead>

                <tbody>
                {teams.map((team) => (
                    <tr
                        key={team.teamId}
                        className={`border-b hover:bg-gray-800 ${
                            team.conferenceRank === 6
                                ? "border-b border-dashed border-gray-400"
                                : team.conferenceRank === 10
                                    ? "border-b border-solid border-gray-300"
                                    : "border-gray-800"
                        }`}
                    >
                        <td className="py-3">{team.conferenceRank}</td>
                        <td className="py-3">
                            <div className="flex items-center gap-3">
                                <img
                                    src={getTeamLogo(team.abbreviation)}
                                    alt={`${team.teamName} logo`}
                                    className="h-8 w-8 object-contain"
                                />

                                <Link
                                    to={`/teams/${team.teamId}`}
                                    className="font-medium hover:text-orange-400"
                                >
                                    {team.teamName}
                                </Link>
                            </div>
                        </td>
                        <td className="py-3 text-right">{team.wins}</td>
                        <td className="py-3 text-right">{team.losses}</td>
                        <td className="py-3 text-right">
                            {team.winPercentage.toFixed(3)}
                        </td>
                        <td className="py-3 text-right">
                           <span
                               className={
                                   team.streak.startsWith("W")
                                      ? "font-medium text-green-400"
                                       : team.streak.startsWith("L")
                                           ? "font-medium text-red-400"
                                           : "text-gray-400"
                                         }
                                 >
                                       {team.streak}
                           </span>
                        </td>

                    </tr>
                ))}
                </tbody>
            </table>
        </section>
    );
}
