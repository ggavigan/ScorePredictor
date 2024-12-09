import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import { API_KEY } from "./constants/apiConstants"; // Import constants


function App() {
  const [matches, setMatches] = useState([]); // state to store matches

  // check if a match is within the ±4 day range from today
  const isMatchWithinDateRange = (matchDate) => {
    const currentDate = new Date();
    const matchDateObj = new Date(matchDate);
    const timeDifference = matchDateObj - currentDate;

    const fourDaysInMs = 4 * 24 * 60 * 60 * 1000;

    return Math.abs(timeDifference) <= fourDaysInMs;
  };

  useEffect(() => {
    const fetchMatches = async () => {
      try {

        // fetch all matches
        const response = await axios.get("/v4/competitions/PL/matches", {
          headers: { "X-Auth-Token": API_KEY },
        });

        // filter matches to include those within ±4 days of the current date
        const filteredMatches = response.data.matches.filter((match) =>
          isMatchWithinDateRange(match.utcDate)
        );

        // sort matches by match date (latest first)
        const sortedMatches = filteredMatches.sort((a, b) =>
          new Date(b.utcDate) - new Date(a.utcDate)
        );

        // set matches to state
        setMatches(sortedMatches);
      } catch (error) {
        console.error("Error fetching match data:", error);
      }
    };

    fetchMatches();
  }, []); // run once on component mount

  // helper function to determine status class based on match status
  const getStatusClass = (status) => {
    switch (status) {
      case "TIMED":
        return "not-played";
      case "IN_PLAY":
        return "playing";
      case "FINISHED":
        return "played";
      case "POSTPONED":
        return "postponed";
      default:
        return "";
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Football Matches</h1>
        <div className="matches-list">
          {matches.map((match) => (
            <div key={match.id} className="matchup">
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
              <div className={`status ${getStatusClass(match.status)}`}>
                {match.status === "TIMED"
                  ? `Kickoff: ${new Date(match.utcDate).toLocaleTimeString()}`
                  : match.status === "IN_PLAY"
                  ? "LIVE"
                  : match.status === "FINISHED"
                  ? "MATCH OVER"
                  : "POSTPONED"}
              </div>
            </div>
          ))}
        </div>
      </header>
    </div>
  );
}

export default App;
