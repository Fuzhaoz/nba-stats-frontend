import { useEffect, useState } from "react";
import { getAllTeams } from "../api/teamApi";
import type { Team } from "../api/teamApi";
import TeamCard from "../components/team/TeamCard";
import { useSearchParams } from "react-router-dom";

export default function TeamsPage() {
    const [teams, setTeams] = useState<Team[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchParams, setSearchParams] = useSearchParams();

    type Conference = "All" | "East" | "West";


    const conferenceParam = searchParams.get("conference");

    const conference: Conference =
        conferenceParam === "East" || conferenceParam === "West"
            ? conferenceParam
            : "All";

    function setConference(value: Conference) {
        setSearchParams(
            value === "All" ? {} : { conference: value },
            { replace: true }
        );
    }

    useEffect(() => {
        let cancelled = false;

        async function loadTeams() {
            try {
                const data = await getAllTeams();

                if (!cancelled) {
                    setTeams(data);
                }
            } catch {
                if (!cancelled) {
                    setError("Failed to load teams");
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        loadTeams();

        return () => {
            cancelled = true;
        };
    }, []);


    const filteredTeams = teams.filter(
        team =>
            conference === "All" ||
            team.conference === conference
    );

    if (loading) {
        return <p className="text-gray-400">Loading teams...</p>;
    }

    if (error) {
        return <p className="text-red-400">{error}</p>;
    }

    return (
        <section className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-white">
                    NBA Teams
                </h1>

            </div>
            <div className="flex flex-wrap gap-2">
                {(["All", "East", "West"] as const).map(value => (
                    <button
                        key={value}
                        type="button"
                        onClick={() => setConference(value)}
                        className={`cursor-pointer rounded-lg px-4 py-2
                text-sm font-medium transition-colors
                ${conference === value
                            ? "bg-orange-500 text-white"
                            : "bg-gray-800 text-gray-400 hover:text-white"
                        }`}
                    >
                        {value === "All" ? "All Teams" : value}
                    </button>
                ))}
            </div>
            <div className="grid grid-cols-2 gap-3
                            md:grid-cols-3 lg:grid-cols-4
                            xl:grid-cols-5 sm:gap-4">
                {filteredTeams.map(team => (
                    <TeamCard
                        key={team.teamId}
                        team={team}
                    />
                ))}
            </div>
        </section>
    );
}