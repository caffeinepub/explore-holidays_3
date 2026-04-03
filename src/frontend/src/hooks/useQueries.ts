import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Destination, Package, UserProfile } from "../backend.d";
import { useActor } from "./useActor";

export function useDestinations() {
  const { actor, isFetching } = useActor();
  return useQuery<Destination[]>({
    queryKey: ["destinations"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllDestinations();
    },
    enabled: !!actor && !isFetching,
  });
}

export function usePackages() {
  const { actor, isFetching } = useActor();
  return useQuery<Package[]>({
    queryKey: ["packages"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPackages();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useFavorites() {
  const { actor, isFetching } = useActor();
  return useQuery<Destination[]>({
    queryKey: ["favorites"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getFavorites();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUserProfile() {
  const { actor, isFetching } = useActor();
  return useQuery<UserProfile | null>({
    queryKey: ["userProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddFavorite() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (destinationId: bigint) => actor!.addFavorite(destinationId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["favorites"] }),
  });
}

export function useRemoveFavorite() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (destinationId: bigint) => actor!.removeFavorite(destinationId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["favorites"] }),
  });
}

export function useAddDestination() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dest: Destination) => actor!.addDestination(dest),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["destinations"] }),
  });
}

export function useUpdateDestination() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dest }: { id: bigint; dest: Destination }) =>
      actor!.updateDestination(id, dest),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["destinations"] }),
  });
}

export function useDeleteDestination() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: bigint) => actor!.deleteDestination(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["destinations"] }),
  });
}

export function useAddPackage() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (pkg: Package) => actor!.addPackage(pkg),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["packages"] }),
  });
}

export function useUpdatePackage() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, pkg }: { id: bigint; pkg: Package }) =>
      actor!.updatePackage(id, pkg),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["packages"] }),
  });
}

export function useDeletePackage() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: bigint) => actor!.deletePackage(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["packages"] }),
  });
}

export function useSaveProfile() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (profile: UserProfile) => actor!.saveCallerUserProfile(profile),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["userProfile"] }),
  });
}
