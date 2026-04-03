import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Loader2,
  MapPin,
  Package as PackageIcon,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Package as DestPackage, Destination } from "../backend.d";
import { SAMPLE_DESTINATIONS, SAMPLE_PACKAGES } from "../data/sampleData";
import {
  useAddDestination,
  useAddPackage,
  useDeleteDestination,
  useDeletePackage,
  useDestinations,
  usePackages,
  useUpdateDestination,
  useUpdatePackage,
} from "../hooks/useQueries";

type Page = "home" | "search" | "favorites" | "profile" | "detail" | "admin";

interface AdminPageProps {
  onNavigate: (page: Page) => void;
}

const EMPTY_DEST: Omit<Destination, "id"> = {
  name: "",
  country: "",
  destinationType: "Beach",
  description: "",
  highlights: [],
  price: BigInt(0),
  imageUrl: "",
  isFeatured: false,
};

const EMPTY_PKG: Omit<DestPackage, "id"> = {
  title: "",
  destinationId: BigInt(0),
  durationDays: BigInt(7),
  price: BigInt(0),
  imageUrl: "",
  inclusions: [],
  isPopular: false,
};

export default function AdminPage({ onNavigate }: AdminPageProps) {
  const { data: destData } = useDestinations();
  const { data: pkgData } = usePackages();
  const destinations = destData?.length ? destData : SAMPLE_DESTINATIONS;
  const packages = pkgData?.length ? pkgData : SAMPLE_PACKAGES;

  const addDest = useAddDestination();
  const updateDest = useUpdateDestination();
  const deleteDest = useDeleteDestination();
  const addPkg = useAddPackage();
  const updatePkg = useUpdatePackage();
  const deletePkg = useDeletePackage();

  const [destDialog, setDestDialog] = useState<"add" | "edit" | null>(null);
  const [editingDest, setEditingDest] = useState<Destination | null>(null);
  const [destForm, setDestForm] = useState<Omit<Destination, "id">>(EMPTY_DEST);

  const [pkgDialog, setPkgDialog] = useState<"add" | "edit" | null>(null);
  const [editingPkg, setEditingPkg] = useState<DestPackage | null>(null);
  const [pkgForm, setPkgForm] = useState<Omit<DestPackage, "id">>(EMPTY_PKG);

  const [confirmDeleteDest, setConfirmDeleteDest] = useState<bigint | null>(
    null,
  );
  const [confirmDeletePkg, setConfirmDeletePkg] = useState<bigint | null>(null);

  // --- Destination handlers ---
  const openAddDest = () => {
    setDestForm(EMPTY_DEST);
    setEditingDest(null);
    setDestDialog("add");
  };

  const openEditDest = (dest: Destination) => {
    setDestForm({ ...dest });
    setEditingDest(dest);
    setDestDialog("edit");
  };

  const handleSaveDest = async () => {
    try {
      if (destDialog === "edit" && editingDest) {
        await updateDest.mutateAsync({
          id: editingDest.id,
          dest: { ...destForm, id: editingDest.id },
        });
        toast.success("Destination updated");
      } else {
        await addDest.mutateAsync({ ...destForm, id: BigInt(0) });
        toast.success("Destination added");
      }
      setDestDialog(null);
    } catch {
      toast.error("Failed to save destination");
    }
  };

  const handleDeleteDest = async (id: bigint) => {
    try {
      await deleteDest.mutateAsync(id);
      toast.success("Destination removed");
      setConfirmDeleteDest(null);
    } catch {
      toast.error("Failed to delete");
    }
  };

  // --- DestPackage handlers ---
  const openAddPkg = () => {
    setPkgForm(EMPTY_PKG);
    setEditingPkg(null);
    setPkgDialog("add");
  };

  const openEditPkg = (pkg: DestPackage) => {
    setPkgForm({ ...pkg });
    setEditingPkg(pkg as DestPackage);
    setPkgDialog("edit");
  };

  const handleSavePkg = async () => {
    try {
      if (pkgDialog === "edit" && editingPkg) {
        await updatePkg.mutateAsync({
          id: editingPkg.id,
          pkg: { ...pkgForm, id: editingPkg.id },
        });
        toast.success("DestPackage updated");
      } else {
        await addPkg.mutateAsync({ ...pkgForm, id: BigInt(0) });
        toast.success("DestPackage added");
      }
      setPkgDialog(null);
    } catch {
      toast.error("Failed to save package");
    }
  };

  const handleDeletePkg = async (id: bigint) => {
    try {
      await deletePkg.mutateAsync(id);
      toast.success("DestPackage removed");
      setConfirmDeletePkg(null);
    } catch {
      toast.error("Failed to delete");
    }
  };

  const isSavingDest = addDest.isPending || updateDest.isPending;
  const isSavingPkg = addPkg.isPending || updatePkg.isPending;

  return (
    <div className="min-h-screen pb-24" style={{ background: "#0A0A0A" }}>
      {/* Header */}
      <div
        className="px-4 pt-12 pb-4 sticky top-0 z-40"
        style={{
          background: "rgba(10,10,10,0.97)",
          backdropFilter: "blur(8px)",
        }}
      >
        <div className="max-w-[430px] mx-auto flex items-center gap-3">
          <button
            type="button"
            data-ocid="admin.back.button"
            onClick={() => onNavigate("profile")}
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: "#1B1B1B", color: "#F2F2F2" }}
          >
            <ArrowLeft size={18} />
          </button>
          <h1 className="font-display text-2xl" style={{ color: "#F2F2F2" }}>
            ADMIN PANEL
          </h1>
        </div>
      </div>

      <div className="max-w-[430px] mx-auto px-4">
        <Tabs defaultValue="destinations" data-ocid="admin.tabs">
          <TabsList className="w-full mb-4" style={{ background: "#1B1B1B" }}>
            <TabsTrigger
              data-ocid="admin.destinations.tab"
              value="destinations"
              className="flex-1"
            >
              <MapPin size={14} className="mr-1" /> Destinations
            </TabsTrigger>
            <TabsTrigger
              data-ocid="admin.packages.tab"
              value="packages"
              className="flex-1"
            >
              <PackageIcon size={14} className="mr-1" /> Packages
            </TabsTrigger>
          </TabsList>

          {/* DESTINATIONS TAB */}
          <TabsContent value="destinations">
            <div className="flex justify-end mb-3">
              <button
                type="button"
                data-ocid="admin.destinations.add.open_modal_button"
                onClick={openAddDest}
                className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200"
                style={{ background: "#E00000", color: "#F2F2F2" }}
              >
                <Plus size={16} /> Add Destination
              </button>
            </div>
            <div className="space-y-3" data-ocid="admin.destinations.list">
              {destinations.map((dest, i) => (
                <motion.div
                  key={dest.id.toString()}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  data-ocid={`admin.destinations.item.${i + 1}`}
                  className="flex items-center gap-3 p-3 rounded-xl"
                  style={{ background: "#1B1B1B", border: "1px solid #2A2A2A" }}
                >
                  <img
                    src={dest.imageUrl}
                    alt={dest.name}
                    className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p
                      className="font-medium text-sm truncate"
                      style={{ color: "#F2F2F2" }}
                    >
                      {dest.name}
                    </p>
                    <p className="text-xs" style={{ color: "#8E8E8E" }}>
                      {dest.country} · {dest.destinationType}
                    </p>
                    <p
                      className="text-xs font-bold"
                      style={{ color: "#E00000" }}
                    >
                      ${Number(dest.price).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      data-ocid={`admin.destinations.edit_button.${i + 1}`}
                      onClick={() => openEditDest(dest)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200"
                      style={{ background: "#2A2A2A", color: "#B8B8B8" }}
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      type="button"
                      data-ocid={`admin.destinations.delete_button.${i + 1}`}
                      onClick={() => setConfirmDeleteDest(dest.id)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200"
                      style={{
                        background: "rgba(224,0,0,0.15)",
                        color: "#E00000",
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* PACKAGES TAB */}
          <TabsContent value="packages">
            <div className="flex justify-end mb-3">
              <button
                type="button"
                data-ocid="admin.packages.add.open_modal_button"
                onClick={openAddPkg}
                className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200"
                style={{ background: "#E00000", color: "#F2F2F2" }}
              >
                <Plus size={16} /> Add DestPackage
              </button>
            </div>
            <div className="space-y-3" data-ocid="admin.packages.list">
              {packages.map((pkg, i) => (
                <motion.div
                  key={pkg.id.toString()}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  data-ocid={`admin.packages.item.${i + 1}`}
                  className="flex items-center gap-3 p-3 rounded-xl"
                  style={{ background: "#1B1B1B", border: "1px solid #2A2A2A" }}
                >
                  <img
                    src={pkg.imageUrl}
                    alt={pkg.title}
                    className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p
                      className="font-medium text-sm truncate"
                      style={{ color: "#F2F2F2" }}
                    >
                      {pkg.title}
                    </p>
                    <p className="text-xs" style={{ color: "#8E8E8E" }}>
                      {Number(pkg.durationDays)} days
                    </p>
                    <p
                      className="text-xs font-bold"
                      style={{ color: "#E00000" }}
                    >
                      ${Number(pkg.price).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      data-ocid={`admin.packages.edit_button.${i + 1}`}
                      onClick={() => openEditPkg(pkg)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ background: "#2A2A2A", color: "#B8B8B8" }}
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      type="button"
                      data-ocid={`admin.packages.delete_button.${i + 1}`}
                      onClick={() => setConfirmDeletePkg(pkg.id)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{
                        background: "rgba(224,0,0,0.15)",
                        color: "#E00000",
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Destination Dialog */}
      <Dialog
        open={destDialog !== null}
        onOpenChange={(o) => !o && setDestDialog(null)}
      >
        <DialogContent
          data-ocid="admin.destinations.dialog"
          className="max-w-[400px] max-h-[90vh] overflow-y-auto"
          style={{
            background: "#1B1B1B",
            border: "1px solid #2A2A2A",
            color: "#F2F2F2",
          }}
        >
          <DialogHeader>
            <DialogTitle style={{ color: "#F2F2F2" }}>
              {destDialog === "edit" ? "Edit Destination" : "Add Destination"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label style={{ color: "#B8B8B8" }}>Name</Label>
              <Input
                data-ocid="admin.destinations.name.input"
                value={destForm.name}
                onChange={(e) =>
                  setDestForm((p) => ({ ...p, name: e.target.value }))
                }
                style={{
                  background: "#2A2A2A",
                  borderColor: "#3A3A3A",
                  color: "#F2F2F2",
                }}
              />
            </div>
            <div>
              <Label style={{ color: "#B8B8B8" }}>Country</Label>
              <Input
                data-ocid="admin.destinations.country.input"
                value={destForm.country}
                onChange={(e) =>
                  setDestForm((p) => ({ ...p, country: e.target.value }))
                }
                style={{
                  background: "#2A2A2A",
                  borderColor: "#3A3A3A",
                  color: "#F2F2F2",
                }}
              />
            </div>
            <div>
              <Label style={{ color: "#B8B8B8" }}>Type</Label>
              <Input
                data-ocid="admin.destinations.type.input"
                value={destForm.destinationType}
                onChange={(e) =>
                  setDestForm((p) => ({
                    ...p,
                    destinationType: e.target.value,
                  }))
                }
                style={{
                  background: "#2A2A2A",
                  borderColor: "#3A3A3A",
                  color: "#F2F2F2",
                }}
              />
            </div>
            <div>
              <Label style={{ color: "#B8B8B8" }}>Description</Label>
              <Textarea
                data-ocid="admin.destinations.description.textarea"
                value={destForm.description}
                onChange={(e) =>
                  setDestForm((p) => ({ ...p, description: e.target.value }))
                }
                rows={3}
                style={{
                  background: "#2A2A2A",
                  borderColor: "#3A3A3A",
                  color: "#F2F2F2",
                }}
              />
            </div>
            <div>
              <Label style={{ color: "#B8B8B8" }}>Price (USD)</Label>
              <Input
                data-ocid="admin.destinations.price.input"
                type="number"
                value={Number(destForm.price)}
                onChange={(e) =>
                  setDestForm((p) => ({
                    ...p,
                    price: BigInt(e.target.value || 0),
                  }))
                }
                style={{
                  background: "#2A2A2A",
                  borderColor: "#3A3A3A",
                  color: "#F2F2F2",
                }}
              />
            </div>
            <div>
              <Label style={{ color: "#B8B8B8" }}>Image URL</Label>
              <Input
                data-ocid="admin.destinations.imageurl.input"
                value={destForm.imageUrl}
                onChange={(e) =>
                  setDestForm((p) => ({ ...p, imageUrl: e.target.value }))
                }
                style={{
                  background: "#2A2A2A",
                  borderColor: "#3A3A3A",
                  color: "#F2F2F2",
                }}
              />
            </div>
            <div>
              <Label style={{ color: "#B8B8B8" }}>
                Highlights (comma-separated)
              </Label>
              <Textarea
                data-ocid="admin.destinations.highlights.textarea"
                value={destForm.highlights.join(", ")}
                onChange={(e) =>
                  setDestForm((p) => ({
                    ...p,
                    highlights: e.target.value
                      .split(",")
                      .map((h) => h.trim())
                      .filter(Boolean),
                  }))
                }
                rows={2}
                style={{
                  background: "#2A2A2A",
                  borderColor: "#3A3A3A",
                  color: "#F2F2F2",
                }}
              />
            </div>
            <div className="flex items-center gap-3">
              <Switch
                data-ocid="admin.destinations.featured.switch"
                checked={destForm.isFeatured}
                onCheckedChange={(v) =>
                  setDestForm((p) => ({ ...p, isFeatured: v }))
                }
              />
              <Label style={{ color: "#B8B8B8" }}>Featured</Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              data-ocid="admin.destinations.cancel.cancel_button"
              variant="outline"
              onClick={() => setDestDialog(null)}
              style={{
                borderColor: "#3A3A3A",
                color: "#B8B8B8",
                background: "transparent",
              }}
            >
              Cancel
            </Button>
            <Button
              data-ocid="admin.destinations.save.submit_button"
              onClick={handleSaveDest}
              disabled={isSavingDest}
              style={{ background: "#E00000", color: "#F2F2F2" }}
            >
              {isSavingDest ? (
                <Loader2 size={14} className="mr-1 animate-spin" />
              ) : null}
              {destDialog === "edit" ? "Update" : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DestPackage Dialog */}
      <Dialog
        open={pkgDialog !== null}
        onOpenChange={(o) => !o && setPkgDialog(null)}
      >
        <DialogContent
          data-ocid="admin.packages.dialog"
          className="max-w-[400px] max-h-[90vh] overflow-y-auto"
          style={{
            background: "#1B1B1B",
            border: "1px solid #2A2A2A",
            color: "#F2F2F2",
          }}
        >
          <DialogHeader>
            <DialogTitle style={{ color: "#F2F2F2" }}>
              {pkgDialog === "edit" ? "Edit DestPackage" : "Add DestPackage"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label style={{ color: "#B8B8B8" }}>Title</Label>
              <Input
                data-ocid="admin.packages.title.input"
                value={pkgForm.title}
                onChange={(e) =>
                  setPkgForm((p) => ({ ...p, title: e.target.value }))
                }
                style={{
                  background: "#2A2A2A",
                  borderColor: "#3A3A3A",
                  color: "#F2F2F2",
                }}
              />
            </div>
            <div>
              <Label style={{ color: "#B8B8B8" }}>Duration (days)</Label>
              <Input
                data-ocid="admin.packages.duration.input"
                type="number"
                value={Number(pkgForm.durationDays)}
                onChange={(e) =>
                  setPkgForm((p) => ({
                    ...p,
                    durationDays: BigInt(e.target.value || 1),
                  }))
                }
                style={{
                  background: "#2A2A2A",
                  borderColor: "#3A3A3A",
                  color: "#F2F2F2",
                }}
              />
            </div>
            <div>
              <Label style={{ color: "#B8B8B8" }}>Price (USD)</Label>
              <Input
                data-ocid="admin.packages.price.input"
                type="number"
                value={Number(pkgForm.price)}
                onChange={(e) =>
                  setPkgForm((p) => ({
                    ...p,
                    price: BigInt(e.target.value || 0),
                  }))
                }
                style={{
                  background: "#2A2A2A",
                  borderColor: "#3A3A3A",
                  color: "#F2F2F2",
                }}
              />
            </div>
            <div>
              <Label style={{ color: "#B8B8B8" }}>Image URL</Label>
              <Input
                data-ocid="admin.packages.imageurl.input"
                value={pkgForm.imageUrl}
                onChange={(e) =>
                  setPkgForm((p) => ({ ...p, imageUrl: e.target.value }))
                }
                style={{
                  background: "#2A2A2A",
                  borderColor: "#3A3A3A",
                  color: "#F2F2F2",
                }}
              />
            </div>
            <div>
              <Label style={{ color: "#B8B8B8" }}>
                Inclusions (comma-separated)
              </Label>
              <Textarea
                data-ocid="admin.packages.inclusions.textarea"
                value={pkgForm.inclusions.join(", ")}
                onChange={(e) =>
                  setPkgForm((p) => ({
                    ...p,
                    inclusions: e.target.value
                      .split(",")
                      .map((i) => i.trim())
                      .filter(Boolean),
                  }))
                }
                rows={2}
                style={{
                  background: "#2A2A2A",
                  borderColor: "#3A3A3A",
                  color: "#F2F2F2",
                }}
              />
            </div>
            <div className="flex items-center gap-3">
              <Switch
                data-ocid="admin.packages.popular.switch"
                checked={pkgForm.isPopular}
                onCheckedChange={(v) =>
                  setPkgForm((p) => ({ ...p, isPopular: v }))
                }
              />
              <Label style={{ color: "#B8B8B8" }}>Popular</Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              data-ocid="admin.packages.cancel.cancel_button"
              variant="outline"
              onClick={() => setPkgDialog(null)}
              style={{
                borderColor: "#3A3A3A",
                color: "#B8B8B8",
                background: "transparent",
              }}
            >
              Cancel
            </Button>
            <Button
              data-ocid="admin.packages.save.submit_button"
              onClick={handleSavePkg}
              disabled={isSavingPkg}
              style={{ background: "#E00000", color: "#F2F2F2" }}
            >
              {isSavingPkg ? (
                <Loader2 size={14} className="mr-1 animate-spin" />
              ) : null}
              {pkgDialog === "edit" ? "Update" : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm delete destination */}
      <Dialog
        open={confirmDeleteDest !== null}
        onOpenChange={(o) => !o && setConfirmDeleteDest(null)}
      >
        <DialogContent
          data-ocid="admin.destinations.delete.dialog"
          style={{ background: "#1B1B1B", border: "1px solid #2A2A2A" }}
        >
          <DialogHeader>
            <DialogTitle style={{ color: "#F2F2F2" }}>
              Confirm Delete
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm" style={{ color: "#B8B8B8" }}>
            Are you sure you want to remove this destination? This action cannot
            be undone.
          </p>
          <DialogFooter>
            <Button
              data-ocid="admin.destinations.delete.cancel_button"
              variant="outline"
              onClick={() => setConfirmDeleteDest(null)}
              style={{
                borderColor: "#3A3A3A",
                color: "#B8B8B8",
                background: "transparent",
              }}
            >
              Cancel
            </Button>
            <Button
              data-ocid="admin.destinations.delete.confirm_button"
              onClick={() =>
                confirmDeleteDest && handleDeleteDest(confirmDeleteDest)
              }
              disabled={deleteDest.isPending}
              style={{ background: "#E00000", color: "#F2F2F2" }}
            >
              {deleteDest.isPending ? (
                <Loader2 size={14} className="mr-1 animate-spin" />
              ) : null}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm delete package */}
      <Dialog
        open={confirmDeletePkg !== null}
        onOpenChange={(o) => !o && setConfirmDeletePkg(null)}
      >
        <DialogContent
          data-ocid="admin.packages.delete.dialog"
          style={{ background: "#1B1B1B", border: "1px solid #2A2A2A" }}
        >
          <DialogHeader>
            <DialogTitle style={{ color: "#F2F2F2" }}>
              Confirm Delete
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm" style={{ color: "#B8B8B8" }}>
            Are you sure you want to remove this package? This action cannot be
            undone.
          </p>
          <DialogFooter>
            <Button
              data-ocid="admin.packages.delete.cancel_button"
              variant="outline"
              onClick={() => setConfirmDeletePkg(null)}
              style={{
                borderColor: "#3A3A3A",
                color: "#B8B8B8",
                background: "transparent",
              }}
            >
              Cancel
            </Button>
            <Button
              data-ocid="admin.packages.delete.confirm_button"
              onClick={() =>
                confirmDeletePkg && handleDeletePkg(confirmDeletePkg)
              }
              disabled={deletePkg.isPending}
              style={{ background: "#E00000", color: "#F2F2F2" }}
            >
              {deletePkg.isPending ? (
                <Loader2 size={14} className="mr-1 animate-spin" />
              ) : null}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
