// ============================================================
//  Site settings — edit these to make the shop yours.
// ============================================================
window.SITE_CONFIG = {
  shopName: "Pou's Market",
  tagline: "Pre-loved clothes, gadgets & home goods — checked, photographed, ready to go.",
  currency: "USD",          // e.g. "USD", "EUR", "GBP", "PKR"
  locale: "en-US",          // controls number formatting

  // How buyers reach you. Leave any field empty ("") to hide that button.
  contact: {
    email: "you@example.com",
    whatsapp: "",            // international format, digits only, e.g. "15551234567"
    instagram: ""            // handle without @
  },

  location: "Pickup or shipping available",

  // Categories shown in the filter bar (order matters). Items can use any of these ids.
  categories: [
    { id: "clothing", label: "Clothing" },
    { id: "shoes", label: "Shoes" },
    { id: "accessories", label: "Accessories" },
    { id: "electronics", label: "Electronics" },
    { id: "home", label: "Home & Living" },
    { id: "books", label: "Books & Media" },
    { id: "sports", label: "Sports & Outdoors" },
    { id: "other", label: "Other" }
  ]
};
