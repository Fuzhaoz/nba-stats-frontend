
import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./components/layout/MainLayout";

import HomePage from "./pages/HomePage";
import GamesPage from "./pages/GamesPage";
import StandingsPage from "./pages/StandingsPage";
import TeamsPage from "./pages/TeamsPage";
import PlayersPage from "./pages/PlayersPage";
import TeamDetailPage from "./pages/TeamDetailPage";
import GameDetailPage from "./pages/GameDetailPage";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<MainLayout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/games" element={<GamesPage />} />
                    <Route path="/games/:gameId" element={<GameDetailPage />} />
                    <Route path="/standings" element={<StandingsPage />} />
                    <Route path="/teams" element={<TeamsPage />} />
                    <Route path="/players" element={<PlayersPage />} />
                    <Route path="/teams/:teamId" element={<TeamDetailPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
