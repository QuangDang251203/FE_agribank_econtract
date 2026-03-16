const CONTRACT_CODE_STORAGE_KEY = 'contractCodeStore';

function readStore() {
  try {
    const raw = localStorage.getItem(CONTRACT_CODE_STORAGE_KEY);
    if (!raw) {
      return { latestByBusinessCode: {}, history: [] };
    }

    const parsed = JSON.parse(raw);
    return {
      latestByBusinessCode: parsed?.latestByBusinessCode || {},
      history: Array.isArray(parsed?.history) ? parsed.history : [],
    };
  } catch {
    return { latestByBusinessCode: {}, history: [] };
  }
}

function writeStore(store) {
  localStorage.setItem(CONTRACT_CODE_STORAGE_KEY, JSON.stringify(store));
}

export function normalizeContractCode(value) {
  return String(value || '').trim().toUpperCase();
}

export function extractContractCodeFromText(value) {
  const text = String(value || '').toUpperCase();
  const match = text.match(/\bCT[A-Z0-9]+\b/);
  return match ? match[0] : '';
}

export function saveContractCode({ businessCode, contractCode, source = 'unknown' }) {
  const normalizedBusinessCode = String(businessCode || '').trim().toUpperCase();
  const normalizedContractCode = normalizeContractCode(contractCode);

  if (!normalizedContractCode) {
    return;
  }

  const store = readStore();

  if (normalizedBusinessCode) {
    store.latestByBusinessCode[normalizedBusinessCode] = normalizedContractCode;
  }

  store.history = [
    {
      contractCode: normalizedContractCode,
      businessCode: normalizedBusinessCode,
      source,
      savedAt: new Date().toISOString(),
    },
    ...store.history.filter((item) => item.contractCode !== normalizedContractCode),
  ].slice(0, 30);

  writeStore(store);
}

export function getLatestContractCode(businessCode) {
  const normalizedBusinessCode = String(businessCode || '').trim().toUpperCase();
  const store = readStore();

  if (normalizedBusinessCode && store.latestByBusinessCode[normalizedBusinessCode]) {
    return store.latestByBusinessCode[normalizedBusinessCode];
  }

  return store.history[0]?.contractCode || '';
}

