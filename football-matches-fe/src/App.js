import React, { useEffect, useState } from "react";
import "./App.css";
import { fetchMatches } from "./helpers/fetchMatches";

const leagues = [
  { name: "Premier League", code: "PL" },
  { name: "La Liga", code: "PD" },
  { name: "Serie A", code: "SA" },
  { name: "Bundesliga", code: "BL1" },
  { name: "Ligue 1", code: "FL1" },
];

function App() {
  const [matches, setMatches] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState("PL");

  useEffect(() => {
    // Fetch matches whenever the selected league changes
    const loadMatches = async () => {
      const matchesData = await fetchMatches(selectedLeague);
      setMatches(matchesData);
    };

    loadMatches();
  }, [selectedLeague]);

  const handleLeagueChange = (event) => {
    setSelectedLeague(event.target.value);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Football Matches</h1>
        <p className="powered-by">Powered by https://api.football-data.org</p>
        <div className="dropdown-container">
          <select
            value={selectedLeague}
            onChange={handleLeagueChange}
            className="league-dropdown"
          >
            {leagues.map((league) => (
              <option key={league.code} value={league.code}>
                {league.name}
              </option>
            ))}
          </select>
        </div>
        <div className="matches-list">
          {matches.map((match) => (
            <div key={match.id} className="matchup">
              <div className="match-date">
                {match.formattedDate}
              </div>
              <div className="team-badges">
                <img
                  src={match.homeTeam.crest}
                  alt={match.homeTeam.name}
                  className="team-badge"
                />
                <span className="vs">VS</span>
                <img
                  src={match.awayTeam.crest}
                  alt={match.awayTeam.name}
                  className="team-badge"
                />
              </div>
              <div className={`status ${match.statusClass}`}>
                {match.statusMessage}
              </div>
              <div className="score-box">
                {match.status !== "TIMED" && match.status !== "POSTPONED" ? (
                  <span>
                    {match.score.fullTime.home} - {match.score.fullTime.away}
                  </span>
                ) : (
                  <span> TBD </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </header>
    </div>
  );
}

export default App;
