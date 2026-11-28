import type { Game } from "../types/game";

interface QuarterScoresProps {
    game: Game;
}

export default function QuarterScores({ game }: QuarterScoresProps) {

    if (game.status === "Upcoming") {
        return null;
    }

    // Build regular quarter scores
    const quarters = [
        {
            label: "Q1",
            away: game.awayQ1,
            home: game.homeQ1
        },
        {
            label: "Q2",
            away: game.awayQ2,
            home: game.homeQ2
        },
        {
            label: "Q3",
            away: game.awayQ3,
            home: game.homeQ3
        },
        {
            label: "Q4",
            away: game.awayQ4,
            home: game.homeQ4
        }
    ];

    // Build overtime scores
    const overtimes = [
        {
            label: "OT1",
            away: game.awayOt1,
            home: game.homeOt1
        },
        {
            label: "OT2",
            away: game.awayOt2,
            home: game.homeOt2
        },
        {
            label: "OT3",
            away: game.awayOt3,
            home: game.homeOt3
        }
    ];

    // Include overtime periods with available scores
    const periods = [
        ...quarters,
        ...overtimes.filter(
            (ot) => ot.away !== null || ot.home !== null
        )
    ];

    return (
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">

            <h2 className="mb-4 text-lg font-semibold">
                Quarter Scores
            </h2>

            <div className="overflow-x-auto">
                <table className="w-full text-center text-sm">

                    <thead className="text-gray-400">
                    <tr>
                        <th className="px-3 py-2 text-left">
                            Team
                        </th>

                        {periods.map((period) => (
                            <th
                                key={period.label}
                                className="px-3 py-2"
                            >
                                {period.label}
                            </th>
                        ))}

                        <th className="px-3 py-2">
                            Total
                        </th>
                    </tr>
                    </thead>

                    <tbody>

                    {/* Away team scores */}
                    <tr className="border-t border-gray-800">
                        <td className="px-3 py-3 text-left font-semibold">
                            {game.awayTeamAbbreviation}
                        </td>

                        {periods.map((period) => (
                            <td
                                key={period.label}
                                className="px-3 py-3"
                            >
                                {period.away ?? "--"}
                            </td>
                        ))}

                        <td className="px-3 py-3 font-bold">
                            {game.awayScore ?? "--"}
                        </td>
                    </tr>

                    {/* Home team scores */}
                    <tr className="border-t border-gray-800">
                        <td className="px-3 py-3 text-left font-semibold">
                            {game.homeTeamAbbreviation}
                        </td>

                        {periods.map((period) => (
                            <td
                                key={period.label}
                                className="px-3 py-3"
                            >
                                {period.home ?? "--"}
                            </td>
                        ))}

                        <td className="px-3 py-3 font-bold">
                            {game.homeScore ?? "--"}
                        </td>
                    </tr>

                    </tbody>
                </table>
            </div>
        </div>
    );
}