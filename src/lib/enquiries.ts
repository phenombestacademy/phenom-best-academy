const KEY = "pba-enquiries-v1";

export type Enquiry = {
  id: string;
  name: string;
  email: string;
  phone: string;
  audience: string;
  service: string;
  message: string;
  createdAt: string;
};

function read(): Enquiry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Enquiry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function write(items: Enquiry[]) {
  window.localStorage.setItem(KEY, JSON.stringify(items));
}

export function listEnquiries(): Enquiry[] {
  return read().sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export function saveEnquiry(input: Omit<Enquiry, "id" | "createdAt">): Enquiry {
  const item: Enquiry = {
    ...input,
    id: `PBA-${Date.now().toString(36).toUpperCase()}`,
    createdAt: new Date().toISOString(),
  };
  const next = [item, ...read()].slice(0, 40);
  write(next);
  return item;
}
