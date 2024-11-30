import SwiftUI

struct MerchantItemView: View {
    let merchant: LocalMerchant

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("Store Name: \(merchant.storeName)")
                .font(.headline)
            Text("Address: \(merchant.address)")
                .font(.subheadline)
            Text("Email: \(merchant.email)")
                .font(.subheadline)
            Text("Phone: \(merchant.phoneNumber)")
                .font(.subheadline)
            Text("Store Type: \(merchant.storeType)")
                .font(.subheadline)
        }
        .padding()
        .background(Color.gray.opacity(0.1))
        .cornerRadius(8)
    }
}

struct MerchantItemView_Previews: PreviewProvider {
    static var previews: some View {
        MerchantItemView(
            merchant: LocalMerchant(
                storeName: "Demo Store",
                address: "123 Main Street",
                email: "demo@store.com",
                phoneNumber: "123-456-7890",
                storeType: "Restaurant"
            )
        )
        .previewLayout(.sizeThatFits)
    }
}
