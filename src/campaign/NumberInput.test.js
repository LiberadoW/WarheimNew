import React, { useState } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import NumberInput from "./NumberInput";

function Harness({ initial = 0, min = 0, max }) {
  const [value, setValue] = useState(initial);
  return (
    <>
      <label>
        Liczba
        <NumberInput
          value={value}
          min={min}
          max={max}
          onChange={(event) =>
            setValue(
              Math.min(
                max ?? Infinity,
                Math.max(min, Number(event.target.value)),
              ),
            )
          }
        />
      </label>
      <output aria-label="Zapisana wartość">{value}</output>
    </>
  );
}

test("zero can be deleted and replaced without putting it back during editing", () => {
  render(<Harness />);
  const input = screen.getByLabelText("Liczba");
  fireEvent.focus(input);
  fireEvent.change(input, { target: { value: "" } });
  expect(input.value).toBe("");
  expect(screen.getByLabelText("Zapisana wartość").textContent).toBe("0");
  fireEvent.change(input, { target: { value: "24" } });
  fireEvent.blur(input);
  expect(input.value).toBe("24");
  expect(screen.getByLabelText("Zapisana wartość").textContent).toBe("24");
});

test("a minimum-one value can be cleared; leaving it empty restores the last valid value", () => {
  render(<Harness initial={10} min={1} />);
  const input = screen.getByLabelText("Liczba");
  fireEvent.focus(input);
  fireEvent.change(input, { target: { value: "" } });
  expect(input.value).toBe("");
  fireEvent.blur(input);
  expect(input.value).toBe("10");
  fireEvent.focus(input);
  fireEvent.change(input, { target: { value: "0" } });
  expect(input.value).toBe("0");
  fireEvent.blur(input);
  expect(input.value).toBe("1");
});

test("bounds still apply to stored values and are reflected when editing finishes", () => {
  render(<Harness max={12} />);
  const input = screen.getByLabelText("Liczba");
  fireEvent.focus(input);
  fireEvent.change(input, { target: { value: "20" } });
  expect(screen.getByLabelText("Zapisana wartość").textContent).toBe("12");
  fireEvent.blur(input);
  expect(input.value).toBe("12");
});
