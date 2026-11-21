
import { useEffect, useState } from "react";
import { getGamesByDate } from "../api/gameApi";
import { getStandings } from "../api/standingsApi";
import GameCard from "../components/GameCard";
import WeekCalendar from "../components/WeekCalendar";
import type { Game } from "../types/game";
import type { TeamRecord } from "../api/standingsApi";
import { getTodayDate, getNBASeason } from "../utils/dateUtils";

export default function GamesPage() {
    const [games, setGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState(getTodayDate);
    const [standingsData, setStandingsData] = useState<{
        season: number;
        teams: TeamRecord[];
    } | null>(null);
    const season = getNBASeason(selectedDate);

    // Load standings once
    useEffect(() => {
        let cancelled = false;

        async function loadStandings() {
            try {
                const data = await getStandings(season);

                if (!cancelled) {
                    setStandingsData({
                        season: season,
                        teams: data,
                    });
                }
            } catch (error) {
                if (!cancelled) {
                    console.error("Failed to load standings:", error);
                }
            }
        }

        loadStandings();

        return () => {
            cancelled = true;
        };
    }, []);

    // Load games when selected date changes
    useEffect(() => {
        let cancelled = false;

        async function loadGames() {
            try {
                setLoading(true);
                setError(null);

                const data = await getGamesByDate(selectedDate);

                if (!cancelled) {
                    setGames(data);
                }
            } catch (error) {
                if (!cancelled) {
                    console.error("Failed to load games:", error);
                    setError("Failed to load games.");
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        loadGames();

        return () => {
            cancelled = true;
        };
    }, [selectedDate]);

    const standings =
        standingsData?.season === season
            ? standingsData.teams
            : [];



    return (
        <div>
            <h1>NBA Games</h1>

            <WeekCalendar
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
            />



            {loading ? (
                <p className="py-10 text-center text-slate-400">
                    Loading games...
                </p>
            ) : error ? (
                <p className="py-10 text-center text-red-400">
                    {error}
                </p>
            ) : games.length === 0 ? (
                <p className="py-10 text-center text-slate-400">
                    No games scheduled for this date.
                </p>
            ) : (
                <div className="grid gap-6 lg:grid-cols-2">
                    {games.map((game) => {
                        const awayRecord = standings.find(
                            (team) =>
                                team.abbreviation === game.awayTeamAbbreviation
                        );

                        const homeRecord = standings.find(
                            (team) =>
                                team.abbreviation === game.homeTeamAbbreviation
                        );

                        return (
                            <GameCard
                                key={game.id}
                                game={{
                                    ...game,
                                    awayTeamRecord: awayRecord
                                        ? `${awayRecord.wins}-${awayRecord.losses}`
                                        : undefined,
                                    homeTeamRecord: homeRecord
                                        ? `${homeRecord.wins}-${homeRecord.losses}`
                                        : undefined,
                                }}
                            />
                        );
                    })}
                </div>
            )}
        </div>
    );
}
