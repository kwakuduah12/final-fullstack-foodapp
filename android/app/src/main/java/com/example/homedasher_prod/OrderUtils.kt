package com.example.homedasher_prod


fun combineOrdersAndReviews(
    orders: List<TransactionRecord>,
    reviews: List<MerchantOrderReview>
): List<CombinedOrderReview> {
    return orders.map { order ->
        val relatedReviews = reviews.find { it.order_id == order.transactionId }?.items ?: emptyList()
        CombinedOrderReview(
            order_id = order.transactionId,
            status = order.transactionStatus,
            total_price = order.paymentTotal,
            items = order.purchasedItems.map { item ->
                CombinedItemReview(
                    menu_item_name = item.linkedMenuItem?.productTitle,
                    quantity = item.itemCount,
                    reviews = relatedReviews.find { it.menu_item_id == item.linkedMenuItem?.optionId }?.reviews ?: emptyList()
                )
            }
        )
    }
}