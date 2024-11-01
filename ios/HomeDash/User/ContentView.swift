//import SwiftUI
//import CoreLocation
//import MapKit
//
//struct Promotion: Identifiable {
//    let id = UUID()
//    let imageName: String
//    let title: String
//    let description: String
//}
//
//struct Notification: Identifiable {
//    let id = UUID()
//    let title: String
//    let description: String
//    let imageName: String
//}
//
//struct Restaurant: Identifiable {
//    let id = UUID()
//    let name: String
//    let rating: Double
//    let price: Double
//    let isPickupAvailable: Bool
//    let hasDeals: Bool
//}
//
//// ContentView with location, promotions, and restaurant sorting features
//struct ContentView: View {
//    @AppStorage("userRole") private var userRole: String = "User"
//    @StateObject private var locationManager = LocationManager()
//    @State private var searchText = ""
//    @State private var showMap = false
//    @State private var showNotifications = false
//    @State private var showCart = false
//    @State private var cartItems: [CartItem] = [
//        CartItem(name: "Pepperoni Pizza", price: 12.99, quantity: 1),
//        CartItem(name: "Burger", price: 9.99, quantity: 2)
//    ]
//    @State private var selectedSortOption: String? = nil
//    @State private var region = MKCoordinateRegion(
//        center: CLLocationCoordinate2D(latitude: 37.7749, longitude: -122.4194),
//        span: MKCoordinateSpan(latitudeDelta: 0.05, longitudeDelta: 0.05)
//    )
//    
//    let promotions = [
//        Promotion(imageName: "pepperoni", title: "20% Off on Pizza", description: "Order any pizza and get 20% off."),
//        Promotion(imageName: "burger-drink", title: "Free Drink with Burger", description: "Get a free drink with every burger."),
//        Promotion(imageName: "taco-tuesday", title: "Taco Tuesday Special", description: "Buy 2 Tacos, get 1 free!")
//    ]
//    
//    let allRestaurants = [
//        Restaurant(name: "Bella Italia", rating: 4.5, price: 15.0, isPickupAvailable: true, hasDeals: true),
//        Restaurant(name: "Sushi House", rating: 4.8, price: 20.0, isPickupAvailable: false, hasDeals: false),
//        Restaurant(name: "Burger Palace", rating: 4.2, price: 10.0, isPickupAvailable: true, hasDeals: true),
//        Restaurant(name: "Pizza Corner", rating: 3.9, price: 8.0, isPickupAvailable: true, hasDeals: false)
//    ]
//    
//    var sortedRestaurants: [Restaurant] {
//        switch selectedSortOption {
//        case "Price":
//            return allRestaurants.sorted { $0.price < $1.price }
//        case "Pickup":
//            return allRestaurants.filter { $0.isPickupAvailable }
//        case "Deals":
//            return allRestaurants.filter { $0.hasDeals }
//        case "Ratings":
//            return allRestaurants.sorted { $0.rating > $1.rating }
//        default:
//            return allRestaurants
//        }
//    }
//    
//    var body: some View {
//        var body: some View {
//                if userRole == "Merchant" {
//                    MerchantView()
//                } else {
//                    AuthView() // or whatever your main user view is called
//                }
//            }
//        NavigationView {
//            VStack(alignment: .leading) {
//                // Top row with location, notification, and cart
//                HStack {
//                    VStack(alignment: .leading) {
//                        Text("Current Location")
//                            .font(.subheadline)
//                            .foregroundColor(.gray)
//                        Text(locationManager.city ?? "Locating...")
//                            .font(.headline)
//                            .fontWeight(.bold)
//                            .foregroundColor(Color.blue)
//                    }
//                    Spacer()
//                    
//                    // Notification Button
//                    Button(action: { showNotifications = true }) {
//                        Image(systemName: "bell.fill")
//                            .font(.title)
//                            .foregroundColor(.white)
//                            .padding()
//                            .background(Circle().fill(Color.orange))
//                    }
//                    .sheet(isPresented: $showNotifications) {
//                        NotificationView()
//                    }
//                    
//                    // Cart Button
//                    Button(action: { showCart = true }) {
//                        Image(systemName: "cart.fill")
//                            .font(.title)
//                            .foregroundColor(.white)
//                            .padding()
//                            .background(Circle().fill(Color.green))
//                    }
//                    .sheet(isPresented: $showCart) {
//                        CartView(cartItems: $cartItems)
//                    }
//                }
//                .padding(.horizontal)
//                
//                // Search Bar and Map Icon
//                HStack {
//                    HStack {
//                        Image(systemName: "magnifyingglass")
//                        TextField("Search for restaurants or food...", text: $searchText)
//                            .textFieldStyle(RoundedBorderTextFieldStyle())
//                    }
//                    .padding(.horizontal)
//                    
//                    Button(action: { showMap.toggle() }) {
//                        Image(systemName: "map.fill")
//                            .font(.title2)
//                            .foregroundColor(.white)
//                            .padding()
//                            .background(Circle().fill(Color.blue))
//                    }
//                    .sheet(isPresented: $showMap) {
//                        MapView(region: $region)
//                    }
//                }
//                
//                // Promotions Section
//                Text("Promotions You'll Love")
//                    .font(.headline)
//                    .padding(.leading, 16)
//                    .frame(maxWidth: .infinity, alignment: .leading)
//                
//                ScrollView(.horizontal, showsIndicators: false) {
//                    HStack(spacing: 16) {
//                        ForEach(promotions) { promotion in
//                            PromotionView(promotion: promotion)
//                        }
//                    }
//                    .padding(.horizontal, 16)
//                }
//                
//                // Popular Foods by Country/Region
//                Text("Popular Foods by Country/Region")
//                    .font(.headline)
//                    .fontWeight(.semibold)
//                    .foregroundColor(.black)
//                    .padding(.top)
//                
//                ScrollView(.horizontal, showsIndicators: false) {
//                    HStack(spacing: 20) {
//                        NavigationLink(destination: RestaurantListView(foodCategory: "Tacos")) {
//                            FoodCategoryView(name: "Tacos", imageName: "tacos")
//                        }
//                        NavigationLink(destination: RestaurantListView(foodCategory: "Jollof")) {
//                            FoodCategoryView(name: "Jollof", imageName: "jollof")
//                        }
//                        NavigationLink(destination: RestaurantListView(foodCategory: "Italian")) {
//                            FoodCategoryView(name: "Italian", imageName: "italian")
//                        }
//                        NavigationLink(destination: RestaurantListView(foodCategory: "Asian")) {
//                            FoodCategoryView(name: "Asian", imageName: "asian")
//                        }
//                    }
//                }
//                .padding(.horizontal)
//                
//                // Sort Options
//                Text("Sort by")
//                    .font(.headline)
//                    .fontWeight(.semibold)
//                    .foregroundColor(.black)
//                    .padding(.top)
//                
//                ScrollView(.horizontal, showsIndicators: false) {
//                    HStack(spacing: 10) {
//                        SortTagView(name: "Price") { selectedSortOption = "Price" }
//                        SortTagView(name: "Pickup") { selectedSortOption = "Pickup" }
//                        SortTagView(name: "Deals") { selectedSortOption = "Deals" }
//                        SortTagView(name: "Ratings") { selectedSortOption = "Ratings" }
//                    }
//                }
//                .padding(.horizontal)
//                
//                // Display sorted restaurants
//                List(sortedRestaurants) { restaurant in
//                    VStack(alignment: .leading) {
//                        Text(restaurant.name)
//                            .font(.headline)
//                        Text("Rating: \(restaurant.rating, specifier: "%.1f")")
//                            .font(.subheadline)
//                        Text("Price: $\(restaurant.price, specifier: "%.2f")")
//                            .font(.subheadline)
//                    }
//                    .padding(.vertical, 8)
//                }
//                .listStyle(InsetGroupedListStyle())
//            }
//            .padding()
//            .background(Color.gray.opacity(0.1))
//        }
//    }
//}

import SwiftUI
import CoreLocation
import MapKit

struct Promotion: Identifiable {
    let id = UUID()
    let imageName: String
    let title: String
    let description: String
}

struct Notification: Identifiable {
    let id = UUID()
    let title: String
    let description: String
    let imageName: String
}

struct Restaurant: Identifiable {
    let id = UUID()
    let name: String
    let rating: Double
    let price: Double
    let isPickupAvailable: Bool
    let hasDeals: Bool
}

struct ContentView: View {
    @AppStorage("userRole") private var userRole: String = "User"
    @StateObject private var locationManager = LocationManager()
    @State private var searchText = ""
    @State private var showMap = false
    @State private var showNotifications = false
    @State private var showCart = false
    @State private var cartItems: [CartItem] = [
        CartItem(name: "Pepperoni Pizza", price: 12.99, quantity: 1),
        CartItem(name: "Burger", price: 9.99, quantity: 2)
    ]
    @State private var selectedSortOption: String? = nil
    @State private var region = MKCoordinateRegion(
        center: CLLocationCoordinate2D(latitude: 37.7749, longitude: -122.4194),
        span: MKCoordinateSpan(latitudeDelta: 0.05, longitudeDelta: 0.05)
    )

    let promotions = [
        Promotion(imageName: "pepperoni", title: "20% Off on Pizza", description: "Order any pizza and get 20% off."),
        Promotion(imageName: "burger-drink", title: "Free Drink with Burger", description: "Get a free drink with every burger."),
        Promotion(imageName: "taco-tuesday", title: "Taco Tuesday Special", description: "Buy 2 Tacos, get 1 free!")
    ]

    let allRestaurants = [
        Restaurant(name: "Bella Italia", rating: 4.5, price: 15.0, isPickupAvailable: true, hasDeals: true),
        Restaurant(name: "Sushi House", rating: 4.8, price: 20.0, isPickupAvailable: false, hasDeals: false),
        Restaurant(name: "Burger Palace", rating: 4.2, price: 10.0, isPickupAvailable: true, hasDeals: true),
        Restaurant(name: "Pizza Corner", rating: 3.9, price: 8.0, isPickupAvailable: true, hasDeals: false)
    ]

    var sortedRestaurants: [Restaurant] {
        switch selectedSortOption {
        case "Price":
            return allRestaurants.sorted { $0.price < $1.price }
        case "Pickup":
            return allRestaurants.filter { $0.isPickupAvailable }
        case "Deals":
            return allRestaurants.filter { $0.hasDeals }
        case "Ratings":
            return allRestaurants.sorted { $0.rating > $1.rating }
        default:
            return allRestaurants
        }
    }

    var body: some View {
        if userRole == "Merchant" {
            MerchantView()
        } else {
            NavigationView {
                VStack(alignment: .leading) {
                    // Top row with location, notification, and cart
                    HStack {
                        VStack(alignment: .leading) {
                            Text("Current Location")
                                .font(.subheadline)
                                .foregroundColor(.gray)
                            Text(locationManager.city ?? "Locating...")
                                .font(.headline)
                                .fontWeight(.bold)
                                .foregroundColor(Color.blue)
                        }
                        Spacer()
                        
                        // Notification Button
                        Button(action: { showNotifications = true }) {
                            Image(systemName: "bell.fill")
                                .font(.title)
                                .foregroundColor(.white)
                                .padding()
                                .background(Circle().fill(Color.orange))
                        }
                        .sheet(isPresented: $showNotifications) {
                            NotificationView()
                        }
                        
                        // Cart Button
                        Button(action: { showCart = true }) {
                            Image(systemName: "cart.fill")
                                .font(.title)
                                .foregroundColor(.white)
                                .padding()
                                .background(Circle().fill(Color.green))
                        }
                        .sheet(isPresented: $showCart) {
                            CartView(cartItems: $cartItems)
                        }
                    }
                    .padding(.horizontal)
                    
                    // Search Bar and Map Icon
                    HStack {
                        HStack {
                            Image(systemName: "magnifyingglass")
                            TextField("Search for restaurants or food...", text: $searchText)
                                .textFieldStyle(RoundedBorderTextFieldStyle())
                        }
                        .padding(.horizontal)
                        
                        Button(action: { showMap.toggle() }) {
                            Image(systemName: "map.fill")
                                .font(.title2)
                                .foregroundColor(.white)
                                .padding()
                                .background(Circle().fill(Color.blue))
                        }
                        .sheet(isPresented: $showMap) {
                            MapView(region: $region)
                        }
                    }
                    
                    // Promotions Section
                    Text("Promotions You'll Love")
                        .font(.headline)
                        .padding(.leading, 16)
                        .frame(maxWidth: .infinity, alignment: .leading)
                    
                    ScrollView(.horizontal, showsIndicators: false) {
                        HStack(spacing: 16) {
                            ForEach(promotions) { promotion in
                                PromotionView(promotion: promotion)
                            }
                        }
                        .padding(.horizontal, 16)
                    }
                    
                    // Popular Foods by Country/Region
                    Text("Popular Foods by Country/Region")
                        .font(.headline)
                        .fontWeight(.semibold)
                        .foregroundColor(.black)
                        .padding(.top)
                    
                    ScrollView(.horizontal, showsIndicators: false) {
                        HStack(spacing: 20) {
                            NavigationLink(destination: RestaurantListView(foodCategory: "Tacos")) {
                                FoodCategoryView(name: "Tacos", imageName: "tacos")
                            }
                            NavigationLink(destination: RestaurantListView(foodCategory: "Jollof")) {
                                FoodCategoryView(name: "Jollof", imageName: "jollof")
                            }
                            NavigationLink(destination: RestaurantListView(foodCategory: "Italian")) {
                                FoodCategoryView(name: "Italian", imageName: "italian")
                            }
                            NavigationLink(destination: RestaurantListView(foodCategory: "Asian")) {
                                FoodCategoryView(name: "Asian", imageName: "asian")
                            }
                        }
                    }
                    .padding(.horizontal)
                    
                    // Sort Options
                    Text("Sort by")
                        .font(.headline)
                        .fontWeight(.semibold)
                        .foregroundColor(.black)
                        .padding(.top)
                    
                    ScrollView(.horizontal, showsIndicators: false) {
                        HStack(spacing: 10) {
                            SortTagView(name: "Price") { selectedSortOption = "Price" }
                            SortTagView(name: "Pickup") { selectedSortOption = "Pickup" }
                            SortTagView(name: "Deals") { selectedSortOption = "Deals" }
                            SortTagView(name: "Ratings") { selectedSortOption = "Ratings" }
                        }
                    }
                    .padding(.horizontal)
                    
                    // Display sorted restaurants
                    List(sortedRestaurants) { restaurant in
                        VStack(alignment: .leading) {
                            Text(restaurant.name)
                                .font(.headline)
                            Text("Rating: \(restaurant.rating, specifier: "%.1f")")
                                .font(.subheadline)
                            Text("Price: $\(restaurant.price, specifier: "%.2f")")
                                .font(.subheadline)
                        }
                        .padding(.vertical, 8)
                    }
                    .listStyle(InsetGroupedListStyle())
                }
                .padding()
                .background(Color.gray.opacity(0.1))
            }
        }
    }
}

// NotificationView to display a list of notifications
struct NotificationView: View {
    let notifications = [
        Notification(title: "Restaurant Recommendations", description: "We recommend trying Bella Italia near you!", imageName: "italian"),
        Notification(title: "Order Update", description: "Your order is being dropped off in 10 minutes.", imageName: "burger-drink"),
        Notification(title: "Familiar Favorites", description: "Your favorite sushi place is offering 10% off today!", imageName: "sushi"),
        Notification(title: "New Restaurant Added", description: "Check out Taco Fiesta, now available in your area.", imageName: "tacos"),
        Notification(title: "Weekly Most Ordered", description: "Pizza is the top choice this week. Order now!", imageName: "pepperoni")
    ]

    var body: some View {
        NavigationView {
            List(notifications) { notification in
                HStack {
                    Image(notification.imageName)
                        .resizable()
                        .aspectRatio(contentMode: .fill)
                        .frame(width: 50, height: 50)
                        .cornerRadius(10)
                        .padding(.trailing, 10)

                    VStack(alignment: .leading) {
                        Text(notification.title)
                            .font(.headline)
                        Text(notification.description)
                            .font(.subheadline)
                            .foregroundColor(.gray)
                    }
                }
                .padding(.vertical, 5)
            }
            .navigationTitle("Notifications")
        }
    }
}

// Restaurant List view for each food category
struct RestaurantListView: View {
    let foodCategory: String

    let restaurants = [
        "Bella Italia",
        "Sushi House",
        "Burger Palace",
        "Pizza Corner"
    ]

    var body: some View {
        List {
            ForEach(restaurants, id: \.self) { restaurant in
                Text(restaurant)
            }
        }
        .navigationTitle("\(foodCategory) Restaurants")
    }
}

// Custom view for promotions
struct PromotionView: View {
    let promotion: Promotion
    
    var body: some View {
        VStack {
            Image(promotion.imageName)
                .resizable()
                .aspectRatio(contentMode: .fill)
                .frame(width: 150, height: 100)
                .cornerRadius(10)
            
            Text(promotion.title)
                .font(.headline)
                .padding(.top, 5)
                .multilineTextAlignment(.center)
            
            Text(promotion.description)
                .font(.subheadline)
                .foregroundColor(.gray)
                .multilineTextAlignment(.center)
                .padding(.horizontal, 5)
        }
        .frame(width: 150)
        .background(Color.white)
        .cornerRadius(10)
        .shadow(radius: 3)
    }
}

// Custom view for food categories
struct FoodCategoryView: View {
    var name: String
    var imageName: String

    var body: some View {
        VStack {
            Image(imageName)
                .resizable()
                .aspectRatio(contentMode: .fit)
                .frame(width: 100, height: 100)
                .background(Circle().fill(Color.purple.opacity(0.2)))
            Text(name)
                .font(.caption)
                .fontWeight(.bold)
                .foregroundColor(.purple)
        }
        .frame(width: 120, height: 150)
        .background(Color.white)
        .cornerRadius(10)
        .shadow(radius: 5)
    }
}

// Custom view for sort tags
struct SortTagView: View {
    var name: String
    var action: () -> Void

    var body: some View {
        Button(action: action)  {
            Text(name)
                .font(.subheadline)
                .padding(.horizontal, 15)
                .padding(.vertical, 10)
                .background(Color.blue.opacity(0.2))
                .foregroundColor(.blue)
                .cornerRadius(20)
                .shadow(radius: 3)
        }
    }
}

// MapView to display the user's location
struct MapView: UIViewRepresentable {
    @Binding var region: MKCoordinateRegion

    func makeUIView(context: Context) -> MKMapView {
        let mapView = MKMapView()
        mapView.delegate = context.coordinator
        mapView.showsUserLocation = true
        return mapView
    }

    func updateUIView(_ uiView: MKMapView, context: Context) {
        uiView.setRegion(region, animated: true)
    }

    func makeCoordinator() -> Coordinator {
        Coordinator(self)
    }

    class Coordinator: NSObject, MKMapViewDelegate {
        var parent: MapView

        init(_ parent: MapView) {
            self.parent = parent
        }
    }
}
// Location Manager to get user's location
class LocationManager: NSObject, ObservableObject, CLLocationManagerDelegate {
    private let locationManager = CLLocationManager()
    @Published var city: String? = nil
    
    override init() {
        super.init()
        locationManager.delegate = self
        locationManager.requestWhenInUseAuthorization()
        locationManager.startUpdatingLocation()
    }

    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        guard let location = locations.first else { return }
        let geocoder = CLGeocoder()
        geocoder.reverseGeocodeLocation(location) { (placemarks, error) in
            if let placemark = placemarks?.first {
                self.city = placemark.locality
            }
        }
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
