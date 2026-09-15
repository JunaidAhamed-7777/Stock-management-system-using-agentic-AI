import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProduct } from "../../services/product.service";
import { useCart } from "../../context/CartContext";
import { getErrorMessage } from "../../utils/errors";
import { formatCurrency, stockStatus } from "../../utils/format";
import { PageHeader } from "../../components/ui/PageHeader";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { StatusBadge } from "../../components/ui/Badge";
import { ErrorState } from "../../components/ui/ErrorState";
import { Loading } from "../../components/ui/Loading";
import { Input } from "../../components/ui/Input";

export function CustomerProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await getProduct(id);
        if (!cancelled) setProduct(data);
      } catch (err) {
        if (!cancelled) setError(getErrorMessage(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) return <Loading label="Loading product…" />;
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />;
  if (!product) return <ErrorState message="Product not found." />;

  const status = stockStatus(product);

  function onAdd() {
    addItem(product, quantity);
    setNotice("Added to cart.");
  }

  return (
    <>
      <PageHeader
        breadcrumb={<><span>Catalog</span><span className="text-outline-variant">/</span><span className="text-secondary font-medium font-mono-data">{product.sku}</span></>}
        title={product.name}
        badge={<StatusBadge status={status} />}
        actions={<Button variant="outline" onClick={() => navigate("/customer/products")}>Back to catalog</Button>}
      />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
        <Card className="lg:col-span-8 p-space-xl space-y-space-md">
          <p className="font-body-md text-on-surface-variant">{product.description || "No engineering description was provided for this SKU."}</p>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-space-md font-body-sm">
            <div><dt className="text-outline uppercase tracking-wider font-caption">SKU</dt><dd className="font-mono-data">{product.sku}</dd></div>
            <div><dt className="text-outline uppercase tracking-wider font-caption">Category</dt><dd>{product.category?.name || "—"}</dd></div>
            <div><dt className="text-outline uppercase tracking-wider font-caption">Supplier</dt><dd>{product.supplier?.companyName || "—"}</dd></div>
            <div><dt className="text-outline uppercase tracking-wider font-caption">Available</dt><dd>{product.quantity}</dd></div>
          </dl>
        </Card>
        <Card className="lg:col-span-4 p-space-xl space-y-space-md">
          <div className="font-headline-lg">{formatCurrency(product.price)}</div>
          <Input id="qty" label="Quantity" type="number" min="1" max={product.quantity} value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
          <Button className="w-full" disabled={status === "OUT"} onClick={onAdd}>Add to wholesale cart</Button>
          <Button className="w-full" variant="outline" onClick={() => navigate("/customer/cart")}>Go to checkout</Button>
          {notice ? <p className="font-caption text-secondary">{notice}</p> : null}
        </Card>
      </div>
    </>
  );
}
