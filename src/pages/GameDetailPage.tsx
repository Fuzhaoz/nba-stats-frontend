import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { GameDetail } from "../types/gameDetail";
import { getGameDetail } from "../api/gameApi";
import GameHeader from "../components/GameHeader";
import { getStandings } from "../api/standingsApi";
import type { TeamRecord } from "../api/standingsApi";
import { getNBASeason } from "../utils/dateUtils";
import QuarterScores from "../components/QuarterScores";
import MatchupAnalyzer from "../components/MatchupAnalyzer";
import BoxScore from "../components/BoxScore";
import PredictionCard from "../components/PredictionCard";
import BackButton from "../components/BackButton";
export default function GameDetailPage() {
    const { gameId } = useParams<{ gameId: string }>();

    const [detail, setDetail] = useState<GameDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [standingsData, setStandingsData] = useState<{
        season: number;
        teams: TeamRecord[];
    } | null>(null);

    const season = detail
        ? getNBASeason(detail.game.date)
        : null;

    useEffect(() => {
        const id = Number(gameId);

        if (!Number.isInteger(id) || id <= 0) {
            setError("Invalid game ID");
            setLoading(false);
            return;
        }

        let cancelled = false;

        async function loadGameDetail() {
            try {
                setLoading(true);
                setError(null);

                const data = await getGameDetail(id);

                if (!cancelled) {
                    setDetail(data);
                }
            } catch {
                if (!cancelled) {
                    setError("Failed to load game detail");
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        loadGameDetail();

        return () => {
            cancelled = true;
        };
    }, [gameId]);

    useEffect(() => {
        if (!detail) return;

        if (
            detail.game.status === "Final" &&
            detail.game.boxScoreSynced === true
        ) return;

        let cancelled = false;

        const interval = setInterval(async () => {
            try {
                const data = await getGameDetail(Number(gameId));

                if (!cancelled) {
                    setDetail(data);
                }
            } catch (error) {
                console.error("Failed to refresh game detail:", error);
            }
        }, 60000);

        return () => {
            cancelled = true;
            clearInterval(interval);
        };
    }, [
        gameId,
        detail?.game.status,
        detail?.game.boxScoreSynced
    ]);



    useEffect(() => {
        if (season === null) {
            return;
        }

        let cancelled = false;

        async function loadStandings(season: number) {
            try {
                const data = await getStandings(season);

                if (!cancelled) {
                    setStandingsData({
                        season: season,
                        teams: data
                    });
                }
            } catch (error) {
                if (!cancelled) {
                    console.error("Failed to load standings:", error);
                }
            }
        }

        loadStandings(season);

        return () => {
            cancelled = true;
        };
    }, [season]);


    if (loading) {
        return <div>Loading game detail...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!detail) {
        return <div>Game not found</div>;
    }

    const { game } = detail;

    const standings =
        standingsData?.season === season
            ? standingsData?.teams ?? []
            : [];

    const awayRecord = standings.find(
        (team) =>
            team.abbreviation === game.awayTeamAbbreviation
    );

    const homeRecord = standings.find(
        (team) =>
            team.abbreviation === game.homeTeamAbbreviation
    );

    return (
        <div className="space-y-4 p-6">
            <BackButton fallback="/games" />
            <GameHeader game={{
                ...game,
                awayTeamRecord: awayRecord
                    ? `${awayRecord.wins}-${awayRecord.losses}`
                    : undefined,
                homeTeamRecord: homeRecord
                    ? `${homeRecord.wins}-${homeRecord.losses}`
                    : undefined
            }} />

            <QuarterScores game={game} />

            <MatchupAnalyzer matchup={detail.matchup} />

            <PredictionCard
                key={game.id}
                game={game}
                spreadHome={detail.spreadHome}
            />

            <BoxScore game={game} />
        </div>
    );
}