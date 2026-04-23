import Berth from '#models/berth'
import Crane from '#models/crane'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const berths = await Berth.createMany([
      {
        code: 'B1',
        length: 300,
        maxDraft: 14,
        maxBeam: 45,
        status: 'available',
      },
      {
        code: 'B2',
        length: 250,
        maxDraft: 12,
        maxBeam: 40,
        status: 'available',
      },
      {
        code: 'B3',
        length: 180,
        maxDraft: 10,
        maxBeam: null,
        status: 'available',
      },
      {
        code: 'B4',
        length: 320,
        maxDraft: 15,
        maxBeam: 48,
        status: 'maintenance',
      },
    ])

    const cranes = await Crane.createMany([
      { code: 'C1', efficiencyRate: 38, status: 'operational' },
      { code: 'C2', efficiencyRate: 29, status: 'operational' },
      { code: 'C3', efficiencyRate: 28, status: 'operational' },
      { code: 'C4', efficiencyRate: 25, status: 'operational' },
      { code: 'C5', efficiencyRate: 30, status: 'operational' },
      { code: 'C6', efficiencyRate: 33, status: 'operational' },
      { code: 'C7', efficiencyRate: 30, status: 'operational' },
      { code: 'C8', efficiencyRate: 30, status: 'operational' },
      { code: 'C9', efficiencyRate: 35, status: 'operational' },
      { code: 'C10', efficiencyRate: 30, status: 'operational' },
    ])

    await berths[0]
      .related('availableCranes')
      .attach([cranes[0].id, cranes[1].id, cranes[2].id, cranes[3].id])
    await berths[1]
      .related('availableCranes')
      .attach([cranes[0].id, cranes[1].id, cranes[2].id, cranes[3].id])
    await berths[2]
      .related('availableCranes')
      .attach([cranes[4].id, cranes[5].id, cranes[6].id, cranes[7].id])
    await berths[3]
      .related('availableCranes')
      .attach([cranes[4].id, cranes[5].id, cranes[6].id, cranes[7].id])
  }
}
