import SwiftUI

struct MenuResponse: Decodable {
    let message: String
    let data: [MenuItem]
}

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

struct MenuItemView: View {
    let menuItem: MenuItem
    var onDelete: (String) -> Void // Callback for delete action

    var body: some View {
        HStack(alignment: .top) {
            // Placeholder for item image (fallback rectangle as no `imageURL` is present)
            Rectangle()
                .fill(Color.gray.opacity(0.2))
                .frame(width: 80, height: 80)
                .cornerRadius(10)
                .overlay(Text("No Image").font(.caption).foregroundColor(.gray))

            VStack(alignment: .leading, spacing: 8) {
                Text(menuItem.itemName)
                    .font(.headline)
                Text(String(format: "$%.2f", menuItem.price))
                    .font(.subheadline)
                    .foregroundColor(.green)
                if let description = menuItem.description {
                    Text(description)
                        .font(.body)
                        .foregroundColor(.gray)
                        .lineLimit(2)
                }
                Toggle("Available", isOn: .constant(menuItem.available))
                    .disabled(true) // Display only
            }

            Spacer()

            Button(action: { onDelete(menuItem.id) }) {
                Image(systemName: "trash")
                    .foregroundColor(.red)
            }
        }
        .padding()
        .background(Color.white)
        .cornerRadius(10)
        .shadow(radius: 3)
    }
}

struct MenuItemView_Previews: PreviewProvider {
    static var previews: some View {
        let sampleItem = MenuItem(
            id: "1",
            merchantId: "merchant123",
            itemName: "Delicious Pizza",
            description: "A classic cheese pizza with a crispy crust and flavorful tomato sauce.",
            price: 12.99,
            category: "Main Course",
            available: true,
            createdAt: "2023-01-01",
            updatedAt: "2023-01-02"
        )
        
        MenuItemView(menuItem: sampleItem, onDelete: { id in
            print("Delete action triggered for item with ID: \(id)")
        })
        .previewLayout(.sizeThatFits)
        .padding()
    }
}
