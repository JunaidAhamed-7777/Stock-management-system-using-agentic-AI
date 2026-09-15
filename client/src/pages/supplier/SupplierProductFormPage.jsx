import { useParams } from "react-router-dom";
import { ProductForm } from "../../components/ProductForm";

export function SupplierProductFormPage() {
  const { id } = useParams();
  return <ProductForm productId={id} cancelTo="/supplier/products" successTo="/supplier/products" />;
}
