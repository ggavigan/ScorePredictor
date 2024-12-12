export const getStatusClass = (status) => {
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
  