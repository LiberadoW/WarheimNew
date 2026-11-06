import React, { useState } from "react";
import { fireEvent, render, screen, cleanup } from "@testing-library/react";
import DiceInput from "./DiceInput";
import useRollDraft from "./useRollDraft";

test("an app roll is single use and cannot be overwritten through inputs", () => {
  const changes = jest.fn();
  function Harness() {
    const [dice, setDice] = useState([]);
    return <DiceInput count={2} value={dice} onChange={(d,s) => { setDice(d); changes(d,s); }} />;
  }
  render(<Harness />);
  const button = screen.getByRole("button", {name:"Rzuć"});
  fireEvent.click(button); fireEvent.click(button);
  expect(changes).toHaveBeenCalledTimes(1);
  expect(button.disabled).toBe(true);
  expect(screen.getAllByRole("spinbutton").every((i) => i.disabled)).toBe(true);
});
test("restoring a complete result locks it, while an authorized separate reroll remains available", () => {
  render(<><DiceInput label="Obrażenia" count={2} value={[2,4]} onChange={jest.fn()} />
    <DiceInput label="Przerzut: pomoc medyka" count={2} onChange={jest.fn()} /></>);
  expect(screen.getByRole("button", {name:"Wynik zapisany"}).disabled).toBe(true);
  expect(screen.getByRole("button", {name:"Rzuć"}).disabled).toBe(false);
});
test("a saved pending roll survives leaving the screen and mounting again", () => {
  let post = {}, original;
  const update = (fn) => fn(post);
  function Harness() {
    const [dice, save] = useRollDraft(post, update, "price:item:unit");
    const [value, setValue] = useState(dice);
    return <DiceInput value={value} onChange={(d) => { save(d); setValue(d); }} />;
  }
  render(<Harness />); fireEvent.click(screen.getByRole("button", {name:"Rzuć"}));
  original = post.rollDrafts["price:item:unit"];
  cleanup(); render(<Harness />);
  expect(screen.getByRole("spinbutton").value).toBe(String(original[0]));
  expect(screen.getByRole("button", {name:"Wynik zapisany"}).disabled).toBe(true);
});
