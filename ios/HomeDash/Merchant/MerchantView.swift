import SwiftUI

struct MerchantView: View {
    @State private var foodName: String = ""
    @State private var foodDescription: String = ""
    @State private var price: String = ""
    @State private var imageURL: String = ""

    var body: some View {
        NavigationView {
            VStack {
                Form {
                    Section(header: Text("Food Details")) {
                        TextField("Food Name", text: $foodName)
                        TextField("Description", text: $foodDescription)
                        TextField("Price", text: $price)
                            .keyboardType(.decimalPad)
                        TextField("Image URL", text: $imageURL)
                    }

                    Button(action: {
                        // Action to post the food item to the backend
                        postFoodItem()
                    }) {
                        Text("Add Food Item")
                            .foregroundColor(.white)
                            .frame(maxWidth: .infinity)
                            .padding()
                            .background(Color.blue)
                            .cornerRadius(8)
                    }
                    .padding(.top)
                }
                
                Spacer()
                
                // Button to navigate to MerchantFoodListView
                NavigationLink(destination: MerchantFoodListView()) {
                    Text("View My Food Items")
                        .foregroundColor(.white)
                        .padding()
                        .frame(maxWidth: .infinity)
                        .background(Color.blue)
                        .cornerRadius(10)
                        .padding(.horizontal)
                }
            }
            .navigationTitle("Merchant Dashboard")
        }
    }

    private func postFoodItem() {
        // Code to integrate with backend for posting food item
        print("Food item \(foodName) with price \(price) posted.")
    }
}

struct MerchantView_Previews: PreviewProvider {
    static var previews: some View {
        MerchantView()
    }
}
