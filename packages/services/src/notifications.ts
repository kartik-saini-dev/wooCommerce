/**
 * Foundation for future Push Notifications integration.
 * Currently provides utilities for requesting permission and registering a subscription.
 */

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!("Notification" in window)) {
    console.warn("This browser does not support desktop notification")
    return "denied"
  }

  if (Notification.permission === "granted") {
    return "granted"
  }

  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission()
    return permission
  }

  return "denied"
}

export async function subscribeToPushNotifications(applicationServerKey: string) {
  if (!("serviceWorker" in navigator)) {
    throw new Error("Service Worker is not supported in this browser.")
  }

  const registration = await navigator.serviceWorker.ready

  try {
    const existingSubscription = await registration.pushManager.getSubscription()
    if (existingSubscription) {
      return existingSubscription
    }

    const newSubscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey,
    })

    // TODO: Send this subscription object to your backend to store it for the user
    // e.g., await fetch('/api/notifications/subscribe', { method: 'POST', body: JSON.stringify(newSubscription) })
    
    return newSubscription
  } catch (error) {
    console.error("Failed to subscribe the user to push notifications:", error)
    throw error
  }
}
