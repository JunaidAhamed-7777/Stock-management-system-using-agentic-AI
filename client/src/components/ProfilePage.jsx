import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getProfile, updateProfile } from "../services/user.service";
import { getErrorMessage } from "../utils/errors";
import { PageHeader } from "./ui/PageHeader";
import { Card } from "./ui/Card";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { Badge } from "./ui/Badge";
import { ErrorState } from "./ui/ErrorState";
import { Loading } from "./ui/Loading";

export function ProfilePage() {
  const { user, refreshUser, supplier } = useAuth();
  const [form, setForm] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const profile = await getProfile();
        if (!cancelled) setForm({ name: profile.name || "", email: profile.email || "" });
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
  }, []);

  async function onSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");
    try {
      await updateProfile({ name: form.name, email: form.email });
      await refreshUser();
      setMessage("Profile updated.");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <Loading label="Loading profile…" />;

  return (
    <>
      <PageHeader
        breadcrumb={
          <>
            <span>Account</span>
            <span className="text-outline-variant">/</span>
            <span className="text-secondary font-medium">Profile</span>
          </>
        }
        title="User Profile & Role Permissions"
        description="Identity is sourced from the authenticated backend session. Password and RBAC matrix changes are not exposed by the API."
        badge={<Badge tone="info">{user?.role}</Badge>}
      />
      {error ? <ErrorState message={error} /> : null}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
        <Card className="lg:col-span-8 p-space-xl">
          <form onSubmit={onSubmit} className="flex flex-col gap-space-md max-w-xl">
            <Input id="name" label="Display name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <Input id="email" label="Corporate email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            <Button type="submit" loading={saving}>Save profile</Button>
            {message ? <p className="font-caption text-caption text-secondary">{message}</p> : null}
          </form>
        </Card>
        <Card className="lg:col-span-4 p-space-xl space-y-space-sm">
          <h2 className="font-headline-sm text-headline-sm">Session identity</h2>
          <dl className="space-y-space-sm font-body-sm text-body-sm">
            <div className="flex justify-between gap-space-sm"><dt className="text-on-surface-variant">User ID</dt><dd className="font-mono-data">{user?.id}</dd></div>
            <div className="flex justify-between gap-space-sm"><dt className="text-on-surface-variant">Role</dt><dd>{user?.role}</dd></div>
            {supplier ? (
              <>
                <div className="flex justify-between gap-space-sm"><dt className="text-on-surface-variant">Company</dt><dd>{supplier.companyName}</dd></div>
                <div className="flex justify-between gap-space-sm"><dt className="text-on-surface-variant">Supplier ID</dt><dd className="font-mono-data">{supplier.id}</dd></div>
              </>
            ) : null}
          </dl>
        </Card>
      </div>
    </>
  );
}
