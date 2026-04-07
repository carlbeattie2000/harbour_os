import Account from "#models/account";
import ContactDetail from "#models/contact_detail";
import Vessel from "#models/vessel";
import { BaseSeeder } from "@adonisjs/lucid/seeders";

export default class extends BaseSeeder {
  async run() {
    const exampleShippingLineAccountAddress = await ContactDetail.create({
      phone: "07548956987",
      email: "example@shippingline.com",
      addressLine: "44 shippingline avenue",
      country: "united kingdom",
    });

    const exampleShippingLineAccount = await Account.create({
      companyName: "shipping lines ltd",
      billingAddressId: exampleShippingLineAccountAddress.id,
      registrationNumber: "91492217",
      status: "active",
      type: "shipping_line",
    });

    const examplePortAgentAddress = await ContactDetail.create({
      phone: "07548956987",
      email: "example@portagent.com",
      addressLine: "harbouros port",
      country: "united kingdom",
    });

    const examplePortAgentAccount = await Account.create({
      companyName: "harbouros port agents ltd",
      billingAddressId: examplePortAgentAddress.id,
      registrationNumber: "51492214",
      status: "active",
      type: "port_agent",
    });

    await Vessel.create({
      name: "OCEANIC MARINER",
      imoNumber: "9412354",
      type: "container ship",
      flagState: "Marshall Islands",
      grossTonnage: 52850,
      loa: 294.1,
      beam: 32.2,
      maxDraft: 13.5,
      shippingLineId: exampleShippingLineAccount.id,
      portAgentId: examplePortAgentAccount.id
    });
  }
}
