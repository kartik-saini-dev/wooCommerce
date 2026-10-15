import { prisma as db } from "@repo/db"

export interface StoreConfiguration {
  PREPARATION_TIME_HOURS: number;
  PICKUP_WINDOW_HOURS: number;
  FREE_DELIVERY_THRESHOLD: number;
  BASE_DELIVERY_FEE: number;
  BUSINESS_HOURS_START: number; // 24-hour format e.g. 9 for 9 AM
  BUSINESS_HOURS_END: number; // 24-hour format e.g. 18 for 6 PM
  AVAILABLE_PAYMENT_METHODS: string[];
}

const DEFAULT_CONFIG: StoreConfiguration = {
  PREPARATION_TIME_HOURS: 2,
  PICKUP_WINDOW_HOURS: 2,
  FREE_DELIVERY_THRESHOLD: 1000, // Amount above which delivery is free
  BASE_DELIVERY_FEE: 50,
  BUSINESS_HOURS_START: 9, // 9 AM
  BUSINESS_HOURS_END: 19, // 7 PM
  AVAILABLE_PAYMENT_METHODS: ["COD", "UPI", "PAY_NOW"]
};

export class ConfigService {
  /**
   * Fetch all configuration settings. Falls back to defaults if not present in DB.
   */
  static async getConfig(): Promise<StoreConfiguration> {
    try {
      const settings = await db.siteSettings.findMany({
        where: {
          key: {
            in: Object.keys(DEFAULT_CONFIG)
          }
        }
      });

      const configMap = settings.reduce((acc, setting) => {
        try {
          acc[setting.key] = JSON.parse(setting.value);
        } catch {
          acc[setting.key] = setting.value;
        }
        return acc;
      }, {} as any);

      return {
        ...DEFAULT_CONFIG,
        ...configMap
      };
    } catch (error) {
      console.error("Failed to load config, returning defaults", error);
      return DEFAULT_CONFIG;
    }
  }

  /**
   * Update a specific configuration key
   */
  static async setConfig<K extends keyof StoreConfiguration>(key: K, value: StoreConfiguration[K]) {
    const stringValue = JSON.stringify(value);
    
    await db.siteSettings.upsert({
      where: { key: key as string },
      update: { value: stringValue },
      create: { key: key as string, value: stringValue }
    });
  }
}
