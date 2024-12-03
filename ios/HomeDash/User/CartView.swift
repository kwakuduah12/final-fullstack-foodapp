//import SwiftUI
//
//// Define CartItem struct if not already defined
//struct CartItem: Identifiable {
//    let id = UUID()
//    let name: String
//    let price: Double
//    var quantity: Int
//}
//
//// CartView for displaying items in the cart and a checkout button
//struct CartView: View {
//    @Binding var cartItems: [CartItem]
//    
//    var totalAmount: Double {
//        cartItems.reduce(0) { $0 + ($1.price * Double($1.quantity)) }
//    }
//    
//    var body: some View {
//        NavigationView {
//            VStack {
//                List {
//                    ForEach(cartItems) { item in
//                        HStack {
//                            Text(item.name)
//                            Spacer()
//                            Text("Qty: \(item.quantity)")
//                            Spacer()
//                            Text(String(format: "$%.2f", item.price * Double(item.quantity)))
//                        }
//                    }
//                }
//                .listStyle(InsetGroupedListStyle())
//                
//                Spacer()
//                
//                // Checkout button with total amount
//                HStack {
//                    Text("Total: \(String(format: "$%.2f", totalAmount))")
//                        .font(.headline)
//                    Spacer()
//                    Button(action: {
//                        print("Proceed to Checkout")
//                    }) {
//                        Text("Checkout")
//                            .font(.headline)
//                            .foregroundColor(.white)
//                            .padding()
//                            .frame(maxWidth: .infinity)
//                            .background(Color.green)
//                            .cornerRadius(10)
//                    }
//                }
//                .padding()
//            }
//            .navigationTitle("Your Cart")
//        }
//    }
//}
//
//// CheckoutView - Displays total amount with a basic confirmation message
//struct CheckoutView: View {
//    let totalAmount: Double
//    
//    var body: some View {
//        VStack {
//            Text("Proceed with Payment")
//                .font(.title)
//                .padding()
//            
//            Text("Total: $\(String(format: "%.2f", totalAmount))")
//                .font(.headline)
//                .padding()
//            
//            // Confirm Button
//            Button(action: {
//                print("Checkout confirmed")
//            }) {
//                Text("Confirm Purchase")
//                    .foregroundColor(.white)
//                    .padding()
//                    .frame(maxWidth: .infinity)
//                    .background(Color.green)
//                    .cornerRadius(10)
//            }
//            .padding(.horizontal)
//            
//            Spacer()
//        }
//        .padding()
//        .navigationTitle("Checkout")
//    }
//}
//
//struct CartView_Previews: PreviewProvider {
//    @State static var sampleCartItems: [CartItem] = [
//        CartItem(name: "Pepperoni Pizza", price: 12.99, quantity: 1),
//        CartItem(name: "Burger", price: 9.99, quantity: 2)
//    ]
//    
//    static var previews: some View {
//        CartView(cartItems: $sampleCartItems)
//    }
//}
//
//import SwiftUI
//
//struct CartView: View {
//    @EnvironmentObject var cartModel: CartModel
//    @AppStorage("authToken") private var authToken: String?
//    @State private var cart: Cart?
//    @State private var isLoading: Bool = true
//    @State private var errorMessage: String?
//
//    var body: some View {
//        NavigationView {
//            VStack {
//                if isLoading {
//                    ProgressView("Loading Cart...")
//                } else if let errorMessage = errorMessage {
//                    Text(errorMessage)
//                        .foregroundColor(.red)
//                        .padding()
//                } else if let cart = cart {
//                    List {
//                        ForEach(cart.items) { item in
//                            HStack {
//                                VStack(alignment: .leading) {
//                                    Text(item.menuItem.itemName)
//                                        .font(.headline)
//                                    Text("Price: $\(String(format: "%.2f", item.menuItem.price))")
//                                    Text("Quantity: \(item.quantity)")
//                                }
//                                Spacer()
//                                Button(action: {
//                                    removeFromCart(item: item)
//                                }) {
//                                    Image(systemName: "trash")
//                                        .foregroundColor(.red)
//                                }
//                            }
//                        }
//                        .onDelete(perform: { indexSet in
//                            if let index = indexSet.first {
//                                let item = cart.items[index]
//                                removeFromCart(item: item)
//                            }
//                        })
//                    }
//                    .listStyle(InsetGroupedListStyle())
//                    Text("Total: $\(String(format: "%.2f", cart.totalPrice))")
//                        .font(.title)
//                        .padding()
//                    Button(action: clearCart) {
//                        Text("Clear Cart")
//                            .frame(maxWidth: .infinity)
//                            .padding()
//                            .background(Color.red)
//                            .foregroundColor(.white)
//                            .cornerRadius(10)
//                    }
//                    .padding()
//                } else {
//                    Text("Your cart is empty.")
//                        .font(.headline)
//                        .padding()
//                }
//            }
//            .navigationTitle("My Cart")
//            .onAppear {
//                fetchCart()
//            }
//        }
//    }
//
//    private func fetchCart() {
//        guard let token = authToken else {
//            errorMessage = "User not authenticated."
//            isLoading = false
//            return
//        }
//
//        let endpoint = "http://localhost:4000/cart"
//        guard let url = URL(string: endpoint) else {
//            errorMessage = "Invalid backend URL."
//            isLoading = false
//            return
//        }
//
//        var request = URLRequest(url: url)
//        request.httpMethod = "GET"
//        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
//
//        isLoading = true
//        errorMessage = nil
//
//        URLSession.shared.dataTask(with: request) { data, response, error in
//            DispatchQueue.main.async {
//                isLoading = false
//                if let error = error {
//                    errorMessage = "Error fetching cart: \(error.localizedDescription)"
//                    return
//                }
//
//                guard let data = data else {
//                    errorMessage = "No data received from server."
//                    return
//                }
//
//                do {
//                    cart = try JSONDecoder().decode(Cart.self, from: data)
//                } catch {
//                    errorMessage = "Failed to decode cart: \(error.localizedDescription)"
//                }
//            }
//        }.resume()
//    }
//
//    private func removeFromCart(item: CartItem) {
//        guard let token = authToken else {
//            errorMessage = "User not authenticated."
//            return
//        }
//
//        let endpoint = "http://localhost:4000/cart/remove"
//        guard let url = URL(string: endpoint) else {
//            errorMessage = "Invalid backend URL."
//            return
//        }
//
//        var request = URLRequest(url: url)
//        request.httpMethod = "DELETE"
//        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
//        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
//
//        let body: [String: Any] = ["menu_item_id": item.menuItem.id]
//        request.httpBody = try? JSONSerialization.data(withJSONObject: body)
//
//        URLSession.shared.dataTask(with: request) { _, response, error in
//            DispatchQueue.main.async {
//                if let error = error {
//                    errorMessage = "Error removing item: \(error.localizedDescription)"
//                    return
//                }
//                fetchCart()
//            }
//        }.resume()
//    }
//
//    private func clearCart() {
//        guard let token = authToken else {
//            errorMessage = "User not authenticated."
//            return
//        }
//
//        let endpoint = "http://localhost:4000/cart/clear"
//        guard let url = URL(string: endpoint) else {
//            errorMessage = "Invalid backend URL."
//            return
//        }
//
//        var request = URLRequest(url: url)
//        request.httpMethod = "DELETE"
//        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
//
//        URLSession.shared.dataTask(with: request) { _, response, error in
//            DispatchQueue.main.async {
//                if let error = error {
//                    errorMessage = "Error clearing cart: \(error.localizedDescription)"
//                    return
//                }
//                fetchCart()
//            }
//        }.resume()
//    }
//}
//
////struct CartView_Previews: PreviewProvider {
////    static var previews: some View {
////        CartView()
////            .environmentObject(CartModel()) // Ensure the CartModel is available
////    }
////}
//import SwiftUI
//
//struct CartView: View {
//    @EnvironmentObject var cartModel: CartModel // Access CartModel from the environment
//    @AppStorage("authToken") private var authToken: String?
//    @State private var isLoading: Bool = true
//    @State private var errorMessage: String?
//
//    var body: some View {
//        NavigationView {
//            VStack {
//                if isLoading {
//                    ProgressView("Loading Cart...")
//                } else if let errorMessage = errorMessage {
//                    Text(errorMessage)
//                        .foregroundColor(.red)
//                        .padding()
//                } else if cartModel.items.isEmpty {
//                    Text("Your cart is empty.")
//                        .font(.headline)
//                        .padding()
//                } else {
//                    List {
//                        ForEach(cartModel.items) { item in
//                            HStack {
//                                VStack(alignment: .leading) {
//                                    Text(item.menuItem.itemName)
//                                        .font(.headline)
//                                    Text("Price: $\(String(format: "%.2f", item.menuItem.price))")
//                                    Text("Quantity: \(item.quantity)")
//                                }
//                                Spacer()
//                                Button(action: {
//                                    removeFromCart(item: item)
//                                }) {
//                                    Image(systemName: "trash")
//                                        .foregroundColor(.red)
//                                }
//                            }
//                        }
//                        .onDelete(perform: { indexSet in
//                            if let index = indexSet.first {
//                                let item = cartModel.items[index]
//                                removeFromCart(item: item)
//                            }
//                        })
//                    }
//                    .listStyle(InsetGroupedListStyle())
//
//                    Text("Total: $\(String(format: "%.2f", cartModel.totalPrice))")
//                        .font(.title)
//                        .padding()
//
//                    Button(action: clearCart) {
//                        Text("Clear Cart")
//                            .frame(maxWidth: .infinity)
//                            .padding()
//                            .background(Color.red)
//                            .foregroundColor(.white)
//                            .cornerRadius(10)
//                    }
//                    .padding()
//                }
//            }
//            .navigationTitle("My Cart")
//            .onAppear {
//                fetchCart()
//            }
//        }
//    }
//
//    private func fetchCart() {
//        guard let token = authToken else {
//            errorMessage = "User not authenticated."
//            isLoading = false
//            return
//        }
//
//        let endpoint = "http://localhost:4000/cart"
//        guard let url = URL(string: endpoint) else {
//            errorMessage = "Invalid backend URL."
//            isLoading = false
//            return
//        }
//
//        var request = URLRequest(url: url)
//        request.httpMethod = "GET"
//        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
//
//        isLoading = true
//        errorMessage = nil
//
//        URLSession.shared.dataTask(with: request) { data, response, error in
//            DispatchQueue.main.async {
//                isLoading = false
//                if let error = error {
//                    errorMessage = "Error fetching cart: \(error.localizedDescription)"
//                    return
//                }
//
//                guard let data = data else {
//                    errorMessage = "No data received from server."
//                    return
//                }
//
//                do {
//                    let cart = try JSONDecoder().decode(Cart.self, from: data)
//                    cartModel.updateCart(with: cart) // Update the CartModel
//                } catch {
//                    errorMessage = "Failed to decode cart: \(error.localizedDescription)"
//                }
//            }
//        }.resume()
//    }
//
//    private func removeFromCart(item: CartItem) {
//        guard let token = authToken else {
//            errorMessage = "User not authenticated."
//            return
//        }
//
//        let endpoint = "http://localhost:4000/cart/remove"
//        guard let url = URL(string: endpoint) else {
//            errorMessage = "Invalid backend URL."
//            return
//        }
//
//        var request = URLRequest(url: url)
//        request.httpMethod = "DELETE"
//        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
//        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
//
//        let body: [String: Any] = ["menu_item_id": item.menuItem.id]
//        request.httpBody = try? JSONSerialization.data(withJSONObject: body)
//
//        URLSession.shared.dataTask(with: request) { _, response, error in
//            DispatchQueue.main.async {
//                if let error = error {
//                    errorMessage = "Error removing item: \(error.localizedDescription)"
//                    return
//                }
//                fetchCart() // Refresh the cart after deletion
//            }
//        }.resume()
//    }
//
//    private func clearCart() {
//        guard let token = authToken else {
//            errorMessage = "User not authenticated."
//            return
//        }
//
//        let endpoint = "http://localhost:4000/cart/clear"
//        guard let url = URL(string: endpoint) else {
//            errorMessage = "Invalid backend URL."
//            return
//        }
//
//        var request = URLRequest(url: url)
//        request.httpMethod = "DELETE"
//        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
//
//        URLSession.shared.dataTask(with: request) { _, response, error in
//            DispatchQueue.main.async {
//                if let error = error {
//                    errorMessage = "Error clearing cart: \(error.localizedDescription)"
//                    return
//                }
//                fetchCart() // Refresh the cart after clearing
//            }
//        }.resume()
//    }
//}
//struct CartView_Previews: PreviewProvider {
//    static var previews: some View {
//        CartView()
//            .environmentObject(CartModel()) // Ensure the CartModel is available
//    }
//}
import SwiftUI

struct CartView: View {
    @EnvironmentObject var cartModel: CartModel // Access CartModel from the environment
    @AppStorage("authToken") private var authToken: String?
    @State private var isLoading: Bool = true
    @State private var errorMessage: String?

    var body: some View {
        NavigationView {
            VStack {
                if isLoading {
                    ProgressView("Loading Cart...")
                } else if let errorMessage = errorMessage {
                    Text(errorMessage)
                        .foregroundColor(.red)
                        .padding()
                } else if $cartModel.items.isEmpty {
                    Text("Your cart is empty.")
                        .font(.headline)
                        .padding()
                } else {
                    List {
                        ForEach(cartModel.items) { item in
                            HStack {
                                VStack(alignment: .leading) {
                                    Text(item.menuItem.itemName)
                                        .font(.headline)
                                    Text("Price: $\(String(format: "%.2f", item.menuItem.price))")
                                    Text("Quantity: \(item.quantity)")
                                }
                                Spacer()
                                Button(action: {
                                    removeFromCart(item: item)
                                }) {
                                    Image(systemName: "trash")
                                        .foregroundColor(.red)
                                }
                            }
                        }
                    }
                    .listStyle(InsetGroupedListStyle())

                    Text("Total: $\(String(format: "%.2f", cartModel.totalPrice))")
                        .font(.title)
                        .padding()

                    Button(action: clearCart) {
                        Text("Clear Cart")
                            .frame(maxWidth: .infinity)
                            .padding()
                            .background(Color.red)
                            .foregroundColor(.white)
                            .cornerRadius(10)
                    }
                    .padding()
                }
            }
            .navigationTitle("My Cart")
            .onAppear {
                fetchCart()
            }
        }
    }

    private func fetchCart() {
        guard let token = authToken else {
            errorMessage = "User not authenticated."
            isLoading = false
            return
        }

        let endpoint = "http://localhost:4000/cart"
        guard let url = URL(string: endpoint) else {
            errorMessage = "Invalid backend URL."
            isLoading = false
            return
        }

        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")

        isLoading = true
        errorMessage = nil

        URLSession.shared.dataTask(with: request) { data, response, error in
            DispatchQueue.main.async {
                isLoading = false
                if let error = error {
                    errorMessage = "Error fetching cart: \(error.localizedDescription)"
                    return
                }

                guard let data = data else {
                    errorMessage = "No data received from server."
                    return
                }

                do {
                    let cart = try JSONDecoder().decode(Cart.self, from: data)
                    cartModel.updateCart(with: cart) // Update the CartModel
                } catch {
                    errorMessage = "Failed to decode cart: \(error.localizedDescription)"
                }
            }
        }.resume()
    }

    private func removeFromCart(item: CartItem) {
        guard let token = authToken else {
            errorMessage = "User not authenticated."
            return
        }

        let endpoint = "http://localhost:4000/cart/remove"
        guard let url = URL(string: endpoint) else {
            errorMessage = "Invalid backend URL."
            return
        }

        var request = URLRequest(url: url)
        request.httpMethod = "DELETE"
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")

        let body: [String: Any] = ["menu_item_id": item.menuItem.id]
        request.httpBody = try? JSONSerialization.data(withJSONObject: body)

        URLSession.shared.dataTask(with: request) { _, response, error in
            DispatchQueue.main.async {
                if let error = error {
                    errorMessage = "Error removing item: \(error.localizedDescription)"
                    return
                }
                fetchCart() // Refresh the cart after deletion
            }
        }.resume()
    }

    private func clearCart() {
        guard let token = authToken else {
            errorMessage = "User not authenticated."
            return
        }

        let endpoint = "http://localhost:4000/cart/clear"
        guard let url = URL(string: endpoint) else {
            errorMessage = "Invalid backend URL."
            return
        }

        var request = URLRequest(url: url)
        request.httpMethod = "DELETE"
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")

        URLSession.shared.dataTask(with: request) { _, response, error in
            DispatchQueue.main.async {
                if let error = error {
                    errorMessage = "Error clearing cart: \(error.localizedDescription)"
                    return
                }
                fetchCart() // Refresh the cart after clearing
            }
        }.resume()
    }
}

struct CartView_Previews: PreviewProvider {
    static var previews: some View {
        CartView()
            .environmentObject(CartModel()) // Ensure CartModel is available for the preview
    }
}
