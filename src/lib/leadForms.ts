// Field sets for the site's smaller CTA forms (everything except CTA1
// "Register your interest", which has its own dedicated component).
// Deliberately fixed in code, not in the CMS: letting a non-technical editor
// add/remove form fields here would risk breaking required-field validation.
// Bjorn edits the copy (heading, microcopy, labels) in content/settings/global.json;
// the field structure itself only changes via a code update.

export type FieldKey = 'firstName' | 'lastName' | 'email' | 'phone' | 'brand' | 'message';

export interface FieldDef {
  key: FieldKey;
  label: string;
  type: 'text' | 'email' | 'tel' | 'textarea';
  required: boolean;
}

export const FIELD_DEFS: Record<FieldKey, FieldDef> = {
  firstName: { key: 'firstName', label: 'First name', type: 'text', required: true },
  lastName: { key: 'lastName', label: 'Last name', type: 'text', required: true },
  email: { key: 'email', label: 'Email', type: 'email', required: true },
  phone: { key: 'phone', label: 'Phone number', type: 'tel', required: true },
  brand: { key: 'brand', label: 'Brand name', type: 'text', required: false },
  message: { key: 'message', label: 'Tell us more', type: 'textarea', required: false },
};

// Maps each lead-form id to the fields it collects, per the General blueprint
// doc's CTA field definitions (CTA2, CTA3, CTA5, CTA6, CTA7).
//
// Ids are camelCase, not kebab-case: these double as Tina/GraphQL field
// names in tina/config.ts, and GraphQL identifiers can't contain hyphens.
export const LEAD_FORM_FIELDS: Record<string, FieldKey[]> = {
  // CTA3-shaped (first, last, email) — used for lightweight, no-friction asks.
  connect: ['firstName', 'lastName', 'email'],
  downloadChapter: ['firstName', 'lastName', 'email'],
  preorder: ['firstName', 'lastName', 'email'],
  // CTA2-shaped (adds brand name) — used where a report/PDF is delivered.
  downloadReport: ['firstName', 'lastName', 'email', 'brand'],
  // CTA5/6/7-shaped (adds phone + open message) — used for booking requests.
  masterclass: ['firstName', 'lastName', 'email', 'phone', 'message'],
  speaker: ['firstName', 'lastName', 'email', 'phone', 'message'],
  consultancy: ['firstName', 'lastName', 'email', 'phone', 'message'],
};
