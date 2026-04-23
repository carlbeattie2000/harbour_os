import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import type { UserRoles } from '../app/contracts/roles.ts'
import db from '@adonisjs/lucid/services/db'
import User from '#models/user'
import UserAssignedRole from '#models/user_assigned_role'
import Role from '#models/role'

export default class CreateUser extends BaseCommand {
  static commandName = 'create:user'
  static description = ''

  static options: CommandOptions = {
    startApp: true,
  }

  async run() {
    const roles: UserRoles[] = [
      'admin',
      'operations_manager',
      'yard_manager',
      'billing_clerk',
      'inventory_controller',
      'gate_operator',
      'tally_clerk',
      'reefer_technician',
      'equipment_operator',
      'portal',
    ]
    const firstName = await this.prompt.ask('First name')
    const lastName = await this.prompt.ask('Last name')
    const email = await this.prompt.ask('Email')
    const password = await this.prompt.secure('Password')
    const role = await this.prompt.choice('Role', [...roles])

    const table = this.ui.table()

    const createFile = this.logger.action('creating user')

    try {
      await db.transaction(async (trx) => {
        const user = await User.create(
          {
            firstName: firstName.toLowerCase(),
            lastName: lastName.toLowerCase(),
            email,
            password: password,
          },
          { client: trx }
        )

        const roleRecord = await Role.findByOrFail('slug', role, {
          client: trx,
        })

        await UserAssignedRole.create(
          {
            userId: user.id,
            roleId: roleRecord.id,
          },
          { client: trx }
        )
      })

      createFile.displayDuration().succeeded()
      table
        .head(['First Name', 'Last Name', 'Email', 'Role'])
        .row([firstName, lastName, email, role])
        .render()
    } catch (error: unknown) {
      createFile.failed(error as Error)
    }
  }
}
