import SwiftUI

struct FoodItem: Identifiable {
    let id = UUID()
    let name: String
    let price: Double
    let description: String
    let isPickupAvailable: Bool
    let hasDeals: Bool
    let image: UIImage? // Image placeholder for now
}

struct MerchantFoodListView: View {
    // Placeholder data for food items
    @State private var foodItems: [FoodItem] = [
        FoodItem(name: "Pepperoni Pizza", price: 12.99, description: "Delicious pepperoni pizza with a crispy crust", isPickupAvailable: true, hasDeals: true, image: nil),
        FoodItem(name: "Classic Burger", price: 9.99, description: "Juicy beef burger with fresh lettuce and tomato", isPickupAvailable: true, hasDeals: false, image: nil)
    ]
    
    var body: some View {
        NavigationView {
            List(foodItems) { item in
                HStack {
                    if let image = item.image {
                        Image(uiImage: image)
                            .resizable()
                            .aspectRatio(contentMode: .fit)
                            .frame(width: 50, height: 50)
                            .cornerRadius(5)
                    } else {
                        Rectangle()
                            .fill(Color.gray)
                            .frame(width: 50, height: 50)
                            .cornerRadius(5)
                    }
                    VStack(alignment: .leading) {
                        Text(item.name)
                            .font(.headline)
                        Text(String(format: "$%.2f", item.price))
                            .font(.subheadline)
                        Text(item.description)
                            .font(.caption)
                            .foregroundColor(.gray)
                    }
                }
            }
            .navigationTitle("My Food Items")
            .toolbar {
                NavigationLink(destination: FoodItemFormView()) {
                    Text("Add Item")
                        .foregroundColor(.blue)
                }
            }
        }
    }
}

struct MerchantFoodListView_Previews: PreviewProvider {
    static var previews: some View {
        MerchantFoodListView()
    }
}
