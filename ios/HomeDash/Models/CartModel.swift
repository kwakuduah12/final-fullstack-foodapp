//import SwiftUI
//
//class CartModel: ObservableObject {
//    // Properties
//    @Published var items: [CartItem] = []
//    @Published var totalPrice: Double = 0.0
//
//    // Update cart data
//    func updateCart(with cart: Cart) {
//        self.items = cart.items
//        self.totalPrice = cart.totalPrice
//    }
//
//    // Clear the cart
//    func clearCart() {
//        self.items.removeAll()
//        self.totalPrice = 0.0
//    }
//}
//
//// CartItem model
//struct CartItem: Identifiable, Decodable {
//    let id: UUID = UUID()
//    let menuItem: MenuItem
//    let quantity: Int
//}
//
//// Cart model
//struct Cart: Decodable {
//    let items: [CartItem]
//    let totalPrice: Double
//}
//
//// MenuItem model
//struct MenuItem: Identifiable, Decodable {
//    let id: String
//    let itemName: String
//    let price: Double
//    let description: String?
//}
import SwiftUI

// Observable object to manage cart state
class CartModel: ObservableObject {
    @Published var items: [CartItem] = [] // List of cart items
    @Published var totalPrice: Double = 0.0 // Total price of the cart

    // Update the cart with new data
    func updateCart(with cart: Cart) {
        self.items = cart.items
        self.totalPrice = cart.totalPrice
    }

    // Clear all items from the cart
    func clearCart() {
        self.items.removeAll()
        self.totalPrice = 0.0
    }
}

// Represents a single item in the cart
struct CartItem: Identifiable, Decodable {
    let id: UUID = UUID() // Unique identifier for each item
    let menuItem: MenuItem // Associated menu item
    let quantity: Int // Quantity of the item in the cart
}

// Represents the entire cart structure
struct Cart: Decodable {
    let items: [CartItem] // List of cart items
    let totalPrice: Double // Total price of the cart
}

// Represents a menu item in the cart
struct MenuItem: Identifiable, Decodable {
    let id: String // MongoDB ObjectId
    let merchantId: String // Matches `merchant_id` in backend
    let itemName: String
    let description: String?
    let price: Double
    let category: String
    let available: Bool
    let createdAt: String? // Matches `created_at` in backend
    let updatedAt: String? // Matches `updated_at` in backend

    enum CodingKeys: String, CodingKey {
        case id = "_id"
        case merchantId = "merchant_id"
        case itemName = "item_name"
        case description
        case price
        case category
        case available
        case createdAt = "created_at"
        case updatedAt = "updated_at"
    }
}
