//import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { YardForecastService } from '#services/yard_forecast_service'

@inject()
export default class YardForecastingsController {
  constructor(protected yardForecastingService: YardForecastService) {}

  async forecast() {}
}
