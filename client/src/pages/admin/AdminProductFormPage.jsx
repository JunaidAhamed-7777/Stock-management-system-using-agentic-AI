import { ProductForm } from "../../components/ProductForm";
import { useParams } from "react-router-dom";

export function AdminProductFormPage() {
  const { id } = useParams();
  return <ProductForm productId={id} cancelTo="/admin/products" successTo="/admin/products" />;
}
