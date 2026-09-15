import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { listProducts } from "../../services/product.service";
import { getCategories, getSuppliers } from "../../services/discovery.service";
import { useCart } from "../../context/CartContext";
import { getErrorMessage } from "../../utils/errors";
import { enrichProducts, formatCurrency, stockStatus } from "../../utils/format";
import { PageHeader, ToolbarSearch } from "../../components/ui/PageHeader";
import { Card } from "../../components/ui/Card";
import { Select } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { StatusBadge } from "../../components/ui/Badge";
import { EmptyState } from "../../components/ui/EmptyState";
import { ErrorState } from "../../components/ui/ErrorState";
import { PageSkeleton } from "../../components/ui/Loading";
import { Icon } from "../../components/ui/Icon";

export function CustomerProducts() {
  const navigate = useNavigate();
  const location = useLocation();
  const { addItem } = useCart();
  const initialSearch = new URLSearchParams(location.search).get("search") || "";
  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState("");
  const [supplier, setSupplier] = useState("");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (category) params.category = category;
      if (supplier) params.supplier = supplier;
      const [rows, cats, sups] = await Promise.all([listProducts(params), getCategories(), getSuppliers()]);
      setCategories(cats || []);
      setSuppliers(sups || []);
      setProducts(enrichProducts(rows || [], cats || [], sups || []));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function addToCart(product) {
    if ((product.quantity || 0) <= 0) return;
    addItem(product, 1);
    setNotice(`${product.name} added to cart.`);
  }

  return (
    <>
      <PageHeader
        breadcrumb={<><span>Catalog</span><span className="text-outline-variant">/</span><span className="text-secondary font-medium">Contracted products</span></>}
        title="Product Catalog"
        description="Live SKUs from GET /api/products."
        actions={<Button variant="ghost" onClick={() => navigate("/customer/cart")}>Open cart</Button>}
      />
      <Card className="p-space-base flex flex-col lg:flex-row gap-space-sm">
        <ToolbarSearch value={search} onChange={setSearch} placeholder="Search catalog" />
        <Select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All categories</option>
          {categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
        </Select>
        <Select value={supplier} onChange={(e) => setSupplier(e.target.value)}>
          <option value="">All suppliers</option>
          {suppliers.map((item) => <option key={item.id} value={item.id}>{item.companyName}</option>)}
        </Select>
        <Button onClick={load}>Apply</Button>
      </Card>
      {notice ? <p className="font-caption text-secondary">{notice}</p> : null}
      {error ? <ErrorState message={error} onRetry={load} /> : null}
      {loading ? <PageSkeleton /> : products.length === 0 ? (
        <Card><EmptyState icon="storefront" title="No products found" description="Try a different search or category." /></Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-space-base">
          {products.map((product) => {
            const status = stockStatus(product);
            return (
              <Card key={product.id} className="p-space-lg flex flex-col gap-space-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-space-sm">
                  <div>
                    <p className="font-caption text-outline uppercase tracking-wider font-mono-data">{product.sku}</p>
                    <h3 className="font-headline-sm text-headline-sm truncate">{product.name}</h3>
                  </div>
                  <StatusBadge status={status} />
                </div>
                <p className="font-body-sm text-on-surface-variant line-clamp-2 min-h-[36px]">{product.description || "No description provided."}</p>
                <div className="flex items-center justify-between font-body-sm">
                  <span className="font-headline-md">{formatCurrency(product.price)}</span>
                  <span className="text-on-surface-variant">{product.quantity} on hand</span>
                </div>
                <p className="font-caption text-outline">{product.category?.name || "Uncategorized"} · {product.supplier?.companyName || "Supplier"}</p>
                <div className="flex gap-space-sm mt-auto">
                  <Button variant="outline" className="flex-1" onClick={() => navigate(`/customer/products/${product.id}`)}>Details</Button>
                  <Button className="flex-1" disabled={status === "OUT"} onClick={() => addToCart(product)} icon={<Icon name="add_shopping_cart" size={16} />}>
                    Add
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
}
