import { useEffect, useState } from "react";
import { getSupplier, getSuppliers } from "../../services/discovery.service";
import { listProducts } from "../../services/product.service";
import { getErrorMessage } from "../../utils/errors";
import { PageHeader } from "../../components/ui/PageHeader";
import { Card } from "../../components/ui/Card";
import { Table } from "../../components/ui/Table";
import { EmptyState } from "../../components/ui/EmptyState";
import { ErrorState } from "../../components/ui/ErrorState";
import { PageSkeleton } from "../../components/ui/Loading";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";

export function AdminSuppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const [rows, catalog] = await Promise.all([getSuppliers(), listProducts()]);
      setSuppliers(rows || []);
      setProducts(catalog || []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function openSupplier(row) {
    try {
      setSelected(await getSupplier(row.id));
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  if (loading) return <PageSkeleton />;

  return (
    <>
      <PageHeader
        breadcrumb={<><span>Procurement</span><span className="text-outline-variant">/</span><span className="text-secondary font-medium">Suppliers</span></>}
        title="Supplier Network"
        description="Suppliers are loaded from GET /api/discovery/suppliers."
      />
      {error ? <ErrorState message={error} onRetry={load} /> : null}
      <Card>
        <Table
          rows={suppliers}
          empty={<EmptyState icon="local_shipping" title="No suppliers found" />}
          columns={[
            { key: "companyName", header: "Company" },
            { key: "contactNumber", header: "Contact" },
            { key: "address", header: "Address", render: (row) => row.address || "—" },
            { key: "user", header: "Account", render: (row) => row.user?.email || "—" },
            { key: "skus", header: "SKUs", align: "right", render: (row) => products.filter((item) => item.supplierId === row.id).length },
            { key: "actions", header: "", render: (row) => <Button variant="outline" onClick={() => openSupplier(row)}>View</Button> },
          ]}
        />
      </Card>
      <Modal open={Boolean(selected)} title={selected?.companyName || "Supplier"} onClose={() => setSelected(null)}>
        {selected ? (
          <dl className="space-y-space-sm font-body-sm">
            <div className="flex justify-between"><dt className="text-on-surface-variant">Supplier ID</dt><dd className="font-mono-data">{selected.id}</dd></div>
            <div className="flex justify-between"><dt className="text-on-surface-variant">Contact</dt><dd>{selected.contactNumber}</dd></div>
            <div className="flex justify-between"><dt className="text-on-surface-variant">Address</dt><dd>{selected.address || "—"}</dd></div>
            <div className="flex justify-between"><dt className="text-on-surface-variant">Linked user</dt><dd>{selected.user?.name} · {selected.user?.email}</dd></div>
          </dl>
        ) : null}
      </Modal>
    </>
  );
}
