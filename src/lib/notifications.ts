import { createClient } from './supabase'

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? ''

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const raw = atob(base64)
  const output = new Uint8Array(raw.length)
  for (let i = 0; i < raw.length; ++i) {
    output[i] = raw.charCodeAt(i)
  }
  return output
}

export async function isPushSupported(): Promise<boolean> {
  return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window
}

export async function getNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) return 'denied'
  return Notification.permission
}

export async function requestPushSubscription(): Promise<PushSubscription | null> {
  if (!(await isPushSupported())) return null

  const permission = await Notification.requestPermission()
  if (permission !== 'granted') return null

  const registration = await navigator.serviceWorker.ready

  // Check existing subscription
  let subscription = await registration.pushManager.getSubscription()

  if (!subscription) {
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY).buffer as ArrayBuffer,
    })
  }

  return subscription
}

export async function savePushSubscription(subscription: PushSubscription): Promise<boolean> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  const json = subscription.toJSON()
  const keys = json.keys as { p256dh: string; auth: string }

  const { error } = await supabase.from('push_subscriptions').upsert(
    {
      profile_id: user.id,
      endpoint: json.endpoint!,
      p256dh: keys.p256dh,
      auth_key: keys.auth,
    },
    { onConflict: 'profile_id,endpoint' }
  )

  return !error
}

export async function removePushSubscription(): Promise<void> {
  const registration = await navigator.serviceWorker.ready
  const subscription = await registration.pushManager.getSubscription()
  if (subscription) {
    await subscription.unsubscribe()

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase
        .from('push_subscriptions')
        .delete()
        .eq('profile_id', user.id)
        .eq('endpoint', subscription.endpoint)
    }
  }
}

/** Full flow: request permission → subscribe → store in DB */
export async function enablePushNotifications(): Promise<boolean> {
  try {
    const subscription = await requestPushSubscription()
    if (!subscription) return false
    return await savePushSubscription(subscription)
  } catch {
    return false
  }
}
