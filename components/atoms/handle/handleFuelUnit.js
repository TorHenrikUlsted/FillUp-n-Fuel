import storageService from "../../../utils/StorageService";

const handleFuelUnit = (oldFuelUnit, newFuelUnit, fuelMilage, tankSize, fuelPrice, setFuelMilage, setTankSize, setFuelPrice, setFuelUnit, setIsCalculating) => {
    setIsCalculating(true)
    if (fuelMilage === "") {
      setFuelMilage("0");
      storageService.saveData("fuelMilage", "0");
      return;
    }
    
    let oldFuelMilage = parseFloat(fuelMilage);
    let newFuelMilage = oldFuelMilage;
    let newTankSize = tankSize;
    let newFuelPrice = fuelPrice;
  
    if (oldFuelUnit === "lpk" && newFuelUnit === "mpg") {
      newFuelMilage = oldFuelMilage ? 235.215 / oldFuelMilage : 0;
      newTankSize = tankSize * 0.264172;
      newFuelPrice = fuelPrice * 3.785411784;
      setFuelMilage(newFuelMilage);
      setTankSize(newTankSize);
      setFuelPrice(newFuelPrice);
    } else if (oldFuelUnit === "mpg" && newFuelUnit === "lpk") {
      newFuelMilage = oldFuelMilage ? 235.215 / oldFuelMilage : 0;
      newTankSize = Math.round(tankSize * 3.785411784);
      newFuelPrice = fuelPrice / 3.785411784;
      setFuelMilage(newFuelMilage);
      setTankSize(newTankSize);
      setFuelPrice(newFuelPrice);
    }
  
    const numMilage = newFuelMilage ? newFuelMilage.toFixed(1) : "0";
    const numPrice = newFuelPrice ? newFuelPrice.toFixed(2) : "0";
  
    setFuelMilage(numMilage.toString());
    setTankSize(newTankSize.toString());
    setFuelUnit(newFuelUnit);
    setFuelPrice(numPrice);
  
    storageService.saveData("fuelUnit", newFuelUnit);
    storageService.saveData("fuelMilage", numMilage);
    storageService.saveData("tankSize", newTankSize);
    storageService.saveData("fuelPrice", numPrice);

    setIsCalculating(false)
  };
  
  export default handleFuelUnit;
  