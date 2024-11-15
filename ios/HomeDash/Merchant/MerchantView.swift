import SwiftUI

struct MerchantView: View {
    var body: some View {
        VStack {
            Text("Welcome, Merchant!")
                .font(.largeTitle)
                .fontWeight(.bold)
                .padding()

            Text("Manage your store and products here.")
                .padding()

            // Add your merchant-specific UI here
        }
    }
}

struct MerchantView_Previews: PreviewProvider {
    static var previews: some View {
        MerchantView()
    }
}
