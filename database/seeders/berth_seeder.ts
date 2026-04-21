import Berth from '#models/berth'
import BerthAvailableCrane from '#models/berth_available_crane'
import Crane from '#models/crane'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await Berth.createMany([
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

    await Crane.createMany([
      {
        code: 'C1',
        berthId: 1,
        efficiencyRate: 38,
        status: 'operational',
      },
      {
        code: 'C2',
        berthId: 1,
        efficiencyRate: 29,
        status: 'operational',
      },
      {
        code: 'C3',
        berthId: 2,
        efficiencyRate: 28,
        status: 'operational',
      },
      {
        code: 'C4',
        berthId: 2,
        efficiencyRate: 25,
        status: 'operational',
      },
      {
        code: 'C5',
        berthId: 3,
        efficiencyRate: 30,
        status: 'operational',
      },
      {
        code: 'C6',
        berthId: 4,
        efficiencyRate: 33,
        status: 'operational',
      },
      {
        code: 'C7',
        berthId: null,
        efficiencyRate: 30,
        status: 'operational',
      },
      {
        code: 'C8',
        berthId: null,
        efficiencyRate: 30,
        status: 'operational',
      },
      {
        code: 'C9',
        berthId: null,
        efficiencyRate: 35,
        status: 'operational',
      },
      {
        code: 'C10',
        berthId: null,
        efficiencyRate: 30,
        status: 'operational',
      },
    ])

    await BerthAvailableCrane.createMany([
      { berthId: 1, craneId: 1 },
      { berthId: 1, craneId: 2 },
      { berthId: 1, craneId: 3 },
      { berthId: 1, craneId: 4 },
      { berthId: 2, craneId: 1 },
      { berthId: 2, craneId: 2 },
      { berthId: 2, craneId: 3 },
      { berthId: 2, craneId: 4 },
      { berthId: 3, craneId: 5 },
      { berthId: 3, craneId: 6 },
      { berthId: 3, craneId: 7 },
      { berthId: 3, craneId: 8 },
      { berthId: 4, craneId: 5 },
      { berthId: 4, craneId: 6 },
      { berthId: 4, craneId: 7 },
      { berthId: 4, craneId: 8 },
    ])
  }
}
