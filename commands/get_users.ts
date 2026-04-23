import User from '#models/user'
import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'

export default class GetUsers extends BaseCommand {
  static commandName = 'get:users'
  static description = ''

  static options: CommandOptions = {
    startApp: true,
  }

  async run() {
    const users = await User.query().preload('roles')

    const table = this.ui.table()
    table.head(['First Name', 'Last Name', 'Email', 'Roles'])

    for (const user of users) {
      table.row([
        user.firstName ?? '',
        user.lastName ?? '',
        user.email,
        user.roles.map((r) => r.slug).join(', '),
      ])
    }

    table.render()
  }
}
