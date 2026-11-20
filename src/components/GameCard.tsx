interface GameCardProps {
    homeTeam: string;
    awayTeam: string;
    homeScore: number;
    awayScore: number;
    status: string;
}


function GameCard({homeTeam, awayTeam, homeScore, awayScore,  status }: GameCardProps) {
    return (
        <div>
            <p>{status}</p>
            <h2>{homeTeam} vs {awayTeam}</h2>
            <p>
                {status === "UPCOMING"
                    ? "- : -"
                    : `${homeScore} : ${awayScore}`}
            </p>

            {status === "LIVE" && <p>Game in Progress</p>}
        </div>
    )
}

export default GameCard