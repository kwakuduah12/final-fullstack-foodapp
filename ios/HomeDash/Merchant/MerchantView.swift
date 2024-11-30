import SwiftUI

struct LocalMerchant: Identifiable, Decodable {
    let id: UUID = UUID() // Locally generated UUID for SwiftUI use
    let storeName: String
    let address: String
    let email: String
    let phoneNumber: String
    let storeType: String
    
    // Map keys from JSON to Swift properties if needed
    enum CodingKeys: String, CodingKey {
        case storeName = "store_name"
        case address
        case email
        case phoneNumber = "phone_number"
        case storeType = "store_type"
    }
}

struct MerchantView: View {
    @State private var merchants: [LocalMerchant] = []
    @State private var isLoading: Bool = true
    @State private var errorMessage: String? = nil
    
    var body: some View {
        NavigationView {
            ScrollView {
                VStack(spacing: 16) {
                    if isLoading {
                        ProgressView()
                            .progressViewStyle(CircularProgressViewStyle())
                    } else {
                        if let errorMessage = errorMessage {
                            Text(errorMessage)
                                .foregroundColor(.red)
                                .font(.headline)
                        } else {
                            ForEach(merchants) { merchant in
                                MerchantItemView(merchant: merchant)
                                    .padding()
                                    .background(Color.white)
                                    .cornerRadius(10)
                                    .shadow(radius: 3)
                            }
                        }
                    }
                }
                .padding(16)
            }
            .navigationTitle("Merchant Home")
            .onAppear {
                fetchMerchants()
            }
        }
    }
    
    private func fetchMerchants() {
        isLoading = true
        errorMessage = nil
        
        // Backend API URL
        guard let url = URL(string: "http://localhost:4000/merchants") else {
            errorMessage = "Invalid backend URL."
            isLoading = false
            return
        }
        
        // Create a data task to fetch merchants
        URLSession.shared.dataTask(with: url) { data, response, error in
            DispatchQueue.main.async {
                if let error = error {
                    self.errorMessage = "Error fetching merchants: \(error.localizedDescription)"
                    self.isLoading = false
                    return
                }
                
                guard let httpResponse = response as? HTTPURLResponse, httpResponse.statusCode == 200 else {
                    self.errorMessage = "Invalid response from server."
                    self.isLoading = false
                    return
                }
                
                guard let data = data else {
                    self.errorMessage = "No data received from server."
                    self.isLoading = false
                    return
                }
                
                do {
                    let decodedMerchants = try JSONDecoder().decode([LocalMerchant].self, from: data)
                    if decodedMerchants.isEmpty {
                        self.errorMessage = "No merchants available."
                    } else {
                        self.merchants = decodedMerchants
                    }
                } catch {
                    self.errorMessage = "Failed to decode merchants: \(error.localizedDescription)"
                }
                self.isLoading = false
            }
        }.resume()
    }
}

struct MerchantView_Previews: PreviewProvider {
    static var previews: some View {
        MerchantView()
    }
}

//import SwiftUI
//
//struct Merchant: Identifiable {
//    let id = UUID()
//    let storeName: String
//    let address: String
//    let email: String
//    let phoneNumber: String
//    let storeType: String
//}
//
//struct MerchantView: View {
//    @State private var merchants: [Merchant] = []
//    @State private var isLoading: Bool = true
//    @State private var errorMessage: String? = nil
//    
//    var body: some View {
//        NavigationView {
//            ScrollView {
//                VStack(spacing: 16) {
//                    if isLoading {
//                        ProgressView()
//                            .progressViewStyle(CircularProgressViewStyle())
//                    } else {
//                        if let errorMessage = errorMessage {
//                            Text(errorMessage)
//                                .foregroundColor(.red)
//                                .font(.headline)
//                        } else {
//                            ForEach(merchants) { merchant in
//                                MerchantItemView(merchant: merchant)
//                                    .padding()
//                                    .background(Color.white)
//                                    .cornerRadius(10)
//                                    .shadow(radius: 3)
//                            }
//                        }
//                    }
//                }
//                .padding(16)
//            }
//            .navigationTitle("Merchant Home")
//            .onAppear {
//                fetchMerchants()
//            }
//        }
//    }
//    private func fetchMerchants() {
//        isLoading = true
//        errorMessage = nil
//        
//        // Backend API URL
//        guard let url = URL(string: "http://localhost:4000/merchants") else {
//            errorMessage = "Invalid backend URL."
//            isLoading = false
//            return
//        }
//        
//        // Create a data task to fetch merchants
//        URLSession.shared.dataTask(with: url) { data, response, error in
//            DispatchQueue.main.async {
//                if let error = error {
//                    self.errorMessage = "Error fetching merchants: \(error.localizedDescription)"
//                    self.isLoading = false
//                    return
//                }
//                
//                guard let httpResponse = response as? HTTPURLResponse, httpResponse.statusCode == 200 else {
//                    self.errorMessage = "Invalid response from server."
//                    self.isLoading = false
//                    return
//                }
//                
//                guard let data = data else {
//                    self.errorMessage = "No data received from server."
//                    self.isLoading = false
//                    return
//                }
//                
////                do {
//////                    let decodedMerchants = try JSONDecoder().decode([Merchant].self, from: data)
////                    if decodedMerchants.isEmpty {
////                        self.errorMessage = "No merchants available."
////                    } else {
////                        self.merchants = decodedMerchants
////                    }
////                } catch {
////                    self.errorMessage = "Failed to decode merchants: \(error.localizedDescription)"
////                }
//                self.isLoading = false
//            }
//        }.resume()
//    }
//}
//
//struct MerchantView_Previews: PreviewProvider {
//    static var previews: some View {
//        MerchantView()
//    }
//}
