export const WAREHOUSE_COMMANDS = [
  "init",
  "store",
  "locate",
  "remove",
  "view",
] as const;
export type WarehouseCommand = typeof WAREHOUSE_COMMANDS[number];
