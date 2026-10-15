import { ConfigService } from "./config.service";

export class PickupService {
  /**
   * Generates a pickup slot based on the current time and store configuration.
   * If the current time + preparation time exceeds business hours, it shifts the pickup to the next business day.
   */
  static async generatePickupSlot(): Promise<{ start: Date, end: Date }> {
    const config = await ConfigService.getConfig();
    
    const now = new Date();
    // Add preparation time
    const readyTime = new Date(now.getTime() + config.PREPARATION_TIME_HOURS * 60 * 60 * 1000);
    
    // Check if ready time is within business hours
    const startHour = readyTime.getHours();
    
    // If ready time is after business hours or very close to it, move to next day
    if (startHour >= config.BUSINESS_HOURS_END) {
      readyTime.setDate(readyTime.getDate() + 1);
      readyTime.setHours(config.BUSINESS_HOURS_START, 0, 0, 0);
    } 
    // If ready time is before business hours, set to business open time
    else if (startHour < config.BUSINESS_HOURS_START) {
      readyTime.setHours(config.BUSINESS_HOURS_START, 0, 0, 0);
    }

    const slotStart = new Date(readyTime);
    const slotEnd = new Date(slotStart.getTime() + config.PICKUP_WINDOW_HOURS * 60 * 60 * 1000);

    return {
      start: slotStart,
      end: slotEnd
    };
  }

  /**
   * Format a slot nicely, e.g., "Oct 12, 1:00 PM - 3:00 PM"
   */
  static formatSlot(start: Date, end: Date): string {
    const dateOptions: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    const timeOptions: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: '2-digit', hour12: true };
    
    const dateStr = start.toLocaleDateString('en-IN', dateOptions);
    const startStr = start.toLocaleTimeString('en-IN', timeOptions);
    const endStr = end.toLocaleTimeString('en-IN', timeOptions);

    return `${dateStr}, ${startStr} - ${endStr}`;
  }
}
