import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { DataTable } from '@/components/ui/data-table';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { BarChart3Icon, CheckCircle2Icon, FileClockIcon, FileTextIcon, PlusIcon } from 'lucide-react';
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

const StatCard = ({ label, value, trend, loading, icon }) => {
  const Icon = icon;

  return (
    <div className="group rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-100/60">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">{label}</p>

          {loading ? (
            <div className="mt-3 h-9 w-20 rounded-md bg-slate-200 animate-pulse" />
          ) : (
            <p className="text-3xl font-bold leading-tight text-slate-900 mt-2">{value}</p>
          )}
        </div>

        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-100 text-indigo-600 bg-indigo-50/70 transition-colors duration-300 group-hover:bg-indigo-100">
          <Icon className="h-4.5 w-4.5" />
        </span>
      </div>

      {loading ? (
        <div className="mt-4 h-4 w-32 rounded-md bg-slate-200 animate-pulse" />
      ) : (
        <p
          className={`mt-4 text-xs font-medium leading-5 ${
            trend > 0 ? 'text-emerald-600' : trend < 0 ? 'text-rose-600' : 'text-slate-500'
          }`}
        >
          {trend > 0 ? `+${trend}%` : `${trend}%`} dibanding periode sebelumnya
        </p>
      )}
    </div>
  );
};

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
      <div className="space-y-7">
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-indigo-50/40 to-white p-6 md:p-7 shadow-sm">
          <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-indigo-200/25 blur-3xl" />
          <div className="pointer-events-none absolute -left-24 -bottom-24 h-52 w-52 rounded-full bg-sky-200/20 blur-3xl" />
          <div className="flex flex-wrap gap-4 items-end justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-indigo-600">Overview</p>
              <h1 className="text-3xl md:text-[34px] font-bold leading-tight text-slate-900 mt-1">Dashboard</h1>
              <p className="text-slate-600 text-sm md:text-[15px] leading-7 mt-1.5 max-w-2xl">Ringkasan performa konten untuk {periodLabel} dengan metrik yang cepat dipindai.</p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <div className="inline-flex items-center rounded-xl border border-indigo-100 p-1.5 bg-white shadow-sm">
                {PERIOD_OPTIONS.map((option) => (
                  <button
                    key={option.days}
                    type="button"
                    onClick={() => setPeriodDays(option.days)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-white border-gray-300 transition-all duration-200 ${
                      periodDays === option.days
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              <Link
                to="/admin/blogs"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-indigo-200 text-indigo-700 bg-white hover:bg-indigo-50 hover:border-indigo-300 transition-all duration-200"
              >
                <PlusIcon className="h-3.5 w-3.5" />
                New Post
              </Link>
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-rose-200 bg-rose-50/70 text-rose-700 px-4 py-3 text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <StatCard
            label="Total Posts"
            value={stats.total}
            trend={trends.total}
            loading={loading}
            icon={FileTextIcon}
          />
          <StatCard
            label="Published"
            value={stats.published}
            trend={trends.published}
            loading={loading}
            icon={CheckCircle2Icon}
          />
          <StatCard
            label="Drafts"
            value={stats.draft}
            trend={trends.draft}
            loading={loading}
            icon={FileClockIcon}
          />
        </div>

        <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md hover:shadow-indigo-100/40 transition-shadow duration-300">
          <div className="px-5 md:px-6 py-4 border-b border-slate-100 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="font-semibold text-slate-900 inline-flex items-center gap-2 text-[15px]">
                <BarChart3Icon className="h-4 w-4 text-indigo-600" />
                Top Pengunjung per Post
              </h2>
              <p className="text-sm text-slate-500 leading-6 mt-1">Artikel publik dengan kunjungan tertinggi di periode terpilih.</p>
            </div>
          </div>

          {loading ? (
            <div className="p-5 md:p-6">
              <div className="h-[300px] rounded-xl bg-slate-100 animate-pulse" />
            </div>
          ) : topVisitors.length === 0 ? (
            <p className="text-center text-slate-400 py-12 text-sm">Belum ada data kunjungan untuk periode ini.</p>
          ) : (
            <div className="p-5 md:p-6">
              <ChartContainer className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topVisitors} margin={{ top: 8, right: 12, left: 0, bottom: 66 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis
                      dataKey="shortTitle"
                      angle={-24}
                      textAnchor="end"
                      interval={0}
                      tick={{ fill: '#64748b', fontSize: 12 }}
                      height={76}
                    />
                    <YAxis tick={{ fill: '#64748b', fontSize: 12 }} allowDecimals={false} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="views" radius={[8, 8, 0, 0]} fill="#4f46e5" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          )}
        </section>

        <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md hover:shadow-indigo-100/40 transition-shadow duration-300">
          <div className="flex items-center justify-between px-5 md:px-6 py-4 border-b border-slate-100">
            <div>
              <h2 className="font-semibold text-slate-900 text-[15px]">Recent Posts</h2>
              <p className="text-xs text-slate-500 mt-1">Post terbaru pada periode aktif</p>
            </div>
            <Link to="/admin/blogs" className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors">View all</Link>
          </div>

          {loading ? (
            <div className="px-6 py-6 space-y-3">
              <div className="h-10 bg-black-100 rounded-lg animate-pulse" />
              <div className="h-10 bg-slate-100 rounded-lg animate-pulse" />
              <div className="h-10 bg-slate-100 rounded-lg animate-pulse" />
              <div className="h-10 bg-slate-100 rounded-lg animate-pulse" />
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
        </section>
      </div>
    </AdminLayout>
  );
}
