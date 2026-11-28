import type { GameMatchup } from "../types/gameDetail";

interface MatchupAnalyzerProps {
    matchup: GameMatchup | null;
}

interface ComparisonStat {
    label: string;
    away: number;
    home: number;
    percentage?: boolean;
    lowerIsBetter?: boolean;
}

export default function MatchupAnalyzer({
                                            matchup
                                        }: MatchupAnalyzerProps) {

    if (!matchup) {
        return null;
    }

    const { homeTeam, visitorTeam } = matchup;

    // Build comparison statistics
    const stats: ComparisonStat[] = [
        {
            label: "Points",
            away: visitorTeam.ppg,
            home: homeTeam.ppg
        },
        {
            label: "Rebounds",
            away: visitorTeam.rpg,
            home: homeTeam.rpg
        },
        {
            label: "Assists",
            away: visitorTeam.apg,
            home: homeTeam.apg
        },
        {
            label: "Field Goal %",
            away: visitorTeam.fgPct,
            home: homeTeam.fgPct,
            percentage: true
        },
        {
            label: "Three Point %",
            away: visitorTeam.fg3Pct,
            home: homeTeam.fg3Pct,
            percentage: true
        },
        {
            label: "Free Throw %",
            away: visitorTeam.ftPct,
            home: homeTeam.ftPct,
            percentage: true
        },
        {
            label: "Steals",
            away: visitorTeam.spg,
            home: homeTeam.spg
        },
        {
            label: "Blocks",
            away: visitorTeam.bpg,
            home: homeTeam.bpg
        },
        {
            label: "Turnovers",
            away: visitorTeam.turnovers,
            home: homeTeam.turnovers,
            lowerIsBetter: true
        }
    ];

    function formatValue(
        value: number,
        percentage?: boolean
    ): string {
        return percentage
            ? `${(value * 100).toFixed(1)}%`
            : value.toFixed(1);
    }

    return (
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">

            <h2 className="mb-6 text-lg font-semibold">
                Matchup Analyzer
            </h2>

            {/* Team information */}
            <div className="mb-6 flex items-center justify-between">

                <div>
                    <h3 className="font-semibold">
                        {visitorTeam.teamName}
                    </h3>
                </div>

                <span className="text-sm text-gray-500">
                    VS
                </span>

                <div className="text-right">
                    <h3 className="font-semibold">
                        {homeTeam.teamName}
                    </h3>
                </div>

            </div>
            {/* Recent form and head-to-head records */}
            <div className="mb-6 space-y-3 border-b border-gray-800 pb-4 text-sm">

                <div className="grid grid-cols-3 items-center">
        <span className="font-semibold">
            {visitorTeam.last5Record}
        </span>

                    <span className="text-center text-gray-400">
            Last 5 Games
        </span>

                    <span className="text-right font-semibold">
            {homeTeam.last5Record}
        </span>
                </div>

                <div className="grid grid-cols-3 items-center">
        <span className="font-semibold">
            {visitorTeam.h2hRecord}
        </span>

                    <span className="text-center text-gray-400">
            Head to Head
        </span>

                    <span className="text-right font-semibold">
            {homeTeam.h2hRecord}
        </span>
                </div>

            </div>

            <h3 className="mb-4 text-sm font-medium text-gray-400">
                Season Statistics
            </h3>
            {/* Statistical comparisons */}
            <div className="space-y-5">

                {stats.map((stat) => {

                    const awayBetter = stat.lowerIsBetter
                        ? stat.away < stat.home
                        : stat.away > stat.home;

                    const homeBetter = stat.lowerIsBetter
                        ? stat.home < stat.away
                        : stat.home > stat.away;

                    const maxValue = Math.max(
                        stat.away,
                        stat.home
                    );

                    const awayWidth = maxValue > 0
                        ? (stat.away / maxValue) * 100
                        : 0;

                    const homeWidth = maxValue > 0
                        ? (stat.home / maxValue) * 100
                        : 0;

                    return (
                        <div key={stat.label}>

                            {/* Statistic values */}
                            <div className="mb-2 grid grid-cols-3 items-center text-sm">

                                <span className={
                                    awayBetter
                                        ? "font-semibold text-orange-500"
                                        : "text-gray-300"
                                }>
                                    {formatValue(
                                        stat.away,
                                        stat.percentage
                                    )}
                                </span>

                                <span className="text-center text-gray-400">
                                    {stat.label}
                                </span>

                                <span className={`text-right ${
                                    homeBetter
                                        ? "font-semibold text-orange-500"
                                        : "text-gray-300"
                                }`}>
                                    {formatValue(
                                        stat.home,
                                        stat.percentage
                                    )}
                                </span>

                            </div>

                            {/* Comparison bars */}
                            <div className="grid grid-cols-2 gap-1">

                                <div className="flex h-2 justify-end overflow-hidden rounded bg-gray-800">
                                    <div
                                        className={`h-full rounded ${
                                            awayBetter
                                                ? "bg-orange-500"
                                                : "bg-gray-500"
                                        }`}
                                        style={{
                                            width: `${awayWidth}%`
                                        }}
                                    />
                                </div>

                                <div className="h-2 overflow-hidden rounded bg-gray-800">
                                    <div
                                        className={`h-full rounded ${
                                            homeBetter
                                                ? "bg-orange-500"
                                                : "bg-gray-500"
                                        }`}
                                        style={{
                                            width: `${homeWidth}%`
                                        }}
                                    />
                                </div>

                            </div>

                        </div>
                    );
                })}

            </div>
        </div>
    );
}