import GameCard from './components/GameCard'
import { useState, useEffect } from 'react'
function App() {
    const [selectedStatus, setSelectedStatus] = useState("ALL");
    useEffect(() => {
        console.log("App mounted");
    }, []);

    useEffect(() => {
        console.log("Selected status:", selectedStatus);
    }, [selectedStatus]);
    const games = [
        {
            id: 1,
            homeTeam: "MIA",
            awayTeam: "BOS",
            homeScore: 82,
            awayScore: 78,
            status: "LIVE"
        },
        {
            id: 2,
            homeTeam: "LAL",
            awayTeam: "GSW",
            homeScore: 118,
            awayScore: 105,
            status: "FINAL"
        },
        {
            id: 3,
            homeTeam: "DEN",
            awayTeam: "OKC",
            homeScore: 0,
            awayScore: 0,
            status: "UPCOMING"
        }
    ];
    const filteredGames = games.filter(game =>
        selectedStatus === "ALL" ||
        game.status === selectedStatus
    );
    return (
        <div>
            <h1>NBA Analytics Platform</h1>

            <button onClick={() => setSelectedStatus("ALL")}>
                All
            </button>

            <button onClick={() => setSelectedStatus("LIVE")}>
                Live
            </button>

            <button onClick={() => setSelectedStatus("UPCOMING")}>
                Upcoming
            </button>

            <button onClick={() => setSelectedStatus("FINAL")}>
                Final
            </button>

            {filteredGames.map(game => (
                <GameCard
                    key={game.id}
                    homeTeam={game.homeTeam}
                    awayTeam={game.awayTeam}
                    homeScore={game.homeScore}
                    awayScore={game.awayScore}
                    status={game.status}
                />
            ))}
        </div>
    )
}

export default App