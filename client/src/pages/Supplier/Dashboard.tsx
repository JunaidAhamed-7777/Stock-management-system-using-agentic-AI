import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getOrders } from "../../services/order.service";
import { getLowStockProducts } from "../../services/stock.service";
import { Loading, EmptyState, ErrorState } from "../../components/ui";
import { Table, TableHeadCell, TableRow } from "../../components/ui/Table";

const SupplierDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [highPriorityOrders, setHighPriorityOrders] = useState<any[]>([]);
  const [dockTelemetry, setDockTelemetry] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [ordersRes, lowStockRes] = await Promise.all([
          getOrders(),
          getLowStockProducts(),
        ]);

        // KPI stats from DESIGN.md-inspired metrics
        setStats({
          openPurchaseOrders: ordersRes.length,
          onTimeDeliveryRate: "98.8%",
          asnsInTransit: 6,
          qualityAcceptanceRate: "99.6%",
        });

        // High-priority orders (those awaiting vendor action)
        const priorityOrders = ordersRes
          .filter((o: any) => o.status === "PENDING" || o.status === "Awaiting Vendor Acceptance")
          .slice(0, 4);
        setHighPriorityOrders(priorityOrders);

        // Dock telemetry (mock structure based on Stitch design)
        const mockDockTelemetry = [
          {
            gate: "B-04",
            status: "Reserved Slot",
            scheduled: "Tomorrow 08:30 CST",
            asn: "ASN-7721",
            carrier: "FedEx Freight Priority",
            eta: "In-Transit (Peoria, IL)",
          },
          {
            gate: "B-12",
            status: "Confirmed",
            scheduled: "Oct 28, 11:00 CST",
            asn: "ASN-7734",
            carrier: "Old Dominion Freight Line",
            eta: "Dispatched (South Bend)",
          },
        ];
        setDockTelemetry(mockDockTelemetry);

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

  if (!stats && !highPriorityOrders.length) {
    return <EmptyState
      title="No Data"
      description="No dashboard data available. Ensure you have pending orders or ASNs."
    />;
  }

  return (
    <div className="p-6">
      {/* Top Operational Header Bar */}
      <div className="bg-white rounded-lg p-6 shadow mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md pb-2">
          <div>
            <h2 className="text-xl font-medium text-gray-500">Supplier Console</h2>
            <p className="text-sm text-gray-500">Supplier Performance & Inbound Operations</p>
          </div>
          <div className="flex items-center gap-space-2">
            <button className="rounded-md px-3 py-1.5 text-sm font-medium text-primary-600 hover:bg-primary-50 transition-colors">
              Download EDI PO Summary (.CSV)
            </button>
            <button
              className="ml-2 rounded-md px-3 py-1.5 text-sm font-medium text-primary-600 hover:bg-primary-50 transition-colors"
            >
              + Submit ASN
            </button>
          </div>
        </div>

        {/* 4-Column KPI Metric Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Open Purchase Orders */}
          <div className="bg-white rounded-lg p-4 shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-500">Open Purchase Orders</p>
              <p className="text-lg font-semibold tabular-nums">{stats?.openPurchaseOrders} Active</p>
              <p className="text-sm text-gray-500">4 Require Action</p>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-error text-error-container font-medium">$584,200.00 pending fulfillment</span>
              <span className="text-gray-400 text-xs">receipt_long</span>
            </div>
            <div className="absolute bottom-0 left-0 h-0.5 w-full bg-secondary"></div>
          </div>

          {/* On-Time Delivery Rate */}
          <div className="bg-white rounded-lg p-4 shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-500">On-Time Delivery Rate (OTIF)</p>
              <p className="text-lg font-bold tabular-nums">{stats?.onTimeDeliveryRate}</p>
              <p className="text-sm text-gray-500">Gold Tier SLA</p>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-gray-400 text-xs">Target SLA > 96.5% (+2.3% margin)</span>
              <span className="text-primary-500">99.1% MTD</span>
            </div>
            <div className="absolute bottom-0 left-0 h-0.5 w-full bg-secondary"></div>
          </div>

          {/* ASNs In-Transit */}
          <div className="bg-white rounded-lg p-4 shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-500">ASNs In-Transit</p>
              <p className="text-lg font-bold tabular-nums">{stats?.asnsInTransit} Shipments</p>
              <p className="text-sm text-gray-500">ETA < 48h</p>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-gray-400 text-xs">34 Pallets • 18,400 Units</span>
              <span className="text-gray-400 text-xs">alt_route</span>
            </div>
            <div className="absolute bottom-0 left-0 h-0.5 w-full bg-secondary"></div>
          </div>

          {/* Quality Acceptance Rate */}
          <div className="bg-white rounded-lg p-4 shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-500">Quality Acceptance Rate</p>
              <p className="text-lg font-bold tabular-nums">{stats?.qualityAcceptanceRate}</p>
              <p className="text-sm text-gray-500">QC Gate 1 Certified</p>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-gray-400 text-xs">0.4% RMA / Quarantine</span>
              <span className="text-gray-400 text-xs">verified</span>
            </div>
            <div className="absolute bottom-0 left-0 h-0.5 w-full bg-secondary"></div>
          </div>
        </div>
      </div>

      {/* Two-Column Midsection */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: High-Priority POs (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <h2 className="text-sm font-medium uppercase tracking-wider text-gray-500">
              High-Priority Inbound Orders Requiring Action
            </h2>
            <p className="text-xs text-gray-400">Direct AS2 purchase orders awaiting vendor acceptance or ASN creation</p>
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-xs">Auto-Refresh 15s</span>
              <button className="rounded-md px-2 py-1 text-xs font-medium text-gray-400 hover:text-gray-600 transition-colors">Reload Queue</button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-body-sm text-body-sm border-collapse">
              <thead>
                <tr class="bg-surface-container-low text-outline font-label-sm text-label-sm uppercase tracking-wider h-8 select-none">
                  <th className="px-space-base py-space-2xs font-semibold">PO Number</th>
                  <th className="px-space-base py-space-2xs font-medium">Target Dock</th>
                  <th className="px-space-base py-space-2xs font-medium">Destination Hub</th>
                  <th className="px-space-base py-space-2xs font-medium text-right">Qty</th>
                  <th className="px-space-base py-space-2xs font-medium text-right">Value ($)</th>
                  <th className="px-space-base py-space-2xs font-medium">Status</th>
                  <th className="px-space-base py-space-2xs font-medium text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {highPriorityOrders.map((order: any, index: number) => (
                  <tr
                    key={index}
                    className="h-9 hover:bg-surface-container-low transition-colors group"
                  >
                    <td className="px-space-base py-space-2xs font-mono-data text-on-surface font-semibold">
                      <a href="#" className="hover:underline flex items-center gap-1">
                        #PO-{order.id}
                        <span className="material-symbols-outlined text-[12px] opacity-0 group-hover:opacity-100 transition-opacity">open_in_new</span>
                      </a>
                    </td>
                    <td className="px-space-base py-space-2xs font-mono-data text-on-surface">
                      <span>{order.dockTarget}</span>
                    </td>
                    <td className="px-space-base py-space-2xs">
                      <span className="inline-flex items-center gap-1 px-1 py-0.5 rounded bg-surface-container font-label-sm text-label-sm text-on-surface">
                        {order.destinationHub}
                      </span>
                    </td>
                    <td className="px-space-base py-space-2xs text-right font-mono-data tabular-nums font-semibold">
                      {order.qty}
                    </td>
                    <td className="px-space-base py-space-2xs text-right font-mono-data tabular-nums font-semibold">
                      ${order.total}
                    </td>
                    <td className="px-space-base py-space-2xs">
                      <span className={order.status === "PENDING" || order.status === "Awaiting Vendor Acceptance"
                        ? "inline-flex items-center gap-1 px-1 py-0.5 rounded bg-error-container text-on-error-container font-label-sm text-label-sm font-semibold"
                        : "inline-flex items-center gap-1 px-1 py-0.5 rounded bg-surface-container text-on-surface font-label-sm text-label-sm font-semibold"
                      }>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-space-base py-space-2xs text-center">
                      <button
                        className="rounded-md px-2 py-1 text-xs font-medium text-primary-600 hover:bg-primary-50 transition-colors shadow-sm"
                        type="button"
                      >
                        Acknowledge PO
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="mt-4 text-sm text-gray-500">
                <tr>
                  <th colSpan={7} className="text-right">
                    {highPriorityOrders.length} high-priority orders requiring immediate SLA attention
                  </th>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Right Column: Dock Appointment & Telemetry (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 flex flex-col gap-4">
            {/* Dock Appointment & Telemetry */}
            <div>
              <h2 className="text-sm font-medium uppercase tracking-wider text-gray-500">
                Dock Appointment & Telemetry
              </h2>
              <p className="text-xs text-gray-400">Chicago Central DC-01 Receiving Inbound Feed</p>
              <p className="text-xs text-gray-400">Gate 04 Online</p>

              {/* Dock Schedules */}
              <div className="grid grid-cols-1 gap-3">
                {/* Dock item */}
                <div className="bg-white rounded-lg p-3 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-primary-container text-on-primary flex items-center justify-center font-mono-data text-mono-data font-bold">
                      B-04
                    </div>
                    <div>
                      <p className="font-medium">Dock Bay 4 • Priority Cross-dock</p>
                      <p className="text-xs text-gray-400">Scheduled Tomorrow 08:30 CST • ASN-7721</p>
                    </div>
                  </div>
                  <span className="rounded-md px-1.5 py-0.5 bg-secondary-container text-secondary font-label-sm text-label-sm font-semibold">Reserved Slot</span>
                </div>

                {/* Dock item 2 */}
                <div className="bg-white rounded-lg p-3 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-surface-container text-on-surface flex items-center justify-center font-mono-data text-mono-data font-bold">
                      B-12
                    </div>
                    <div>
                      <p className="font-medium">Dock Bay 12 • Standard Pallet Inflow</p>
                      <p className="text-xs text-gray-400">Scheduled Oct 28, 11:00 CST • ASN-7734</p>
                    </div>
                  </div>
                  <span className="rounded-md px-1.5 py-0.5 bg-secondary text-on-secondary font-label-sm text-label-sm font-semibold">Confirmed</span>
                </div>
              </div>

              {/* Carrier Dispatch Telemetry */}
              <div className="mt-4 bg-white rounded-lg p-3 shadow-sm">
                <p className="text-xs uppercase tracking-wider text-gray-500">Carrier Transit Verification</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="rounded-md px-2 py-1 bg-secondary-container text-secondary font-mono-data text-mono-data font-bold">FDXF</span>
                    <p className="text-xs">FedEx Freight Priority</p>
                    <p className="text-xs text-gray-400">PRO #892-49102-1 • In-Transit (Peoria, IL)</p>
                  </div>
                  <div>
                    <span className="rounded-md px-2 py-1 bg-tertiary-fixed text-on-tertiary-fixed font-mono-data text-mono-data font-bold">ODFL</span>
                    <p className="text-xs">Old Dominion Freight Line</p>
                    <p className="text-xs text-gray-400">PRO #441-00293-8 • Dispatched (South Bend)</p>
                  </div>
                </div>

                {/* ASN 24-Hour Compliance Meter */}
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-gray-400">ASN 24-Hour Lead Time Compliance</span>
                  <span className="text-secondary font-bold">99.2%</span>
                </div>
                <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
                  <div className="bg-secondary h-full rounded-full" styleName="width: 99.2%"></div>
                </div>
                <p className="text-xs text-gray-400">Rolling 90-Day KPI • Min. SLA: 98.0%</p>
              </div>
            </div>

            {/* Critical Component Stock Depletion */}
            <div className="mt-4 bg-white rounded-lg p-3 shadow-sm">
              <h2 className="text-xs uppercase tracking-wider text-gray-500">
                Critical Component Stock Depletion & Factory Production Buffer
              </h2>
              <p className="text-xs text-gray-400">Warehouse telemetry sync: 1m ago</p>

              {/* Grid of 3 fast-depleting supplied items */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Item 1: Danger Depleted */}
                <div>
                  <div className="bg-white rounded-lg p-3 shadow-sm flex flex-col justify-between">
                    <div className="flex flex-col gap-1">
                      <span className="font-mono-data font-bold text-secondary">SKU-9932-SN</span>
                      <h3 className="font-label-md font-semibold text-on-surface">
                        Infrared Ambient Sensor v4
                      </h3>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="rounded-md px-1.5 py-0.5 bg-error-container text-on-error-container font-label-sm text-label-sm font-semibold">
                        Danger Depleted
                      </span>
                      <span className="text-error font-bold font-mono-data">24 units</span>
                      <span className="text-error font-medium">Under minimum (150)</span>
                    </div>
                  </div>
                  <div className="mt-1 flex items-center gap-1">
                    <span className="text-xs text-gray-400">Stock at DC-01</span>
                    <span className="font-headline-sm font-bold text-error">1,200 units</span>
                    <span className="text-xs text-gray-400 font-medium">Factory Buffer (VND)</span>
                  </div>
                  <div className="mt-1 flex items-center gap-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-outline">DC Runout Window</span>
                      <span className="text-error font-bold font-mono-data">~14 operating hours</span>
                    </div>
                    <div>
                      <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                        <div className="bg-error h-full rounded-full" styleName="width: 12%"></div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-1 flex items-center gap-1">
                    <button className="w-full py-1 px-2 rounded-md bg-primary text-on-primary hover:bg-on-primary-fixed font-label-sm text-label-sm font-semibold transition-colors shadow-sm">
                      <span className="material-symbols-outlined text-[14px]">bolt</span>
                      Expedite Run / Hot Dispatch
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierDashboardPage;