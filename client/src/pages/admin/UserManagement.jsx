import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Badge from '../../components/common/Badge';
import GlowSearchInput from '../../components/common/GlowSearchInput';
import { getRealisticAvatar } from '../../utils/avatarHelper';
import { Users, Search, ShieldCheck, ShieldAlert, Trash2, CheckCircle2, XCircle } from 'lucide-react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [actionLoading, setActionLoading] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (roleFilter !== 'All') params.append('role', roleFilter);

      const res = await api.get(`/users?${params.toString()}`);
      if (res.data.success) {
        setUsers(res.data.data);
      }
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const handleToggleStatus = async (user) => {
    try {
      setActionLoading(user._id);
      const res = await api.patch(`/users/${user._id}/status`, { isActive: !user.isActive });
      if (res.data.success) {
        setUsers((prev) =>
          prev.map((u) => (u._id === user._id ? { ...u, isActive: !user.isActive } : u))
        );
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update user status');
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleVerify = async (user) => {
    try {
      setActionLoading(user._id);
      const res = await api.patch(`/users/${user._id}/verify`, { isVerified: !user.isVerified });
      if (res.data.success) {
        setUsers((prev) =>
          prev.map((u) => (u._id === user._id ? { ...u, isVerified: !user.isVerified } : u))
        );
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update verification status');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to permanently delete this user account?')) return;
    try {
      setActionLoading(userId);
      const res = await api.delete(`/users/${userId}`);
      if (res.data.success) {
        setUsers((prev) => prev.filter((u) => u._id !== userId));
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete user');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Search & Filter Bar */}
      <div className="card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ flex: 1, minWidth: '280px', maxWidth: '520px' }}>
            <GlowSearchInput
              placeholder="Search user by name, email, or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchUsers()}
              onFilterClick={fetchUsers}
              showFilter={true}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Role Filter:</span>
            {['All', 'admin', 'owner', 'tenant'].map((r) => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`btn btn-sm ${roleFilter === r ? 'btn-primary' : 'btn-outline'}`}
                style={{ textTransform: 'capitalize' }}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Users Data Table */}
      {loading ? (
        <LoadingSpinner text="Loading users..." />
      ) : users.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: 'var(--text-muted)' }}>No users found matching query.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Contact</th>
                <th>Verification</th>
                <th>Account Status</th>
                <th>Registered</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const roleColors = {
                  admin: { badge: 'badge-primary' },
                  owner: { badge: 'badge-info' },
                  tenant: { badge: 'badge-success' }
                };
                const theme = roleColors[u.role] || roleColors.tenant;
                const avatarSrc = getRealisticAvatar(u);

                return (
                  <tr key={u._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                        <div
                          style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '50%',
                            border: '1.5px solid rgba(255, 255, 255, 0.12)',
                            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.35)',
                            overflow: 'hidden',
                            flexShrink: 0,
                            background: '#111827',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <img
                            src={avatarSrc}
                            alt={u.name}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=1e293b&color=f8fafc`;
                            }}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </div>
                        <div>
                          <p style={{ fontWeight: 700, color: '#f8fafc', fontSize: '0.92rem', letterSpacing: '-0.01em', marginBottom: '2px' }}>
                            {u.name}
                          </p>
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${theme.badge}`}>
                        {u.role}
                      </span>
                    </td>
                  <td>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{u.phone}</span>
                  </td>
                  <td>
                    {u.isVerified ? (
                      <span className="badge badge-success">Verified</span>
                    ) : (
                      <span className="badge badge-warning">Unverified</span>
                    )}
                  </td>
                  <td>
                    {u.isActive ? (
                      <span className="badge badge-success">Active</span>
                    ) : (
                      <span className="badge badge-danger">Suspended</span>
                    )}
                  </td>
                  <td>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {new Date(u.createdAt).toLocaleDateString()}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      {/* Verify Button */}
                      <button
                        onClick={() => handleToggleVerify(u)}
                        disabled={actionLoading === u._id}
                        className="btn btn-outline btn-sm"
                        title={u.isVerified ? 'Revoke Verification' : 'Verify User'}
                      >
                        <ShieldCheck size={14} color={u.isVerified ? 'var(--warning)' : 'var(--success)'} />
                        {u.isVerified ? 'Unverify' : 'Verify'}
                      </button>

                      {/* Suspend / Activate Button */}
                      {u.role !== 'admin' && (
                        <button
                          onClick={() => handleToggleStatus(u)}
                          disabled={actionLoading === u._id}
                          className={`btn btn-sm ${u.isActive ? 'btn-danger' : 'btn-success'}`}
                          title={u.isActive ? 'Suspend Account' : 'Reactivate Account'}
                        >
                          {u.isActive ? 'Suspend' : 'Activate'}
                        </button>
                      )}

                      {/* Delete */}
                      {u.role !== 'admin' && (
                        <button
                          onClick={() => handleDeleteUser(u._id)}
                          disabled={actionLoading === u._id}
                          className="btn btn-outline btn-sm"
                          title="Delete User"
                          style={{ color: 'var(--danger)' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
