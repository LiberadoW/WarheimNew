export const addCommandCost = (cost, number, arr) => {
    const totalCost = cost * number;
  
    if (arr.includes("Chorąży") && arr.includes("Sygnalista")) {
      return totalCost + 40;
    } else if (arr.includes("Chorąży") || arr.includes("Sygnalista")) {
      return totalCost + 20;
    } else {
      return totalCost;
    }
  };