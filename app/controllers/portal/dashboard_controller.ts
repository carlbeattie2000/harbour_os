import type { HttpContext } from "@adonisjs/core/http";

export default class DashboardController {
  async home({ view, auth }: HttpContext) {
    const user = auth.getUserOrFail();
    return view.render("pages/portal/home", { user });
  }
}

