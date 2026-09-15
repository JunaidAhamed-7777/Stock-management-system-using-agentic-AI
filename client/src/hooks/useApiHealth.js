import { useEffect, useState } from "react";
import { getHealth } from "../services/api";

export function useApiHealth() {
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    let cancelled = false;
    getHealth()
      .then((data) => {
        if (!cancelled) setStatus(data?.success ? "live" : "down");
      })
      .catch(() => {
        if (!cancelled) setStatus("down");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return status;
}
