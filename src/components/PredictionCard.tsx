import type { Game } from "../types/game";
import { useState } from "react";
import { getTeamLogo } from "../utils/teamUtils";

interface PredictionCardProps {
    game: Game;
    spreadHome: number | null;
}

export default function PredictionCard({
                                           game,
                                           spreadHome
                                       }: PredictionCardProps) {

    const [selectedSide, setSelectedSide] =
        useState<"HOME" | "AWAY" | null>(null);


    // Only display prediction options before the game starts
    if (game.status !== "Upcoming") {
        return null;
    }

    // Handle unavailable spread data
    if (spreadHome === null) {
        return (
            <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
                <h2 className="mb-2 text-lg font-semibold">
                    Game Prediction
                </h2>

                <p className="text-sm text-gray-400">
                    Spread unavailable.
                </p>
            </div>
        );
    }
    const spreadAway = -spreadHome;

    function formatSpread(spread: number): string {
        return spread > 0 ? `+${spread}` : String(spread);
    }
// Render a selectable team option
    function renderTeamOption(
        side: "HOME" | "AWAY",
        teamName: string,
        abbreviation: string,
        spread: number
    ) {
        const isSelected = selectedSide === side;

        return (
            <button
                type="button"
                onClick={() => setSelectedSide(side)}
                className={`flex flex-col items-center gap-3
                rounded-xl border p-4 transition-colors ${
                    isSelected
                        ? "border-orange-500 bg-orange-500/10"
                        : "border-gray-700 bg-gray-800 hover:border-gray-500"
                }`}
            >
                <img
                    src={getTeamLogo(abbreviation)}
                    alt={teamName}
                    className="h-16 w-16 object-contain"
                />

                <span className="font-semibold">
                {teamName}
            </span>

                <span className="text-2xl font-bold">
                {formatSpread(spread)}
            </span>

                <span className="text-xs text-gray-400">
                {side}
            </span>
            </button>
        );
    }

    return (
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">

            <h2 className="mb-2 text-lg font-semibold">
                Game Prediction
            </h2>

            <p className="mb-4 text-sm text-gray-400">
                Which team will cover the spread?
            </p>

            <div className="grid grid-cols-2 gap-4">
                {renderTeamOption(
                    "AWAY",
                    game.awayTeam,
                    game.awayTeamAbbreviation,
                    spreadAway
                )}

                {renderTeamOption(
                    "HOME",
                    game.homeTeam,
                    game.homeTeamAbbreviation,
                    spreadHome
                )}
            </div>

            <button
                type="button"
                disabled
                className="mt-4 w-full cursor-not-allowed
                rounded-lg bg-gray-700 py-3
                font-semibold text-gray-400"
            >
                Sign in to predict
            </button>

            <p className="mt-3 text-center text-xs text-gray-400">
                You can change your prediction before tip-off.
            </p>

        </div>
    );
}