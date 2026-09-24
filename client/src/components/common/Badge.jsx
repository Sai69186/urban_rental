import React from 'react';

const statusMap = {
  // Property approval
  approved: { variant: 'badge-success', label: 'Approved' },
  pending: { variant: 'badge-warning', label: 'Pending' },
  rejected: { variant: 'badge-danger', label: 'Rejected' },

  // Availability
  available: { variant: 'badge-success', label: 'Available' },
  under_application: { variant: 'badge-warning', label: 'In Review' },
  rented: { variant: 'badge-info', label: 'Rented' },
  maintenance: { variant: 'badge-danger', label: 'Maintenance' },

  // Application
  under_review: { variant: 'badge-warning', label: 'Under Review' },
  withdrawn: { variant: 'badge-danger', label: 'Withdrawn' },

  // Agreements
  active: { variant: 'badge-success', label: 'Active Lease' },
  draft: { variant: 'badge-warning', label: 'Draft' },
  expired: { variant: 'badge-danger', label: 'Expired' },
  terminated: { variant: 'badge-danger', label: 'Terminated' },

  // Rent / Payment
  paid: { variant: 'badge-success', label: 'Paid' },
  overdue: { variant: 'badge-danger', label: 'Overdue' },
  completed: { variant: 'badge-success', label: 'Completed' },
  failed: { variant: 'badge-danger', label: 'Failed' },

  // Maintenance
  Submitted: { variant: 'badge-warning', label: 'Submitted' },
  Acknowledged: { variant: 'badge-info', label: 'Acknowledged' },
  'In Progress': { variant: 'badge-primary', label: 'In Progress' },
  Resolved: { variant: 'badge-success', label: 'Resolved' },
  Closed: { variant: 'badge-secondary', label: 'Closed' },

  // Priority
  Low: { variant: 'badge-info', label: 'Low' },
  Medium: { variant: 'badge-warning', label: 'Medium' },
  High: { variant: 'badge-danger', label: 'High' },
  Urgent: { variant: 'badge-danger', label: 'Urgent' },

  // General
  open: { variant: 'badge-warning', label: 'Open' },
  investigating: { variant: 'badge-info', label: 'Investigating' },
  resolved: { variant: 'badge-success', label: 'Resolved' },
  closed: { variant: 'badge-secondary', label: 'Closed' },
  active_user: { variant: 'badge-success', label: 'Active' },
  suspended_user: { variant: 'badge-danger', label: 'Suspended' },
  verified: { variant: 'badge-success', label: 'Verified' },
  unverified: { variant: 'badge-warning', label: 'Unverified' },
};

const Badge = ({ status, customLabel, variant }) => {
  const meta = statusMap[status] || { variant: variant || 'badge-primary', label: status || 'Unknown' };
  const badgeClass = variant ? `badge-${variant}` : meta.variant;

  return (
    <span className={`badge ${badgeClass}`}>
      {customLabel || meta.label}
    </span>
  );
};

export default Badge;
