import { useEffect, useState } from "react";
import { getForecast, getRecommendations, getStockout } from "../../services/ai.service";
import { getErrorMessage, isNotImplemented } from "../../utils/errors";
import { PageHeader } from "../../components/ui/PageHeader";
import { UnavailableState } from "../../components/ui/PageHeader";
import { Card } from "../../components/ui/Card";
import { Icon } from "../../components/ui/Icon";
import { ErrorState } from "../../components/ui/ErrorState";

async function probe(label, fn) {
  try {
    const data = await fn();
    return { label, status: "ready", data };
  } catch (error) {
    return {
      label,
      status: isNotImplemented(error) ? "unavailable" : "error",
      message: getErrorMessage(error),
    };
  }
}

export function AdminAI() {
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const next = await Promise.all([
          probe("Forecast", getForecast),
          probe("Stockout prediction", getStockout),
          probe("Recommendations", getRecommendations),
        ]);
        if (!cancelled) setResults(next);
      } catch (err) {
        if (!cancelled) setError(getErrorMessage(err));
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <PageHeader
        breadcrumb={<><span>Core</span><span className="text-outline-variant">/</span><span className="text-secondary font-medium">AI Forecasting</span></>}
        title="AI Forecasting & Stockout Prediction Hub"
        description="Connected to /api/ai/forecast, /api/ai/stockout, and /api/ai/recommendations. Predictions are shown only when the backend returns them."
        badge={
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-surface-container text-secondary text-label-sm">
            <Icon name="auto_graph" size={14} /> n8n-ready
          </span>
        }
      />
      {error ? <ErrorState message={error} /> : null}
      <UnavailableState
        title="AI Analysis Unavailable"
        message="The AI forecasting workflow has not been connected yet. These routes currently return 501 from the backend. When n8n or another agent runtime is enabled, this hub will render live forecasts without fabricating predictions."
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-space-base">
        {results.map((item) => (
          <Card key={item.label} className="p-space-lg space-y-space-sm">
            <div className="flex items-center gap-space-sm">
              <Icon name="psychology" className="text-secondary" />
              <h2 className="font-headline-sm">{item.label}</h2>
            </div>
            <p className="font-body-sm text-on-surface-variant">{item.message || "Awaiting workflow connection."}</p>
            <p className="font-caption uppercase tracking-wider text-outline">{item.status}</p>
          </Card>
        ))}
      </div>
    </>
  );
}
