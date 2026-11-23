
import { useEffect, useState } from "react";
import { getStandings, type TeamRecord } from "../api/standingsApi";
import { getNBASeason, getTodayDate } from "../utils/dateUtils";
import StandingsTable from "../components/StandingsTable";

export default function StandingsPage() {
    const [standings, setStandings] = useState<TeamRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const season = getNBASeason(getTodayDate());
    const easternTeams = standings
        .filter((team) => team.conference === "East")
        .sort((a, b) => a.conferenceRank - b.conferenceRank);

    const westernTeams = standings
        .filter((team) => team.conference === "West")
        .sort((a, b) => a.conferenceRank - b.conferenceRank);

    useEffect(() => {
        let cancelled = false;

        async function loadStandings() {
            try {
                setLoading(true);
                setError(null);

                const data = await getStandings(season);

                if (!cancelled) {
                    setStandings(data);
                }
            } catch  {
                if (!cancelled) {
                    setError("Failed to load standings");
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        void loadStandings();

        return () => {
            cancelled = true;
        };
    }, [season]);

    if (loading) {
        return <p>Loading standings...</p>;
    }

    if (error) {
        return <p className="text-red-400">{error}</p>;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">NBA Standings</h1>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                <StandingsTable title="Western Conference" teams={westernTeams} />
                <StandingsTable title="Eastern Conference" teams={easternTeams} />
            </div>
        </div>
    );
}
