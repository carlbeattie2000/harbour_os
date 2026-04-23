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
    const bays = 26
    const rows = 50
    const stackHeight = 5

    const batchSize = 2000
    let batch: any[] = []

    for (let i = 0; i < bays; i++) {
      const char = toBayLabel(i)

      const typeChance = Math.random() * 100
      const type = typeChance <= 76 ? 'standard' : typeChance < 90 ? 'reefer' : 'hazmat'

      for (let r = 1; r <= rows; r++) {
        batch.push({
          bay: char,
          row: r,
          maxStackHeight: stackHeight,
          type,
          status: 'available',
          ownership: 'port',
        })

        if (batch.length >= batchSize) {
          await YardSlot.createMany(batch)
          batch = []
        }
      }
    }

    if (batch.length > 0) {
      await YardSlot.createMany(batch)
    }
  }
}
