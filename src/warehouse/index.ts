import { H, ProductCode, W, X, Y } from '../types';
import { XY } from './commands';

export type Cell = ProductCode | null;

export class Warehouse {

  // always at least 1x1
  private store: Cell[][];
  // y's in store are top to down, but the business requirements are bottom to top
  // private reverseY(y: Y): Y {
  //   return this.store.length - y - 1;
  // }
  set(x: X, y: Y, w: W, h: H, value: ProductCode): void {
    if (w <= 0 || h <= 0) {
      throw new Error('Invalid dimensions');
    }
    if (!this.isAreaInBounds(x, y, w, h)) throw new Error("Out of bounds");
    if (!this.isFree(x, y, w, h)) throw new Error("Some space is not empty");
    if (this.locate(value).length) throw new Error("Value already exists");
    for (let i = 0; i < h; i++) {
      for (let j = 0; j < w; j++) {
        this.store[y + i][x + j] = value;
      }
    }
  }
  private isInBounds(x: X, y: Y): boolean {
    return x >= 0 && x < this.store[0].length && y >= 0 && y < this.store.length;
  }
  private isAreaInBounds(x: X, y: Y, w: W, h: H): boolean {
    return x >= 0 && x + w <= this.store[0].length && y >= 0 && y + h <= this.store.length;
  }

  private isFree(x: X, y: Y, w: W, h: H): boolean {
    for (let i = 0; i < h; i++) {
      for (let j = 0; j < w; j++) {
        if (!this.isInBounds(x + j, y + i) || this.get(x + j, y + i) !== null) {
          return false;
        }
      }
    }
    return true;
  }
  private get(x: X, y: Y): Cell {
    if (!this.isInBounds(x, y)) throw new Error("Out of bounds");
    return this.store[y][x];
  }

  constructor(w: W, h: H) {
    if (w < 1 || h < 1) throw new Error("Warehouse must be at least 1x1");
    this.store = new Array(h).fill(null).map(() => new Array(w).fill(null));
  }

  locate(p: ProductCode): XY[] {
    return this.store.reduce((acc, row, y) => {
      return row.reduce((acc, cell, x) => {
        if (cell === p) {
          acc.push({x, y});
        }
        return acc;
      }, acc);
    }, [] as XY[]);
  }

  removeAtCoords(x: X, y: Y) {
    if (!this.isInBounds(x, y)) throw new Error("Out of bounds");
    const cell = this.get(x, y);
    if (cell === null) {
      throw new Error("Value not found at coords");
    }
    const coords = this.locate(cell);
    for (const {x, y} of coords) {
      this.store[y][x] = null;
    }
  }

  view() {
    return [...this.store].map(row => [...row]).reverse();
  }

}