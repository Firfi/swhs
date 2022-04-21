import chalk from "chalk";
import uniq from "lodash/uniq";

import { Cell } from "../warehouse";
import { ProductCode } from "../types";

const NONE_PLACEHOLDER = " " as const;

const bracketIt = (s: string) => `[${s}]`;
const bracketedNonePlaceholder = bracketIt(NONE_PLACEHOLDER);

// https://github.com/chalk/chalk
const colors = [
  // "black",
  "red",
  "green",
  "yellow",
  "blue",
  "magenta",
  "cyan",
  "white",
  "gray",
  "redBright",
  "greenBright",
  "yellowBright",
  "blueBright",
  "magentaBright",
  "cyanBright",
  "whiteBright",
] as const;

type Color = typeof colors[number];

export function formatField(f: Cell[][]): string {
  const maxLengthPerColumn: number[] = [];
  for (let r = 0; r < f.length; r++) {
    const row = f[r];
    for (let c = 0; c < row.length; c++) {
      maxLengthPerColumn[c] = Math.max(
        maxLengthPerColumn[c] || 0,
        bracketIt(row[c] || NONE_PLACEHOLDER).length
      );
    }
  }
  const colorPerProduct = (
    uniq(f.flat().filter(Boolean)) as ProductCode[]
  ).reduce((acc, p, i) => {
    acc.set(p, colors[i % colors.length]);
    return acc;
  }, new Map<ProductCode, Color>());
  const colorIt = (p: ProductCode) => chalk[colorPerProduct.get(p)!](p);

  return f.reduce((acc, row) => {
    return (
      acc +
      row.reduce((acc, cell, c) => {
        return (
          acc +
          (cell ? bracketIt(colorIt(cell)) : bracketedNonePlaceholder).padEnd(
            maxLengthPerColumn[c],
            " "
          )
        );
      }, "") +
      "\n"
    );
  }, "");
}
