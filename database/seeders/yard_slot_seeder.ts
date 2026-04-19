import YardSlot from '#models/yard_slot'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

function toBayLabel(index: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let label = ''
  index++
  while (index > 0) {
    index--
    label = chars[index % 26] + label
    index = Math.floor(index / 26)
  }
  return label
}

export default class extends BaseSeeder {
  async run() {
    const bays = 702
    const rows = 50
    const stackHeight = 5
    const yardSlots = []

    for (let i = 0; i < bays; i++) {
      const createRows = []
      const char = toBayLabel(i)
      const typeChance = Math.random() * 100
      const type = typeChance <= 76 ? 'standard' : typeChance < 90 ? 'reefer' : 'hazmat'

      for (let r = 1; r <= rows; r++) {
        createRows.push({
          bay: char,
          row: r,
          maxStackHeight: stackHeight,
          type,
          status: 'available',
          ownership: 'port',
        })
      }

      yardSlots.push(...createRows)
    }

    await YardSlot.createMany(yardSlots)
  }
}
