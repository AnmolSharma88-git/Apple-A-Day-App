import { useEffect, useMemo, useState } from "react"

import {
  BarChart3,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  IndianRupee,
  Lightbulb,
  Package,
  RefreshCw,
  ShoppingBag,
  Truck,
  Utensils,
  X,
} from "lucide-react"

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { getAnalyticsData } from "../../../services/analyticsService"

/* =========================================================
   DATE PRESETS
========================================================= */

const DATE_PRESETS = {
  TODAY: "TODAY",
  YESTERDAY: "YESTERDAY",
  LAST_7_DAYS: "LAST_7_DAYS",
  LAST_30_DAYS: "LAST_30_DAYS",
  THIS_MONTH: "THIS_MONTH",
  LAST_MONTH: "LAST_MONTH",
  LAST_3_MONTHS: "LAST_3_MONTHS",
  CUSTOM: "CUSTOM",
}

/* =========================================================
   MAIN PAGE
========================================================= */

function Analytics() {
  const [analytics, setAnalytics] =
    useState(null)

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState("")

  const [datePreset, setDatePreset] =
    useState(
      DATE_PRESETS.LAST_3_MONTHS
    )

  const [orderType, setOrderType] =
    useState("ALL")

  const [category, setCategory] =
    useState("ALL")

  const [item, setItem] =
    useState("ALL")

  const [customStartDate, setCustomStartDate] =
    useState("")

  const [customEndDate, setCustomEndDate] =
    useState("")

  const [insight, setInsight] =
    useState(null)

  useEffect(() => {
    loadAnalytics()
  }, [
    datePreset,
    orderType,
    category,
    item,
    customStartDate,
    customEndDate,
  ])

  async function loadAnalytics() {
    try {
      setLoading(true)
      setError("")

      const dates = getPresetDates(
        datePreset,
        customStartDate,
        customEndDate
      )

      const data =
        await getAnalyticsData({
          startDate: dates.startDate,
          endDate: dates.endDate,
          orderType,
          category,
          item,
        })

      setAnalytics(data)
    } catch (err) {
      console.error(
        "Analytics error:",
        err
      )

      setError(
        "Unable to load analytics data."
      )
    } finally {
      setLoading(false)
    }
  }

  const itemOptions = useMemo(() => {
    const names = new Set()

    analytics?.popularItems?.forEach(
      (item) => {
        names.add(item.name)
      }
    )

    return [...names]
  }, [analytics])

  const insights = useMemo(() => {
    if (!analytics) {
      return {}
    }

    const peakHour =
      [...(analytics.peakHours || [])].sort(
        (a, b) => b.count - a.count
      )[0]

    const busiestDay =
      [...(analytics.busiestDays || [])].sort(
        (a, b) => b.count - a.count
      )[0]

    const bestItem =
      analytics.popularItems?.[0]

    const leastItem =
      analytics.leastItems?.[0]

    const preferredType =
      [...(analytics.orderTypeData || [])].sort(
        (a, b) => b.count - a.count
      )[0]

    const topCategory =
      [...(analytics.categoryRevenue || [])].sort(
        (a, b) => b.revenue - a.revenue
      )[0]

    const bestRevenueDay =
      [...(analytics.revenueTrend || [])].sort(
        (a, b) => b.revenue - a.revenue
      )[0]

    const preferredPayment =
      [...(analytics.paymentData || [])].sort(
        (a, b) => b.count - a.count
      )[0]

    return {
      peakHour,
      busiestDay,
      bestItem,
      leastItem,
      preferredType,
      topCategory,
      bestRevenueDay,
      preferredPayment,
    }
  }, [analytics])

  if (loading) {
    return <LoadingState />
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#faf8f3] p-6">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5">
            <p className="text-sm font-semibold text-rose-700">
              {error}
            </p>

            <button
              type="button"
              onClick={loadAnalytics}
              className="mt-3 rounded-lg bg-white px-4 py-2 text-xs font-semibold text-rose-700"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!analytics) {
    return null
  }

  return (
    <div className="min-h-screen bg-[#faf8f3]">
      {/* =================================================
          HEADER
      ================================================= */}

      <header className="border-b border-[#e7e1d6] bg-[#f3eee5]">
        <div className="mx-auto max-w-[1500px] px-5 py-5 sm:px-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#718176]">
                Café insights
              </p>

              <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#193528]">
                Analytics
              </h1>

              <p className="mt-1 text-xs text-[#777269]">
                Understand orders, revenue and
                customer preferences.
              </p>
            </div>

            <button
              type="button"
              onClick={loadAnalytics}
              className="flex w-fit items-center gap-2 rounded-xl border border-[#d8d1c5] bg-white px-3.5 py-2 text-xs font-semibold text-[#1f4635] shadow-sm transition hover:bg-[#f8f5ef]"
            >
              <RefreshCw size={14} />
              Refresh
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1500px] space-y-5 p-5 sm:p-6">
        {/* =================================================
            FILTERS
        ================================================= */}

        <section className="rounded-2xl border border-[#e5dfd4] bg-white p-4 shadow-sm">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <FilterSelect
              label="Date range"
              value={datePreset}
              onChange={(event) =>
                setDatePreset(
                  event.target.value
                )
              }
              options={[
                ["TODAY", "Today"],
                [
                  "YESTERDAY",
                  "Yesterday",
                ],
                [
                  "LAST_7_DAYS",
                  "Last 7 days",
                ],
                [
                  "LAST_30_DAYS",
                  "Last 30 days",
                ],
                [
                  "THIS_MONTH",
                  "This month",
                ],
                [
                  "LAST_MONTH",
                  "Last month",
                ],
                [
                  "LAST_3_MONTHS",
                  "Last 3 months",
                ],
                [
                  "CUSTOM",
                  "Custom range",
                ],
              ]}
            />

            <FilterSelect
              label="Order type"
              value={orderType}
              onChange={(event) =>
                setOrderType(
                  event.target.value
                )
              }
              options={[
                ["ALL", "All orders"],
                ["PICKUP", "Pickup"],
                [
                  "DELIVERY",
                  "Delivery",
                ],
              ]}
            />

            <FilterSelect
              label="Category"
              value={category}
              onChange={(event) =>
                setCategory(
                  event.target.value
                )
              }
              options={[
                ["ALL", "All categories"],
                ["FOOD", "Food"],
                [
                  "BEVERAGES",
                  "Beverages",
                ],
                ["SNACKS", "Snacks"],
                [
                  "DESSERTS",
                  "Desserts",
                ],
              ]}
            />

            <FilterSelect
              label="Item"
              value={item}
              onChange={(event) =>
                setItem(
                  event.target.value
                )
              }
              options={[
                ["ALL", "All items"],
                ...itemOptions.map(
                  (name) => [name, name]
                ),
              ]}
            />

            <button
              type="button"
              onClick={() => {
                setDatePreset(
                  DATE_PRESETS.LAST_3_MONTHS
                )

                setOrderType("ALL")
                setCategory("ALL")
                setItem("ALL")

                setCustomStartDate("")
                setCustomEndDate("")
              }}
              className="mt-auto h-10 rounded-xl border border-[#ddd6ca] bg-[#faf8f3] px-4 text-xs font-semibold text-[#625f58] transition hover:bg-[#f2eee6]"
            >
              Reset filters
            </button>
          </div>

          {datePreset === "CUSTOM" && (
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <DateInput
                label="Start date"
                value={customStartDate}
                onChange={(event) =>
                  setCustomStartDate(
                    event.target.value
                  )
                }
              />

              <DateInput
                label="End date"
                value={customEndDate}
                onChange={(event) =>
                  setCustomEndDate(
                    event.target.value
                  )
                }
              />
            </div>
          )}
        </section>

        {/* =================================================
            KPI GRID
        ================================================= */}

        <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <MetricCard
            title="Revenue"
            value={`₹${formatNumber(
              analytics.overview.totalRevenue
            )}`}
            icon={IndianRupee}
          />

          <MetricCard
            title="Orders"
            value={
              analytics.overview.totalOrders
            }
            icon={ShoppingBag}
          />

          <MetricCard
            title="Avg. order"
            value={`₹${Math.round(
              analytics.overview
                .averageOrderValue
            )}`}
            icon={BarChart3}
          />

          <MetricCard
            title="Completion"
            value={`${Math.round(
              analytics.overview
                .completionRate
            )}%`}
            icon={CheckCircle2}
          />
        </section>

        {/* =================================================
            ROW 1 — IMPORTANT REVENUE CHART
        ================================================= */}

        <ChartCard
          title="Revenue trend"
          icon={IndianRupee}
          insightTitle="Best revenue day"
          insightValue={
            insights.bestRevenueDay?.date ||
            "—"
          }
          insightText={
            insights.bestRevenueDay
              ? `₹${formatNumber(
                  insights.bestRevenueDay
                    .revenue
                )}`
              : "No data"
          }
          onInsights={() =>
            setInsight({
              title: "Revenue insights",
              items: [
                `Total revenue: ₹${formatNumber(
                  analytics.overview
                    .totalRevenue
                )}`,
                `Average order value: ₹${Math.round(
                  analytics.overview
                    .averageOrderValue
                )}`,
                `Best revenue day: ${
                  insights.bestRevenueDay
                    ?.date || "No data"
                }`,
              ],
            })
          }
        >
          <RevenueChart
            data={
              analytics.revenueTrend
            }
          />
        </ChartCard>

        {/* =================================================
            ROW 2 — TWO MEDIUM CHARTS
        ================================================= */}

        <div className="grid gap-5 xl:grid-cols-2">
          <ChartCard
            title="Order volume"
            icon={ShoppingBag}
            insightTitle="Busiest day"
            insightValue={
              insights.busiestDay?.date ||
              "—"
            }
            insightText={
              insights.busiestDay
                ? `${insights.busiestDay.count} orders`
                : "No data"
            }
            onInsights={() =>
              setInsight({
                title: "Order volume insights",
                items: [
                  `Total orders: ${analytics.overview.totalOrders}`,
                  `Busiest day: ${
                    insights.busiestDay
                      ?.date || "No data"
                  }`,
                  `Peak hour: ${
                    insights.peakHour
                      ? formatHour(
                          insights
                            .peakHour
                            .hour
                        )
                      : "No data"
                  }`,
                ],
              })
            }
          >
            <BusiestDaysChart
              data={
                analytics.busiestDays
              }
            />
          </ChartCard>

          <ChartCard
            title="Peak ordering hours"
            icon={Package}
            insightTitle="Peak hour"
            insightValue={
              insights.peakHour
                ? formatHour(
                    insights.peakHour.hour
                  )
                : "—"
            }
            insightText={
              insights.peakHour
                ? `${insights.peakHour.count} orders`
                : "No data"
            }
            onInsights={() =>
              setInsight({
                title: "Peak hour insights",
                items: [
                  `Peak hour: ${
                    insights.peakHour
                      ? formatHour(
                          insights
                            .peakHour
                            .hour
                        )
                      : "No data"
                  }`,
                  `Orders during peak: ${
                    insights.peakHour
                      ?.count || 0
                  }`,
                  "Useful for staffing and preparation planning.",
                ],
              })
            }
          >
            <PeakHoursChart
              data={
                analytics.peakHours
              }
            />
          </ChartCard>
        </div>

        {/* =================================================
            ROW 3 — SMALLER ANALYSIS CARDS
        ================================================= */}

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <MiniAnalysisCard
            title="Best seller"
            icon={Utensils}
            value={
              insights.bestItem?.name ||
              "—"
            }
            secondary={
              insights.bestItem
                ? `${insights.bestItem.quantity} sold`
                : "No data"
            }
            onClick={() =>
              setInsight({
                title: "Best seller",
                items: [
                  `Item: ${
                    insights.bestItem
                      ?.name || "No data"
                  }`,
                  `Units sold: ${
                    insights.bestItem
                      ?.quantity || 0
                  }`,
                  `Revenue: ₹${formatNumber(
                    insights.bestItem
                      ?.revenue
                  )}`,
                ],
              })
            }
          />

          <MiniAnalysisCard
            title="Least seller"
            icon={Package}
            value={
              insights.leastItem?.name ||
              "—"
            }
            secondary={
              insights.leastItem
                ? `${insights.leastItem.quantity} sold`
                : "No data"
            }
            onClick={() =>
              setInsight({
                title: "Least selling item",
                items: [
                  `Item: ${
                    insights.leastItem
                      ?.name || "No data"
                  }`,
                  `Units sold: ${
                    insights.leastItem
                      ?.quantity || 0
                  }`,
                  "Consider reviewing pricing, placement or availability.",
                ],
              })
            }
          />

          <MiniAnalysisCard
            title="Top category"
            icon={Utensils}
            value={
              insights.topCategory
                ? formatLabel(
                    insights.topCategory
                      .category
                  )
                : "—"
            }
            secondary={
              insights.topCategory
                ? `₹${formatNumber(
                    insights.topCategory
                      .revenue
                  )}`
                : "No data"
            }
            onClick={() =>
              setInsight({
                title: "Top category",
                items: [
                  `Category: ${
                    insights.topCategory
                      ? formatLabel(
                          insights
                            .topCategory
                            .category
                        )
                      : "No data"
                  }`,
                  `Revenue: ₹${formatNumber(
                    insights.topCategory
                      ?.revenue
                  )}`,
                  `Units sold: ${
                    insights.topCategory
                      ?.quantity || 0
                  }`,
                ],
              })
            }
          />

          <MiniAnalysisCard
            title="Preferred order"
            icon={Truck}
            value={
              insights.preferredType
                ? formatLabel(
                    insights
                      .preferredType
                      .type
                  )
                : "—"
            }
            secondary={
              insights.preferredType
                ? `${insights.preferredType.count} orders`
                : "No data"
            }
            onClick={() =>
              setInsight({
                title: "Order type insights",
                items: [
                  `Preferred type: ${
                    insights.preferredType
                      ? formatLabel(
                          insights
                            .preferredType
                            .type
                        )
                      : "No data"
                  }`,
                  `Orders: ${
                    insights.preferredType
                      ?.count || 0
                  }`,
                  `Delivery orders: ${
                    analytics.operations
                      .deliveryOrders
                  }`,
                ],
              })
            }
          />
        </div>

        {/* =================================================
            ROW 4 — SALES + CATEGORY
        ================================================= */}

        <div className="grid gap-5 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <ChartCard
              title="Top selling items"
              icon={Utensils}
              insightTitle="Best seller"
              insightValue={
                insights.bestItem?.name ||
                "—"
              }
              insightText={
                insights.bestItem
                  ? `${insights.bestItem.quantity} sold`
                  : "No data"
              }
              onInsights={() =>
                setInsight({
                  title: "Item performance",
                  items: [
                    `Best seller: ${
                      insights.bestItem
                        ?.name || "No data"
                    }`,
                    `Least seller: ${
                      insights.leastItem
                        ?.name || "No data"
                    }`,
                    `Items analysed: ${
                      analytics
                        .popularItems
                        ?.length || 0
                    }`,
                  ],
                })
              }
            >
              <PopularItemsChart
                data={
                  analytics.popularItems
                }
              />
            </ChartCard>
          </div>

          <ChartCard
            title="Revenue by category"
            icon={IndianRupee}
            insightTitle="Top category"
            insightValue={
              insights.topCategory
                ? formatLabel(
                    insights.topCategory
                      .category
                  )
                : "—"
            }
            insightText={
              insights.topCategory
                ? `₹${formatNumber(
                    insights.topCategory
                      .revenue
                  )}`
                : "No data"
            }
            onInsights={() =>
              setInsight({
                title: "Category insights",
                items: [
                  `Top category: ${
                    insights.topCategory
                      ? formatLabel(
                          insights
                            .topCategory
                            .category
                        )
                      : "No data"
                  }`,
                  `Revenue: ₹${formatNumber(
                    insights.topCategory
                      ?.revenue
                  )}`,
                  "Use category performance to decide menu focus.",
                ],
              })
            }
          >
            <CategoryChart
              data={
                analytics.categoryRevenue
              }
            />
          </ChartCard>
        </div>

        {/* =================================================
            ROW 5 — CATEGORY TOP ITEMS
        ================================================= */}

        <section className="rounded-2xl border border-[#e5dfd4] bg-white p-5 shadow-sm">
          <SectionHeader
            title="Top item by category"
            icon={Utensils}
            onInsights={() =>
              setInsight({
                title: "Category item insights",
                items:
                  analytics.categoryItems?.map(
                    (categoryItem) =>
                      `${formatLabel(
                        categoryItem.category
                      )}: ${
                        categoryItem
                          .topItem
                          ?.name ||
                        "No sales"
                      }`
                  ) || [],
              })
            }
          />

          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {analytics.categoryItems?.map(
              (categoryItem) => (
                <CategoryItemCard
                  key={
                    categoryItem.category
                  }
                  categoryItem={
                    categoryItem
                  }
                />
              )
            )}
          </div>
        </section>

        {/* =================================================
            ROW 6 — ORDER TYPE + PAYMENT + STATUS
        ================================================= */}

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <ChartCard
            title="Pickup vs delivery"
            icon={Truck}
            insightTitle="Preferred"
            insightValue={
              insights.preferredType
                ? formatLabel(
                    insights
                      .preferredType
                      .type
                  )
                : "—"
            }
            insightText={
              insights.preferredType
                ? `${insights.preferredType.count} orders`
                : "No data"
            }
            onInsights={() =>
              setInsight({
                title: "Pickup vs delivery",
                items: [
                  `Pickup: ${
                    analytics.operations
                      .pickupOrders
                  } orders`,
                  `Delivery: ${
                    analytics.operations
                      .deliveryOrders
                  } orders`,
                  `Preferred: ${
                    insights.preferredType
                      ? formatLabel(
                          insights
                            .preferredType
                            .type
                        )
                      : "No data"
                  }`,
                ],
              })
            }
          >
            <OrderTypeChart
              data={
                analytics.orderTypeData
              }
            />
          </ChartCard>

          <ChartCard
            title="Payment methods"
            icon={IndianRupee}
            insightTitle="Most used"
            insightValue={
              insights.preferredPayment
                ? formatLabel(
                    insights
                      .preferredPayment
                      .method
                  )
                : "—"
            }
            insightText={
              insights.preferredPayment
                ? `${insights.preferredPayment.count} payments`
                : "No data"
            }
            onInsights={() =>
              setInsight({
                title: "Payment insights",
                items:
                  analytics.paymentData?.map(
                    (payment) =>
                      `${formatLabel(
                        payment.method
                      )}: ${payment.count} payments`
                  ) || [],
              })
            }
          >
            <PaymentChart
              data={
                analytics.paymentData
              }
            />
          </ChartCard>

          <ChartCard
            title="Order status"
            icon={Package}
            insightTitle="Active"
            insightValue={
              analytics.operations
                .activeOrders
            }
            insightText="orders in progress"
            onInsights={() =>
              setInsight({
                title: "Order status insights",
                items:
                  analytics.statusData?.map(
                    (status) =>
                      `${status.label}: ${status.count}`
                  ) || [],
              })
            }
          >
            <StatusChart
              data={
                analytics.statusData
              }
            />
          </ChartCard>
        </div>

        {/* =================================================
            ROW 7 — COMPACT OPERATIONS
        ================================================= */}

        <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <SmallStat
            label="Pending"
            value={
              analytics.operations
                .pendingOrders
            }
          />

          <SmallStat
            label="Active"
            value={
              analytics.operations
                .activeOrders
            }
          />

          <SmallStat
            label="Delivered"
            value={
              analytics.operations
                .deliveredOrders
            }
          />

          <SmallStat
            label="Delivery completion"
            value={`${Math.round(
              analytics.operations
                .deliveryCompletionRate
            )}%`}
          />
        </section>
      </main>

      {/* =================================================
          INSIGHT MODAL
      ================================================= */}

      {insight && (
        <InsightModal
          insight={insight}
          onClose={() =>
            setInsight(null)
          }
        />
      )}
    </div>
  )
}

/* =========================================================
   FILTER COMPONENT
========================================================= */

function FilterSelect({
  label,
  value,
  onChange,
  options,
}) {
  return (
    <label>
      <span className="mb-1.5 block text-[9px] font-bold uppercase tracking-[0.14em] text-[#858078]">
        {label}
      </span>

      <select
        value={value}
        onChange={onChange}
        className="h-10 w-full rounded-xl border border-[#ddd7cb] bg-white px-3 text-xs font-medium text-[#403e39] outline-none transition focus:border-[#62816c]"
      >
        {options.map(
          ([optionValue, optionLabel]) => (
            <option
              key={optionValue}
              value={optionValue}
            >
              {optionLabel}
            </option>
          )
        )}
      </select>
    </label>
  )
}

function DateInput({
  label,
  value,
  onChange,
}) {
  return (
    <label>
      <span className="mb-1.5 block text-[9px] font-bold uppercase tracking-[0.14em] text-[#858078]">
        {label}
      </span>

      <input
        type="date"
        value={value}
        onChange={onChange}
        className="h-10 w-full rounded-xl border border-[#ddd7cb] bg-white px-3 text-xs outline-none focus:border-[#62816c]"
      />
    </label>
  )
}

/* =========================================================
   METRIC CARD
========================================================= */

function MetricCard({
  title,
  value,
  icon: Icon,
}) {
  return (
    <div className="rounded-2xl border border-[#e5dfd4] bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#eaf1eb] text-[#1f4635]">
          <Icon size={16} />
        </div>

        <span className="text-[9px] font-bold uppercase tracking-wider text-[#aaa49a]">
          KPI
        </span>
      </div>

      <p className="mt-4 text-[9px] font-bold uppercase tracking-[0.13em] text-[#858078]">
        {title}
      </p>

      <p className="mt-1 text-xl font-bold tracking-tight text-[#193528]">
        {value}
      </p>
    </div>
  )
}

/* =========================================================
   CHART CARD
========================================================= */

function ChartCard({
  title,
  icon: Icon,
  insightTitle,
  insightValue,
  insightText,
  onInsights,
  children,
}) {
  return (
    <section className="rounded-2xl border border-[#e5dfd4] bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#eaf1eb] text-[#1f4635]">
            <Icon size={15} />
          </div>

          <h2 className="truncate text-sm font-bold text-[#193528]">
            {title}
          </h2>
        </div>

        <button
          type="button"
          onClick={onInsights}
          className="flex shrink-0 items-center gap-1 rounded-lg border border-[#dfe7df] bg-[#f4f8f4] px-2 py-1.5 text-[9px] font-bold text-[#41634e] transition hover:bg-[#eaf1eb]"
        >
          <Lightbulb size={11} />
          Insights
        </button>
      </div>

      <div className="mt-3 flex flex-col gap-3 sm:flex-row">
        <div className="min-w-0 flex-1">
          {children}
        </div>

        <div className="hidden w-28 shrink-0 rounded-xl bg-[#f5f8f5] p-2.5 sm:block">
          <p className="text-[8px] font-bold uppercase tracking-wide text-[#829087]">
            {insightTitle}
          </p>

          <p className="mt-1 truncate text-xs font-bold text-[#1f4635]">
            {insightValue}
          </p>

          <p className="mt-0.5 line-clamp-2 text-[9px] leading-4 text-[#777269]">
            {insightText}
          </p>
        </div>
      </div>
    </section>
  )
}

/* =========================================================
   MINI ANALYSIS CARD
========================================================= */

function MiniAnalysisCard({
  title,
  icon: Icon,
  value,
  secondary,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group rounded-2xl border border-[#e5dfd4] bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-[#cbd8cd] hover:shadow-md"
    >
      <div className="flex items-center justify-between">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f0f4ef] text-[#42634e]">
          <Icon size={15} />
        </div>

        <Lightbulb
          size={13}
          className="text-[#aaa49a] transition group-hover:text-[#62816c]"
        />
      </div>

      <p className="mt-4 text-[9px] font-bold uppercase tracking-[0.13em] text-[#858078]">
        {title}
      </p>

      <p className="mt-1 truncate text-base font-bold text-[#193528]">
        {value}
      </p>

      <p className="mt-0.5 text-[10px] text-[#777269]">
        {secondary}
      </p>
    </button>
  )
}

/* =========================================================
   SECTION HEADER
========================================================= */

function SectionHeader({
  title,
  icon: Icon,
  onInsights,
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#eaf1eb] text-[#1f4635]">
          <Icon size={15} />
        </div>

        <h2 className="text-sm font-bold text-[#193528]">
          {title}
        </h2>
      </div>

      <button
        type="button"
        onClick={onInsights}
        className="flex items-center gap-1 rounded-lg border border-[#dfe7df] bg-[#f4f8f4] px-2 py-1.5 text-[9px] font-bold text-[#41634e]"
      >
        <Lightbulb size={11} />
        Insights
      </button>
    </div>
  )
}

/* =========================================================
   CATEGORY ITEM CARD
========================================================= */

function CategoryItemCard({
  categoryItem,
}) {
  const topItem =
    categoryItem.topItem

  return (
    <div className="rounded-xl border border-[#ebe6dd] bg-[#fcfbf8] p-3">
      <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-[#8a857d]">
        {formatLabel(
          categoryItem.category
        )}
      </p>

      {topItem ? (
        <>
          <p className="mt-2 truncate text-sm font-bold text-[#193528]">
            {topItem.name}
          </p>

          <div className="mt-1 flex items-center justify-between text-[10px] text-[#777269]">
            <span>
              {topItem.quantity} sold
            </span>

            <span>
              ₹
              {formatNumber(
                topItem.revenue
              )}
            </span>
          </div>
        </>
      ) : (
        <p className="mt-2 text-xs text-[#99938a]">
          No sales
        </p>
      )}
    </div>
  )
}

/* =========================================================
   SMALL STAT
========================================================= */

function SmallStat({
  label,
  value,
}) {
  return (
    <div className="rounded-xl border border-[#e5dfd4] bg-white px-4 py-3">
      <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-[#8a857d]">
        {label}
      </p>

      <p className="mt-1 text-lg font-bold text-[#193528]">
        {value}
      </p>
    </div>
  )
}

/* =========================================================
   REVENUE CHART
========================================================= */

function RevenueChart({ data }) {
  if (!data?.length) {
    return <ChartEmpty />
  }

  return (
    <div className="h-52 w-full sm:h-56">
      <ResponsiveContainer
        width="100%"
        height="100%"
      >
        <LineChart
          data={data}
          margin={{
            top: 8,
            right: 8,
            left: -15,
            bottom: 0,
          }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
          />

          <XAxis
            dataKey="date"
            tick={{
              fontSize: 9,
            }}
          />

          <YAxis
            tick={{
              fontSize: 9,
            }}
          />

          <Tooltip
            formatter={(value) =>
              `₹${formatNumber(value)}`
            }
          />

          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#557a63"
            strokeWidth={2.5}
            dot={{
              r: 2.5,
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

/* =========================================================
   BUSIEST DAYS
========================================================= */

function BusiestDaysChart({ data }) {
  if (!data?.length) {
    return <ChartEmpty />
  }

  return (
    <div className="h-52 w-full sm:h-56">
      <ResponsiveContainer
        width="100%"
        height="100%"
      >
        <BarChart
          data={data}
          margin={{
            top: 8,
            right: 8,
            left: -15,
            bottom: 0,
          }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
          />

          <XAxis
            dataKey="date"
            tick={{
              fontSize: 8,
            }}
          />

          <YAxis
            allowDecimals={false}
            tick={{
              fontSize: 9,
            }}
          />

          <Tooltip />

          <Bar
            dataKey="count"
            fill="#7ca58a"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

/* =========================================================
   PEAK HOURS
========================================================= */

function PeakHoursChart({ data }) {
  if (!data?.length) {
    return <ChartEmpty />
  }

  return (
    <div className="h-52 w-full sm:h-56">
      <ResponsiveContainer
        width="100%"
        height="100%"
      >
        <BarChart
          data={data}
          margin={{
            top: 8,
            right: 8,
            left: -15,
            bottom: 0,
          }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
          />

          <XAxis
            dataKey="hour"
            tickFormatter={formatHour}
            tick={{
              fontSize: 9,
            }}
          />

          <YAxis
            allowDecimals={false}
            tick={{
              fontSize: 9,
            }}
          />

          <Tooltip
            labelFormatter={(value) =>
              formatHour(value)
            }
          />

          <Bar
            dataKey="count"
            fill="#62816c"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

/* =========================================================
   POPULAR ITEMS
========================================================= */

function PopularItemsChart({ data }) {
  if (!data?.length) {
    return <ChartEmpty />
  }

  const chartData =
    data.slice(0, 6)

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer
        width="100%"
        height="100%"
      >
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{
            top: 5,
            right: 15,
            left: 10,
            bottom: 5,
          }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            horizontal={false}
          />

          <XAxis
            type="number"
            allowDecimals={false}
            tick={{
              fontSize: 9,
            }}
          />

          <YAxis
            type="category"
            dataKey="name"
            width={85}
            tick={{
              fontSize: 9,
            }}
          />

          <Tooltip />

          <Bar
            dataKey="quantity"
            fill="#62816c"
            radius={[0, 4, 4, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

/* =========================================================
   CATEGORY
========================================================= */

function CategoryChart({ data }) {
  if (!data?.length) {
    return <ChartEmpty />
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer
        width="100%"
        height="100%"
      >
        <BarChart
          data={data}
          margin={{
            top: 8,
            right: 8,
            left: -15,
            bottom: 0,
          }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
          />

          <XAxis
            dataKey="category"
            tickFormatter={formatLabel}
            tick={{
              fontSize: 8,
            }}
          />

          <YAxis
            tick={{
              fontSize: 9,
            }}
          />

          <Tooltip
            formatter={(value) =>
              `₹${formatNumber(value)}`
            }
          />

          <Bar
            dataKey="revenue"
            fill="#8aab93"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

/* =========================================================
   ORDER TYPE
========================================================= */

function OrderTypeChart({ data }) {
  if (!data?.length) {
    return <ChartEmpty />
  }

  return (
    <div className="h-56 w-full">
      <ResponsiveContainer
        width="100%"
        height="100%"
      >
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="type"
            cx="50%"
            cy="48%"
            innerRadius={48}
            outerRadius={76}
            paddingAngle={3}
          >
            {data.map(
              (entry, index) => (
                <Cell
                  key={entry.type}
                  fill={
                    index === 0
                      ? "#62816c"
                      : "#c3d0c4"
                  }
                />
              )
            )}
          </Pie>

          <Tooltip />

          <Legend
            wrapperStyle={{
              fontSize: "10px",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

/* =========================================================
   PAYMENT
========================================================= */

function PaymentChart({ data }) {
  if (!data?.length) {
    return <ChartEmpty />
  }

  return (
    <div className="h-56 w-full">
      <ResponsiveContainer
        width="100%"
        height="100%"
      >
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="method"
            cx="50%"
            cy="48%"
            innerRadius={48}
            outerRadius={76}
            paddingAngle={3}
          >
            {data.map(
              (entry, index) => (
                <Cell
                  key={entry.method}
                  fill={
                    index === 0
                      ? "#7ca58a"
                      : "#d4c3aa"
                  }
                />
              )
            )}
          </Pie>

          <Tooltip />

          <Legend
            wrapperStyle={{
              fontSize: "10px",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

/* =========================================================
   STATUS
========================================================= */

function StatusChart({ data }) {
  if (!data?.length) {
    return <ChartEmpty />
  }

  return (
    <div className="h-56 w-full">
      <ResponsiveContainer
        width="100%"
        height="100%"
      >
        <BarChart
          data={data}
          layout="vertical"
          margin={{
            top: 5,
            right: 10,
            left: 10,
            bottom: 5,
          }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            horizontal={false}
          />

          <XAxis
            type="number"
            allowDecimals={false}
            tick={{
              fontSize: 9,
            }}
          />

          <YAxis
            type="category"
            dataKey="label"
            width={85}
            tick={{
              fontSize: 8,
            }}
          />

          <Tooltip />

          <Bar
            dataKey="count"
            fill="#66846f"
            radius={[0, 4, 4, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

/* =========================================================
   EMPTY
========================================================= */

function ChartEmpty() {
  return (
    <div className="flex h-52 items-center justify-center rounded-xl bg-[#faf8f3]">
      <p className="text-[10px] text-[#8b867d]">
        No data available.
      </p>
    </div>
  )
}

/* =========================================================
   INSIGHT MODAL
========================================================= */

function InsightModal({
  insight,
  onClose,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-[2px]">
      <div className="w-full max-w-sm rounded-2xl border border-[#e4ded3] bg-[#fffdf9] p-5 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e8f0e9] text-[#1f4635]">
              <Lightbulb size={17} />
            </div>

            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#879289]">
                Analysis
              </p>

              <h3 className="text-base font-bold text-[#193528]">
                {insight.title}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#817c73] transition hover:bg-[#f2eee7]"
          >
            <X size={17} />
          </button>
        </div>

        <div className="mt-5 space-y-2">
          {insight.items?.map(
            (item, index) => (
              <div
                key={`${item}-${index}`}
                className="rounded-xl border border-[#ebe5da] bg-white px-3 py-2.5 text-xs text-[#514e48]"
              >
                {item}
              </div>
            )
          )}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full rounded-xl bg-[#1f4635] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#17392b]"
        >
          Close
        </button>
      </div>
    </div>
  )
}

/* =========================================================
   LOADING
========================================================= */

function LoadingState() {
  return (
    <div className="min-h-screen bg-[#faf8f3] p-5">
      <div className="mx-auto max-w-[1500px] space-y-4">
        <div className="h-20 animate-pulse rounded-2xl bg-stone-200" />

        <div className="h-16 animate-pulse rounded-2xl bg-stone-200" />

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[1, 2, 3, 4].map(
            (item) => (
              <div
                key={item}
                className="h-28 animate-pulse rounded-2xl bg-stone-200"
              />
            )
          )}
        </div>

        <div className="h-64 animate-pulse rounded-2xl bg-stone-200" />

        <div className="grid gap-4 xl:grid-cols-2">
          {[1, 2].map(
            (item) => (
              <div
                key={item}
                className="h-64 animate-pulse rounded-2xl bg-stone-200"
              />
            )
          )}
        </div>
      </div>
    </div>
  )
}

/* =========================================================
   DATE HELPERS
========================================================= */

function getPresetDates(
  preset,
  customStartDate,
  customEndDate
) {
  const today = new Date()

  function formatDate(date) {
    const year = date.getFullYear()

    const month = String(
      date.getMonth() + 1
    ).padStart(2, "0")

    const day = String(
      date.getDate()
    ).padStart(2, "0")

    return `${year}-${month}-${day}`
  }

  if (preset === "CUSTOM") {
    return {
      startDate:
        customStartDate || undefined,
      endDate:
        customEndDate || undefined,
    }
  }

  if (preset === "TODAY") {
    return {
      startDate: formatDate(today),
      endDate: formatDate(today),
    }
  }

  if (preset === "YESTERDAY") {
    const yesterday = new Date(today)

    yesterday.setDate(
      yesterday.getDate() - 1
    )

    return {
      startDate: formatDate(yesterday),
      endDate: formatDate(yesterday),
    }
  }

  if (preset === "LAST_7_DAYS") {
    const start = new Date(today)

    start.setDate(
      start.getDate() - 6
    )

    return {
      startDate: formatDate(start),
      endDate: formatDate(today),
    }
  }

  if (preset === "LAST_30_DAYS") {
    const start = new Date(today)

    start.setDate(
      start.getDate() - 29
    )

    return {
      startDate: formatDate(start),
      endDate: formatDate(today),
    }
  }

  if (preset === "THIS_MONTH") {
    const start = new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    )

    return {
      startDate: formatDate(start),
      endDate: formatDate(today),
    }
  }

  if (preset === "LAST_MONTH") {
    const start = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      1
    )

    const end = new Date(
      today.getFullYear(),
      today.getMonth(),
      0
    )

    return {
      startDate: formatDate(start),
      endDate: formatDate(end),
    }
  }

  if (preset === "LAST_3_MONTHS") {
    const start = new Date(
      today.getFullYear(),
      today.getMonth() - 2,
      1
    )

    return {
      startDate: formatDate(start),
      endDate: formatDate(today),
    }
  }

  return {}
}

/* =========================================================
   GENERAL HELPERS
========================================================= */

function formatNumber(value) {
  return Number(
    value || 0
  ).toLocaleString("en-IN")
}

function formatHour(hour) {
  const numericHour = Number(hour)

  if (Number.isNaN(numericHour)) {
    return hour
  }

  const suffix =
    numericHour >= 12 ? "PM" : "AM"

  const displayHour =
    numericHour % 12 || 12

  return `${displayHour} ${suffix}`
}

function formatLabel(value) {
  if (!value) {
    return ""
  }

  return String(value)
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) =>
      char.toUpperCase()
    )
}

export default Analytics;