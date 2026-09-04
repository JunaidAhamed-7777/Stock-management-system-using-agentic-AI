import React from "react";
import { useAuth } from "../../context/AuthContext";
import { Loading, EmptyState, ErrorState } from "../../components/ui";

const AdminAIPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="py-8">
      <div className="bg-white rounded-lg p-6 shadow">
        <h2 className="text-xl font-medium text-gray-500 mb-4">AI Dashboard</h2>

        <p className="text-gray-500 mb-4">
          AI functionality is not implemented yet. The AI dashboard exists as a UI
          placeholder. Future AI functionality will be connected through n8n.
        </p>

        <div className="p-8 bg-surface-container-lowest rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 mb-2">
            AI Forecasting Stockout Prediction Hub
          </h3>
          <p className="text-gray-500 mb-4">
            This section will feature autonomous depletion predictions, 30-day Bayesian
            projection curves, and ARE replenishment guardrails once the n8n integration
            is complete.
          </p>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-400">
              Status: Pending n8n integration. AI endpoints currently return placeholder
              responses indicating functionality will be integrated through n8n.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAIPage;