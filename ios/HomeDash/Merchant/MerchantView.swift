import SwiftUI

struct MerchantView: View {
    @AppStorage("authToken") private var authToken: String?
    @State private var menuItems: [MenuItem] = []
    @State private var isLoading: Bool = true
    @State private var errorMessage: String? = nil
    @State private var isAddMenuPresented: Bool = false
    
    var body: some View {
        NavigationView {
            VStack {
                if isLoading {
                    ProgressView("Loading Menu Items...")
                } else {
                    if let errorMessage = errorMessage {
                        Text(errorMessage)
                            .foregroundColor(.red)
                            .padding()
                    } else {
                        ScrollView {
                            VStack(spacing: 16) {
                                ForEach(menuItems) { item in
                                    MenuItemView(menuItem: item, onDelete: deleteMenuItem)
                                        .padding()
                                        .background(Color.white)
                                        .cornerRadius(10)
                                        .shadow(radius: 3)
                                }
                            }
                            .padding()
                        }
                    }
                }
                Spacer()
                Button(action: { isAddMenuPresented = true }) {
                    Text("Add Menu Item")
                        .font(.headline)
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(Color.blue)
                        .foregroundColor(.white)
                        .cornerRadius(10)
                }
                .padding()
                .sheet(isPresented: $isAddMenuPresented) {
                    AddMenuItemView(onAdd: fetchMenuItems)
                }
            }
            .navigationTitle("Merchant Menu")
            .onAppear {
                fetchMenuItems()
            }
        }
    }
    private func fetchMenuItems() {
        guard let token = authToken else {
            errorMessage = "User not authenticated."
            isLoading = false
            return
        }
        
        guard let merchantId = decodeMerchantId(from: token) else {
            errorMessage = "Invalid token format."
            isLoading = false
            return
        }
        
        let endpoint = "http://localhost:4000/menu/merchant/\(merchantId)"
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
                    errorMessage = "Error fetching menu items: \(error.localizedDescription)"
                    return
                }
                
                guard let data = data else {
                    errorMessage = "No data received from server."
                    return
                }
                
                do {
                    // Decode the response
                    let decodedResponse = try JSONDecoder().decode(MenuResponse.self, from: data)
                    menuItems = decodedResponse.data // Extract the menu items array
                } catch {
                    errorMessage = "Failed to decode menu items: \(error.localizedDescription)"
                }
            }
        }.resume()
    }
    
    private func deleteMenuItem(_ id: String) {
        guard let token = authToken else {
            errorMessage = "User not authenticated."
            return
        }
        
        let endpoint = "http://localhost:4000/menu/\(id)"
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
                    errorMessage = "Error deleting menu item: \(error.localizedDescription)"
                    return
                }
                
                menuItems.removeAll { $0.id == id }
            }
        }.resume()
    }
    private func decodeMerchantId(from token: String) -> String? {
        // Split the token to extract the payload
        let parts = token.split(separator: ".")
        guard parts.count == 3 else {
            print("Invalid JWT structure. Token: \(token)")
            return nil
        }
        
        // Decode the payload (Base64)
        let base64Payload = String(parts[1])
        
        // Add padding to Base64 string if necessary
        let paddedBase64 = base64Payload.padding(toLength: ((base64Payload.count + 3) / 4) * 4, withPad: "=", startingAt: 0)
        
        guard let payloadData = Data(base64Encoded: paddedBase64) else {
            print("Failed to Base64 decode payload. Token: \(token)")
            return nil
        }
        
        // Parse the JSON payload
        do {
            if let json = try JSONSerialization.jsonObject(with: payloadData, options: []) as? [String: Any],
               let merchantId = json["id"] as? String {
                print("Decoded merchant ID: \(merchantId)")
                return merchantId
            } else {
                print("Invalid JSON structure in payload. Data: \(String(data: payloadData, encoding: .utf8) ?? "")")
            }
        } catch {
            print("Failed to parse JSON payload. Error: \(error.localizedDescription)")
        }
        
        return nil
    }
    
    
    struct MerchantView_Previews: PreviewProvider {
        static var previews: some View {
            MerchantView()
        }
    }
}
