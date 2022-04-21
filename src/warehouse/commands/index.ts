import { WarehouseCommand } from './types';
import { H, ProductCode, W, X, Y } from '../../types';
import { Cell, Warehouse } from '../index';

export interface WH {
  w: W,
  h: H,
}

export interface XY {
  x: X,
  y: Y,
}

export interface WithP {
  p: ProductCode,
}

export type XYWHP = WH & XY & WithP;

type CommandArgs<T extends WarehouseCommand> =
  T extends "init" ? WH :
    T extends "store" ? XYWHP :
      T extends "locate" ? WithP :
        T extends "remove" ? XY :
          T extends "view" ? void :
            never;

type CommandReturns<T extends WarehouseCommand> =
  T extends "init" ? void :
    T extends "store" ? void :
      T extends "locate" ? XY[] :
        T extends "remove" ? void :
          T extends "view" ? Cell[][] :
            never;

type CommandF<K extends WarehouseCommand> = (args: CommandArgs<K>) => Promise<CommandReturns<K>>;

// since it's global for the app instance
let wh: Warehouse;
const checkWhInitialized = () => {
  if (!wh) throw new Error('Warehouse not initialized');
}

// async because potentially, db writes
export const commandHandlers: {[k in WarehouseCommand]: CommandF<k>} = {
  init: async (args: WH) => {
    wh = new Warehouse(args.w, args.h);
  },
  store: async ({x,y,w,h,p}) => {
    checkWhInitialized();
    wh.set(x, y, w, h, p);
  },
  locate: async ({p}) => {
    checkWhInitialized();
    return wh.locate(p);
  },
  remove: async ({x, y}) => {
    checkWhInitialized();
    wh.removeAtCoords(x, y);
  },
  view: async () => {
    checkWhInitialized();
    return wh.view();
  },
}