const Cart = require("../models/Cart.model");
const cartService = require("../services/cart.service");

describe("Cart Service", () => {
  beforeEach(async () => {
    await Cart.deleteMany({});
  });

  describe("getOrCreateCart", () => {
    test("Creates new cart if none exists", async () => {
      const cart = await cartService.getOrCreateCart("user-new");

      expect(cart).not.toBeNull();
      expect(cart.userId).toBe("user-new");
      expect(cart.items).toEqual([]);
      expect(cart.totalPrice).toBe(0);
    });

    test("Returns existing cart if found", async () => {
      await Cart.create({
        userId: "user-existing",
        items: [{ productId: "p1", productName: "Test", price: 50, quantity: 2 }],
      });

      const cart = await cartService.getOrCreateCart("user-existing");

      expect(cart.userId).toBe("user-existing");
      expect(cart.items).toHaveLength(1);
    });
  });

  describe("addItemsToCart", () => {
    test("Creates new cart when user has none", async () => {
      const items = [
        { productId: "p1", productName: "Product 1", price: 100, quantity: 1 },
      ];

      const cart = await cartService.addItemsToCart("user-1", items);

      expect(cart.userId).toBe("user-1");
      expect(cart.items).toHaveLength(1);
      expect(cart.items[0].productId).toBe("p1");
    });

    test("Adds new items to existing cart", async () => {
      await Cart.create({
        userId: "user-2",
        items: [{ productId: "p1", productName: "Product 1", price: 100, quantity: 1 }],
      });

      const newItems = [
        { productId: "p2", productName: "Product 2", price: 50, quantity: 2 },
      ];

      const cart = await cartService.addItemsToCart("user-2", newItems);

      expect(cart.items).toHaveLength(2);
    });

    test("Updates quantity for existing product", async () => {
      await Cart.create({
        userId: "user-3",
        items: [{ productId: "p1", productName: "Product 1", price: 100, quantity: 1 }],
      });

      const items = [
        { productId: "p1", productName: "Product 1", price: 100, quantity: 5 },
      ];

      const cart = await cartService.addItemsToCart("user-3", items);

      expect(cart.items).toHaveLength(1);
      expect(cart.items[0].quantity).toBe(5);
    });
  });

  describe("updateCartItemQuantity", () => {
    beforeEach(async () => {
      await Cart.create({
        userId: "user-update",
        items: [
          { productId: "p1", productName: "Product 1", price: 100, quantity: 1 },
          { productId: "p2", productName: "Product 2", price: 50, quantity: 3 },
        ],
      });
    });

    test("Updates quantity for existing product", async () => {
      const result = await cartService.updateCartItemQuantity("user-update", "p1", 5);

      expect(result.error).toBeUndefined();
      const item = result.items.find((i) => i.productId === "p1");
      expect(item.quantity).toBe(5);
    });

    test("Returns error if cart does not exist", async () => {
      const result = await cartService.updateCartItemQuantity("non-existent", "p1", 2);

      expect(result.error).toBe("Cart not found for the user.");
    });

    test("Returns error if product not in cart", async () => {
      const result = await cartService.updateCartItemQuantity("user-update", "p999", 2);

      expect(result.error).toBe("Product not found in the cart.");
    });
  });

  describe("removeCartItem", () => {
    beforeEach(async () => {
      await Cart.create({
        userId: "user-remove",
        items: [
          { productId: "p1", productName: "Product 1", price: 100, quantity: 1 },
          { productId: "p2", productName: "Product 2", price: 50, quantity: 2 },
        ],
      });
    });

    test("Removes item from cart", async () => {
      const result = await cartService.removeCartItem("user-remove", "p1");

      expect(result.error).toBeUndefined();
      expect(result.items).toHaveLength(1);
      expect(result.items[0].productId).toBe("p2");
    });

    test("Returns error if cart does not exist", async () => {
      const result = await cartService.removeCartItem("non-existent", "p1");

      expect(result.error).toBe("Cart not found");
    });
  });

  describe("calculateCartQuantity", () => {
    beforeEach(async () => {
      await Cart.create({
        userId: "user-qty",
        items: [
          { productId: "p1", productName: "Product 1", price: 100, quantity: 2 },
          { productId: "p2", productName: "Product 2", price: 50, quantity: 3 },
          { productId: "p3", productName: "Product 3", price: 75, quantity: 1 },
        ],
      });
    });

    test("Returns total quantity across all items", async () => {
      const total = await cartService.calculateCartQuantity("user-qty");

      expect(total).toBe(6);
    });

    test("Returns 0 for user with no cart", async () => {
      const total = await cartService.calculateCartQuantity("no-cart-user");

      expect(total).toBe(0);
    });

    test("Returns 0 for empty cart", async () => {
      await Cart.create({
        userId: "user-empty",
        items: [],
      });

      const total = await cartService.calculateCartQuantity("user-empty");

      expect(total).toBe(0);
    });
  });

  describe("Cart pre-save hook", () => {
    test("Auto-calculates totalPrice on save", async () => {
      const cart = new Cart({
        userId: "user-total",
        items: [
          { productId: "p1", productName: "Product 1", price: 100, quantity: 2 },
          { productId: "p2", productName: "Product 2", price: 50, quantity: 3 },
        ],
      });

      await cart.save();

      expect(cart.totalPrice).toBe(350);
    });

    test("Recalculates totalPrice when items change", async () => {
      const cart = new Cart({
        userId: "user-recalc",
        items: [
          { productId: "p1", productName: "Product 1", price: 100, quantity: 1 },
        ],
      });

      await cart.save();
      expect(cart.totalPrice).toBe(100);

      cart.items.push({ productId: "p2", productName: "Product 2", price: 50, quantity: 2 });
      await cart.save();

      expect(cart.totalPrice).toBe(200);
    });
  });
});
