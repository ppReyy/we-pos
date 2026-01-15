import { createFileRoute } from '@tanstack/react-router'
import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useTRPC } from '../../integrations/trpc/react'
import { RoleGuard } from '../../components/RoleGuard'
import {
  DollarSign,
  TrendingUp,
  ShoppingCart,
  Users,
  Download,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  Calendar,
} from 'lucide-react'
import { Button } from '../../components/ui/button'

export const Route = createFileRoute('/dashboard/reports')({
  component: () => (
    <RoleGuard allowedRoles={['admin', 'manager']}>
      <ReportsPage />
    </RoleGuard>
  ),
})

// Helper to calculate date ranges
function getDateRange(range: 'today' | 'week' | 'month' | 'year') {
  const now = new Date()
  const end = new Date(now)
  end.setHours(23, 59, 59, 999)
  
  const start = new Date(now)
  start.setHours(0, 0, 0, 0)
  
  switch (range) {
    case 'today':
      // start is already today at 00:00
      break
    case 'week':
      start.setDate(start.getDate() - 6) // Last 7 days including today
      break
    case 'month':
      start.setDate(start.getDate() - 29) // Last 30 days
      break
    case 'year':
      start.setFullYear(start.getFullYear() - 1)
      start.setDate(start.getDate() + 1) // Last 365 days
      break
  }
  
  return {
    startDate: start.toISOString().split('T')[0],
    endDate: end.toISOString().split('T')[0],
  }
}

function ReportsPage() {
  const trpc = useTRPC()
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'year' | 'custom'>('today')
  const [customStart, setCustomStart] = useState<string>(() => {
    const d = new Date()
    d.setDate(d.getDate() - 7)
    return d.toISOString().split('T')[0]
  })
  const [customEnd, setCustomEnd] = useState<string>(() => new Date().toISOString().split('T')[0])

  // Calculate date range based on selection
  const { startDate, endDate } = useMemo(() => {
    if (dateRange === 'custom') {
      return { startDate: customStart, endDate: customEnd }
    }
    return getDateRange(dateRange)
  }, [dateRange, customStart, customEnd])
  const todayStr = new Date().toISOString().split('T')[0]

  // Fetch stats with comparison to previous period
  const { data: stats, isLoading: loadingStats } = useQuery(
    trpc.reports.getStatsWithComparison.queryOptions({ startDate, endDate })
  )

  // Fetch top products for the date range
  const { data: topProductsData = [], isLoading: loadingProducts } = useQuery(
    trpc.reports.getTopProducts.queryOptions({ limit: 5, startDate, endDate })
  )

  // Fetch sales by category for the date range
  const { data: salesByCategoryData = [], isLoading: loadingCategories } = useQuery(
    trpc.reports.getSalesByCategory.queryOptions({ startDate, endDate })
  )

  // Fetch hourly sales for today (shown when viewing "today")
  const { data: hourlySalesData = [], isLoading: loadingHourly } = useQuery(
    trpc.reports.getHourlySales.queryOptions({ date: todayStr })
  )

  // Fetch daily sales for week/month/year/custom views
  const { data: dailySalesData = [], isLoading: loadingDaily } = useQuery({
    ...trpc.reports.getDailySales.queryOptions({ startDate, endDate }),
    enabled: dateRange !== 'today',
  })

  // Calculate total for percentage
  const totalCategorySales = useMemo(() => 
    salesByCategoryData.reduce((sum, cat) => sum + (parseFloat(cat.totalRevenue as unknown as string) || 0), 0),
    [salesByCategoryData]
  )

  // Transform category data with percentages
  const salesByCategory = useMemo(() => 
    salesByCategoryData.map(cat => ({
      name: cat.categoryName,
      sales: parseFloat(cat.totalRevenue as unknown as string) || 0,
      percentage: totalCategorySales > 0 
        ? Math.round((parseFloat(cat.totalRevenue as unknown as string) || 0) / totalCategorySales * 100)
        : 0
    })),
    [salesByCategoryData, totalCategorySales]
  )

  // Transform top products
  const topProducts = useMemo(() => 
    topProductsData.map(p => ({
      name: p.productName,
      sales: p.totalQuantity || 0,
      revenue: parseFloat(p.totalRevenue as unknown as string) || 0,
    })),
    [topProductsData]
  )

  // Use hourly data for today, or aggregate daily data for other ranges
  const chartData = useMemo(() => {
    if (dateRange === 'today') {
      return hourlySalesData.map(h => ({
        label: h.label,
        sales: h.sales,
      }))
    }
    // For week/month/year, show daily data
    return dailySalesData.map(d => ({
      label: new Date(d.date).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      }),
      sales: d.sales,
    }))
  }, [dateRange, hourlySalesData, dailySalesData])

  const currentStats = useMemo(() => ({
    revenue: stats?.revenue || 0,
    revenueChange: stats?.revenueChange || 0,
    orders: stats?.orders || 0,
    ordersChange: stats?.ordersChange || 0,
    avgOrder: stats?.avgOrder || 0,
    avgOrderChange: stats?.avgOrderChange || 0,
    customers: stats?.customers || 0,
    customersChange: stats?.customersChange || 0,
  }), [stats])

  const maxSales = Math.max(...chartData.map((h) => h.sales), 1)

  const isLoading = loadingStats || loadingProducts || loadingCategories || 
    (dateRange === 'today' ? loadingHourly : loadingDaily)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Reports & Analytics</h1>
          <p className="text-gray-400">Track your restaurant performance</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-slate-800 rounded-lg border border-slate-700 p-1">
            {(['today', 'week', 'month', 'year', 'custom'] as const).map((range) => (
              <button
                key={range}
                type="button"
                onClick={() => setDateRange(range)}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                  dateRange === range
                    ? 'bg-cyan-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
          {dateRange === 'custom' && (
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
                max={customEnd}
                className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <span className="text-gray-400">to</span>
              <input
                type="date"
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
                min={customStart}
                max={new Date().toISOString().split('T')[0]}
                className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          )}
          <Button variant="outline" className="border-slate-700">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Revenue</p>
              <p className="text-2xl font-bold text-white mt-1">
                ${currentStats.revenue.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            {currentStats.revenueChange >= 0 ? (
              <ArrowUpRight className="w-4 h-4 text-green-400" />
            ) : (
              <ArrowDownRight className="w-4 h-4 text-red-400" />
            )}
            <span
              className={`text-sm ${currentStats.revenueChange >= 0 ? 'text-green-400' : 'text-red-400'}`}
            >
              {currentStats.revenueChange >= 0 ? '+' : ''}
              {currentStats.revenueChange}%
            </span>
            <span className="text-sm text-gray-500">vs previous period</span>
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Orders</p>
              <p className="text-2xl font-bold text-white mt-1">
                {currentStats.orders.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            {currentStats.ordersChange >= 0 ? (
              <ArrowUpRight className="w-4 h-4 text-green-400" />
            ) : (
              <ArrowDownRight className="w-4 h-4 text-red-400" />
            )}
            <span
              className={`text-sm ${currentStats.ordersChange >= 0 ? 'text-green-400' : 'text-red-400'}`}
            >
              {currentStats.ordersChange >= 0 ? '+' : ''}
              {currentStats.ordersChange}%
            </span>
            <span className="text-sm text-gray-500">vs previous period</span>
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-400">Avg Order Value</p>
              <p className="text-2xl font-bold text-white mt-1">
                ${currentStats.avgOrder.toFixed(2)}
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            {currentStats.avgOrderChange >= 0 ? (
              <ArrowUpRight className="w-4 h-4 text-green-400" />
            ) : (
              <ArrowDownRight className="w-4 h-4 text-red-400" />
            )}
            <span
              className={`text-sm ${currentStats.avgOrderChange >= 0 ? 'text-green-400' : 'text-red-400'}`}
            >
              {currentStats.avgOrderChange >= 0 ? '+' : ''}
              {currentStats.avgOrderChange}%
            </span>
            <span className="text-sm text-gray-500">vs previous period</span>
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Customers</p>
              <p className="text-2xl font-bold text-white mt-1">
                {currentStats.customers.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            {currentStats.customersChange >= 0 ? (
              <ArrowUpRight className="w-4 h-4 text-green-400" />
            ) : (
              <ArrowDownRight className="w-4 h-4 text-red-400" />
            )}
            <span
              className={`text-sm ${currentStats.customersChange >= 0 ? 'text-green-400' : 'text-red-400'}`}
            >
              {currentStats.customersChange >= 0 ? '+' : ''}
              {currentStats.customersChange}%
            </span>
            <span className="text-sm text-gray-500">vs previous period</span>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart - Hourly for today, Daily for other ranges */}
        <div className="lg:col-span-2 bg-slate-800 rounded-xl border border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            {dateRange === 'today' ? 'Hourly Sales' : 'Daily Sales'}
            <span className="text-sm font-normal text-gray-400 ml-2">
              ({startDate}{startDate !== endDate ? ` to ${endDate}` : ''})
            </span>
          </h2>
          {chartData.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-gray-500">
              <Calendar className="w-6 h-6 mr-2" />
              No sales data for this period
            </div>
          ) : (
            <div className="flex items-end gap-1 h-48 overflow-x-auto">
              {chartData.map((item) => (
                <div key={item.label} className="flex-1 min-w-[24px] flex flex-col items-center">
                  <div
                    className="w-full bg-gradient-to-t from-cyan-500 to-blue-500 rounded-t-sm transition-all hover:from-cyan-400 hover:to-blue-400"
                    style={{ height: `${(item.sales / maxSales) * 100}%`, minHeight: item.sales > 0 ? '4px' : '0' }}
                    title={`$${item.sales.toLocaleString()}`}
                  />
                  <span className="text-xs text-gray-500 mt-2 whitespace-nowrap">{item.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sales by Category */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-cyan-400" />
            Sales by Category
          </h2>
          {salesByCategory.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-gray-500">
              No category data for this period
            </div>
          ) : (
            <div className="space-y-3">
              {salesByCategory.map((category, index) => {
                const colors = [
                  'bg-cyan-500',
                  'bg-blue-500',
                  'bg-purple-500',
                  'bg-green-500',
                  'bg-orange-500',
                  'bg-pink-500',
                ]
                return (
                  <div key={category.name}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-300">{category.name}</span>
                      <span className="text-sm text-gray-400">
                        ${category.sales.toLocaleString()}
                      </span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${colors[index % colors.length]} transition-all`}
                        style={{ width: `${category.percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-slate-800 rounded-xl border border-slate-700">
        <div className="p-6 border-b border-slate-700">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-cyan-400" />
            Top Selling Products
            <span className="text-sm font-normal text-gray-400 ml-2">
              ({startDate}{startDate !== endDate ? ` to ${endDate}` : ''})
            </span>
          </h2>
        </div>
        {topProducts.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No product sales data for this period
          </div>
        ) : (
          <div className="divide-y divide-slate-700">
            {topProducts.map((product, index) => (
              <div
                key={product.name}
                className="p-4 flex items-center justify-between hover:bg-slate-700/30"
              >
                <div className="flex items-center gap-4">
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      index === 0
                        ? 'bg-yellow-500 text-black'
                        : index === 1
                          ? 'bg-gray-400 text-black'
                          : index === 2
                            ? 'bg-amber-700 text-white'
                            : 'bg-slate-600 text-gray-300'
                    }`}
                  >
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-medium text-white">{product.name}</p>
                    <p className="text-sm text-gray-400">{product.sales} orders</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-400">
                    ${product.revenue.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
