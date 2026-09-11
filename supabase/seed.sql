-- Generated from src/data/seedData.js — do not edit by hand.
-- Run scripts/generate-seed-sql.mjs after changing seed data, then re-run this
-- file in the Supabase SQL editor against a project with supabase/schema.sql applied.

insert into clients (id, name, code, status) values
  ('enablesme', 'enablesGROUP', 'ENABLESME', 'active')
on conflict (id) do nothing;

insert into engagements (id, client_id, name, description, current_phase, overall_progress, start_date, target_date, status) values
  ('enablesme-india', 'enablesme', 'India Entity Establishment & Capability Build', 'Wholly owned subsidiary (WOS) incorporation in India, followed by operational readiness and AI & engineering capability build.', 'Document Collection & Validation', '25', '2026-09-01', null, 'active')
on conflict (id) do nothing;

insert into milestones (id, engagement_id, title, description, sequence, weight, owner, status) values
  ('m1', 'enablesme-india', 'Engagement', 'Engagement letter signed.', '1', '5', 'Statnativ', 'completed'),
  ('m2', 'enablesme-india', 'India Structure Confirmed', 'Wholly owned subsidiary approach agreed; corporate ownership structure confirmed.', '2', '10', 'Statnativ', 'completed'),
  ('m3', 'enablesme-india', 'Document Collection', 'Client information and documentation checklist being collected and validated.', '3', '20', 'enablesGROUP', 'in_progress'),
  ('m4', 'enablesme-india', 'Name Approval', 'RUN (Reserve Unique Name) application and approval.', '4', '10', 'Statnativ', 'pending'),
  ('m5', 'enablesme-india', 'Incorporation', 'Filing of incorporation forms with the Registrar of Companies.', '5', '20', 'Statnativ', 'pending'),
  ('m6', 'enablesme-india', 'Bank Account', 'Company current account opening.', '6', '10', 'enablesGROUP', 'pending'),
  ('m7', 'enablesme-india', 'Statutory Registrations', 'PAN, TAN, GST and other statutory registrations.', '7', '10', 'Statnativ', 'pending'),
  ('m8', 'enablesme-india', 'Operational Readiness', 'Office, banking and compliance operations ready.', '8', '5', 'enablesGROUP', 'pending'),
  ('m9', 'enablesme-india', 'AI & Engineering Capability Build', 'Hiring and capability build for the India AI & engineering team.', '9', '5', 'enablesGROUP', 'pending'),
  ('m10', 'enablesme-india', 'Delivery Readiness', 'India team ready for project delivery.', '10', '5', 'enablesGROUP', 'pending')
on conflict (id) do nothing;

insert into documents (id, engagement_id, category, document_name, owner, status, received_date, reviewed_date, notes) values
  ('d1', 'enablesme-india', 'Corporate Shareholder (Holding Co.)', 'Certificate of Incorporation (COI)', 'enablesGROUP', 'Pending', null, null, null),
  ('d2', 'enablesme-india', 'Corporate Shareholder (Holding Co.)', 'MOA / AOA / Articles / By-laws (or equivalent charter document)', 'enablesGROUP', 'Pending', null, null, null),
  ('d3', 'enablesme-india', 'Corporate Shareholder (Holding Co.)', 'Certificate of Good Standing / Incumbency Certificate (recommended)', 'enablesGROUP', 'Not Applicable', null, null, null),
  ('d4', 'enablesme-india', 'Corporate Shareholder (Holding Co.)', 'Board Resolution approving the Indian investment / incorporation and authorizing signatory', 'Statnativ', 'Pending', null, null, 'Will be prepared by Statnativ post receipt of information.'),
  ('d5', 'enablesme-india', 'Corporate Shareholder (Holding Co.)', 'Power of Attorney in favour of Authorized Signatory (if any)', 'enablesGROUP', 'Pending', null, null, null),
  ('d6', 'enablesme-india', 'Corporate Shareholder (Holding Co.)', 'Electricity Bill (or similar) as proof of registered address', 'enablesGROUP', 'Pending', null, null, null),
  ('d7', 'enablesme-india', 'Corporate Shareholder (Holding Co.)', 'Latest Bank Statement (not older than 2 months)', 'enablesGROUP', 'Pending', null, null, null),
  ('d8', 'enablesme-india', 'Corporate Shareholder (Holding Co.)', 'PAN of the company, if already obtained', 'enablesGROUP', 'Pending', null, null, null),
  ('d9', 'enablesme-india', 'Authorized Signatory', 'Passport copy', 'enablesGROUP', 'Pending', null, null, null),
  ('d10', 'enablesme-india', 'Authorized Signatory', 'Passport-size photograph', 'enablesGROUP', 'Pending', null, null, null),
  ('d11', 'enablesme-india', 'Authorized Signatory', 'Bank Statement (proof of address, not older than 2 months)', 'enablesGROUP', 'Pending', null, null, null),
  ('d12', 'enablesme-india', 'Authorized Signatory', 'PAN and Aadhaar Card (only if resident in India)', 'enablesGROUP', 'Pending', null, null, null),
  ('d13', 'enablesme-india', 'Director(s)', 'Passport copy (foreign) / PAN & Aadhaar Card (Indian resident)', 'enablesGROUP', 'Pending', null, null, null),
  ('d14', 'enablesme-india', 'Director(s)', 'Passport-size photograph', 'enablesGROUP', 'Pending', null, null, null),
  ('d15', 'enablesme-india', 'Director(s)', 'Specimen signature', 'enablesGROUP', 'Pending', null, null, null),
  ('d16', 'enablesme-india', 'Director(s)', 'Bank Statement (proof of address, not older than 2 months)', 'enablesGROUP', 'Pending', null, null, null),
  ('d17', 'enablesme-india', 'Director(s)', 'Declaration of other directorships/shareholdings, once details are confirmed', 'Statnativ', 'Pending', null, null, 'Will be shared by Statnativ post receipt of information.'),
  ('d18', 'enablesme-india', 'Nominee Shareholder', 'Passport copy (foreign) / PAN & Aadhaar Card (Indian resident)', 'enablesGROUP', 'Pending', null, null, null),
  ('d19', 'enablesme-india', 'Nominee Shareholder', 'Passport-size photograph', 'enablesGROUP', 'Pending', null, null, null),
  ('d20', 'enablesme-india', 'Nominee Shareholder', 'Bank Statement (proof of address, not older than 2 months)', 'enablesGROUP', 'Pending', null, null, null),
  ('d21', 'enablesme-india', 'Nominee Shareholder', 'Signed Nominee Declaration (confirming shares held on behalf of holding company)', 'Statnativ', 'Pending', null, null, 'Will be shared by Statnativ post receipt of information.'),
  ('d22', 'enablesme-india', 'Registered Office (India)', 'Rent/Lease Agreement or ownership proof (notarized, if not owned by the company)', 'enablesGROUP', 'Not Applicable', null, null, null),
  ('d23', 'enablesme-india', 'Registered Office (India)', 'No Objection Certificate (NOC) from property owner', 'enablesGROUP', 'Not Applicable', null, null, null),
  ('d24', 'enablesme-india', 'Registered Office (India)', 'Latest electricity bill / property tax receipt for the office, in owner''s name', 'enablesGROUP', 'Not Applicable', null, null, null),
  ('d25', 'enablesme-india', 'DSC (all applicants)', 'Identity proof, address proof, photograph, personal email & mobile number', 'enablesGROUP', 'Pending', null, null, null)
on conflict (id) do nothing;

insert into tasks (id, engagement_id, title, description, owner, owner_type, due_date, priority, status) values
  ('t1', 'enablesme-india', 'Corporate shareholder documents', null, 'enablesGROUP (Tess)', 'client', null, 'high', 'Pending'),
  ('t2', 'enablesme-india', 'Director confirmation', null, 'enablesGROUP (Sanjay)', 'client', null, 'high', 'In Progress'),
  ('t3', 'enablesme-india', 'Validate shareholder documentation', null, 'Statnativ', 'statnativ', null, 'high', 'In Progress'),
  ('t4', 'enablesme-india', 'Prepare incorporation documents', null, 'Statnativ', 'statnativ', null, 'medium', 'Pending'),
  ('t5', 'enablesme-india', 'Prepare name application', null, 'Statnativ', 'statnativ', null, 'medium', 'Pending')
on conflict (id) do nothing;

insert into risks (id, engagement_id, title, description, severity, owner, mitigation, status) values
  ('r1', 'enablesme-india', 'Awaiting shareholder documentation', 'Corporate shareholder and director documents are still outstanding, which blocks name reservation and incorporation filing.', 'Medium', 'enablesGROUP', 'Follow up directly with Tess and Sanjay; provide a checklist walkthrough to unblock collection.', 'Open')
on conflict (id) do nothing;

insert into updates (id, engagement_id, update_date, title, description, created_by) values
  ('u1', 'enablesme-india', '2026-09-11', 'Director documentation received', 'Director documentation received.', 'Statnativ'),
  ('u2', 'enablesme-india', '2026-09-10', 'Ownership structure confirmed', 'Corporate ownership structure confirmed.', 'Statnativ'),
  ('u3', 'enablesme-india', '2026-09-09', 'Wholly owned subsidiary approach agreed', 'Wholly owned subsidiary approach agreed.', 'Statnativ')
on conflict (id) do nothing;

