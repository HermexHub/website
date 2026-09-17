export type Locale = 'en' | 'ua'

export interface TranslationDictionary {
  common: {
    brandName: string
    tagline: string
    currency: string
    loading: string
    error: string
    retry: string
    backToCatalog: string
    allRightsReserved: string
  }
  nav: {
    catalog: string
    cart: string
    orders: string
    admin: string
    language: string
    searchPlaceholder: string
  }
  catalog: {
    title: string
    subtitle: string
    inStockOnly: string
    allCategories: string
    searchPlaceholder: string
    sortBy: string
    sortNewest: string
    sortPriceAsc: string
    sortPriceDesc: string
    sortName: string
    addToCart: string
    addedToCart: string
    outOfStock: string
    inStock: string
    lowStock: string
    itemsFound: string
    noProductsFound: string
    page: string
    of: string
    previous: string
    next: string
  }
  product: {
    sku: string
    category: string
    stockAvailable: string
    quantity: string
    backToCatalog: string
  }
  cart: {
    title: string
    empty: string
    emptyPrompt: string
    startShopping: string
    subtotal: string
    freeDeliveryProgress: string
    freeDeliveryAchieved: string
    checkout: string
    clear: string
    priceChangedAlert: string
    stockLimitedAlert: string
    outOfStockAlert: string
    applyAdjustments: string
    remove: string
    backToCart: string
  }
  checkout: {
    title: string
    subtitle: string
    addressLabel: string
    addressPlaceholder: string
    fullNameLabel: string
    fullNamePlaceholder: string
    emailLabel: string
    emailPlaceholder: string
    orderSummary: string
    itemsCount: string
    delivery: string
    free: string
    total: string
    placeOrder: string
    placingOrder: string
    idempotencyNotice: string
  }
  payment: {
    title: string
    subtitle: string
    orderId: string
    amountDue: string
    cardNumberLabel: string
    cardHolderLabel: string
    expiryLabel: string
    cvvLabel: string
    payButton: string
    processing: string
    testScenariosTitle: string
    testScenariosSubtitle: string
    scenarioSuccess: string
    scenarioInsufficientFunds: string
    scenarioCardExpired: string
    scenarioBankDeclined: string
    scenarioTimeout: string
    safeSimulationBadge: string
  }
  tracker: {
    title: string
    subtitle: string
    orderId: string
    connecting: string
    statusPending: string
    statusConfirmed: string
    statusCancelled: string
    stepCreated: string
    stepStockReserved: string
    stepPayment: string
    stepConfirmed: string
    sagaFailedNotice: string
    orderSummary: string
    liveConnected: string
    deliveryAddress: string
  }
}
