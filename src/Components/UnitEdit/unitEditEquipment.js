import { useState } from "react";
import "./unitEditEquipment.css";

const parsePrice = (value) => {
  const parsedValue = Number(String(value).replace(",", "."));
  return Number.isFinite(parsedValue) && parsedValue >= 0 ? parsedValue : NaN;
};

const normalizeCustomEquipment = (entry, index) => {
  if (entry && typeof entry === "object" && !Array.isArray(entry)) {
    const normalizedName = String(entry.name || "").trim();
    const normalizedPrice = parsePrice(entry.price);

    return {
      id: entry.id || `legacy-custom-${index}`,
      name: normalizedName,
      price: Number.isNaN(normalizedPrice) ? 0 : normalizedPrice,
    };
  }

  if (typeof entry === "string") {
    return {
      id: `legacy-custom-${index}`,
      name: entry.trim(),
      price: 0,
    };
  }

  return null;
};

const getModelCount = (unit) => {
  const parsedNumber = Number(unit.selectedNumber);
  return Number.isFinite(parsedNumber) && parsedNumber > 0 ? parsedNumber : 1;
};

const getEquipmentPrice = (entry) => {
  const parsedPrice = Number(entry?.price);
  return Number.isFinite(parsedPrice) && parsedPrice > 0 ? parsedPrice : 0;
};

const applyEquipmentCostDelta = (unit, priceDelta) => {
  const modelCount = getModelCount(unit);

  unit.cost = (Number(unit.cost) || 0) + priceDelta;
  unit.totalCost = (Number(unit.totalCost) || 0) + priceDelta * modelCount;
};

const UnitEditEquipment = ({ unit, setUnitList, unitList }) => {
  if (!Array.isArray(unit.customEquipment)) {
    unit.customEquipment = [];
  }

  unit.customEquipment = unit.customEquipment
    .map((entry, index) => normalizeCustomEquipment(entry, index))
    .filter((entry) => entry && entry.name.length > 0);

  if (!Array.isArray(unit.baseCustomEquipmentIds)) {
    unit.baseCustomEquipmentIds = unit.customEquipment.map((entry) => entry.id);
  }

  const [equipmentName, setEquipmentName] = useState("");
  const [equipmentPrice, setEquipmentPrice] = useState("");

  const addedEquipment = unit.customEquipment.filter(
    (entry) => !unit.baseCustomEquipmentIds.includes(entry.id),
  );

  const coreCustomEquipment = unit.customEquipment.filter((entry) =>
    unit.baseCustomEquipmentIds.includes(entry.id),
  );

  const handleAddEquipment = (event) => {
    event.preventDefault();

    const normalizedName = equipmentName.trim();
    const parsedPrice = parsePrice(equipmentPrice);

    if (normalizedName.length === 0 || Number.isNaN(parsedPrice)) {
      return;
    }

    const entry = {
      id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: normalizedName,
      price: parsedPrice,
    };

    unit.customEquipment.push(entry);
    applyEquipmentCostDelta(unit, parsedPrice);
    setUnitList([...unitList]);
    setEquipmentName("");
    setEquipmentPrice("");
  };

  const handleDeleteEquipment = (id) => {
    if (unit.baseCustomEquipmentIds.includes(id)) {
      return;
    }

    const index = unit.customEquipment.findIndex((entry) => entry.id === id);
    if (index !== -1) {
      applyEquipmentCostDelta(
        unit,
        -getEquipmentPrice(unit.customEquipment[index]),
      );
      unit.customEquipment.splice(index, 1);
      setUnitList([...unitList]);
    }
  };

  const handleRevertClick = () => {
    const priceDelta = addedEquipment.reduce(
      (sum, entry) => sum - getEquipmentPrice(entry),
      0,
    );

    unit.customEquipment = unit.customEquipment.filter((entry) =>
      unit.baseCustomEquipmentIds.includes(entry.id),
    );
    applyEquipmentCostDelta(unit, priceDelta);
    setUnitList([...unitList]);
  };

  return (
    <div className="unit-edit-equipment-container">
      <form className="equipment-input" onSubmit={handleAddEquipment}>
        <input
          type="text"
          placeholder="Nazwa ekwipunku"
          value={equipmentName}
          onChange={(event) => setEquipmentName(event.target.value)}
        />
        <input
          type="number"
          placeholder="Cena (zk)"
          min="0"
          step="1"
          value={equipmentPrice}
          onChange={(event) => setEquipmentPrice(event.target.value)}
        />
        <button type="submit" className="button">
          Dodaj
        </button>
        <button
          type="button"
          className="button"
          onClick={handleRevertClick}
          disabled={addedEquipment.length === 0}
        >
          Cofnij
        </button>
      </form>

      <div className="unit-edit-equipment-list">
        {[
          ...(unit.startingEquipment || []),
          ...(unit.optionalEquipment || []),
        ].map((item, index) => (
          <div
            key={`core-equipment-${index}`}
            className="unit-edit-equipment-item"
          >
            <span>{item}</span>
            <span className="unit-edit-pill unit-edit-pill-core">
              {"początkowa"}
            </span>
            {/* <button onClick={() => handleDeleteEquipment(item.id)}>
              <i className="fa-solid fa-trash-can"></i>
            </button> */}
          </div>
        ))}

        {coreCustomEquipment.map((item) => (
          <div key={item.id} className="unit-edit-equipment-item">
            <span>{item.name}</span>
            <span className="unit-edit-pill unit-edit-pill-core">
              {"początkowaa"}
            </span>
            <button onClick={() => handleDeleteEquipment(item.id)}>
              <i className="fa-solid fa-trash-can"></i>
            </button>
          </div>
        ))}

        {addedEquipment.map((item) => (
          <div key={item.id} className="unit-edit-equipment-item">
            <span>{item.name}</span>
            <span className="unit-edit-pill unit-edit-pill-added">dodane</span>
            <button onClick={() => handleDeleteEquipment(item.id)}>
              <i className="fa-solid fa-trash-can"></i>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UnitEditEquipment;
