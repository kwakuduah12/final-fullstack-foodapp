package com.example.homedasher_prod

import android.util.Log
import io.ktor.client.HttpClient
import io.ktor.client.engine.cio.CIO
import io.ktor.client.plugins.contentnegotiation.ContentNegotiation
import io.ktor.serialization.kotlinx.json.json
import kotlinx.serialization.ExperimentalSerializationApi
import kotlinx.serialization.InternalSerializationApi
import kotlinx.serialization.KSerializer
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable
import kotlinx.serialization.SerializationException
import kotlinx.serialization.builtins.ListSerializer
import kotlinx.serialization.builtins.serializer
import kotlinx.serialization.descriptors.PrimitiveKind
import kotlinx.serialization.descriptors.PrimitiveSerialDescriptor
import kotlinx.serialization.descriptors.SerialDescriptor
import kotlinx.serialization.descriptors.StructureKind
import kotlinx.serialization.descriptors.buildClassSerialDescriptor
import kotlinx.serialization.descriptors.buildSerialDescriptor
import kotlinx.serialization.descriptors.element
import kotlinx.serialization.encoding.Decoder
import kotlinx.serialization.encoding.Encoder
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.JsonArray
import kotlinx.serialization.json.JsonClassDiscriminator
import kotlinx.serialization.json.JsonDecoder
import kotlinx.serialization.json.JsonElement
import kotlinx.serialization.json.JsonEncoder
import kotlinx.serialization.json.JsonObject
import kotlinx.serialization.json.JsonPrimitive
import kotlinx.serialization.json.contentOrNull
import kotlinx.serialization.json.intOrNull
import kotlinx.serialization.json.jsonPrimitive


object HttpClientProvider {
    val instance: HttpClient by lazy {
        HttpClient(CIO) {
            install(ContentNegotiation) {
                json(Json { ignoreUnknownKeys = true })
            }
        }
    }
}

val client = HttpClientProvider.instance

@Serializable
data class LoginRequest(val email: String, val password: String)

@Serializable
data class RegisterRequest(val email: String, val name: String, val password: String, val confirmPassword: String)

@Serializable
data class MerchantRegisterRequest(
    val email: String,
    val store_name: String,
    val address: String,
    val phone_number: String,
    val store_type: String,
    val password: String,
    val confirmPassword: String
)

@Serializable
data class MerchantResponse(
    val message: String,
    val data: List<Merchant>
)

@Serializable
data class Merchant(
    @SerialName("_id") val id: String,
    @SerialName("store_name") val storeName: String,
    val address: String,
    val email: String,
    @SerialName("phone_number") val phoneNumber: String,
    @SerialName("store_type") val storeType: String,
    @SerialName("created_at") val createdAt: String,
    @SerialName("updated_at") val updatedAt: String
)


@Serializable
data class MerchantMenuItem(
    val _id: String,
    @SerialName("merchant_id") val merchantId: String,
    @SerialName("item_name") val itemName: String,
    val description: String? = null,
    val price: Double,
    val category: String,
    val available: Boolean,
    var isPromoted: Boolean = false,
    @SerialName("created_at") val createdAt: String,
    @SerialName("updated_at") val updatedAt: String,
    @SerialName("__v") val version: Int,
    val discountedPrice: Double? = null
)

@Serializable
data class MenuResponse(
    val data: List<MerchantMenuItem>
)
@Serializable
data class CartResponse(
    val message: String,
    val data: CartData
)

@Serializable
data class CartData(
    val _id: String,
    val user_id: String,
    val items: List<CartItem>,
    val total_price: Double,
    val created_at: String,
    val updated_at: String,
    val __v: Int
)

@Serializable
data class CartItem(
    @SerialName("menu_item_id") val menuItem: MenuItem? = null,
    val quantity: Int,
    val _id: String
)

@Serializable
data class MenuItem(
    @SerialName("_id") val id: String,
    @SerialName("merchant_id") val merchantId: String,
    @SerialName("item_name") val itemName: String,
    val description: String,
    val price: Double,
    val category: String,
    val available: Boolean,
    @SerialName("created_at") val createdAt: String,
    @SerialName("updated_at") val updatedAt: String,
    @SerialName("__v") val version: Int
)


@Serializable
data class AddToCartRequest(
    val user_id: String,
    val menu_item_id: String,
    val quantity: Int
)

@Serializable
data class LoginResponse(
    val message: String,
    val token: String
)

@Serializable
data class OrderRequest(
    val merchant_id: String,
    val items: List<OrderItem>
)

@Serializable
data class OrderResponse(
    val message: String,
    val data: Order
)


@Serializable
data class OrderItem(
    val menu_item_id: String,
    val quantity: Int,
    val price: Double // Use the already assigned price
)



@Serializable
data class RemoveItemRequest(
    val menu_item_id: String
)

@Serializable
data class MerchantProfile(
    val _id: String,
    val store_name: String,
    val address: String,
    val email: String,
    val phone_number: String,
    val store_type: String
)

@Serializable
data class UserProfile(
    val _id: String,
    val name: String,
    val email: String
)

@Serializable
data class ProfileResponse(val data: JsonElement)

@Serializable
data class UpdateMenuItemRequest(
    val item_name: String,
    val price: Double,
    val category: String,
    val available: Boolean
)

@Serializable
data class CreateMenuItemRequest(
    val item_name: String,
    val description: String,
    val price: Double,
    val category: String,
    val available: Boolean
)
@Serializable
data class MerchantOrdersResponse(
    val message: String,
    val data: List<MerchantOrder>
)

@Serializable
data class Order(
    @SerialName("_id") val id: String,
    @SerialName("user_id") val user: JsonElement, // Keep as JsonElement for polymorphic handling
    @SerialName("merchant_id") val merchantId: String,
    val items: List<OrderItemDetail> = emptyList(),
    @SerialName("total_price") val totalPrice: Double = 0.0,
    @SerialName("status") val status: String?,
    @SerialName("order_date") val orderDate: String?,
    @SerialName("updated_at") val updatedAt: String? = null,
    @SerialName("__v") val version: Int? = null // Add if needed
)



@Serializable
data class MerchantId(
    @SerialName("_id") val id: String,
    val email: String? = null
)


@Serializable
data class OrderItemDetail(
    @Serializable(with = MenuItemIdOrDetailsSerializer::class)
    @SerialName("menu_item_id") val menuItem: MenuItemDetails? = null,
    val quantity: Int,
    @SerialName("_id") val id: String
)

object MenuItemIdOrDetailsSerializer : KSerializer<MenuItemDetails?> {
    override val descriptor: SerialDescriptor = buildClassSerialDescriptor("MenuItemIdOrDetails")

    override fun serialize(encoder: Encoder, value: MenuItemDetails?) {
        val jsonEncoder = encoder as? JsonEncoder
            ?: throw SerializationException("MenuItemIdOrDetailsSerializer only supports JSON encoding")

        if (value != null) {
            jsonEncoder.encodeJsonElement(Json.encodeToJsonElement(MenuItemDetails.serializer(), value))
        } else {
            jsonEncoder.encodeNull()
        }
    }

    override fun deserialize(decoder: Decoder): MenuItemDetails? {
        val jsonDecoder = decoder as? JsonDecoder
            ?: throw SerializationException("MenuItemIdOrDetailsSerializer only supports JSON decoding")

        val element = jsonDecoder.decodeJsonElement()
        return when (element) {
            is JsonObject -> {
                // Full details provided
                Json.decodeFromJsonElement(MenuItemDetails.serializer(), element)
            }
            is JsonPrimitive -> {
                // Handle case where menu_item_id is just an ID string
                if (element.isString) {
                    MenuItemDetails(
                        id = element.content,
                        itemName = "Unknown Item", // Placeholder if details are missing
                        description = null,
                        price = 0.0,
                        category = "Unknown",
                        available = false
                    )
                } else {
                    null
                }
            }
            else -> null
        }
    }
}



@Serializable
data class MostOrderedFood(
    @SerialName("_id") val menuItemId: String,
    @SerialName("totalQuantity") val totalQuantity: Int,
    @SerialName("menuItemName") val name: String,
    @SerialName("menuItemPrice") val price: Double,
    val storeName: String,
    val merchantId: String
)

@Serializable
data class MostOrderedFoodsResponse(
    val message: String,
    val data: List<MostOrderedFood>
)


@Serializable
data class PaymentRequest(
    @SerialName("orderId") val orderId: String,
    @SerialName("userId") val userId: String,
    @SerialName("merchantId") val merchantId: String,
    @SerialName("amount") val amount: Double
)


@Serializable
data class PaymentResponse(
    val message: String,
    val userBalance: Double,
    val merchantBalance: Double,
    val orderStatus: String,
    val paymentStatus: String // Matches backend `payment.status`
)


@Serializable
data class UserBalanceResponse(
    val message: String,
    val balance: Double
)


@Serializable
data class MenuItemId(
    @SerialName("_id") val id: String
)

@Serializable
data class OrderItem1(
    @SerialName("menu_item_id") val menuItemId: MenuItemId, // Updated type
    val quantity: Int,
    @SerialName("_id") val id: String
)


@Serializable
data class MerchantOrder(
    @SerialName("_id") val id: String,
    @SerialName("user_id") @Serializable(with = UserIdOrDetailsSerializer::class) val user: UserIdOrDetails,
    @SerialName("merchant_id") val merchantId: String,
    val items: List<OrderItemDetail2> = emptyList(),
    @SerialName("total_price") val totalPrice: Double = 0.0,
    @SerialName("status") val status: String?,
    @SerialName("order_date") val orderDate: String?,
    @SerialName("updated_at") val updatedAt: String? = null
)


@Serializable
data class OrderItemDetail2(
    @SerialName("menu_item_id") val menuItemId: MenuItemDetails? = null, // Nullable
    val quantity: Int,
    @SerialName("_id") val id: String
)

@Serializable
data class MenuItemDetails(
    @SerialName("_id") val id: String,
    @SerialName("item_name") val itemName: String,
    val description: String? = null,
    val price: Double,
    val category: String,
    val available: Boolean
)

@Serializable
sealed class UserIdOrDetails {
    @Serializable
    @SerialName("id")
    data class Id(@SerialName("_id") val id: String) : UserIdOrDetails()

    @Serializable
    @SerialName("details")
    data class Details(
        @SerialName("_id") val id: String,
        val name: String = "",
        val email: String = "",
        val balance: Double = 0.0,
        val password: String? = null, // Password field is nullable
        @SerialName("__v") val version: Int? = null // Add the `__v` field as nullable
    ) : UserIdOrDetails()

    companion object {
        fun deserialize(jsonElement: JsonElement): UserIdOrDetails {
            return when (jsonElement) {
                is JsonPrimitive -> Id(jsonElement.content)
                is JsonObject -> Json.decodeFromJsonElement(Details.serializer(), jsonElement)
                else -> throw IllegalArgumentException("Unsupported JSON structure for UserIdOrDetails")
            }
        }
    }
}



    object UserIdOrDetailsSerializer : KSerializer<UserIdOrDetails> {
    override val descriptor: SerialDescriptor = buildClassSerialDescriptor("UserIdOrDetails")

    override fun serialize(encoder: Encoder, value: UserIdOrDetails) {
        val jsonEncoder = encoder as? JsonEncoder
            ?: throw SerializationException("UserIdOrDetailsSerializer only supports Json encoding")

        val jsonElement = when (value) {
            is UserIdOrDetails.Id -> JsonPrimitive(value.id)
            is UserIdOrDetails.Details -> Json.encodeToJsonElement(UserIdOrDetails.Details.serializer(), value)
        }

        jsonEncoder.encodeJsonElement(jsonElement)
    }

    override fun deserialize(decoder: Decoder): UserIdOrDetails {
        val jsonDecoder = decoder as? JsonDecoder
            ?: throw SerializationException("UserIdOrDetailsSerializer only supports Json decoding")

        val element = jsonDecoder.decodeJsonElement()
        return when (element) {
            is JsonPrimitive -> {
                if (element.isString) {
                    UserIdOrDetails.Id(element.content)
                } else {
                    throw SerializationException("Expected a string for UserIdOrDetails.Id")
                }
            }
            is JsonObject -> Json.decodeFromJsonElement(UserIdOrDetails.Details.serializer(), element)
            else -> throw SerializationException("Unsupported JSON structure for UserIdOrDetails")
        }
    }
}

@Serializable
data class CreatePromotionRequest(
    val promotionName: String,
    val description: String,
    val discount: Double,
    val startDate: String, // Use ISO 8601 format for dates (e.g., "2024-12-01T00:00:00Z")
    val endDate: String,   // Use ISO 8601 format for dates
    val menuItems: List<String> // List of menu item IDs
)

@Serializable
data class Promotion(
    val _id: String,
    val promotionName: String,
    val description: String,
    val discount: Double,
    val startDate: String,
    val endDate: String,
    @Serializable(with = MenuItemsToStringListSerializer::class)
    val menuItems: List<String>,
    val merchantId: MerchantId
)



@Serializable
data class PromotionsResponse(
    val message: String,
    val data: List<Promotion>
)



object MenuItemsToStringListSerializer : KSerializer<List<String>> {
    @OptIn(InternalSerializationApi::class, ExperimentalSerializationApi::class)
    override val descriptor: SerialDescriptor =
        buildSerialDescriptor("MenuItems", StructureKind.LIST) {
            element<String>("id")
        }

    override fun deserialize(decoder: Decoder): List<String> {
        val element = (decoder as JsonDecoder).decodeJsonElement()

        if (element !is JsonArray) {
            throw SerializationException("Expected a JSON array for menuItems")
        }

        return element.mapNotNull {
            val id = (it as? JsonObject)?.get("_id")?.jsonPrimitive?.contentOrNull
            id ?: run {
                println("Invalid menu item format: $it") // Logging invalid format
                null
            }
        }
    }

    override fun serialize(encoder: Encoder, value: List<String>) {
        val jsonArray = JsonArray(value.map { JsonPrimitive(it) })
        (encoder as JsonEncoder).encodeJsonElement(jsonArray)
    }
}

@Serializable
data class UserOrderResponse(
    val message: String,
    val data: List<UserOrder>
)

@Serializable
data class UserOrder(
    @SerialName("_id") val id: String,
    @SerialName("user_id") val userId: String,
    @SerialName("merchant_id") val merchant: MerchantDetails,
    val items: List<UserOrderItem>,
    @SerialName("total_price") val totalPrice: Double,
    val status: String?,
    @SerialName("order_date") val orderDate: String?,
    @SerialName("updated_at") val updatedAt: String?
)

@Serializable
data class MerchantDetails(
    @SerialName("_id") val id: String,
    @SerialName("store_name") val storeName: String,
    val address: String,
    val email: String,
    @SerialName("phone_number") val phoneNumber: String,
    @SerialName("store_type") val storeType: String,
    val password: String,
    @SerialName("created_at") val createdAt: String,
    @SerialName("updated_at") val updatedAt: String,
    @SerialName("__v") val version: Int,
    @Serializable(with = FlexibleBalanceSerializer::class)
    val balance: Double
)


object FlexibleBalanceSerializer : KSerializer<Double> {
    override val descriptor: SerialDescriptor = PrimitiveSerialDescriptor("FlexibleBalance", PrimitiveKind.DOUBLE)

    override fun serialize(encoder: Encoder, value: Double) {
        encoder.encodeDouble(value)
    }

    override fun deserialize(decoder: Decoder): Double {
        return try {
            decoder.decodeDouble()
        } catch (e: SerializationException) {
            decoder.decodeInt().toDouble()
        }
    }
}


@Serializable
data class UserOrderItem(
    @SerialName("menu_item_id") val menuItem: MenuItemDetails1? = null,
    val quantity: Int,
    @SerialName("_id") val id: String
)

@Serializable
data class MenuItemDetails1(
    @SerialName("_id") val id: String,
    @SerialName("item_name") val itemName: String,
    val description: String?,
    val price: Double,
    val category: String,
    val available: Boolean
)


@Serializable
data class MerchantOrdersResponse1(
    val message: String,
    val data: List<MerchantOrderDetail>
)

@Serializable
data class MerchantOrderDetail(
    @SerialName("_id") val id: String,
    @SerialName("user_id") val user: MerchantOrderUser,
    @SerialName("merchant_id") val merchantId: String,
    val items: List<MerchantOrderItem>,
    @SerialName("total_price") val totalPrice: Double,
    val status: String?,
    @SerialName("order_date") val orderDate: String?,
    @SerialName("updated_at") val updatedAt: String?,
    @SerialName("__v") val version: Int
)

@Serializable
data class MerchantOrderUser(
    @SerialName("_id") val id: String,
    val name: String,
    val email: String,
    val password: String,
    @SerialName("__v") val version: Int,
    val balance: Double
)

@Serializable
data class MerchantOrderItem(
    @SerialName("menu_item_id") val menuItem: MenuItemDetailsOrNull? = null,
    val quantity: Int,
    @SerialName("_id") val id: String
)

@Serializable
data class MenuItemDetailsOrNull(
    @SerialName("_id") val id: String,
    @SerialName("merchant_id") val merchantId: String,
    @SerialName("item_name") val itemName: String,
    val description: String? = null,
    val price: Double,
    val category: String,
    val available: Boolean,
    @SerialName("created_at") val createdAt: String,
    @SerialName("updated_at") val updatedAt: String,
    @SerialName("__v") val version: Int
)

@Serializable
data class OrderResponsePayload(
    @SerialName("message") val responseMessage: String,
    @SerialName("data") val ordersList: List<TransactionRecord>
)

@Serializable
data class TransactionRecord(
    @SerialName("_id") val transactionId: String,
    @SerialName("user_id") val clientDetails: ClientProfile,
    @SerialName("merchant_id") val businessId: String,
    @SerialName("items") val purchasedItems: List<PurchaseDetail>,
    @SerialName("total_price") val paymentTotal: Double,
    @SerialName("status") val transactionStatus: String,
    @SerialName("order_date") val timestampOrderPlaced: String,
    @SerialName("updated_at") val timestampLastModified: String,
    @SerialName("__v") val dataVersion: Int
)

@Serializable
data class ClientProfile(
    @SerialName("_id") val profileId: String,
    @SerialName("name") val fullName: String,
    @SerialName("email") val emailAddress: String,
    @SerialName("password") val hashedPassword: String,
    @SerialName("balance") val walletBalance: Double,
    @SerialName("__v") val profileVersion: Int
)

@Serializable
data class PurchaseDetail(
    @SerialName("menu_item_id") val linkedMenuItem: MenuOption?,
    @SerialName("quantity") val itemCount: Int,
    @SerialName("_id") val detailId: String
)

@Serializable
data class MenuOption(
    @SerialName("_id") val optionId: String,
    @SerialName("merchant_id") val vendorId: String,
    @SerialName("item_name") val productTitle: String,
    @SerialName("description") val productDescription: String,
    @SerialName("price") val productCost: Double,
    @SerialName("category") val productCategory: String,
    @SerialName("available") val isInStock: Boolean,
    @SerialName("created_at") val creationTimestamp: String,
    @SerialName("updated_at") val modificationTimestamp: String,
    @SerialName("__v") val optionVersion: Int
)

@Serializable
data class Promo(
    @SerialName("_id") val id: String,
    @SerialName("promotionName") val name: String,
    val description: String,
    val discount: Double,
    val startDate: String,
    val endDate: String,
    val menuItems: List<PromotionMenuItem>, // Updated to match the new structure
    @SerialName("merchantId") val merchantId: PromotionMerchantId
)

@Serializable
data class PromotionMenuItem(
    @SerialName("_id") val id: String,
    @SerialName("item_name") val itemName: String,
    val price: Double,
    val category: String
)

@Serializable
data class PromotionMerchantId(
    @SerialName("_id") val id: String,
    @SerialName("store_name") val storeName: String,
    val email: String
)

@Serializable
data class PromoResponse(
    val message: String,
    val data: List<Promo>
)

@Serializable
data class CommonPromotion(
    val id: String,
    val name: String,
    val description: String,
    val discount: Double,
    val startDate: String,
    val endDate: String,
    val merchantId: String,

)

fun Promo.toCommonPromotion(): CommonPromotion {
    return CommonPromotion(
        id = this.id,
        name = this.name,
        description = this.description,
        discount = this.discount,
        startDate = this.startDate,
        endDate = this.endDate,
        merchantId = this.merchantId.id
    )
}

fun Promotion.toCommonPromotion(): CommonPromotion {
    return CommonPromotion(
        id = this._id,
        name = this.promotionName,
        description = this.description,
        discount = this.discount,
        startDate = this.startDate,
        endDate = this.endDate,
        merchantId = this.merchantId.id
    )
}

@Serializable
data class ReviewRequest(
    val order_id: String,
    val menu_item_id: String,
    val rating: Int,
    val review_text: String
)

@Serializable
data class ReviewResponse(
    val message: String, // Example: "Review retrieved successfully"
    val data: ReviewData // Now it's a single review, not a list
)

@Serializable
data class MerchantRatingRequest(
    val rating: Int,
    val reviewText: String?
)



@Serializable
data class ReviewData(
    val _id: String, // Review ID
    val user_id: UserId, // Nested object for user information
    val order_id: String, // ID of the associated order
    val menu_item_id: String, // ID of the reviewed menu item
    val merchant_id: String?, // ID of the merchant, optional if reviewing an item
    val rating: Int, // Star rating (1 to 5)
    val review_text: String?, // Review text
    val created_at: String, // Timestamp when the review was created
    val updated_at: String, // Timestamp when the review was last updated
    val __v: Int?
)



@Serializable
data class UserId(
    val _id: String, // User ID
    val name: String? = null, // User name (optional, if available)
    val email: String? = null // User email (optional, if available)
)

@Serializable
data class MerchantOrderReviewsResponse(
    val message: String,
    val data: List<MerchantOrderReview>
)

@Serializable
data class MerchantOrderReview(
    val order_id: String,
    val items: List<ReviewedItem>
)

@Serializable
data class ReviewedItem(
    val menu_item_id: String,
    val menu_item_name: String?,
    val reviews: List<ReviewData>
)
@Serializable
data class CombinedOrderReview(
    val order_id: String,
    val status: String,
    val total_price: Double,
    val items: List<CombinedItemReview>
)

@Serializable
data class CombinedItemReview(
    val menu_item_name: String?,
    val quantity: Int,
    val reviews: List<ReviewData>
)


@Serializable
data class MerchantReview(
    val user_id: UserData,
    val rating: Int,
    val review_text: String?,
    val created_at: String
)

@Serializable
data class UserData(
    val name: String,
    val email: String
)

@Serializable
data class MerchantReviewsResponse(
    val data: List<MerchantReview>,
    val averageRating: Double?
)




