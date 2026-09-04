import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getOrders } from "../../services/order.service";
import { getLowStockProducts } from "../../services/stock.service";
import { getProducts } from "../../services/product.service";
import { Loading, EmptyState, ErrorState } from "../../components/ui";
import { Table, TableHeadCell, TableRow } from "../../components/ui/Table";
import { Badge } from "../../components/ui/Badge";

const AdminDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [lowStock, setLowStock] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [ordersRes, lowStockRes, productsRes] = await Promise.all([
          getOrders(),
          getLowStockProducts(),
          getProducts({}),
        ]);

        // Build admin KPI stats from backend data
        const totalProducts = productsRes.length;
        const totalStock = productsRes.reduce((sum: number, p: any) => sum + (p.quantity || 0), 0);
        const totalOrders = ordersRes.length;
        const lowStockCount = lowStockRes.length;

        setStats({
          totalProducts,
          totalStock,
          totalOrders,
          lowStockCount,
        });

        setOrders(ordersRes);
        setProducts(productsRes);
        setLowStock(lowStockRes);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || "Failed to fetch dashboard data");
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return <Loading className="p-8" />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  if (!stats && !orders.length) {
    return <EmptyState
      title="No Data"
      description="No admin data available. Ensure the backend API is running."
    />;
  }

  return (
    <div className="p-6">
      {/* Top Header Banner & Command Bar -->
      <div className="bg-white rounded-lg p-6 shadow mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md pb-2">
          <div>
            <h2 className="text-xl font-medium text-gray-500">Admin Console</h2>
            <p className="text-sm text-gray-500">Executive Command Center</p>
          </div>
          <div className="flex items-center gap-space-sm">
            <button className="rounded-md px-3 py-1.5 text-sm font-medium text-primary-600 hover:bg-primary-50 transition-colors">
              Export Brief (.PDF)
            </button>
            <button className="ml-2 rounded-md px-3 py-1.5 text-sm font-medium text-primary-600 hover:bg-primary-50 transition-colors">
              Emergency Stock Rebalance
            </button>
            <button className="ml-2 rounded-md px-3 py-1.5 text-sm font-medium text-primary-600 hover:bg-primary-50 transition-colors shadow-sm">
              + Quick PO / Transfer
            </button>
          </div>
        </div>

        {/* Global KPI Metrics Row (4 Cards, Dense & Analytical) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          {/* Card 1: Total Global Valuation */}
          <div className="bg-white rounded-lg p-5 shadow-sm flex flex-col justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-500">Total Global Valuation</p>
              <p className="text-2xl font-bold tabular-nums">${stats?.totalStock?.toLocaleString() || "0"}</p>
              <p className="text-sm text-gray-500">24,180 SKUs across 6 DCs</p>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-primary-500 text-sm font-medium">+4.2% MoM</span>
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded bg-primary-container text-primary-container font-mono-data text-label-sm font-semibold">
                <span className="material-symbols-outlined text-[14px]">trending_up</span>
                  +4.2% MoM
              </span>
            </div>
          </div>

          {/* Card 2: Critical Stockout Alerts */}
          <div className="bg-white rounded-lg p-5 shadow-sm flex flex-col justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-500">Critical Stockout Alerts</p>
              <p className="text-2xl font-bold text-error tabular-nums">{stats?.lowStockCount} Items</p>
              <p className="text-sm text-gray-500">4 Breached under 24h</p>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-error-container text-on-error-container font-mono-data text-label-sm font-semibold">
                <span className="material-symbols-outlined text-[14px]">warning</span>
                  4 Breached under 24h
              </span>
              <button className="text-xs font-label-sm text-secondary hover:underline">Review All</button>
            </div>
          </div>

          {/* Card 3: Global OTIF Fulfillment */}
          <div className="bg-white rounded-lg p-5 shadow-sm flex flex-col justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-500">Global OTIF Fulfillment</p>
              <p className="text-2xl font-bold text-on-surface tabular-nums">98.4%</p>
              <p className="text-sm text-gray-500">Target: 98.0%</p>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-surface-container text-on-surface font-mono-data text-label-sm font-semibold">
                <span className="material-symbols-outlined text-[15px]">local_shipping</span>
                  1,420 orders today • 0 penalty
              </span>
              <span className="text-gray-500 text-nominal">Nominal</span>
            </div>
          </div>

          {/* Card 4: Inbound Pipeline */}
          <div className="bg-white rounded-lg p-5 shadow-sm flex flex-col justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-500">Inbound EDI / AS2 Pipeline</p>
              <p className="text-2xl font-bold text-on-surface tabular-nums">42 Freight BOLs</p>
              <p className="text-sm text-gray-500">12 Arriving Today</p>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-surface-container text-secondary font-mono-data text-label-sm font-semibold">
                <span className="material-symbols-outlined text-[14px]">directions_boat</span>
                  $3.8M en route (ORD / RTM)
              </span>
              <span className="text-gray-500 text-xs">99.2% synced</span>
            </div>
          </div>
        </div>
      </div>

       <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: DC Capacity Matrix (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <h2 className="text-sm font-medium uppercase tracking-wider text-gray-500">
              DC Capacity Saturation & Real-Time Velocity
            </h2>
            <button className="text-xs font-label-sm text-secondary hover:underline flex items-center gap-1">
              <span>Configure Inter-DC Transfer</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>

          <div className="space-y-space-sm">
            {/* DC 1: Chicago */}
            <div className="bg-white rounded-lg p-3 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-space-sm min-w-0">
                <span className="w-2 h-2 rounded-full bg-secondary shrink-0"></span>
                <span className="font-headline-sm text-headline-sm text-on-surface truncate">
                  Chicago Central (DC-01)
                </span>
                <span className="font-caption text-caption px-1.5 py-0.5 rounded bg-surface-container-high text-on-surface font-mono-data">
                  Primary Crossdock
                </span>
              </div>
              <div className="flex items-center gap-space-md">
                <span className="font-mono-data text-body-sm text-outline tabular-nums">9,420 u/day</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-label-sm font-medium bg-surface-container-highest text-on-surface">
                  88% Saturated
                </span>
              </div>
              <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden flex">
                <div className="bg-secondary h-full rounded-full" styleName="width: 88%"></div>
              </div>
              <div className="flex items-center justify-between font-caption text-caption text-outline font-mono-data">
                <span>Utilization: 44,000 / 50,000 Pallets</span>
                <span>Buffer Headroom: 6,000 Pallets</span>
              </div>
            </div>

            {/* DC 2: Dallas */}
            <div className="bg-white rounded-lg p-3 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-space-sm min-w-0">
                <span className="w-2 h-2 rounded-full bg-secondary shrink-0"></span>
                <span className="font-headline-sm text-headline-sm text-on-surface truncate">
                  Dallas South (DC-02)
                </span>
                <span className="font-caption text-caption px-1.5 py-0.5 rounded bg-surface-container-high text-on-surface font-mono-data">
                  Zone Hub
                </span>
              </div>
              <div className="flex items-center gap-space-md">
                <span className="font-mono-data text-body-sm text-outline tabular-nums">6,180 u/day</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-label-sm font-medium bg-surface-container text-secondary">
                  64% Optimal
                </span>
              </div>
              <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden flex">
                <div className="bg-secondary-container h-full rounded-full" styleName="width: 64%"></div>
              </div>
              <div className="flex items-center justify-between font-caption text-caption text-outline font-mono-data">
                <span>Utilization: 22,400 / 35,000 Pallets</span>
                <span>Buffer Headroom: 12,600 Pallets</span>
              </div>
            </div>

            {/* DC 3: Rotterdam */}
            <div className="bg-white rounded-lg p-3 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-space-sm min-w-0">
                <span className="w-2 h-2 rounded-full bg-error shrink-0"></span>
                <span className="font-headline-sm text-headline-sm text-on-surface truncate">
                  Rotterdam EMEA Hub (DC-04)
                </span>
                <span className="font-caption text-caption px-1.5 py-0.5 rounded bg-error-container text-on-error-container font-mono-data">
                  High Congestion
                </span>
              </div>
              <div className="flex items-center gap-space-md">
                <span className="font-mono-data text-body-sm text-outline tabular-nums">11,200 u/day</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-label-sm font-medium bg-error-container text-on-error-container font-semibold">
                  92% Critical
                </span>
              </div>
              <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden flex">
                <div className="bg-error h-full rounded-full" styleName="width: 92%"></div>
              </div>
              <div className="flex items-center justify-between font-caption text-caption text-outline font-mono-data">
                <span>Utilization: 55,200 / 60,000 Pallets</span>
                <span>Buffer Headroom: 4,800 Pallets (Overflow risk)</span>
              </div>
            </div>

            {/* DC 4: Singapore */}
            <div className="bg-white rounded-lg p-3 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-space-sm min-w-0">
                <span className="w-2 h-2 rounded-full bg-secondary shrink-0"></span>
                <span className="font-headline-sm text-headline-sm text-on-surface truncate">
                  Singapore Gateway (DC-06)
                </span>
                <span className="font-caption text-caption px-1.5 py-0.5 rounded bg-surface-container-high text-on-surface font-mono-data">
                  APAC Inbound
                </span>
              </div>
              <div className="flex items-center gap-space-md">
                <span className="font-mono-data text-body-sm text-outline tabular-nums">4,540 u/day</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-label-sm font-medium bg-surface-container text-secondary">
                  46% Low Load
                </span>
              </div>
              <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden flex">
                <div className="bg-secondary h-full rounded-full" styleName="width: 46%"></div>
              </div>
              <div className="flex items-center justify-between font-caption text-caption text-outline font-mono-data">
                <span>Utilization: 18,400 / 40,000 Pallets</span>
                <span>Buffer Headroom: 21,600 Pallets</span>
              </div>
            </div>
          </div>

          {/* Right Column: Action Required Queue (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-lg shadow-sm flex flex-col justify-between space-y-space-md">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-space-sm">
                <span className="material-symbols-outlined text-error text-[20px]">
                  assignment_late
                </span>
                <h2 className="font-headline-sm text-headline-sm text-on-surface">
                  High-Priority Exceptions
                </h2>
              </div>
              <span className="px-2 py-0.5 rounded bg-error-container text-on-error-container font-mono-data text-label-sm font-semibold">
                3 Actions Pending
              </span>
            </div>

            {/* Action Items List */}
            <div className="space-y-space-sm flex-1">
              {/* Item 1: Expedite Approval */}
              <div className="p-base rounded-lg space-y-space-xs hover:bg-surface-container transition-colors">
                <div className="flex items-start justify-between gap-space-xs">
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-label-md text-label-md text-error font-semibold font-mono-data">
                        PO-2024-8891
                      </span>
                      <span className="font-caption text-caption px-1.5 py-0.5 rounded bg-surface-container-high text-outline">
                        Chicago DC-01
                      </span>
                    </div>
                    <span className="font-body-sm text-body-sm text-on-surface font-medium truncate mt-0.5">
                      Infrared Optical Sensors 940nm
                    </span>
                    <span className="font-caption text-caption text-outline">
                      Stockout predicted in 18 hrs • Vendor requests expedite authorization
                    </span>
                  </div>
                  <button className="h-7 px-space-sm bg-primary hover:bg-primary-container text-on-primary rounded font-label-sm text-label-sm shrink-0 flex items-center gap-1 transition-colors" type="button">
                    <span className="material-symbols-outlined text-[14px]">check</span>
                    Approve Expedite
                  </button>
                </div>
              </div>

              {/* Item 2: Variance Flag */}
              <div className="p-base rounded-lg space-y-space-xs hover:bg-surface-container transition-colors">
                <div className="flex items-start justify-between gap-space-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="font-label-md text-label-md text-secondary font-semibold font-mono-data">
                      Variance Flag: Aisle 04 Bin B-12
                    </span>
                  </div>
                  <span className="font-body-sm text-body-sm text-on-surface font-medium truncate mt-0.5">
                    Delta Servo Motor Controller 48V
                  </span>
                  <span className="font-caption text-caption text-outline">
                    Cycle count mismatch: -6 units recorded vs WMS system balance
                  </span>
                </div>
                <button className="h-7 px-space-sm bg-surface-container-high hover:bg-surface-variant text-on-surface rounded font-label-sm text-label-sm shrink-0 flex items-center gap-1 transition-colors" type="button">
                  <span className="material-symbols-outlined text-[14px]">
                    troubleshoot
                  </span>
                  Launch Audit
                </button>
              </div>

              {/* Item 3: EDI ASN Delay */}
              <div className="p-base rounded-lg space-y-space-xs hover:bg-surface-container transition-colors">
                <div className="flex items-start justify-between gap-space-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="font-label-md text-label-md text-secondary font-semibold font-mono-data">
                      EDI 856 ASN Delay
                    </span>
                    <span className="font-caption text-caption px-1.5 py-0.5 rounded bg-surface-container-high text-outline">
                      Maersk Intermodal
                    </span>
                  </div>
                  <span className="font-body-sm text-body-sm text-on-surface font-medium truncate mt-0.5">
                    Vessel MSK-900281 slipped +14 hrs
                  </span>
                  <span className="font-caption text-caption text-outline">
                    Affects 1,200 units reserved for Customer Backorder Fulfillment
                  </span>
                </div>
                <button className="h-7 px-space-sm bg-surface-container-high hover:bg-surface-variant text-on-surface rounded font-label-sm text-label-sm shrink-0 flex items-center gap-1 transition-colors" type="button">
                  <span className="material-symbols-outlined text-[14px]">
                    alt_route
                  </span>
                  Reroute Carrier
                </button>
              </div>
            </div>

            {/* Quick Facility Snapshot */}
            <div className="pt-2 flex items-center justify-between text-outline font-caption text-caption border-t-0">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">
                  schedule
                </span>
                Last cycle synchronization: 2 minutes ago
              </span>
              <span className="font-mono-data">Telemetry ID: #WMS-LIVE-7729</span>
            </div>
          </div>
        </div>

        {/* Comprehensive Master Inventory Table */}
        <div className="lg:col-span-12 bg-white rounded-lg shadow-sm overflow-hidden flex flex-col space-y-space-sm p-base">
          {/* Filter & Toolbar Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-base">
            <div className="flex items-center flex-wrap gap-space-xs">
              <button className="h-base rounded bg-primary text-on-primary font-label-md text-label-md transition-colors flex items-center gap-1.5" type="button">
                <span>All Items</span>
                <span className="px-1.5 py-0.2 bg-primary-container text-on-primary-container rounded font-mono-data text-caption">
                  24,180
                </span>
              </button>
              <button className="h-base rounded bg-surface-container-low hover:bg-surface-container text-error font-label-md text-label-md transition-colors flex items-center gap-1.5" type="button">
                <span>Stockout Imminent</span>
                <span className="px-1.5 py-0.2 bg-error-container text-on-error-container rounded font-mono-data text-caption">
                  9
                </span>
              </button>
              <button className="h-base rounded bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md transition-colors flex items-center gap-1.5" type="button">
                <span>Transfer Needed</span>
                <span className="px-1.5 py-0.2 bg-surface-container-high text-secondary rounded font-mono-data text-caption">
                  14
                </span>
              </button>
              <button className="h-base rounded bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md transition-colors flex items-center gap-1.5" type="button">
                <span>Surplus >120%</span>
                <span className="px-1.5 py-0.2 bg-surface-container-high text-outline rounded font-mono-data text-caption">
                  38
                </span>
              </button>
            </div>

            {/* Search and Secondary Action Buttons */}
            <div className="flex items-center gap-space-sm">
              <div className="relative w-80">
                <span className="material-symbols-outlined absolute left-2.5 top-2 text-outline text-[16px] pointer-events-none">
                  search
                </span>
                <input className="w-full h-8 pl-8 pr-3 bg-surface-container-low rounded font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:bg-surface-container-lowest focus:outline-none transition-colors" placeholder="Omni-search SKU, MPN, Serial..." type="text" />
              </div>
              <button className="h-base px-2.5 bg-surface-container-low hover:bg-surface-container text-on-surface rounded font-label-md text-label-md flex items-center gap-1 transition-colors" title="Column Presets" type="button">
                <span className="material-symbols-outlined text-[16px] text-outline">
                  tune
                </span>
                <span className="hidden sm:inline">Columns</span>
              </button>
              <button className="h-base px-2.5 bg-surface-container-low hover:bg-surface-container text-on-surface rounded font-label-md text-label-md flex items-center gap-1 transition-colors" title="Download CSV" type="button">
                <span className="material-symbols-outlined text-[16px] text-outline">
                  file_download
                </span>
                <span className="hidden sm:inline">Export CSV</span>
              </button>
            </div>
          </div>

          {/* Data Table Container */}
          <div className="w-full overflow-x-auto rounded-lg bg-surface-container-lowest">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="h-11 bg-surface-container-low text-outline font-label-sm text-label-sm uppercase tracking-wider select-none">
                  <th className="px-space-base py-1 font-semibold">
                    SKU & Description
                  </th>
                  <th className="px-space-base py-1 font-semibold">
                    Category
                  </th>
                  <th className="px-space-base py-1 font-semibold">
                    Primary DC & Bin
                  </th>
                  <th className="px-space-base py-1 font-semibold text-right">
                    Available / Reserv / Total
                  </th>
                  <th className="px-space-base py-1 font-semibold text-right">
                    Reorder Pt (Safety)
                  </th>
                  <th className="px-space-base py-1 font-semibold text-right">
                    Unit Val / Ext Value
                  </th>
                  <th className="px-space-base py-1 font-semibold text-center">
                    Buffer Health
                  </th>
                  <th className="px-space-base py-1 font-semibold text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y-0 text-on-surface font-body-sm text-body-sm">
                {/* Stockout Imminent Row */}
                <tr className="h-10 hover:bg-surface-container-low transition-colors group">
                  <td className="px-space-base py-1.5 min-w-[220px]">
                    <div className="flex flex-col">
                      <span className="font-mono-data text-label-md font-semibold text-on-surface group-hover:text-secondary cursor-pointer">
                        SKU-7809-X90
                      </span>
                      <span className="font-caption text-caption text-outline truncate">
                        Industrial High-Torque Stepper Motor 2.8Nm
                      </span>
                    </div>
                  </td>
                  <td className="px-space-base py-1.5 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface font-caption text-caption font-medium">
                      Robotics & Motion
                    </span>
                  </td>
                  <td className="px-space-base py-1.5 whitespace-nowrap">
                    <div className="flex items-center gap-1 font-mono-data text-body-sm">
                      <span className="text-on-surface font-medium">
                        Chicago DC-01
                      </span>
                      <span className="text-outline">/</span>
                      <span className="text-outline font-normal">
                        A04-B12-02
                      </span>
                    </div>
                  </td>
                  <td className="px-space-base py-1.5 text-right font-mono-data tabular-nums whitespace-nowrap">
                    <span className="text-error font-bold">14</span>
                    <span className="text-outline">/</span>
                    <span className="text-outline">80</span>
                    <span className="text-outline">/</span>
                    <span className="text-on-surface font-medium">
                      94
                    </span>
                  </td>
                  <td className="px-space-base py-1.5 text-right font-mono-data tabular-nums whitespace-nowrap">
                    <span className="text-on-surface font-medium">150</span>
                    <span className="text-outline text-caption">(SS: 50)</span>
                  </td>
                  <td className="px-space-base py-1.5 text-right font-mono-data tabular-nums whitespace-nowrap">
                    <div className="flex flex-col items-end">
                      <span className="text-on-surface font-medium">
                        $184.50
                      </span>
                      <span className="text-caption text-outline font-mono-data">
                        $17,343.00
                      </span>
                    </div>
                  </td>
                  <td className="px-space-base py-1.5 text-center whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-error-container text-on-error-container font-mono-data text-label-sm font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-error animate-ping">
                        Stockout <18h
                      </span>
                    </span>
                  </td>
                  <td className="px-space-base py-1.5 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1">
                      <button className="h-7 px-2 bg-primary hover:bg-primary-container text-on-primary rounded font-label-sm text-label-sm transition-colors" title="Create Expedited PO" type="button">
                        Reorder PO
                      </button>
                      <button className="p-1 hover:bg-surface-container rounded text-outline hover:text-on-surface transition-colors" title="More Options" type="button">
                        <span className="material-symbols-outlined text-[18px]">more_vert</span>
                      </button>
                    </div>
                  </td>
                </tr>

                {/* Optimal Normal Row */}
                <tr className="h-10 hover:bg-surface-container-low transition-colors group">
                  <td className="px-space-base py-1.5 min-w-[220px]">
                    <div className="flex flex-col">
                      <span className="font-mono-data text-label-md font-semibold text-on-surface group-hover:text-secondary cursor-pointer">
                        SKU-4412-C11
                      </span>
                      <span className="font-caption text-caption text-outline truncate">
                        Ruggedized PoE Gigabit Switch 16-Port
                      </span>
                    </div>
                  </td>
                  <td className="px-space-base py-1.5 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface font-caption text-caption font-medium">
                      Telecom & Motion
                    </span>
                  </td>
                  <td className="px-space-base py-1.5 whitespace-nowrap">
                    <div className="flex items-center gap-1 font-mono-data text-body-sm">
                      <span className="text-on-surface font-medium">
                        Dallas DC-02
                      </span>
                      <span className="text-outline">/</span>
                      <span className="text-outline font-normal">
                        C11-R03-09
                      </span>
                    </div>
                  </td>
                  <td className="px-space-base py-1.5 text-right font-mono-data tabular-nums whitespace-nowrap">
                    <span className="text-on-surface font-medium">820</span>
                    <span className="text-outline">/</span>
                    <span className="text-outline">140</span>
                    <span className="text-outline">/</span>
                    <span className="text-on-surface font-medium">
                      960
                    </span>
                  </td>
                  <td className="px-space-base py-1.5 text-right font-mono-data tabular-nums whitespace-nowrap">
                    <span className="text-on-surface font-medium">300</span>
                    <span className="text-outline text-caption">(SS: 120)</span>
                  </td>
                  <td className="px-space-base py-1.5 text-right font-mono-data tabular-nums whitespace-nowrap">
                    <div className="flex flex-col items-end">
                      <span className="text-on-surface font-medium">$420.00</span>
                      <span className="text-caption text-outline font-mono-data">
                        $403,200.00
                      </span>
                    </div>
                  </td>
                  <td className="px-space-base py-1.5 text-center whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container text-on-surface font-mono-data text-label-sm font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                      Nominal (3.2x)
                    </span>
                  </td>
                  <td className="px-space-base py-1.5 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1">
                      <button className="h-7 px-2 bg-surface-container hover:bg-surface-container-high text-on-surface rounded font-label-sm text-label-sm transition-colors" type="button">
                        Transfer
                      </button>
                      <button className="p-1 hover:bg-surface-container rounded text-outline hover:text-on-surface transition-colors" type="button">
                        <span className="material-symbols-outlined text-[18px]">
                          more_vert
                        </span>
                      </button>
                    </div>
                  </td>
                </tr>

                {/* Transfer Needed Row */}
                <tr className="h-10 hover:bg-surface-container-low transition-colors group">
                  <td className="px-space-base py-1.5 min-w-[220px]">
                    <div className="flex flex-col">
                      <span className="font-mono-data text-label-md font-semibold text-on-surface group-hover:text-secondary cursor-pointer">
                        SKU-9921-W44
                      </span>
                      <span className="font-caption text-caption text-outline truncate">
                        Armored Fiber Optic Cable Reel (1,000m)
                      </span>
                    </div>
                  </td>
                  <td className="px-space-base py-1.5 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface font-caption text-caption font-medium">
                      Passive Cabling
                    </span>
                  </td>
                  <td className="px-space-base py-1.5 whitespace-nowrap">
                    <div className="flex items-center gap-1 font-mono-data text-body-sm">
                      <span className="text-on-surface font-medium">
                        Rotterdam DC-04
                      </span>
                      <span className="text-outline">/</span>
                      <span className="text-outline font-normal">
                        F02-D01-14
                      </span>
                    </div>
                  </td>
                  <td className="px-space-base py-1.5 text-right font-mono-data tabular-nums whitespace-nowrap">
                    <span className="text-on-surface font-medium">1,450</span>
                    <span className="text-outline">/</span>
                    <span className="text-outline">600</span>
                    <span className="text-outline">/</span>
                    <span className="text-on-surface font-medium">2,050</span>
                  </td>
                  <td className="px-space-base py-1.5 text-right font-mono-data tabular-nums whitespace-nowrap">
                    <span className="text-on-surface font-medium">500</span>
                    <span className="text-outline text-caption">(SS: 200)</span>
                  </td>
                  <td className="px-space-base py-1.5 text-right font-mono-data tabular-nums whitespace-nowrap">
                    <div className="flex flex-col items-end">
                      <span className="text-on-surface font-medium">$620.00</span>
                      <span className="text-caption text-outline font-mono-data">
                        $1,271,000.00
                      </span>
                    </div>
                  </td>
                  <td className="px-space-base py-1.5 text-center whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container-high text-secondary font-mono-data text-label-sm font-semibold">
                      <span className="material-symbols-outlined text-[13px]">
                        swap_horiz
                      </span>
                      Inter-DC Rebalance
                    </span>
                  </td>
                  <td className="px-space-base py-1.5 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1">
                      <button className="h-7 px-2 bg-secondary hover:bg-secondary/90 text-on-secondary rounded font-label-sm text-label-sm transition-colors" type="button">
                        Relocate
                      </button>
                      <button className="p-1 hover:bg-surface-container rounded text-outline hover:text-on-surface transition-colors" type="button">
                        <span className="material-symbols-outlined text-[18px]">more_vert</span>
                      </button>
                    </div>
                  </td>
                </tr>

                {/* Surplus Stock Row */}
                <tr className="h-10 hover:bg-surface-container-low transition-colors group">
                  <td className="px-space-base py-1.5 min-w-[220px]">
                    <div className="flex flex-col">
                      <span className="font-mono-data text-label-md font-semibold text-on-surface group-hover:text-secondary cursor-pointer">
                        SKU-1082-M05
                      </span>
                      <span className="font-caption text-caption text-outline truncate">
                        Precision Planetary Gearbox 10:1 Ratio
                      </span>
                    </div>
                  </td>
                  <td className="px-space-base py-1.5 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface font-caption text-caption font-medium">
                      Mechanical Drive
                    </span>
                  </td>
                  <td className="px-space-base py-1.5 whitespace-nowrap">
                    <div className="flex items-center gap-1 font-mono-data text-body-sm">
                      <span className="text-on-surface font-medium">
                        Singapore DC-06
                      </span>
                      <span className="text-outline">/</span>
                      <span className="text-outline font-normal">
                        H19-K02-01
                      </span>
                    </div>
                  </td>
                  <td className="px-space-base py-1.5 text-right font-mono-data tabular-nums whitespace-nowrap">
                    <span className="text-on-surface font-medium">3,400</span>
                    <span className="text-outline">/</span>
                    <span className="text-outline">120</span>
                    <span className="text-outline">/</span>
                    <span className="text-on-surface font-medium">3,520</span>
                  </td>
                  <td className="px-space-base py-1.5 text-right font-mono-data tabular-nums whitespace-nowrap">
                    <span className="text-on-surface font-medium">800</span>
                    <span className="text-outline text-caption">(SS: 250)</span>
                  </td>
                  <td className="px-space-base py-1.5 text-right font-mono-data tabular-nums whitespace-nowrap">
                    <div className="flex flex-col items-end">
                      <span className="text-on-surface font-medium">$310.00</span>
                      <span className="text-caption text-outline font-mono-data">
                        $1,091,200.00
                      </span>
                    </div>
                  </td>
                  <td className="px-space-base py-1.5 text-center whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container text-outline font-mono-data text-label-sm font-medium">
                      Surplus (440%)
                    </span>
                  </td>
                  <td className="px-space-base py-1.5 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1">
                      <button className="h-7 px-2 bg-surface-container hover:bg-surface-container-high text-on-surface rounded font-label-sm text-label-sm transition-colors" type="button">
                        Discount
                      </button>
                      <button className="p-1 hover:bg-surface-container rounded text-outline hover:text-on-surface transition-colors" type="button">
                        <span className="material-symbols-outlined text-[18px]">more_vert</span>
                      </button>
                    </div>
                  </td>
                </tr>

                {/* Low Safety Buffer Row */}
                <tr className="h-10 hover:bg-surface-container-low transition-colors group">
                  <td className="px-space-base py-1.5 min-w-[220px]">
                    <div className="flex flex-col">
                      <span className="font-mono-data text-label-md font-semibold text-on-surface group-hover:text-secondary cursor-pointer">
                        SKU-3120-L88
                      </span>
                      <span className="font-caption text-caption text-outline truncate">
                        Semiconductor Power Inverter Module 650V
                      </span>
                    </div>
                  </td>
                  <td className="px-space-base py-1.5 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface font-caption text-caption font-medium">
                      Power Distribution
                    </span>
                  </td>
                  <td className="px-space-base py-1.5 whitespace-nowrap">
                    <div className="flex items-center gap-1 font-mono-data text-body-sm">
                      <span className="text-on-surface font-medium">
                        Chicago DC-01
                      </span>
                      <span className="text-outline">/</span>
                      <span className="text-outline font-normal">
                        B08-A01-04
                      </span>
                    </div>
                  </td>
                  <td className="px-space-base py-1.5 text-right font-mono-data tabular-nums whitespace-nowrap">
                    <span className="text-error font-semibold">68</span>
                    <span className="text-outline">/</span>
                    <span className="text-outline">210</span>
                    <span className="text-outline">/</span>
                    <span className="text-on-surface font-medium">278</span>
                  </td>
                  <td className="px-space-base py-1.5 text-right font-mono-data tabular-nums whitespace-nowrap">
                    <span className="text-on-surface font-medium">400</span>
                    <span className="text-outline text-caption">(SS: 150)</span>
                  </td>
                  <td className="px-space-base py-1.5 text-right font-mono-data tabular-nums whitespace-nowrap">
                    <div className="flex flex-col items-end">
                      <span className="text-on-surface font-medium">$540.00</span>
                      <span className="text-caption text-outline font-mono-data">
                        $150,120.00
                      </span>
                    </div>
                  </td>
                  <td className="px-space-base py-1.5 text-center whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-error-container text-on-error-container font-mono-data text-label-sm font-semibold">
                      Below Safety Stock
                    </span>
                  </td>
                  <td className="px-space-base py-1.5 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1">
                      <button className="h-7 px-2 bg-primary hover:bg-primary-container text-on-primary rounded font-label-sm text-label-sm transition-colors" type="button">
                        Reorder PO
                      </button>
                      <button className="p-1 hover:bg-surface-container rounded text-outline hover:text-on-surface transition-colors" type="button">
                        <span className="material-symbols-outlined text-[18px]">more_vert</span>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Table Pagination & Footer Telemetry */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pt-base">
            <div className="flex items-center gap-space-sm text-outline font-body-sm text-body-sm">
              <span>
                Showing <strong className="text-on-surface font-semibold font-mono-data">
                  1–5
                </strong> of <strong className="text-on-surface font-semibold font-mono-data">
                  24,180
                </strong> items
              </span>
              <span className="text-outline-variant">•</span>
              <span className="font-caption text-caption text-outline">
                Cluster latency: 12ms
              </span>
            </div>
            <div className="flex items-center gap-space-xs">
              <button className="h-8 px-2.5 bg-surface-container-low hover:bg-surface-container text-on-surface rounded font-label-sm text-label-sm flex items-center gap-1 disabled:opacity-40" disabled="" type="button">
                <span className="material-symbols-outlined text-[16px]">
                  chevron_left
                </span>
                <span>Prev</span>
              </button>
              <button className="h-8 w-8 rounded bg-primary text-on-primary font-mono-data text-label-sm font-semibold" type="button">1</button>
              <button className="h-8 w-8 rounded bg-surface-container-low hover:bg-surface-container text-on-surface font-mono-data text-label-sm" type="button">2</button>
              <button className="h-8 w-8 rounded bg-surface-container-low hover:bg-surface-container text-on-surface font-mono-data text-label-sm" type="button">3</button>
              <span className="px-1 text-outline font-mono-data">...</span>
              <button className="h-8 w-8 rounded bg-surface-container-low hover:bg-surface-container text-on-surface font-mono-data text-label-sm" type="button">484</button>
              <button className="h-8 px-2.5 bg-surface-container-low hover:bg-surface-container text-on-surface rounded font-label-sm text-label-sm flex items-center gap-1" type="button">
                <span className="material-symbols-outlined text-[16px]">
                  chevron_right
                </span>
                <span>Next</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;