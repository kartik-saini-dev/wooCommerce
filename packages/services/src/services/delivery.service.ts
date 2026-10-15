import { ConfigService } from "./config.service";

export class DeliveryService {
  /**
   * Calculate the delivery fee based on cart subtotal and active configuration.
   */
  static async calculateDeliveryFee(subtotal: number): Promise<{ fee: number, isFree: boolean, remainingForFree: number }> {
    const config = await ConfigService.getConfig();
    
    if (subtotal >= config.FREE_DELIVERY_THRESHOLD) {
      return { 
        fee: 0, 
        isFree: true, 
        remainingForFree: 0 
      };
    }

    const remainingForFree = config.FREE_DELIVERY_THRESHOLD - subtotal;
    return {
      fee: config.BASE_DELIVERY_FEE,
      isFree: false,
      remainingForFree: remainingForFree > 0 ? remainingForFree : 0
    };
  }
}
