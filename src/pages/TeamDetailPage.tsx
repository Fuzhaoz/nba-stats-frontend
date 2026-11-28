
import { useEffect, useState } from "react";
import TeamRoster from "../components/team/TeamRoster";
import { getTeamRecord, getTeamStats } from "../api/teamApi";
import type { TeamSeasonStats } from "../api/teamApi";
import type { TeamRecord } from "../api/standingsApi";
import TeamGames from "../components/team/TeamGames";
import { getNBASeason, getTodayDate } from "../utils/dateUtils";
import { getTeamLogo } from "../utils/teamUtils";
import { getRecentGames } from "../api/teamApi";
import type { RecentGame } from "../api/teamApi";
import TeamStatistics from "../components/team/TeamStatistics";
import TeamRecentGames from "../components/team/TeamRecentGames";
import {
    useParams,
    useSearchParams,
    useLocation
} from "react-router-dom";

import BackButton from "../components/BackButton";

export default function TeamDetailPage() {
    const { teamId } = useParams<{ teamId: string }>();

    const [team, setTeam] = useState<TeamRecord | null>(null);
    const [stats, setStats] = useState<TeamSeasonStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [recentGames, setRecentGames] = useState<RecentGame[]>([]);
    const season = getNBASeason(getTodayDate());
    type TeamTab = "overview" | "roster" | "games";

    const [searchParams, setSearchParams] = useSearchParams();

    const tab = searchParams.get("tab");
    const location = useLocation();

    const activeTab: TeamTab =
        tab === "roster" || tab === "games"
            ? tab
            : "overview";

    function setActiveTab(tab: TeamTab) {
        setSearchParams(
            { tab },
            {
                replace: true,
                state: location.state
            }
        );
    }

    useEffect(() => {
        let cancelled = false;

        async function loadTeam() {
            try {
                setLoading(true);
                setError(null);
                setTeam(null);
                setStats(null);
                setRecentGames([]);

                const id = Number(teamId);

                if (
                    !teamId ||
                    !Number.isInteger(id) ||
                    id <= 0
                ) {
                    throw new Error("Invalid team ID");
                }

                // Fetch team record and statistics in parallel
                const [teamData, statsData, gamesData] = await Promise.all([
                    getTeamRecord(id, season),
                    getTeamStats(id, season),
                    getRecentGames(id, 5)
                ]);
                console.log("Recent Games API:", gamesData);
                if (!cancelled) {
                    setTeam(teamData);
                    setStats(statsData);
                    setRecentGames(gamesData);
                }
            } catch (err) {
                console.error("Failed to load team:", err);

                if (!cancelled) {
                    setError("Failed to load team");
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        void loadTeam();

        return () => {
            cancelled = true;
        };
    }, [teamId, season]);



    if (loading) {
        return (
            <p className="text-gray-400">
                Loading team...
            </p>
        );
    }

    if (error) {
        return (
            <p className="text-red-400">
                {error}
            </p>
        );
    }

    if (!team) {
        return (
            <p className="text-gray-400">
                Team not found
            </p>
        );
    }


    return (
        <div className="space-y-8 text-white">
            <BackButton fallback="/standings" />



            {/* Team Header */}
            <section className="rounded-2xl border border-gray-800 bg-gray-900 p-6">

                {/* Breadcrumb */}
                <p className="mb-6 text-xs font-medium uppercase tracking-widest text-gray-500">
                    Courtside / Teams / {team.teamName}
                </p>

                {/* Team Identity */}
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center">

                    <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-2xl bg-gray-800 p-4">
                        <img
                            src={getTeamLogo(team.abbreviation)}
                            alt={`${team.teamName} logo`}
                            className="h-full w-full object-contain"
                        />
                    </div>

                    <div className="flex-1">
                        <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
                            {team.teamName}
                        </h1>

                        <p className="mt-2 text-sm text-gray-400">
                            {team.conference === "East" ? "Eastern" : "Western"} Conference
                            {" · "}
                            #{team.conferenceRank} Seed
                        </p>

                        <div className="mt-4 flex flex-wrap items-center gap-3">
                <span className="text-lg font-semibold text-emerald-400">
                    {team.wins}W - {team.losses}L
                </span>

                            <span
                                className={`rounded-full px-3 py-1 text-sm font-semibold ${
                                    team.streak?.startsWith("W")
                                        ? "bg-emerald-500/10 text-emerald-400"
                                        : team.streak?.startsWith("L")
                                            ? "bg-red-500/10 text-red-400"
                                            : "bg-gray-800 text-gray-300"
                                }`}
                            >
    {                            team.streak} Streak
                            </span>
                        </div>
                    </div>
                </div>

                {/* Season Information */}
                <div className="mt-6 flex items-center justify-between border-t border-gray-800 pt-4">
        <span className="text-sm text-gray-400">
            Regular Season
        </span>

                    <span className="rounded-lg bg-gray-800 px-3 py-1 text-sm font-medium text-gray-200">
            {season}-{String(season + 1).slice(-2)}
        </span>
                </div>
            </section>

            {/* Team Tabs */}
            <div className="flex border-b border-gray-800">
                {(["overview", "roster", "games"] as const).map((tab) => (
                    <button
                        key={tab}
                        type="button"
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 border-b-2 px-4 py-4 text-sm font-semibold capitalize transition-colors ${
                            activeTab === tab
                                ? "border-orange-500 text-orange-400"
                                : "border-transparent text-gray-400 hover:text-white"
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            {activeTab === "overview" && (
                <div className="space-y-8">
                    <TeamStatistics stats={stats} />

                    <TeamRecentGames
                        teamId={Number(teamId)}
                        recentGames={recentGames}
                    />
                </div>
            )}

            {activeTab === "roster" && (
                <TeamRoster teamId={Number(teamId)} />
            )}

            {activeTab === "games" && teamId && (
                <TeamGames
                    teamId={Number(teamId)}
                    season={2026}
                />
            )}



        </div>
    );
}
