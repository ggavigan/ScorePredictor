import axios from "axios";
import { API_KEY } from "../constants/apiConstants";

export const fetchLeagues = async () => {
  try {
    const response = await axios.get("/v4/competitions/", {
      headers: { "X-Auth-Token": API_KEY },
    });

    const leagues = response.data.competitions
      .filter((league) => league.plan === "TIER_ONE") // filter for top-tier leagues
      .map((league) => ({
        name: league.name,
        code: league.code,
      }));

    return leagues;
  } catch (error) {
    console.error("Error fetching leagues:", error);
    return [];
  }
};
