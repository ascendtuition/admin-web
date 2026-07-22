import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getAllPackages, createPackage, updatePackage } from '../api/package';
import StatusPill from '../components/StatusPill';
import type { PackageItem } from '../types';

interface FormState {
  name: string;
  description: string;
  price: string;
  currency: string;
  lessonsIncluded: string;
  validityDays: string;
}

const EMPTY_FORM: FormState = {
  name: '',
  description: '',
  price: '',
  currency: 'GBP',
  lessonsIncluded: '',
  validityDays: '',
};

const PackagesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<PackageItem | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);

  const { data, isLoading } = useQuery({ queryKey: ['admin', 'packages'], queryFn: getAllPackages });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['admin', 'packages'] });

  const createMutation = useMutation({
    mutationFn: () =>
      createPackage({
        name: form.name,
        description: form.description || undefined,
        priceMinor: Math.round(parseFloat(form.price) * 100),
        currency: form.currency,
        lessonsIncluded: parseInt(form.lessonsIncluded, 10),
        validityDays: parseInt(form.validityDays, 10),
      }),
    onSuccess: () => {
      invalidate();
      closeModal();
    },
  });

  const updateMutation = useMutation({
    mutationFn: () =>
      updatePackage(editing!._id, {
        name: form.name,
        description: form.description || undefined,
        priceMinor: Math.round(parseFloat(form.price) * 100),
        currency: form.currency,
        lessonsIncluded: parseInt(form.lessonsIncluded, 10),
        validityDays: parseInt(form.validityDays, 10),
      }),
    onSuccess: () => {
      invalidate();
      closeModal();
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: (pkg: PackageItem) => updatePackage(pkg._id, { isActive: !pkg.isActive }),
    onSuccess: invalidate,
  });

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (pkg: PackageItem) => {
    setEditing(pkg);
    setForm({
      name: pkg.name,
      description: pkg.description ?? '',
      price: (pkg.priceMinor / 100).toString(),
      currency: pkg.currency,
      lessonsIncluded: pkg.lessonsIncluded.toString(),
      validityDays: pkg.validityDays.toString(),
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditing(null);
    setForm(EMPTY_FORM);
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;
  const canSave = form.name && form.price && form.lessonsIncluded && form.validityDays;

  return (
    <div>
      <div className="top-row">
        <div>
          <h1 className="page-title">Packages</h1>
          <p className="page-subtitle" style={{ marginBottom: 0 }}>
            Pricing and lesson bundles parents can purchase.
          </p>
        </div>
        <button className="button" onClick={openCreate}>
          + New package
        </button>
      </div>

      {isLoading ? (
        <p className="page-subtitle">Loading…</p>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Lessons</th>
                <th>Validity</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {(data?.packages ?? []).map((pkg) => (
                <tr key={pkg._id}>
                  <td>
                    <div style={{ fontWeight: 700 }}>{pkg.name}</div>
                    <div className="page-subtitle" style={{ margin: 0, fontSize: 12 }}>
                      {pkg.description}
                    </div>
                  </td>
                  <td>
                    {pkg.currency === 'GBP' ? '£' : pkg.currency + ' '}
                    {(pkg.priceMinor / 100).toFixed(2)}
                  </td>
                  <td>{pkg.lessonsIncluded}</td>
                  <td>{pkg.validityDays} days</td>
                  <td>
                    <StatusPill
                      label={pkg.isActive === false ? 'inactive' : 'active'}
                      tone={pkg.isActive === false ? 'neutral' : 'success'}
                    />
                  </td>
                  <td style={{ display: 'flex', gap: 8 }}>
                    <button className="button secondary small" onClick={() => openEdit(pkg)}>
                      Edit
                    </button>
                    <button
                      className="button secondary small"
                      onClick={() => toggleActiveMutation.mutate(pkg)}
                      disabled={toggleActiveMutation.isPending}
                    >
                      {pkg.isActive === false ? 'Activate' : 'Retire'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal ? (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h2 style={{ marginTop: 0 }}>{editing ? 'Edit package' : 'New package'}</h2>
            <label className="label">Name</label>
            <input
              className="input"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
            <label className="label">Description</label>
            <input
              className="input"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
            <label className="label">Price (£)</label>
            <input
              className="input"
              type="number"
              step="0.01"
              value={form.price}
              onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
            />
            <label className="label">Lessons included</label>
            <input
              className="input"
              type="number"
              value={form.lessonsIncluded}
              onChange={(e) => setForm((f) => ({ ...f, lessonsIncluded: e.target.value }))}
            />
            <label className="label">Validity (days)</label>
            <input
              className="input"
              type="number"
              value={form.validityDays}
              onChange={(e) => setForm((f) => ({ ...f, validityDays: e.target.value }))}
            />
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <button
                className="button"
                disabled={!canSave || isSaving}
                onClick={() => (editing ? updateMutation.mutate() : createMutation.mutate())}
              >
                {isSaving ? 'Saving…' : editing ? 'Save changes' : 'Create package'}
              </button>
              <button className="button secondary" onClick={closeModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default PackagesPage;
