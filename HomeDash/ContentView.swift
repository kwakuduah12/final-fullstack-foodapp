import SwiftUI
import CoreLocation

struct ContentView: View {
    @StateObject private var locationManager = LocationManager()
    @State private var searchText = ""
    
    var body: some View {
        VStack(alignment: .leading) {
            // Background color for entire view
            Color.gray.opacity(0.1)
                .ignoresSafeArea()
            
            // Top Row with Location, Notification, and Cart
            HStack {
                // 1a. Current Location
                VStack(alignment: .leading) {
                    Text("Current Location")
                        .font(.subheadline)
                        .foregroundColor(.gray)
                    Text(locationManager.city ?? "Locating...")
                        .font(.headline)
                        .fontWeight(.bold)
                        .foregroundColor(Color.blue) // Changed text color to blue
                }
                Spacer()
                
                // 1b. Notification Bell
                Button(action: {
                    // Navigate to notifications page
                    print("Notification Bell Tapped")
                }) {
                    Image(systemName: "bell.fill")
                        .font(.title)
                        .foregroundColor(.white)
                        .padding()
                        .background(Circle().fill(Color.orange)) // Circle with orange background
                }
                .padding(.horizontal)
                
                // 1c. Shopping Cart
                Button(action: {
                    // Navigate to checkout page
                    print("Shopping Cart Tapped")
                }) {
                    Image(systemName: "cart.fill")
                        .font(.title)
                        .foregroundColor(.white)
                        .padding()
                        .background(Circle().fill(Color.green)) // Circle with green background
                }
            }
            .padding(.horizontal)
            .padding(.top, 10)
            
            // 2.a Search Bar and 2.b Map Icon
            HStack {
                // Search bar
                HStack {
                    Image(systemName: "magnifyingglass")
                    TextField("Search for restaurants or food...", text: $searchText)
                        .textFieldStyle(RoundedBorderTextFieldStyle())
                }
                .padding(.horizontal)
                
                // Map Icon
                Button(action: {
                    // Action to navigate to map with vendors
                    print("Map Icon Tapped")
                }) {
                    Image(systemName: "map.fill")
                        .font(.title2)
                        .foregroundColor(.white)
                        .padding()
                        .background(Circle().fill(Color.blue)) // Circle with blue background
                }
                .padding(.trailing)
            }
            .padding(.top, 10)
            
            // 3.a Popular Foods by Country/Region
            Text("Popular Foods by Country/Region")
                .font(.headline)
                .fontWeight(.semibold)
                .foregroundColor(.black)
                .padding(.top)
            
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 20) {
                    FoodCategoryView(name: "Pizza", imageName: "pizza")
                    FoodCategoryView(name: "Burgers", imageName: "burger")
                    FoodCategoryView(name: "Sushi", imageName: "sushi")
                    // Add more food categories by country/region
                }
            }
            .padding(.horizontal)
            
            // 3.b Popular Tags for Sorting
            Text("Sort by")
                .font(.headline)
                .fontWeight(.semibold)
                .foregroundColor(.black)
                .padding(.top)
            
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 10) {
                    SortTagView(name: "Price")
                    SortTagView(name: "Pickup")
                    SortTagView(name: "Deals")
                    SortTagView(name: "Ratings")
                    // Add more sort tags as needed
                }
            }
            .padding(.horizontal)
        }
        .padding()
        .background(Color.gray.opacity(0.1))
 // Background color for the whole view
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
                .background(Circle().fill(Color.purple.opacity(0.2))) // Add a circle behind the image
            Text(name)
                .font(.caption)
                .fontWeight(.bold)
                .foregroundColor(.purple) // Purple text color
        }
        .frame(width: 120, height: 150)
        .background(Color.white) // White background for the card
        .cornerRadius(10)
        .shadow(radius: 5) // Add shadow for depth
    }
}

// Custom view for sort tags
struct SortTagView: View {
    var name: String
    
    var body: some View {
        Text(name)
            .font(.subheadline)
            .padding(.horizontal, 15)
            .padding(.vertical, 10)
            .background(Color.blue.opacity(0.2)) // Light blue background
            .foregroundColor(.blue) // Blue text color
            .cornerRadius(20)
            .shadow(radius: 3)
    }
}

// Location Manager to Get User's Location
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
        
        // Reverse geocoding to get the city name
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
