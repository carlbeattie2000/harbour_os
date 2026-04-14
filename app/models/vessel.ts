import { VesselSchema } from "#database/schema";
import { belongsTo } from "@adonisjs/lucid/orm";
import Account from "./account.ts";
import type { BelongsTo } from "@adonisjs/lucid/types/relations";

export default class Vessel extends VesselSchema {
  @belongsTo(() => Account, { foreignKey: "shippingLineId" })
  declare account?: BelongsTo<typeof Account>;
}
