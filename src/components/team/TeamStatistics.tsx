
import type { TeamSeasonStats } from "../../api/teamApi";

interface TeamStatisticsProps {
    stats: TeamSeasonStats | null;
}

export default function TeamStatistics({
                                           stats,
                                       }: TeamStatisticsProps) {

    function formatNumber(value: number | null | undefined) {
        return value == null ? "—" : value.toFixed(1);
    }

    function formatPercentage(value: number | null | undefined) {
        return value == null ? "—" : `${(value * 100).toFixed(1)}%`;
    }

    return (
        <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">
                Team Statistics
            </h2>

            {stats ? (
                <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">

                    {/* Header */}
                    <div className="mb-5 flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-orange-400">
                            Season Statistics
                        </h3>

                        <span className="text-xs uppercase tracking-wider text-gray-500">
              Per Game
            </span>
                    </div>

                    {/* Statistics Grid */}
                    <div className="grid grid-cols-1 gap-x-12 md:grid-cols-2">
                        {[
                            {
                                label: "Points / Game",
                                value: formatNumber(stats.ppg),
                                rank: stats.ppgRank,
                            },
                            {
                                label: "Rebounds / Game",
                                value: formatNumber(stats.rpg),
                                rank: stats.rpgRank,
                            },
                            {
                                label: "Assists / Game",
                                value: formatNumber(stats.apg),
                                rank: stats.apgRank,
                            },
                            {
                                label: "Field Goal %",
                                value: formatPercentage(stats.fgPct),
                                rank: stats.fgPctRank,
                            },
                            {
                                label: "Three-Point %",
                                value: formatPercentage(stats.fg3Pct),
                                rank: stats.fg3PctRank,
                            },
                            {
                                label: "Free Throw %",
                                value: formatPercentage(stats.ftPct),
                                rank: stats.ftPctRank,
                            },
                            {
                                label: "Steals / Game",
                                value: formatNumber(stats.spg),
                                rank: stats.spgRank,
                            },
                            {
                                label: "Blocks / Game",
                                value: formatNumber(stats.bpg),
                                rank: stats.bpgRank,
                            },
                            {
                                label: "Turnovers / Game",
                                value: formatNumber(stats.turnovers),
                                rank: stats.turnoversRank,
                            },
                            {
                                label: "Plus / Minus",
                                value:
                                    stats.plusMinus == null
                                        ? "—"
                                        : `${stats.plusMinus > 0 ? "+" : ""}${stats.plusMinus.toFixed(1)}`,
                                rank: stats.plusMinusRank,
                            },
                        ].map((stat) => {

                            const isTopFive =
                                stat.rank != null &&
                                stat.rank > 0 &&
                                stat.rank <= 5;

                            return (
                                <div
                                    key={stat.label}
                                    className="flex items-center justify-between gap-4 border-b border-gray-800 py-4"
                                >
                                    {/* Statistic Name */}
                                    <span className="text-sm text-gray-400">
                    {stat.label}
                  </span>

                                    {/* Value + NBA Rank */}
                                    <div className="flex shrink-0 items-center gap-3">
                    <span className="min-w-14 text-right font-semibold tabular-nums text-white">
                      {stat.value}
                    </span>

                                        <span
                                            className={`min-w-20 rounded-md px-2 py-1 text-center text-xs font-medium tabular-nums ${
                                                isTopFive
                                                    ? "bg-orange-500/15 text-orange-400"
                                                    : "bg-gray-800 text-gray-400"
                                            }`}
                                        >
                      {stat.rank == null || stat.rank <= 0
                          ? "—"
                          : `#${stat.rank}`}
                    </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Footer */}
                    <p className="mt-5 text-xs text-gray-500">
                        Rankings are based on all NBA teams in the regular season.
                    </p>
                </div>
            ) : (
                <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
                    <p className="text-sm text-gray-400">
                        No team statistics available.
                    </p>
                </div>
            )}
        </section>
    );
}
