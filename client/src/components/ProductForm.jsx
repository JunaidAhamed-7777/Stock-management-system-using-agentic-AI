import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/Button";
import { Input, Select, Textarea } from "./ui/Input";
import { Card } from "./ui/Card";
import { ErrorState } from "./ui/ErrorState";
import { Icon } from "./ui/Icon";
import { PageHeader } from "./ui/PageHeader";
import { getErrorMessage } from "../utils/errors";
import { createProduct, getProduct, updateProduct } from "../services/product.service";
import { getCategories, getSuppliers } from "../services/discovery.service";
import { useAuth } from "../context/AuthContext";

const emptyForm = {
  name: "",
  description: "",
  sku: "",
  price: "",
  quantity: "",
  lowStockThreshold: "10",
  categoryId: "",
  supplierId: "",
};

export function ProductForm({ productId, cancelTo, successTo }) {
  const navigate = useNavigate();
  const { role, supplier } = useAuth();
  const isEdit = Boolean(productId);
  const [form, setForm] = useState(emptyForm);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const [cats, sups] = await Promise.all([getCategories(), getSuppliers()]);
        if (cancelled) return;
        setCategories(cats || []);
        setSuppliers(sups || []);
        if (isEdit) {
          const product = await getProduct(productId);
          if (cancelled) return;
          setForm({
            name: product.name || "",
            description: product.description || "",
            sku: product.sku || "",
            price: String(product.price ?? ""),
            quantity: String(product.quantity ?? ""),
            lowStockThreshold: String(product.lowStockThreshold ?? 10),
            categoryId: String(product.categoryId ?? ""),
            supplierId: String(product.supplierId ?? ""),
          });
        } else if (role === "SUPPLIER" && supplier?.id) {
          setForm((current) => ({ ...current, supplierId: String(supplier.id) }));
        }
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
  }, [isEdit, productId, role, supplier?.id]);

  function setField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function onSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    const payload = {
      name: form.name.trim(),
      description: form.description.trim() || undefined,
      sku: form.sku.trim(),
      price: Number(form.price),
      quantity: Number(form.quantity),
      lowStockThreshold: Number(form.lowStockThreshold),
      categoryId: Number(form.categoryId),
    };
    if (role === "ADMIN") {
      payload.supplierId = Number(form.supplierId);
    }
    try {
      if (isEdit) {
        await updateProduct(productId, payload);
      } else {
        await createProduct(payload);
      }
      navigate(successTo);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="font-body-sm text-on-surface-variant">Loading specification form…</div>;
  }

  return (
    <>
      <PageHeader
        breadcrumb={
          <>
            <span>Products</span>
            <span className="text-outline-variant">/</span>
            <span className="text-secondary font-medium">{isEdit ? "Edit specification" : "Create SKU"}</span>
          </>
        }
        title={isEdit ? "Edit Product Specification" : "Create Product Specification"}
        description="Only fields accepted by the StockFlow catalog API are submitted."
        actions={
          <>
            <Button variant="outline" onClick={() => navigate(cancelTo)}>Discard Changes</Button>
            <Button variant="dark" loading={saving} onClick={onSubmit} icon={<Icon name="publish" size={16} />}>
              {isEdit ? "Save SKU" : "Publish SKU"}
            </Button>
          </>
        }
      />
      {error ? <ErrorState message={error} /> : null}
      <form onSubmit={onSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl">
        <Card className="lg:col-span-8 p-space-xl flex flex-col gap-space-md">
          <div className="flex items-center gap-space-xs">
            <Icon name="fingerprint" className="text-secondary" />
            <h2 className="font-headline-sm text-headline-sm">Core Identification</h2>
          </div>
          <Input id="name" label="Product name" value={form.name} onChange={(e) => setField("name", e.target.value)} required />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
            <Input id="sku" label="SKU" value={form.sku} onChange={(e) => setField("sku", e.target.value)} required />
            <Select id="categoryId" label="Category" value={form.categoryId} onChange={(e) => setField("categoryId", e.target.value)} required>
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </Select>
          </div>
          <Textarea id="description" label="Description" value={form.description} onChange={(e) => setField("description", e.target.value)} />
        </Card>
        <Card className="lg:col-span-4 p-space-xl flex flex-col gap-space-md">
          <div className="flex items-center gap-space-xs">
            <Icon name="payments" className="text-secondary" />
            <h2 className="font-headline-sm text-headline-sm">Pricing & Stock</h2>
          </div>
          <Input id="price" label="Unit price" type="number" min="0" step="0.01" value={form.price} onChange={(e) => setField("price", e.target.value)} required />
          <Input id="quantity" label="On-hand quantity" type="number" min="0" step="1" value={form.quantity} onChange={(e) => setField("quantity", e.target.value)} required />
          <Input id="lowStockThreshold" label="Low-stock threshold" type="number" min="0" step="1" value={form.lowStockThreshold} onChange={(e) => setField("lowStockThreshold", e.target.value)} required />
          {role === "ADMIN" ? (
            <Select id="supplierId" label="Supplier" value={form.supplierId} onChange={(e) => setField("supplierId", e.target.value)} required>
              <option value="">Select supplier</option>
              {suppliers.map((item) => (
                <option key={item.id} value={item.id}>{item.companyName}</option>
              ))}
            </Select>
          ) : (
            <div className="font-body-sm text-body-sm text-on-surface-variant bg-surface-container-low rounded-lg p-space-sm">
              Supplier ownership is assigned automatically to {supplier?.companyName || "your supplier profile"}.
            </div>
          )}
          <Button type="submit" variant="dark" loading={saving}>{isEdit ? "Save changes" : "Create product"}</Button>
        </Card>
      </form>
    </>
  );
}
