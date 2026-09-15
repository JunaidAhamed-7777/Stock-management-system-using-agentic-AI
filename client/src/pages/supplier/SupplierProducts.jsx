import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { listProducts } from "../../services/product.service";
import { getCategories } from "../../services/discovery.service";
import { getErrorMessage } from "../../utils/errors";
import { enrichProducts, formatCurrency, stockStatus } from "../../utils/format";
import { PageHeader, ToolbarSearch } from "../../components/ui/PageHeader";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Table } from "../../components/ui/Table";
import { StatusBadge } from "../../components/ui/Badge";
import { EmptyState } from "../../components/ui/EmptyState";
import { ErrorState } from "../../components/ui/ErrorState";
import { PageSkeleton } from "../../components/ui/Loading";
import { Icon } from "../../components/ui/Icon";

export function SupplierProducts() {
  const { supplier } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const initialSearch = new URLSearchParams(location.search).get("search") || "";
  const [search, setSearch] = useState(initialSearch);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load(searchOverride) {
    if (!supplier?.id) {
      setProducts([]);
      setLoading(false);
      setError("No supplier profile is linked to this account, so owned SKUs cannot be loaded.");
      return;
    }
    const searchValue = (searchOverride ?? search).trim();
    setLoading(true);
    setError("");
    try {
      const params = { supplier: supplier.id };
      if (searchValue) params.search = searchValue;
      const [rows, cats] = await Promise.all([listProducts(params), getCategories()]);
      setProducts(enrichProducts(rows || [], cats || [], [supplier]));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const next = new URLSearchParams(location.search).get("search") || "";
    setSearch(next);
    load(next);
  }, [supplier?.id, location.search]);

  const columns = useMemo(
    () => [
      { key: "sku", header: "SKU", render: (row) => <span className="font-mono-data">{row.sku}</span> },
      { key: "name", header: "Product" },
      { key: "category", header: "Category", render: (row) => row.category?.name || "—" },
      { key: "price", header: "Price", align: "right", render: (row) => formatCurrency(row.price) },
      { key: "quantity", header: "Qty", align: "right" },
      { key: "status", header: "Status", render: (row) => <StatusBadge status={stockStatus(row)} /> },
      { key: "actions", header: "", render: (row) => <Button variant="outline" onClick={() => navigate(`/supplier/products/${row.id}/edit`)}>Edit</Button> },
    ],
    [navigate]
  );

  return (
    <>
      <PageHeader
        breadcrumb={<><span>Catalog</span><span className="text-outline-variant">/</span><span className="text-secondary font-medium">Supplier products</span></>}
        title="Supplied Product Catalog"
        description="Only SKUs owned by your supplier profile are requested from the catalog API."
        actions={<Button variant="dark" onClick={() => navigate("/supplier/products/new")} icon={<Icon name="add" size={16} />}>Add product</Button>}
      />
      <Card className="p-space-base flex gap-space-sm">
        <ToolbarSearch value={search} onChange={setSearch} placeholder="Search your SKUs" />
        <Button onClick={load}>Search</Button>
      </Card>
      {error ? <ErrorState message={error} onRetry={load} /> : null}
      {loading ? <PageSkeleton /> : (
        <Card>
          <Table rows={products} columns={columns} empty={<EmptyState icon="inventory_2" title="No products found" actionLabel="Create product" onAction={() => navigate("/supplier/products/new")} />} />
        </Card>
      )}
    </>
  );
}
