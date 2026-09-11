/**
 * Local demo/seed data used when Supabase is not configured (see src/lib/supabaseClient.js),
 * and as the source for supabase/seed.sql.
 *
 * Milestones, document categories/names, and dates are sourced from:
 *  - Statnativ_enablesGROUP_Client_Dashboard_Deployment_Guide.md (sections 4, 14, 19)
 *  - "Client Information and Documentation Checklist for Incorporation.xlsx", tab
 *    "7. Documents Checklist" (category + document name only — no personal data).
 *
 * Intentionally excluded: any director/shareholder personal details (names, PAN,
 * Aadhaar, addresses, phone/email) that live in the incorporation checklist's other
 * tabs. Per the deployment guide, the dashboard stores document STATUS only.
 */

export const client = {
  id: 'enablesme',
  name: 'enablesGROUP',
  code: 'ENABLESME',
  status: 'active',
}

export const engagement = {
  id: 'enablesme-india',
  client_id: 'enablesme',
  name: 'India Entity Establishment & Capability Build',
  description:
    'Wholly owned subsidiary (WOS) incorporation in India, followed by operational readiness and AI & engineering capability build.',
  current_phase: 'Document Collection & Validation',
  start_date: '2026-09-01',
  target_date: null,
  status: 'active',
}

// Weights per guide section 19. Sum = 100.
export const milestones = [
  { id: 'm1', sequence: 1, title: 'Engagement', weight: 5, status: 'completed', owner: 'Statnativ', description: 'Engagement letter signed.' },
  { id: 'm2', sequence: 2, title: 'India Structure Confirmed', weight: 10, status: 'completed', owner: 'Statnativ', description: 'Wholly owned subsidiary approach agreed; corporate ownership structure confirmed.' },
  { id: 'm3', sequence: 3, title: 'Document Collection', weight: 20, status: 'in_progress', owner: 'enablesGROUP', description: 'Client information and documentation checklist being collected and validated.' },
  { id: 'm4', sequence: 4, title: 'Name Approval', weight: 10, status: 'pending', owner: 'Statnativ', description: 'RUN (Reserve Unique Name) application and approval.' },
  { id: 'm5', sequence: 5, title: 'Incorporation', weight: 20, status: 'pending', owner: 'Statnativ', description: 'Filing of incorporation forms with the Registrar of Companies.' },
  { id: 'm6', sequence: 6, title: 'Bank Account', weight: 10, status: 'pending', owner: 'enablesGROUP', description: 'Company current account opening.' },
  { id: 'm7', sequence: 7, title: 'Statutory Registrations', weight: 10, status: 'pending', owner: 'Statnativ', description: 'PAN, TAN, GST and other statutory registrations.' },
  { id: 'm8', sequence: 8, title: 'Operational Readiness', weight: 5, status: 'pending', owner: 'enablesGROUP', description: 'Office, banking and compliance operations ready.' },
  { id: 'm9', sequence: 9, title: 'AI & Engineering Capability Build', weight: 5, status: 'pending', owner: 'enablesGROUP', description: 'Hiring and capability build for the India AI & engineering team.' },
  { id: 'm10', sequence: 10, title: 'Delivery Readiness', weight: 5, status: 'pending', owner: 'enablesGROUP', description: 'India team ready for project delivery.' },
]

// From "7. Documents Checklist" tab. `status` defaults to "Pending" — none of the
// checklist rows were marked received (Y) in the source workbook as of 2026-09-11.
export const documents = [
  { category: 'Corporate Shareholder (Holding Co.)', document_name: 'Certificate of Incorporation (COI)', owner: 'enablesGROUP', status: 'Pending', notes: null },
  { category: 'Corporate Shareholder (Holding Co.)', document_name: 'MOA / AOA / Articles / By-laws (or equivalent charter document)', owner: 'enablesGROUP', status: 'Pending', notes: null },
  { category: 'Corporate Shareholder (Holding Co.)', document_name: 'Certificate of Good Standing / Incumbency Certificate (recommended)', owner: 'enablesGROUP', status: 'Not Applicable', notes: null },
  { category: 'Corporate Shareholder (Holding Co.)', document_name: 'Board Resolution approving the Indian investment / incorporation and authorizing signatory', owner: 'Statnativ', status: 'Pending', notes: 'Will be prepared by Statnativ post receipt of information.' },
  { category: 'Corporate Shareholder (Holding Co.)', document_name: 'Power of Attorney in favour of Authorized Signatory (if any)', owner: 'enablesGROUP', status: 'Pending', notes: null },
  { category: 'Corporate Shareholder (Holding Co.)', document_name: 'Electricity Bill (or similar) as proof of registered address', owner: 'enablesGROUP', status: 'Pending', notes: null },
  { category: 'Corporate Shareholder (Holding Co.)', document_name: 'Latest Bank Statement (not older than 2 months)', owner: 'enablesGROUP', status: 'Pending', notes: null },
  { category: 'Corporate Shareholder (Holding Co.)', document_name: 'PAN of the company, if already obtained', owner: 'enablesGROUP', status: 'Pending', notes: null },
  { category: 'Authorized Signatory', document_name: 'Passport copy', owner: 'enablesGROUP', status: 'Pending', notes: null },
  { category: 'Authorized Signatory', document_name: 'Passport-size photograph', owner: 'enablesGROUP', status: 'Pending', notes: null },
  { category: 'Authorized Signatory', document_name: 'Bank Statement (proof of address, not older than 2 months)', owner: 'enablesGROUP', status: 'Pending', notes: null },
  { category: 'Authorized Signatory', document_name: 'PAN and Aadhaar Card (only if resident in India)', owner: 'enablesGROUP', status: 'Pending', notes: null },
  { category: 'Director(s)', document_name: 'Passport copy (foreign) / PAN & Aadhaar Card (Indian resident)', owner: 'enablesGROUP', status: 'Pending', notes: null },
  { category: 'Director(s)', document_name: 'Passport-size photograph', owner: 'enablesGROUP', status: 'Pending', notes: null },
  { category: 'Director(s)', document_name: 'Specimen signature', owner: 'enablesGROUP', status: 'Pending', notes: null },
  { category: 'Director(s)', document_name: 'Bank Statement (proof of address, not older than 2 months)', owner: 'enablesGROUP', status: 'Pending', notes: null },
  { category: 'Director(s)', document_name: 'Declaration of other directorships/shareholdings, once details are confirmed', owner: 'Statnativ', status: 'Pending', notes: 'Will be shared by Statnativ post receipt of information.' },
  { category: 'Nominee Shareholder', document_name: 'Passport copy (foreign) / PAN & Aadhaar Card (Indian resident)', owner: 'enablesGROUP', status: 'Pending', notes: null },
  { category: 'Nominee Shareholder', document_name: 'Passport-size photograph', owner: 'enablesGROUP', status: 'Pending', notes: null },
  { category: 'Nominee Shareholder', document_name: 'Bank Statement (proof of address, not older than 2 months)', owner: 'enablesGROUP', status: 'Pending', notes: null },
  { category: 'Nominee Shareholder', document_name: 'Signed Nominee Declaration (confirming shares held on behalf of holding company)', owner: 'Statnativ', status: 'Pending', notes: 'Will be shared by Statnativ post receipt of information.' },
  { category: 'Registered Office (India)', document_name: 'Rent/Lease Agreement or ownership proof (notarized, if not owned by the company)', owner: 'enablesGROUP', status: 'Not Applicable', notes: null },
  { category: 'Registered Office (India)', document_name: 'No Objection Certificate (NOC) from property owner', owner: 'enablesGROUP', status: 'Not Applicable', notes: null },
  { category: 'Registered Office (India)', document_name: 'Latest electricity bill / property tax receipt for the office, in owner\'s name', owner: 'enablesGROUP', status: 'Not Applicable', notes: null },
  { category: 'DSC (all applicants)', document_name: 'Identity proof, address proof, photograph, personal email & mobile number', owner: 'enablesGROUP', status: 'Pending', notes: null },
].map((d, i) => ({ id: `d${i + 1}`, engagement_id: 'enablesme-india', received_date: null, reviewed_date: null, ...d }))

export const tasks = [
  { id: 't1', title: 'Corporate shareholder documents', owner: 'enablesGROUP (Tess)', owner_type: 'client', due_date: null, priority: 'high', status: 'Pending' },
  { id: 't2', title: 'Director confirmation', owner: 'enablesGROUP (Sanjay)', owner_type: 'client', due_date: null, priority: 'high', status: 'In Progress' },
  { id: 't3', title: 'Validate shareholder documentation', owner: 'Statnativ', owner_type: 'statnativ', due_date: null, priority: 'high', status: 'In Progress' },
  { id: 't4', title: 'Prepare incorporation documents', owner: 'Statnativ', owner_type: 'statnativ', due_date: null, priority: 'medium', status: 'Pending' },
  { id: 't5', title: 'Prepare name application', owner: 'Statnativ', owner_type: 'statnativ', due_date: null, priority: 'medium', status: 'Pending' },
].map((t) => ({ engagement_id: 'enablesme-india', description: null, ...t }))

export const risks = [
  {
    id: 'r1',
    engagement_id: 'enablesme-india',
    title: 'Awaiting shareholder documentation',
    description: 'Corporate shareholder and director documents are still outstanding, which blocks name reservation and incorporation filing.',
    severity: 'Medium',
    owner: 'enablesGROUP',
    mitigation: 'Follow up directly with Tess and Sanjay; provide a checklist walkthrough to unblock collection.',
    status: 'Open',
  },
]

export const updates = [
  { id: 'u1', engagement_id: 'enablesme-india', update_date: '2026-09-11', title: 'Director documentation received', description: 'Director documentation received.', created_by: 'Statnativ' },
  { id: 'u2', engagement_id: 'enablesme-india', update_date: '2026-09-10', title: 'Ownership structure confirmed', description: 'Corporate ownership structure confirmed.', created_by: 'Statnativ' },
  { id: 'u3', engagement_id: 'enablesme-india', update_date: '2026-09-09', title: 'Wholly owned subsidiary approach agreed', description: 'Wholly owned subsidiary approach agreed.', created_by: 'Statnativ' },
]

/**
 * Weighted progress per deployment guide section 19: completed milestones count in
 * full, the single in-progress milestone counts at half weight.
 */
export function calculateProgress(milestoneList) {
  const total = milestoneList.reduce((sum, m) => sum + m.weight, 0) || 100
  const earned = milestoneList.reduce((sum, m) => {
    if (m.status === 'completed') return sum + m.weight
    if (m.status === 'in_progress') return sum + m.weight * 0.5
    return sum
  }, 0)
  return Math.round((earned / total) * 100)
}
