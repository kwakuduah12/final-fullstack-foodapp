import SwiftUI

// Define CartItem struct if not already defined
struct CartItem: Identifiable {
    let id = UUID()
    let name: String
    let price: Double
    var quantity: Int
}

// CartView for displaying items in the cart and a checkout button
struct CartView: View {
    @Binding var cartItems: [CartItem]
    
    var totalAmount: Double {
        cartItems.reduce(0) { $0 + ($1.price * Double($1.quantity)) }
    }
    
    var body: some View {
        NavigationView {
            VStack {
                List {
                    ForEach(cartItems) { item in
                        HStack {
                            Text(item.name)
                            Spacer()
                            Text("Qty: \(item.quantity)")
                            Spacer()
                            Text(String(format: "$%.2f", item.price * Double(item.quantity)))
                        }
                    }
                }
                .listStyle(InsetGroupedListStyle())
                
                Spacer()
                
                // Checkout button with total amount
                HStack {
                    Text("Total: \(String(format: "$%.2f", totalAmount))")
                        .font(.headline)
                    Spacer()
                    Button(action: {
                        print("Proceed to Checkout")
                    }) {
                        Text("Checkout")
                            .font(.headline)
                            .foregroundColor(.white)
                            .padding()
                            .frame(maxWidth: .infinity)
                            .background(Color.green)
                            .cornerRadius(10)
                    }
                }
                .padding()
            }
            .navigationTitle("Your Cart")
        }
    }
}

// CheckoutView - Displays total amount with a basic confirmation message
struct CheckoutView: View {
    let totalAmount: Double
    
    var body: some View {
        VStack {
            Text("Proceed with Payment")
                .font(.title)
                .padding()
            
            Text("Total: $\(String(format: "%.2f", totalAmount))")
                .font(.headline)
                .padding()
            
            // Confirm Button
            Button(action: {
                print("Checkout confirmed")
            }) {
                Text("Confirm Purchase")
                    .foregroundColor(.white)
                    .padding()
                    .frame(maxWidth: .infinity)
                    .background(Color.green)
                    .cornerRadius(10)
            }
            .padding(.horizontal)
            
            Spacer()
        }
        .padding()
        .navigationTitle("Checkout")
    }
}

struct CartView_Previews: PreviewProvider {
    @State static var sampleCartItems: [CartItem] = [
        CartItem(name: "Pepperoni Pizza", price: 12.99, quantity: 1),
        CartItem(name: "Burger", price: 9.99, quantity: 2)
    ]
    
    static var previews: some View {
        CartView(cartItems: $sampleCartItems)
    }
}

