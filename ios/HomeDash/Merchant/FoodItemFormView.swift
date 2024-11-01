import SwiftUI
import PhotosUI

struct FoodItemFormView: View {
    @State private var name: String = ""
    @State private var price: String = ""
    @State private var description: String = ""
    @State private var isPickupAvailable: Bool = false
    @State private var hasDeals: Bool = false
    @State private var selectedImageItem: PhotosPickerItem? = nil
    @State private var selectedImageData: Data? = nil
    @State private var isImagePickerPresented = false

    var body: some View {
        NavigationView {
            Form {
                Section(header: Text("Food Item Details")) {
                    TextField("Name", text: $name)
                    TextField("Price", text: $price)
                        .keyboardType(.decimalPad)
                    TextField("Description", text: $description)
                }
                
                Section(header: Text("Additional Options")) {
                    Toggle("Pickup Available", isOn: $isPickupAvailable)
                    Toggle("Has Deals", isOn: $hasDeals)
                }
                
                Section(header: Text("Image")) {
                    if let imageData = selectedImageData, let uiImage = UIImage(data: imageData) {
                        Image(uiImage: uiImage)
                            .resizable()
                            .scaledToFit()
                            .frame(height: 200)
                            .cornerRadius(10)
                            .padding(.top)
                    } else {
                        Button(action: {
                            isImagePickerPresented = true
                        }) {
                            Text("Select an Image")
                                .foregroundColor(.blue)
                                .padding()
                                .overlay(
                                    RoundedRectangle(cornerRadius: 8)
                                        .stroke(Color.blue, lineWidth: 1)
                                )
                        }
                    }
                }
                
                Section {
                    Button(action: submitFoodItem) {
                        Text("Add Food Item")
                            .foregroundColor(.white)
                            .frame(maxWidth: .infinity)
                            .padding()
                            .background(Color.blue)
                            .cornerRadius(10)
                    }
                }
            }
            .navigationTitle("Add Food Item")
            .photosPicker(isPresented: $isImagePickerPresented, selection: $selectedImageItem, matching: .images)
            .onChange(of: selectedImageItem) { newItem in
                Task {
                    if let data = try? await newItem?.loadTransferable(type: Data.self) {
                        selectedImageData = data
                    }
                }
            }
        }
    }
    
    private func submitFoodItem() {
        guard let priceValue = Double(price), !name.isEmpty, !description.isEmpty else {
            print("Invalid input - please fill all fields correctly.")
            return
        }

        let foodItem: [String: Any] = [
            "name": name,
            "price": priceValue,
            "description": description,
            "isPickupAvailable": isPickupAvailable,
            "hasDeals": hasDeals,
            "imageData": selectedImageData ?? Data()
        ]
        
        print("Food Item to Submit:", foodItem)
    }
}

struct FoodItemFormView_Previews: PreviewProvider {
    static var previews: some View {
        FoodItemFormView()
    }
}
