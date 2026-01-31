const STORAGE_SCHEMA_VERSION: number = 1;

export function isLocalStorageAvailable(): boolean {
  try {
    const testKey: string = "__furnishes_storage_test__";
    window.localStorage.setItem(testKey, "1");
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

export function readVersionedJson<T>(storageKey: string): T | null {
  if (typeof window === "undefined") return null;
  if (!isLocalStorageAvailable()) return null;

  const rawValue: string | null = window.localStorage.getItem(storageKey);
  if (!rawValue) return null;

  const parsed: unknown = JSON.parse(rawValue);
  if (
    typeof parsed === "object" &&
    parsed !== null &&
    "version" in parsed &&
    "data" in parsed
  ) {
    const versionValue: unknown = (parsed as { version: unknown }).version;
    const dataValue: unknown = (parsed as { data: unknown }).data;

    if (versionValue === STORAGE_SCHEMA_VERSION) {
      return dataValue as T;
    }
  }
  return null;
}

export function writeVersionedJson<T>(storageKey: string, data: T): void {
  if (typeof window === "undefined") return;
  if (!isLocalStorageAvailable()) return;

  const payload: { version: number; data: T } = {
    version: STORAGE_SCHEMA_VERSION,
    data,
  };
  window.localStorage.setItem(storageKey, JSON.stringify(payload));
}
