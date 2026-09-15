import { useEffect, useState } from "react";
import { getStockTransactions } from "../../services/stock.service";
import { getErrorMessage, isNotImplemented } from "../../utils/errors";
import { PageHeader } from "../../components/ui/PageHeader";
import { UnavailableState } from "../../components/ui/PageHeader";
import { ErrorState } from "../../components/ui/ErrorState";
import { Card } from "../../components/ui/Card";
import { Table } from "../../components/ui/Table";
import { EmptyState } from "../../components/ui/EmptyState";
import { formatDate } from "../../utils/format";
import { PageSkeleton } from "../../components/ui/Loading";
import { Badge } from "../../components/ui/Badge";

export function AdminStockTransactions() {
  const [rows, setRows] = useState([]);
  const [unavailable, setUnavailable] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    setError("");
    setUnavailable("");
    try {
      const data = await getStockTransactions();
      setRows(Array.isArray(data) ? data : []);
    } catch (err) {
      if (isNotImplemented(err)) {
        setUnavailable(getErrorMessage(err));
      } else {
        setError(getErrorMessage(err));
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <>
      <PageHeader
        breadcrumb={<><span>Governance</span><span className="text-outline-variant">/</span><span className="text-secondary font-medium">Audit ledger</span></>}
        title="Stock Transactions Audit Ledger"
        description="This view calls GET /api/stock/transactions. Adjustments still record transactions on the server, but listing is not implemented yet."
      />
      {loading ? <PageSkeleton /> : null}
      {error ? <ErrorState message={error} onRetry={load} /> : null}
      {unavailable ? (
        <UnavailableState
          title="Transaction listing unavailable"
          message="The stock transaction ledger endpoint is not implemented yet. Stock still changes through order placement and manual adjustments; the immutable list cannot be retrieved until the backend exposes it."
        />
      ) : !loading && !error ? (
        <Card>
          <Table
            rows={rows}
            empty={<EmptyState icon="swap_horiz" title="No transactions recorded" />}
            columns={[
              { key: "id", header: "ID", render: (row) => <span className="font-mono-data">{row.id}</span> },
              { key: "type", header: "Type", render: (row) => <Badge tone={row.type === "IN" ? "success" : "warning"}>{row.type}</Badge> },
              { key: "quantity", header: "Qty", align: "right" },
              { key: "reason", header: "Reason", render: (row) => row.reason || "—" },
              { key: "createdAt", header: "When", render: (row) => formatDate(row.createdAt) },
            ]}
          />
        </Card>
      ) : null}
    </>
  );
}
