import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Package {
    id: bigint;
    durationDays: bigint;
    title: string;
    destinationId: bigint;
    isPopular: boolean;
    inclusions: Array<string>;
    imageUrl: string;
    price: bigint;
}
export interface Destination {
    id: bigint;
    country: string;
    name: string;
    description: string;
    destinationType: string;
    highlights: Array<string>;
    imageUrl: string;
    isFeatured: boolean;
    price: bigint;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addDestination(dest: Destination): Promise<bigint>;
    addFavorite(destinationId: bigint): Promise<void>;
    addPackage(pkg: Package): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteDestination(id: bigint): Promise<void>;
    deletePackage(id: bigint): Promise<void>;
    getAllDestinations(): Promise<Array<Destination>>;
    getAllPackages(): Promise<Array<Package>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getDestinationsByMaxPrice(maxPrice: bigint): Promise<Array<Destination>>;
    getDestinationsByType(destType: string): Promise<Array<Destination>>;
    getFavorites(): Promise<Array<Destination>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    removeFavorite(destinationId: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateDestination(id: bigint, dest: Destination): Promise<void>;
    updatePackage(id: bigint, pkg: Package): Promise<void>;
}
