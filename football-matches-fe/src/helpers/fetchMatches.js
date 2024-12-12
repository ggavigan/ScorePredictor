import axios from "axios";
import { API_KEY } from "../constants/apiConstants";
import { isMatchWithinDateRange } from "./isMatchWithinDateRange";
import { getStatusClass } from "./getStatusClass";

export const fetchMatches = async (leagueCode = "PL") => {
  try {
    const response = await axios.get(`/v4/competitions/${leagueCode}/matches`, {
      headers: { "X-Auth-Token": API_KEY },
    });

    const matches = response.data.matches
      .filter((match) => isMatchWithinDateRange(match.utcDate))
      .sort((a, b) => new Date(b.utcDate) - new Date(a.utcDate))
      .map((match) => {
        const matchDate = new Date(match.utcDate);
        const formattedDate = `${String(matchDate.getDate()).padStart(2, "0")}-${String(matchDate.getMonth() + 1).padStart(2, "0")}-${String(matchDate.getFullYear()).slice(-2)}`;

        return {
          ...match,
          formattedDate,
          statusClass: getStatusClass(match.status),
          statusMessage:
            match.status === "TIMED"
              ? "Upcoming"
              : match.status === "IN_PLAY"
              ? "LIVE"
              : match.status === "FINISHED"
              ? "MATCH OVER"
              : "POSTPONED",
        };
      });

    return matches;
  } catch (error) {
    console.error("Error fetching match data:", error);
    return [];
  }
};

