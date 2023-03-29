export const setCommandNumberModels = (arr) => {
    if (arr.includes("Chorąży") && arr.includes("Sygnalista")) {
      return 2;
    } else if (arr.includes("Chorąży") || arr.includes("Sygnalista")) {
      return 1;
    } else {
      return 1;
    }
  };