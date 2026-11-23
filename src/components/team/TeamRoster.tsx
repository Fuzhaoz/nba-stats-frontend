
import { useEffect, useState } from "react";
import { getTeamRoster } from "../../api/playerApi";
import type { Player } from "../../api/playerApi";

interface TeamRosterProps {
    teamId: number;
}

export default function TeamRoster({ teamId }: TeamRosterProps) {
    const [players, setPlayers] = useState<Player[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        async function loadRoster() {
            try {
                setLoading(true);
                setError(null);

                const data = await getTeamRoster(teamId);

                if (!cancelled) {
                    setPlayers(data);
                }
            } catch (err) {
                console.error("Failed to load roster:", err);

                if (!cancelled) {
                    setError("Failed to load team roster");
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        void loadRoster();

        return () => {
            cancelled = true;
        };
    }, [teamId]);

    if (loading) {
        return <p className="text-gray-400">Loading roster...</p>;
    }

    if (error) {
        return <p className="text-red-400">{error}</p>;
    }

    return (
        <section className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-white">
                    Team Roster
                </h2>
                <p className="mt-1 text-sm text-gray-400">
                    {players.length} Players
                </p>
            </div>

            {players.length === 0 ? (
                <p className="text-gray-400">
                    No active players found.
                </p>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {players.map((player) => (
                        <div
                            key={player.playerId}
                            className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900"
                        >
                            <div className="flex h-44 items-end justify-center bg-gray-800">
                                {player.imageUrl ? (
                                    <img
                                        src={player.imageUrl}
                                        alt={`${player.firstName} ${player.lastName}`}
                                        className="h-full w-full object-contain object-bottom"
                                    />
                                ) : (
                                    <div className="flex h-full items-center text-gray-500">
                                        No Photo
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2 p-5">
                                <p className="text-sm font-semibold text-orange-400">
                                    #{player.jerseyNumber ?? "—"} · {player.position ?? "N/A"}
                                </p>

                                <h3 className="text-lg font-bold text-white">
                                    {player.firstName} {player.lastName}
                                </h3>

                                <p className="text-sm text-gray-400">
                                    {player.height ?? "—"} · {player.weight ? `${player.weight} lbs` : "—"}
                                </p>

                                <p className="text-xs text-gray-500">
                                    {player.country ?? "Unknown country"}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}
