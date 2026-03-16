const NOTIFICATION_STORAGE_KEY = 'appNotifications';
const NOTIFICATION_EVENT_NAME = 'app-notifications-updated';

function readStore() {
  try {
    const raw = localStorage.getItem(NOTIFICATION_STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeStore(items) {
  localStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(items));
}

function emitUpdated() {
  window.dispatchEvent(new CustomEvent(NOTIFICATION_EVENT_NAME));
}

export function getNotifications() {
  return readStore();
}

export function addNotification({ message, type = 'info' }) {
  const nextItem = {
    id: Date.now(),
    message: String(message || '').trim(),
    type,
    read: false,
    createdAt: new Date().toISOString(),
  };

  if (!nextItem.message) {
    return;
  }

  const current = readStore();
  const updated = [nextItem, ...current].slice(0, 30);
  writeStore(updated);
  emitUpdated();
}

export function markAllNotificationsRead() {
  const current = readStore();
  const updated = current.map((item) => ({ ...item, read: true }));
  writeStore(updated);
  emitUpdated();
}

export function subscribeNotifications(listener) {
  const handleStorage = (event) => {
    if (event.key === NOTIFICATION_STORAGE_KEY) {
      listener();
    }
  };

  const handleCustom = () => {
    listener();
  };

  window.addEventListener('storage', handleStorage);
  window.addEventListener(NOTIFICATION_EVENT_NAME, handleCustom);

  return () => {
    window.removeEventListener('storage', handleStorage);
    window.removeEventListener(NOTIFICATION_EVENT_NAME, handleCustom);
  };
}

