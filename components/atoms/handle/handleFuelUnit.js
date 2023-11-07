import storageService from "../../../utils/StorageService";

const handleFuelUnit = (oldFuelUnit, newFuelUnit, fuelMilage, tankSize, fuelPrice, setFuelMilage, setTankSize, setFuelPrice, setFuelUnit, setIsCalculating) => {
  try {
    setIsCalculating(true)

    if (!fuelMilage) {
      console.error('Missing fuelMilage value');
      setFuelMilage("0");
    }
    else if (!tankSize) {
      console.error('Missing tankSize value');
      setTankSize("0");
  }
    else if (!fuelPrice) {
      console.error('Missing fuelPrice value');
      setFuelPrice("0");
  }
    
    let oldFuelMilage = parseFloat(fuelMilage);
    let newFuelMilage = oldFuelMilage;
    let newTankSize = parseFloat(tankSize);
    let newFuelPrice = parseFloat(fuelPrice);
  
    if (oldFuelUnit === "lpk" && newFuelUnit === "mpg") {
      try {
      newFuelMilage = oldFuelMilage ? 235.215 / oldFuelMilage : 0;
      newTankSize = tankSize * 0.264172;
      newFuelPrice = fuelPrice * 3.785411784;
      } catch (error) {
        console.error('Error in lpk to mpg conversion:', error);
      }
    } 
    else if (oldFuelUnit === "mpg" && newFuelUnit === "lpk") {
      try {
      newFuelMilage = oldFuelMilage ? 235.215 / oldFuelMilage : 0;
      newTankSize = Math.round(tankSize * 3.785411784);
      newFuelPrice = fuelPrice / 3.785411784;
      } catch (error) {
        console.error('Error in mpg to lpk conversion:', error);
      }
    }
  
    const numMilage = newFuelMilage ? newFuelMilage.toFixed(2) : "0";
    const numPrice = newFuelPrice ? newFuelPrice.toFixed(2) : "0";
    newTankSize = newTankSize ? newTankSize.toFixed(2) : "0";
  
    setFuelMilage(numMilage.toString());
    setTankSize(newTankSize.toString());
    setFuelUnit(newFuelUnit.toString());
    setFuelPrice(numPrice.toString());
  
    storageService.saveData("fuelUnit", newFuelUnit);
    storageService.saveData("fuelMilage", numMilage);
    storageService.saveData("tankSize", newTankSize);
    storageService.saveData("fuelPrice", numPrice);

    setIsCalculating(false)

    } catch (error) {
      console.error('Error in handleFuelUnit:', error)
    }
  };
  
  export default handleFuelUnit;
  