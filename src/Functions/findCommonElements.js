const findCommonElements = (arr1, arr2) => {
    const index = arr1.some((item) => arr2.includes(item));
    return index;
  };

  export default findCommonElements