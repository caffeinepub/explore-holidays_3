import Map "mo:core/Map";
import Set "mo:core/Set";
import List "mo:core/List";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Order "mo:core/Order";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  public type UserProfile = {
    name : Text;
  };

  public type Destination = {
    id : Nat;
    name : Text;
    country : Text;
    description : Text;
    destinationType : Text;
    price : Nat;
    imageUrl : Text;
    highlights : [Text];
    isFeatured : Bool;
  };

  public type Package = {
    id : Nat;
    title : Text;
    destinationId : Nat;
    durationDays : Nat;
    price : Nat;
    imageUrl : Text;
    inclusions : [Text];
    isPopular : Bool;
  };

  module Destination {
    public func compare(dest1 : Destination, dest2 : Destination) : Order.Order {
      Nat.compare(dest1.id, dest2.id);
    };
  };

  module Package {
    public func compare(pkg1 : Package, pkg2 : Package) : Order.Order {
      Nat.compare(pkg1.id, pkg2.id);
    };
  };

  // State
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let userProfiles = Map.empty<Principal, UserProfile>();
  let destinations = Map.empty<Nat, Destination>();
  let packages = Map.empty<Nat, Package>();
  let favorites = Map.empty<Principal, Set.Set<Nat>>();
  var nextDestinationId = 1;
  var nextPackageId = 1;

  // User Profile Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Seeds
  func seedSampleData() {
    if (destinations.isEmpty()) {
      let dest1 : Destination = {
        id = nextDestinationId;
        name = "Santorini";
        country = "Greece";
        description = "Famous for its stunning cliffside villages and beautiful views.";
        destinationType = "Beach";
        price = 1500;
        imageUrl = "https://example.com/santorini.jpg";
        highlights = List.fromArray(["Blue Domes", "Sunsets", "Beaches"]).toArray();
        isFeatured = true;
      };
      destinations.add(nextDestinationId, dest1);
      nextDestinationId += 1;

      let dest2 : Destination = {
        id = nextDestinationId;
        name = "Swiss Alps";
        country = "Switzerland";
        description = "Beautiful alpine region offering skiing, hiking, and breathtaking scenery.";
        destinationType = "Mountain";
        price = 2000;
        imageUrl = "https://example.com/swiss-alps.jpg";
        highlights = List.fromArray(["Skiing", "Hiking", "Lake Views"]).toArray();
        isFeatured = true;
      };
      destinations.add(nextDestinationId, dest2);
      nextDestinationId += 1;

      let dest3 : Destination = {
        id = nextDestinationId;
        name = "Bali";
        country = "Indonesia";
        description = "Renowned island getaway with stunning beaches, temples, and cultural experiences.";
        destinationType = "Beach";
        price = 1200;
        imageUrl = "https://example.com/bali.jpg";
        highlights = List.fromArray(["Temples", "Surfing", "Spa Resorts"]).toArray();
        isFeatured = false;
      };
      destinations.add(nextDestinationId, dest3);
      nextDestinationId += 1;

      let dest4 : Destination = {
        id = nextDestinationId;
        name = "Kyoto";
        country = "Japan";
        description = "Historic city known for its temples, gardens, and traditional culture.";
        destinationType = "Cultural";
        price = 1600;
        imageUrl = "https://example.com/kyoto.jpg";
        highlights = List.fromArray(["Temples", "Gardens", "Traditional Food"]).toArray();
        isFeatured = true;
      };
      destinations.add(nextDestinationId, dest4);
      nextDestinationId += 1;

      let dest5 : Destination = {
        id = nextDestinationId;
        name = "Machu Picchu";
        country = "Peru";
        description = "World-famous Incan citadel set high in Andes Mountains.";
        destinationType = "Adventure";
        price = 2500;
        imageUrl = "https://example.com/machu-picchu.jpg";
        highlights = List.fromArray(["Ruins", "Hiking", "Historical Sites"]).toArray();
        isFeatured = false;
      };
      destinations.add(nextDestinationId, dest5);
      nextDestinationId += 1;

      let dest6 : Destination = {
        id = nextDestinationId;
        name = "Nairobi";
        country = "Kenya";
        description = "Gateway to African safaris and national parks in Kenya.";
        destinationType = "Safari";
        price = 3000;
        imageUrl = "https://example.com/nairobi.jpg";
        highlights = List.fromArray(["Wildlife", "Culture", "National Parks"]).toArray();
        isFeatured = false;
      };
      destinations.add(nextDestinationId, dest6);
      nextDestinationId += 1;
    };

    if (packages.isEmpty()) {
      let pkg1 : Package = {
        id = nextPackageId;
        title = "Santorini Summer Package";
        destinationId = 1;
        durationDays = 7;
        price = 2300;
        imageUrl = "https://example.com/santorini-pkg.jpg";
        inclusions = List.fromArray(["Flights", "Hotels", "Guided Tours"]).toArray();
        isPopular = true;
      };
      packages.add(nextPackageId, pkg1);
      nextPackageId += 1;

      let pkg2 : Package = {
        id = nextPackageId;
        title = "Alpine Adventure Tour";
        destinationId = 2;
        durationDays = 10;
        price = 3500;
        imageUrl = "https://example.com/alps-pkg.jpg";
        inclusions = List.fromArray(["Ski Passes", "Lodging", "Equipment"]).toArray();
        isPopular = false;
      };
      packages.add(nextPackageId, pkg2);
      nextPackageId += 1;

      let pkg3 : Package = {
        id = nextPackageId;
        title = "Bali Escape Package";
        destinationId = 3;
        durationDays = 8;
        price = 1850;
        imageUrl = "https://example.com/bali-pkg.jpg";
        inclusions = List.fromArray(["Resort Stay", "Surf Lessons", "Yoga Classes"]).toArray();
        isPopular = true;
      };
      packages.add(nextPackageId, pkg3);
      nextPackageId += 1;

      let pkg4 : Package = {
        id = nextPackageId;
        title = "Kyoto Cultural Package";
        destinationId = 4;
        durationDays = 6;
        price = 2100;
        imageUrl = "https://example.com/kyoto-pkg.jpg";
        inclusions = List.fromArray(["Temple Tours", "Cultural Experiences", "Meals"]).toArray();
        isPopular = false;
      };
      packages.add(nextPackageId, pkg4);
      nextPackageId += 1;
    };
  };

  // Public Read Functions - No authorization needed
  public query func getAllDestinations() : async [Destination] {
    seedSampleData();
    destinations.values().toArray().sort();
  };

  public query func getAllPackages() : async [Package] {
    seedSampleData();
    packages.values().toArray().sort();
  };

  public query func getDestinationsByType(destType : Text) : async [Destination] {
    destinations.values().toArray().filter(func(x) { x.destinationType == destType });
  };

  public query func getDestinationsByMaxPrice(maxPrice : Nat) : async [Destination] {
    destinations.values().toArray().filter(func(x) { x.price <= maxPrice });
  };

  // Admin Functions - Admin authorization required
  public shared ({ caller }) func addDestination(dest : Destination) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create destinations");
    };

    let newId = nextDestinationId;
    let newDest = { dest with id = newId };
    destinations.add(newId, newDest);
    nextDestinationId += 1;
    newId;
  };

  public shared ({ caller }) func addPackage(pkg : Package) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create packages");
    };

    let newId = nextPackageId;
    let newPackage = { pkg with id = newId };
    packages.add(newId, newPackage);
    nextPackageId += 1;
    newId;
  };

  public shared ({ caller }) func updateDestination(id : Nat, dest : Destination) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update destinations");
    };
    if (not destinations.containsKey(id)) {
      Runtime.trap("Destination not found");
    };
    destinations.add(id, { dest with id });
  };

  public shared ({ caller }) func updatePackage(id : Nat, pkg : Package) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update packages");
    };
    if (not packages.containsKey(id)) {
      Runtime.trap("Package not found");
    };
    packages.add(id, { pkg with id });
  };

  public shared ({ caller }) func deleteDestination(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete destinations");
    };
    if (not destinations.containsKey(id)) {
      Runtime.trap("Destination not found");
    };
    destinations.remove(id);
  };

  public shared ({ caller }) func deletePackage(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete packages");
    };
    if (not packages.containsKey(id)) {
      Runtime.trap("Package not found");
    };
    packages.remove(id);
  };

  // Favorites Functions - Authenticated user authorization required
  public shared ({ caller }) func addFavorite(destinationId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can add favorites");
    };

    if (not destinations.containsKey(destinationId)) {
      Runtime.trap("Destination not found");
    };

    let currentFavorites = switch (favorites.get(caller)) {
      case (null) { Set.empty<Nat>() };
      case (?fav) { fav };
    };

    currentFavorites.add(destinationId);
    favorites.add(caller, currentFavorites);
  };

  public shared ({ caller }) func removeFavorite(destinationId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can remove favorites");
    };

    let currentFavorites = switch (favorites.get(caller)) {
      case (null) { Runtime.trap("Destination not in favorites") };
      case (?fav) { fav };
    };

    if (not currentFavorites.contains(destinationId)) {
      Runtime.trap("Destination not in favorites");
    };
    currentFavorites.remove(destinationId);
    favorites.add(caller, currentFavorites);
  };

  public query ({ caller }) func getFavorites() : async [Destination] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view favorites");
    };

    let favIds = switch (favorites.get(caller)) {
      case (null) { Set.empty<Nat>() };
      case (?fav) { fav };
    };

    favIds.toArray().map(func(id) { switch (destinations.get(id)) { case (null) { Runtime.trap("Destination not found") }; case (?d) { d } } });
  };
};
