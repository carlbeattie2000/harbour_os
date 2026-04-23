import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import type { UserRoles } from '../app/contracts/roles.ts'
import User from '#models/user'
import UserAssignedRole from '#models/user_assigned_role'
import Role from '#models/role'
import { DateTime } from 'luxon'

export default class GiveUserRole extends BaseCommand {
  static commandName = 'give:user-role'
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

    const userId = await this.prompt.ask('User ID', {
      validate(value) {
        return Number.isNaN(Number.parseInt(value, 10)) ? 'Please enter a valid number' : true
      },
      result(value) {
        return Number.parseInt(value, 10)
      },
    })

    const user = await User.findOrFail(userId)

    this.ui
      .sticker()
      .add('User')
      .add('First Name:' + user.firstName)
      .add('Last Name:' + user.lastName)
      .add('Email:' + user.email)
      .render()

    const role = await this.prompt.choice('Role', [...roles])
    const roleRecord = await Role.findByOrFail('slug', role)

    let endDate: DateTime | null = null

    const roleShouldExpire = await this.prompt.confirm('Should this role have an expiration date?')

    if (roleShouldExpire) {
      endDate = await this.prompt.ask('Enter expiration date (YYYY-MM-DD)', {
        result(value) {
          return DateTime.fromFormat(value, 'yyyy-MM-dd', { zone: 'utc' })
        },
      })
    }

    const confimmation = await this.prompt.confirm(
      `Are you sure you want to give the role ${role} to this user?`
    )

    if (confimmation) {
      const createFile = this.logger.action('adding role to user')

      try {
        await UserAssignedRole.create({
          userId: user.id,
          roleId: roleRecord.id,
          expiresAt: endDate,
        })
        createFile.displayDuration().succeeded()
      } catch (error: unknown) {
        createFile.failed(error as Error)
      }
    } else {
      this.logger.info('Operation cancelled')
    }
  }
}
