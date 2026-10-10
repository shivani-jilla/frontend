import React, { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ConfirmDialog from '../components/ConfirmDialog';

const ManageUsers = () => {
  const { user: currentUser, showToast } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Modal / Confirm state
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editRole, setEditRole] = useState('STUDENT');
  const [editName, setEditName] = useState('');
  const [confirmDeleteUser, setConfirmDeleteUser] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        size: 10,
      };
      if (searchTerm.trim()) params.search = searchTerm.trim();
      if (roleFilter) params.role = roleFilter;

      const data = await adminService.getUsers(params);
      setUsers(data.content || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to fetch users', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, roleFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0);
    fetchUsers();
  };

  const handleToggleStatus = async (targetUser) => {
    if (targetUser.id === currentUser?.id) {
      showToast('You cannot deactivate your own administrative account!', 'warning');
      return;
    }
    try {
      await adminService.toggleUserStatus(targetUser.id);
      showToast(`User ${targetUser.name} status updated`, 'success');
      fetchUsers();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update user status', 'error');
    }
  };

  const openEditModal = (u) => {
    setSelectedUser(u);
    setEditName(u.name);
    setEditRole(u.role);
    setIsEditModalOpen(true);
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;
    try {
      await adminService.updateUser(selectedUser.id, {
        name: editName,
        role: editRole,
        active: selectedUser.active,
      });
      showToast('User details updated successfully', 'success');
      setIsEditModalOpen(false);
      fetchUsers();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update user', 'error');
    }
  };

  const handleDeleteUser = async () => {
    if (!confirmDeleteUser) return;
    if (confirmDeleteUser.id === currentUser?.id) {
      showToast('You cannot delete your own account!', 'error');
      setConfirmDeleteUser(null);
      return;
    }
    try {
      await adminService.deleteUser(confirmDeleteUser.id);
      showToast(`Account for ${confirmDeleteUser.name} permanently deleted`, 'success');
      setConfirmDeleteUser(null);
      fetchUsers();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete user', 'error');
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'ADMIN':
        return <span className="badge bg-danger text-white rounded-pill px-2.5 py-1">ADMIN</span>;
      case 'INSTRUCTOR':
        return <span className="badge bg-primary text-white rounded-pill px-2.5 py-1">INSTRUCTOR</span>;
      case 'STUDENT':
      default:
        return <span className="badge bg-secondary-subtle text-dark rounded-pill px-2.5 py-1">STUDENT</span>;
    }
  };

  return (
    <div className="d-flex flex-column gap-4">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
        <div>
          <h2 className="fw-bold text-dark mb-1">
            <i className="bi bi-people-fill text-primary me-2"></i> User Directory Management
          </h2>
          <p className="text-muted mb-0">
            Audit registered platform accounts, assign authorization roles, and regulate access privileges.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card border-0 shadow-sm rounded-4 p-3 bg-white">
        <form onSubmit={handleSearchSubmit} className="row g-2 align-items-center">
          <div className="col-12 col-md-6 col-lg-7">
            <div className="input-group">
              <span className="input-group-text bg-transparent border-end-0">
                <i className="bi bi-search text-muted"></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Search by user name or email address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="btn btn-primary px-4 fw-semibold" type="submit">
                Search
              </button>
            </div>
          </div>

          <div className="col-12 col-md-6 col-lg-5 d-flex gap-2 justify-content-md-end">
            <select
              className="form-select w-auto"
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setPage(0);
              }}
            >
              <option value="">All Roles</option>
              <option value="STUDENT">Students</option>
              <option value="INSTRUCTOR">Instructors</option>
              <option value="ADMIN">Administrators</option>
            </select>

            {(searchTerm || roleFilter) && (
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => {
                  setSearchTerm('');
                  setRoleFilter('');
                  setPage(0);
                }}
              >
                Clear
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Users Table */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
        {loading ? (
          <div className="py-5">
            <LoadingSpinner text="Loading user accounts..." />
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-5">
            <i className="bi bi-person-x text-muted" style={{ fontSize: '3rem' }}></i>
            <h5 className="fw-bold mt-3 text-dark">No Accounts Found</h5>
            <p className="text-muted">No users matched your current query or role filter criteria.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light text-muted small text-uppercase">
                <tr>
                  <th className="ps-4">User</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Registered</th>
                  <th className="text-end pe-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td className="ps-4">
                      <div className="d-flex align-items-center gap-3">
                        <div
                          className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold shadow-sm"
                          style={{
                            width: '42px',
                            height: '42px',
                            background: u.role === 'ADMIN' ? '#ef4444' : u.role === 'INSTRUCTOR' ? '#2563eb' : '#64748b',
                            fontSize: '1rem',
                          }}
                        >
                          {u.name ? u.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div>
                          <div className="fw-bold text-dark">{u.name}</div>
                          <div className="text-muted small">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>{getRoleBadge(u.role)}</td>
                    <td>
                      {u.active ? (
                        <span className="badge bg-success-subtle text-success rounded-pill px-2.5 py-1">
                          <i className="bi bi-check-circle-fill me-1"></i> Active
                        </span>
                      ) : (
                        <span className="badge bg-danger-subtle text-danger rounded-pill px-2.5 py-1">
                          <i className="bi bi-x-circle-fill me-1"></i> Inactive
                        </span>
                      )}
                    </td>
                    <td className="text-muted small">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="text-end pe-4">
                      <div className="d-flex justify-content-end gap-2">
                        <button
                          className="btn btn-sm btn-outline-secondary rounded-pill px-2.5"
                          title="Edit Details / Role"
                          onClick={() => openEditModal(u)}
                        >
                          <i className="bi bi-pencil me-1"></i> Edit
                        </button>

                        <button
                          className={`btn btn-sm rounded-pill px-2.5 ${
                            u.active ? 'btn-outline-warning' : 'btn-outline-success'
                          }`}
                          title={u.active ? 'Deactivate account' : 'Activate account'}
                          disabled={u.id === currentUser?.id}
                          onClick={() => handleToggleStatus(u)}
                        >
                          <i className={`bi ${u.active ? 'bi-lock' : 'bi-unlock'} me-1`}></i>
                          {u.active ? 'Deactivate' : 'Activate'}
                        </button>

                        <button
                          className="btn btn-sm btn-outline-danger rounded-pill px-2.5"
                          title="Delete user"
                          disabled={u.id === currentUser?.id}
                          onClick={() => setConfirmDeleteUser(u)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="d-flex justify-content-between align-items-center p-3 border-top">
            <span className="text-muted small">
              Page {page + 1} of {totalPages}
            </span>
            <div className="btn-group">
              <button
                className="btn btn-sm btn-outline-primary"
                disabled={page === 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
              >
                Previous
              </button>
              <button
                className="btn btn-sm btn-outline-primary"
                disabled={page >= totalPages - 1}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Edit User Modal */}
      {isEditModalOpen && selectedUser && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(3px)' }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">Edit Account Details</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setIsEditModalOpen(false)}
                ></button>
              </div>
              <form onSubmit={handleSaveUser}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Email Address (Immutable)</label>
                    <input
                      type="text"
                      className="form-control bg-light"
                      value={selectedUser.email}
                      disabled
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Platform Role</label>
                    <select
                      className="form-select"
                      value={editRole}
                      onChange={(e) => setEditRole(e.target.value)}
                    >
                      <option value="STUDENT">STUDENT - Can view courses, submit assignments</option>
                      <option value="INSTRUCTOR">INSTRUCTOR - Can author courses and grade</option>
                      <option value="ADMIN">ADMIN - Full system administration access</option>
                    </select>
                  </div>
                </div>

                <div className="modal-footer border-0 pt-0">
                  <button
                    type="button"
                    className="btn btn-outline-secondary rounded-pill px-4"
                    onClick={() => setIsEditModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary rounded-pill px-4 fw-semibold">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={!!confirmDeleteUser}
        title="Confirm Account Deletion"
        message={`Are you sure you want to delete the user account for "${confirmDeleteUser?.name}" (${confirmDeleteUser?.email})? This action cannot be reversed.`}
        confirmText="Yes, Delete User"
        confirmVariant="danger"
        onConfirm={handleDeleteUser}
        onCancel={() => setConfirmDeleteUser(null)}
      />
    </div>
  );
};

export default ManageUsers;
