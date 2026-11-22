import React, { useEffect, useState } from 'react';
import { adminService } from '../../../api/adminService';
import { ContactMessageData } from '../../../types/api';

export function MessagesPanel() {
  const [messages, setMessages] = useState<ContactMessageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessageData | null>(null);

  const loadData = () => {
    adminService.getMessages().then((data) => {
      setMessages(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = async (id: number, newStatus: string) => {
    await adminService.updateMessageStatus(id, newStatus);
    loadData();
    if (selectedMessage && selectedMessage.id === id) {
      setSelectedMessage((prev) => (prev ? { ...prev, status: newStatus as any } : null));
    }
  };

  if (loading) return <div className="section-loading">Loading contact messages...</div>;

  return (
    <div className="admin-panel" style={{ maxWidth: '1000px' }}>
      <h2>Contact Messages</h2>
      <p style={{ fontSize: '0.88rem', color: 'var(--ink-soft)', marginBottom: '1.5rem' }}>
        Messages submitted by recruiters and visitors via the public contact form.
      </p>

      {messages.length === 0 ? (
        <div className="section-empty">No contact messages received yet.</div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Status</th>
              <th>From</th>
              <th>Email</th>
              <th>Message Preview</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((m) => (
              <tr
                key={m.id}
                style={{ cursor: 'pointer', background: selectedMessage?.id === m.id ? 'var(--navy-light)' : undefined }}
                onClick={() => setSelectedMessage(m)}
              >
                <td>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    padding: '2px 8px',
                    borderRadius: '4px',
                    background: m.status === 'UNREAD' ? '#fef3c7' : m.status === 'REPLIED' ? '#dcfce7' : '#f1f5f9',
                    color: m.status === 'UNREAD' ? '#92400e' : m.status === 'REPLIED' ? '#166534' : '#475569'
                  }}>
                    {m.status}
                  </span>
                </td>
                <td><strong>{m.senderName}</strong></td>
                <td><a href={`mailto:${m.senderEmail}`}>{m.senderEmail}</a></td>
                <td>
                  {m.message.length > 50 ? `${m.message.substring(0, 50)}...` : m.message}
                </td>
                <td style={{ fontSize: '0.8rem', color: 'var(--ink-soft)' }}>
                  {new Date(m.submittedAt).toLocaleDateString()}
                </td>
                <td onClick={(e) => e.stopPropagation()}>
                  {m.status === 'UNREAD' && (
                    <button
                      type="button"
                      className="btn btn--sm btn--outline"
                      onClick={() => handleStatusChange(m.id, 'READ')}
                    >
                      Mark Read
                    </button>
                  )}
                  {m.status !== 'REPLIED' && (
                    <button
                      type="button"
                      className="btn btn--sm btn--outline"
                      style={{ marginLeft: '0.25rem' }}
                      onClick={() => handleStatusChange(m.id, 'REPLIED')}
                    >
                      Mark Replied
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedMessage && (
        <div className="card" style={{ marginTop: '2rem', padding: '1.5rem', borderLeft: '4px solid var(--navy)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0, color: 'var(--navy)' }}>Message from {selectedMessage.senderName}</h3>
            <button
              type="button"
              className="btn btn--sm btn--outline"
              onClick={() => setSelectedMessage(null)}
            >
              Close
            </button>
          </div>
          <div style={{ marginBottom: '1rem', fontSize: '0.88rem', color: 'var(--ink-soft)' }}>
            <strong>Email:</strong> <a href={`mailto:${selectedMessage.senderEmail}`}>{selectedMessage.senderEmail}</a> |{' '}
            <strong>Submitted:</strong> {new Date(selectedMessage.submittedAt).toLocaleString()} |{' '}
            <strong>Status:</strong> {selectedMessage.status}
          </div>
          <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.8, fontSize: '0.95rem' }}>
            {selectedMessage.message}
          </div>
          <div style={{ marginTop: '1.5rem' }}>
            <a
              href={`mailto:${selectedMessage.senderEmail}?subject=Re: Portfolio Contact Inquiry`}
              className="btn btn--primary btn--sm"
            >
              Reply via Email
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

