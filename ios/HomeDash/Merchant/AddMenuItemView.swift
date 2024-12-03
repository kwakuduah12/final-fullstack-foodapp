import SwiftUI

struct AddMenuItemView: View {
    @Environment(\.presentationMode) var presentationMode
    @AppStorage("authToken") private var authToken: String? // To retrieve the token
    @State private var itemName: String = ""
    @State private var price: String = ""
    @State private var description: String = ""
    @State private var category: String = "Appetizer" // Default category
    @State private var available: Bool = true
    @State private var isSubmitting: Bool = false
    @State private var errorMessage: String?

    let categories = ["Appetizer", "Main Course", "Dessert", "Drink", "Other"]

    var onAdd: () -> Void // Callback to refresh the merchant's menu after adding

    var body: some View {
        NavigationView {
            VStack {
                Form {
                    Section(header: Text("Item Details")) {
                        TextField("Item Name", text: $itemName)
                        TextField("Price", text: $price)
                            .keyboardType(.decimalPad)
                        TextField("Description", text: $description)
                        
                        Picker("Category", selection: $category) {
                            ForEach(categories, id: \.self) { category in
                                Text(category)
                            }
                        }
                        .pickerStyle(MenuPickerStyle()) // Dropdown style
                    }

                    Section {
                        Toggle("Available", isOn: $available)
                    }
                }

                if let errorMessage = errorMessage {
                    Text(errorMessage)
                        .foregroundColor(.red)
                        .padding(.top)
                }

                Button(action: addItem) {
                    if isSubmitting {
                        ProgressView()
                            .progressViewStyle(CircularProgressViewStyle())
                            .padding()
                    } else {
                        Text("Add Item")
                            .frame(maxWidth: .infinity)
                            .padding()
                            .background(Color.blue)
                            .foregroundColor(.white)
                            .cornerRadius(10)
                    }
                }
                .padding()
                .disabled(isSubmitting)
            }
            .navigationTitle("Add Menu Item")
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Cancel") {
                        presentationMode.wrappedValue.dismiss()
                    }
                }
            }
        }
    }

    private func addItem() {
        guard let token = authToken else {
            errorMessage = "User not authenticated."
            return
        }

        guard let priceValue = Double(price) else {
            errorMessage = "Invalid price. Please enter a valid number."
            return
        }

        let endpoint = "http://localhost:4000/menu/create" // Backend expects this
        guard let url = URL(string: endpoint) else {
            errorMessage = "Invalid backend URL."
            return
        }

        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")

        let body: [String: Any] = [
            "item_name": itemName,
            "price": priceValue,
            "description": description,
            "category": category,
            "available": available
        ]

        do {
            request.httpBody = try JSONSerialization.data(withJSONObject: body)
        } catch {
            errorMessage = "Failed to encode data. Please try again."
            return
        }

        isSubmitting = true
        URLSession.shared.dataTask(with: request) { data, response, error in
            DispatchQueue.main.async {
                isSubmitting = false
                if let error = error {
                    errorMessage = "Error adding item: \(error.localizedDescription)"
                    return
                }

                guard let httpResponse = response as? HTTPURLResponse, httpResponse.statusCode == 201 else {
                    errorMessage = "Failed to add item. Please try again."
                    return
                }

                onAdd()
                presentationMode.wrappedValue.dismiss()
            }
        }.resume()
    }
}

struct AddMenuItemView_Previews: PreviewProvider {
    static var previews: some View {
        AddMenuItemView {
            print("Menu refreshed!")
        }
    }
}
