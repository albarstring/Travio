import { useEffect, useMemo, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { DataTable } from '@/components/ui/data-table';
import { DownloadIcon, FileSpreadsheetIcon } from 'lucide-react';
import { fetchAdminMessages } from '../../services/adminApi';

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const messageColumns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => <p className="font-medium text-slate-900">{row.original.name}</p>,
      },
      {
        accessorKey: 'email',
        header: 'Email',
        cell: ({ row }) => <span className="text-slate-600">{row.original.email}</span>,
      },
      {
        accessorKey: 'phone',
        header: 'Phone',
        cell: ({ row }) => <span className="text-slate-600">{row.original.phone || '-'}</span>,
      },
      {
        accessorKey: 'company',
        header: 'Company',
        cell: ({ row }) => <span className="text-slate-600">{row.original.company || '-'}</span>,
      },
      {
        accessorKey: 'message',
        header: 'Message',
        cell: ({ row }) => (
          <p className="text-slate-700 max-w-[360px] truncate" title={row.original.message}>
            {row.original.message}
          </p>
        ),
      },
      {
        accessorKey: 'created_at',
        header: 'Date',
        cell: ({ row }) => (
          <span className="text-slate-500">{new Date(row.original.created_at).toLocaleString('id-ID')}</span>
        ),
      },
    ],
    []
  );

  const downloadBlobFile = (content, mimeType, filename) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  };

  const exportMessagesToCsv = () => {
    if (!messages.length) return;

    const headers = ['Name', 'Email', 'Phone', 'Company', 'Message', 'Created At'];
    const escapeCsv = (value) => `"${String(value || '').replace(/"/g, '""')}"`;

    const rows = messages.map((item) => [
      item.name,
      item.email,
      item.phone,
      item.company,
      item.message,
      new Date(item.created_at).toLocaleString('id-ID'),
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map(escapeCsv).join(','))
      .join('\n');

    downloadBlobFile(csvContent, 'text/csv;charset=utf-8;', 'contact-messages.csv');
  };

  const exportMessagesToExcel = () => {
    if (!messages.length) return;

    const escapeHtml = (value) =>
      String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');

    const rowsHtml = messages
      .map(
        (item) => `
          <tr>
            <td>${escapeHtml(item.name)}</td>
            <td>${escapeHtml(item.email)}</td>
            <td>${escapeHtml(item.phone)}</td>
            <td>${escapeHtml(item.company)}</td>
            <td>${escapeHtml(item.message)}</td>
            <td>${escapeHtml(new Date(item.created_at).toLocaleString('id-ID'))}</td>
          </tr>`
      )
      .join('');

    const excelHtml = `
      <html>
        <head>
          <meta charset="UTF-8" />
        </head>
        <body>
          <table border="1">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Company</th>
                <th>Message</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>${rowsHtml}</tbody>
          </table>
        </body>
      </html>`;

    downloadBlobFile(excelHtml, 'application/vnd.ms-excel;charset=utf-8;', 'contact-messages.xls');
  };

  useEffect(() => {
    const loadMessages = async () => {
      try {
        setError('');
        setLoading(true);
        const response = await fetchAdminMessages(1, 500);
        setMessages(response.data || []);
      } catch (err) {
        setError(err.message || 'Gagal memuat data message.');
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-indigo-50/35 to-white p-6 shadow-sm flex flex-wrap gap-4 items-end justify-between">
          <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-indigo-200/20 blur-3xl" />
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-indigo-600">Inbox</p>
            <h1 className="text-3xl font-bold text-slate-900 mt-1">Contact Messages</h1>
            <p className="text-slate-600 text-sm mt-1">Daftar pesan dari form contact website.</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={exportMessagesToCsv}
              disabled={!messages.length || loading}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-indigo-200 bg-white text-indigo-700 hover:bg-indigo-50 hover:border-indigo-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <DownloadIcon className="h-3.5 w-3.5" />
              Export CSV
            </button>
            <button
              type="button"
              onClick={exportMessagesToExcel}
              disabled={!messages.length || loading}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-indigo-200 bg-white text-indigo-700 hover:bg-indigo-50 hover:border-indigo-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FileSpreadsheetIcon className="h-3.5 w-3.5" />
              Export Excel
            </button>
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 text-rose-700 px-4 py-3 text-sm">
            {error}
          </div>
        )}

        <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md hover:shadow-indigo-100/40 transition-shadow duration-300">
          {loading ? (
            <div className="px-6 py-6 space-y-3">
              <div className="h-10 bg-slate-100 rounded-lg animate-pulse" />
              <div className="h-10 bg-slate-100 rounded-lg animate-pulse" />
              <div className="h-10 bg-slate-100 rounded-lg animate-pulse" />
            </div>
          ) : (
            <DataTable
              columns={messageColumns}
              data={messages}
              emptyMessage="Belum ada message masuk."
              filterColumnKey="name"
              filterPlaceholder="Cari nama pengirim..."
            />
          )}
        </section>
      </div>
    </AdminLayout>
  );
}
