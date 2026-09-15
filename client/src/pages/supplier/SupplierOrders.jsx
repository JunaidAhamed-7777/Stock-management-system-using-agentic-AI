import { OrdersPage } from "../admin/AdminOrders";

export function SupplierOrders() {
  return (
    <OrdersPage
      title="Supplier Orders & ASN Dispatch"
      description="Orders that contain at least one of your SKUs. Status updates are allowed when the backend confirms ownership."
      canUpdateStatus
    />
  );
}
