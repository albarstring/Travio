import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { DataTable } from '@/components/ui/data-table';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { fetchAllBlogs } from '../../services/adminApi';

const PERIOD_OPTIONS = [
  { label: '7D', days: 7 },
  { label: '30D', days: 30 },
  { label: '90D', days: 90 },
];

const calcTrend = (current, previous) => {
  if (previous === 0) return current === 0 ? 0 : 100;
  return Math.round(((current - previous) / previous) * 100);
};

const StatCard = ({ label, value, color, icon, trend, loading }) => (
  <div className={`bg-white rounded-2xl p-6 border ${color} min-h-[132px]`}>
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <p className="text-sm text-gray-500 font-medium tracking-wide">{label}</p>
        {loading ? (
          <div className="mt-3 h-9 w-20 rounded-md bg-gray-200 animate-pulse" />
        ) : (
          <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
        )}

        {loading ? (
          <div className="mt-3 h-5 w-24 rounded-full bg-gray-200 animate-pulse" />
        ) : (
          <p
            className={`mt-3 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border ${
              trend > 0
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : trend < 0
                  ? 'bg-red-50 text-red-700 border-red-200'
                  : 'bg-gray-100 text-gray-700 border-gray-200'
            }`}
          >
            {trend > 0 ? `+${trend}%` : `${trend}%`} vs periode lalu
          </p>
        )}
      </div>
      <span className="text-2xl bg-gray-50 border border-gray-200 w-12 h-12 rounded-xl flex items-center justify-center">{icon}</span>
    </div>
  </div>
);

export default function AdminDashboard() {
  const [allPosts, setAllPosts] = useState([]);
  const [stats, setStats]     = useState({ total: 0, published: 0, draft: 0 });
  const [trends, setTrends]   = useState({ total: 0, published: 0, draft: 0 });
  const [recent, setRecent]   = useState([]);
  const [topVisitors, setTopVisitors] = useState([]);
  const [periodDays, setPeriodDays] = useState(30);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const recentColumns = useMemo(
    () => [
      {
        accessorKey: 'title',
        header: 'Title',
        cell: ({ row }) => (
          <p className="font-medium text-gray-900 max-w-xs truncate">{row.original.title}</p>
        ),
      },
      {
        accessorKey: 'author',
        header: 'Author',
        cell: ({ row }) => <span className="text-gray-600">{row.original.author}</span>,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => (
          <span
            className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
              row.original.status === 'published'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                : 'bg-amber-50 text-amber-700 border border-amber-100'
            }`}
          >
            {row.original.status}
          </span>
        ),
      },
      {
        accessorKey: 'created_at',
        header: 'Date',
        cell: ({ row }) => (
          <span className="text-gray-500">
            {new Date(row.original.created_at).toLocaleDateString()}
          </span>
        ),
      },
    ],
    []
  );

  useEffect(() => {
    const load = async () => {
      try {
        setError('');
        const all = await fetchAllBlogs(1, 200);
        setAllPosts(all.data || []);
      } catch (err) {
        setError(err.message || 'Gagal memuat data dashboard.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (!allPosts.length) {
      setStats({ total: 0, published: 0, draft: 0 });
      setTrends({ total: 0, published: 0, draft: 0 });
      setRecent([]);
      setTopVisitors([]);
      return;
    }

    const nowMs = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;
    const currentStart = nowMs - periodDays * dayMs;
    const previousStart = nowMs - periodDays * 2 * dayMs;

    const getMs = (value) => new Date(value).getTime();

    const currentPeriodPosts = allPosts.filter((item) => {
      const ts = getMs(item.created_at);
      return ts >= currentStart && ts <= nowMs;
    });

    const previousPeriodPosts = allPosts.filter((item) => {
      const ts = getMs(item.created_at);
      return ts >= previousStart && ts < currentStart;
    });

    const currentPublished = currentPeriodPosts.filter((item) => item.status === 'published').length;
    const currentDraft = currentPeriodPosts.filter((item) => item.status === 'draft').length;
    const previousPublished = previousPeriodPosts.filter((item) => item.status === 'published').length;
    const previousDraft = previousPeriodPosts.filter((item) => item.status === 'draft').length;

    setStats({
      total: currentPeriodPosts.length,
      published: currentPublished,
      draft: currentDraft,
    });

    setTrends({
      total: calcTrend(currentPeriodPosts.length, previousPeriodPosts.length),
      published: calcTrend(currentPublished, previousPublished),
      draft: calcTrend(currentDraft, previousDraft),
    });

    const visitorData = [...currentPeriodPosts]
      .filter((item) => item.status === 'published')
      .sort((a, b) => (b.views_count || 0) - (a.views_count || 0))
      .slice(0, 7)
      .map((item) => ({
        title: item.title,
        shortTitle: item.title.length > 22 ? `${item.title.slice(0, 22)}...` : item.title,
        views: item.views_count || 0,
      }));

    const recentData = [...currentPeriodPosts]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 5);

    setTopVisitors(visitorData);
    setRecent(recentData);
  }, [allPosts, periodDays]);

  const periodLabel = useMemo(() => {
    const selected = PERIOD_OPTIONS.find((option) => option.days === periodDays);
    return selected ? `${selected.days} hari terakhir` : 'periode aktif';
  }, [periodDays]);

  return (
    <AdminLayout>
      <div className="mb-8 pb-6 border-b border-gray-100 flex flex-wrap gap-4 items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-2">Ringkasan performa blog untuk {periodLabel}.</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {PERIOD_OPTIONS.map((option) => (
            <button
              key={option.days}
              type="button"
              onClick={() => setPeriodDays(option.days)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                periodDays === option.days
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-gray-500'
              }`}
            >
              {option.label}
            </button>
          ))}
          <Link
            to="/admin/blogs"
            className="ml-1 px-3 py-1.5 rounded-lg text-xs font-semibold border border-gray-300 text-gray-700 hover:border-gray-500 transition"
          >
            + New Post
          </Link>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <StatCard label="Total Posts" value={stats.total} trend={trends.total} loading={loading} color="border-gray-200" icon="📝" />
        <StatCard label="Published" value={stats.published} trend={trends.published} loading={loading} color="border-gray-200" icon="✅" />
        <StatCard label="Drafts" value={stats.draft} trend={trends.draft} loading={loading} color="border-gray-200" icon="📋" />
      </div>

      {/* Visitors Chart */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Top Pengunjung per Post</h2>
          <p className="text-sm text-gray-500 mt-1">Berdasarkan jumlah kunjungan halaman artikel publik.</p>
        </div>

        {loading ? (
          <div className="p-4 md:p-6">
            <div className="h-[320px] rounded-xl bg-gray-100 animate-pulse" />
          </div>
        ) : topVisitors.length === 0 ? (
          <p className="text-center text-gray-400 py-10 text-sm">Belum ada data kunjungan untuk periode ini.</p>
        ) : (
          <div className="p-4 md:p-6">
            <ChartContainer className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topVisitors} margin={{ top: 10, right: 20, left: 0, bottom: 70 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="shortTitle"
                    angle={-28}
                    textAnchor="end"
                    interval={0}
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    height={80}
                  />
                  <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} allowDecimals={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="views" radius={[6, 6, 0, 0]} fill="#111827" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        )}
      </div>

      {/* Recent Posts */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Recent Posts</h2>
          <Link to="/admin/blogs" className="text-sm text-gray-600 hover:text-gray-900 transition">View all →</Link>
        </div>

        {loading ? (
          <div className="px-6 py-6 space-y-3">
            <div className="h-10 bg-gray-100 rounded-lg animate-pulse" />
            <div className="h-10 bg-gray-100 rounded-lg animate-pulse" />
            <div className="h-10 bg-gray-100 rounded-lg animate-pulse" />
            <div className="h-10 bg-gray-100 rounded-lg animate-pulse" />
          </div>
        ) : (
          <DataTable
            columns={recentColumns}
            data={recent}
            emptyMessage="No posts in selected period."
            filterColumnKey="title"
            filterPlaceholder="Search post title..."
          />
        )}
      </div>
    </AdminLayout>
  );
}
