import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  QueryConstraint,
  where
} from "firebase/firestore";
import { db } from "../lib/firebase";

export type VatStatus = "vat" | "non_vat" | null;
export type Importance = "high" | "medium" | "low";

export interface LegalUpdate {
  id: string;
  date: string; // YYYY-MM-DD
  created_at: string; // ISO string
  source: string;
  title: string;
  url: string;
  raw_text?: string;
  is_for_fop?: boolean;
  group?: number | null;
  vat_status?: VatStatus;
  topics?: string[];
  importance?: Importance;
  summary_general?: string;
  summary_for_fop3_non_vat?: string;
}

export interface LegalUpdateFilters {
  isForFop?: boolean;
  group?: number | null;
  vatStatus?: VatStatus;
  fromDate?: string; // YYYY-MM-DD
  maxItems?: number;
}

/**
 * Reads legal updates tailored to a user profile (group + VAT).
 */
export async function fetchLegalUpdatesForProfile(filters: LegalUpdateFilters = {}): Promise<LegalUpdate[]> {
  const constraints: QueryConstraint[] = [];

  if (filters.isForFop !== undefined) {
    constraints.push(where("is_for_fop", "==", filters.isForFop));
  }

  if (filters.group !== undefined && filters.group !== null) {
    constraints.push(where("group", "==", filters.group));
  }

  if (filters.vatStatus) {
    constraints.push(where("vat_status", "==", filters.vatStatus));
  }

  if (filters.fromDate) {
    constraints.push(where("date", ">=", filters.fromDate));
  }

  constraints.push(orderBy("date", "desc"));

  if (filters.maxItems) {
    constraints.push(limit(filters.maxItems));
  }

  const snapshot = await getDocs(query(collection(db, "legal_updates"), ...constraints));

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<LegalUpdate, "id">)
  }));
}

