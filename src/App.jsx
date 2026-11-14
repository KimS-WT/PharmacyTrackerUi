import { useEffect, useState } from 'react';

const API_URL = 'http://localhost:5029/api';

export default function App() {
  const [patients, setPatients] = useState([]);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    medicationName: '',
    dosage: '',
    refillsRemaining: 1,
    patientId: 1
  });

  // 1. Fetch patients and their nested prescriptions on page load
  const loadPatients = async () => {
    try {
      const res = await fetch(`${API_URL}/Patients`);
      if (!res.ok) throw new Error('Failed to load patients');
      const data = await res.json();
      setPatients(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  // 2. Call PUT /api/Prescriptions/{id}/refill
  const handleRefill = async (prescriptionId) => {
    setError('');
    const res = await fetch(`${API_URL}/Prescriptions/${prescriptionId}/refill`, {
      method: 'PUT'
    });

    if (!res.ok) {
      const msg = await res.text();
      setError(msg || 'Could not process refill.');
      return;
    }

    loadPatients(); // Refresh list to show updated refill count
  };

  // 3. Call POST /api/Prescriptions
  const handleAddPrescription = async (e) => {
    e.preventDefault();
    setError('');

    const res = await fetch(`${API_URL}/Prescriptions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        refillsRemaining: Number(form.refillsRemaining),
        patientId: Number(form.patientId)
      })
    });

    if (!res.ok) {
      const msg = await res.text();
      setError(msg || 'Failed to add prescription.');
      return;
    }

    setForm({ medicationName: '', dosage: '', refillsRemaining: 1, patientId: 1 });
    loadPatients();
  };

  return (
    <div style={{ maxWidth: '750px', margin: '2rem auto', fontFamily: 'sans-serif', padding: '0 1rem' }}>
      <h1>Pharmacy Prescription Tracker</h1>

      {error && (
        <div style={{ background: '#fee2e2', color: '#991b1b', padding: '0.75rem', borderRadius: '6px', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      {/* Add Prescription Form */}
      <form onSubmit={handleAddPrescription} style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
        <input
          placeholder="Medication (e.g. Ibuprofen)"
          value={form.medicationName}
          onChange={(e) => setForm({ ...form, medicationName: e.target.value })}
          required
        />
        <input
          placeholder="Dosage (e.g. 200mg)"
          value={form.dosage}
          onChange={(e) => setForm({ ...form, dosage: e.target.value })}
          required
        />
        <input
          type="number"
          min="0"
          placeholder="Refills"
          value={form.refillsRemaining}
          onChange={(e) => setForm({ ...form, refillsRemaining: e.target.value })}
          style={{ width: '75px' }}
          required
        />
        <select
          value={form.patientId}
          onChange={(e) => setForm({ ...form, patientId: e.target.value })}
        >
          {patients.map((p) => (
            <option key={p.id} value={p.id}>
              {p.firstName} {p.lastName} (ID: {p.id})
            </option>
          ))}
        </select>
        <button type="submit">Add Prescription</button>
      </form>

      {/* Patients & Prescriptions List */}
      {patients.map((patient) => (
        <div key={patient.id} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
          <h2 style={{ margin: '0 0 0.5rem 0' }}>
            {patient.firstName} {patient.lastName} <small style={{ color: '#666' }}>(DOB: {patient.dateOfBirth})</small>
          </h2>

          {patient.prescriptions.length === 0 ? (
            <p style={{ color: '#666' }}>No prescriptions on file.</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {patient.prescriptions.map((rx) => (
                <li key={rx.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderTop: '1px solid #eee' }}>
                  <span>
                    <strong>{rx.medicationName}</strong> ({rx.dosage}) — Refills left: <strong>{rx.refillsRemaining}</strong>
                  </span>
                  <button onClick={() => handleRefill(rx.id)}>
                    Refill
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}
