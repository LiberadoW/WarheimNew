export const disableButtons = (name, index) => {
    const armour = document.querySelectorAll(
      `div.unit[id='${String(index)}'] [data='${name}']`
    );
    const armourArray = Array.from(armour);
    const checkedArr = [];
  
    armourArray.forEach((item) => {
      checkedArr.push(item.checked);
    });
  
    if (checkedArr.filter((el) => el === true).length === 1) {
      armourArray.forEach((item) => {
        if (item.checked === false) {
          item.disabled = true;
        }
      });
    } else {
      armourArray.forEach((item) => {
        item.disabled = false;
      });
    }
  };