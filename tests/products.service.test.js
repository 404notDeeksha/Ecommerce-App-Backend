const Products = require("../models/Products.model");
const productService = require("../services/products.service");

describe("Products Service", () => {
  beforeEach(async () => {
    await Products.deleteMany({});
  });

  describe("buildProductQuery", () => {
    test("Returns empty query for no filters", () => {
      const query = productService.buildProductQuery({});

      expect(query).toEqual({});
    });

    test("Builds text search query", () => {
      const query = productService.buildProductQuery({ search: "phone" });

      expect(query).toEqual({ $text: { $search: "phone" } });
    });

    test("Builds category filter", () => {
      const query = productService.buildProductQuery({ category: "Electronics" });

      expect(query).toEqual({ category: "Electronics" });
    });

    test("Builds subCategory filter", () => {
      const query = productService.buildProductQuery({ subCategory: "Mobiles" });

      expect(query).toEqual({ subCategory: "Mobiles" });
    });

    test("Builds discount range query", () => {
      const query = productService.buildProductQuery({ discount: 50 });

      expect(query.discount).toEqual({ $gte: 0, $lte: 50 });
    });

    test("Builds price range with both min and max", () => {
      const query = productService.buildProductQuery({ minPrice: "100", maxPrice: "500" });

      expect(query.price.$gte).toBe(100);
      expect(query.price.$lte).toBe(500);
    });

    test("Builds price range with min only", () => {
      const query = productService.buildProductQuery({ minPrice: "50" });

      expect(query.price.$gte).toBe(50);
      expect(query.price.$lte).toBeUndefined();
    });

    test("Builds price range with max only", () => {
      const query = productService.buildProductQuery({ maxPrice: "200" });

      expect(query.price.$lte).toBe(200);
      expect(query.price.$gte).toBeUndefined();
    });

    test("Builds brand filter as $in array", () => {
      const query = productService.buildProductQuery({ brand: "Apple,Samsung" });

      expect(query.brand).toEqual({ $in: ["Apple", "Samsung"] });
    });

    test("Combines multiple filters with AND logic", () => {
      const query = productService.buildProductQuery({
        category: "Electronics",
        minPrice: "100",
        brand: "Apple",
      });

      expect(query.category).toBe("Electronics");
      expect(query.price.$gte).toBe(100);
      expect(query.brand).toEqual({ $in: ["Apple"] });
    });
  });

  describe("buildSortOption", () => {
    test("Returns default sort by rating descending", () => {
      const sort = productService.buildSortOption();

      expect(sort).toEqual({ rating: -1 });
    });

    test("Sorts by price ascending", () => {
      const sort = productService.buildSortOption("price", "asc");

      expect(sort).toEqual({ price: 1 });
    });

    test("Sorts by price descending", () => {
      const sort = productService.buildSortOption("price", "desc");

      expect(sort).toEqual({ price: -1 });
    });

    test("Sorts by name ascending", () => {
      const sort = productService.buildSortOption("name", "asc");

      expect(sort).toEqual({ productName: 1 });
    });

    test("Sorts by rating ascending", () => {
      const sort = productService.buildSortOption("rating", "asc");

      expect(sort).toEqual({ rating: 1 });
    });

    test("Returns empty object for unknown sortBy", () => {
      const sort = productService.buildSortOption("invalid");

      expect(sort).toEqual({});
    });
  });

  describe("getProductById", () => {
    test("Returns product by productId", async () => {
      await Products.create({
        productId: "prod-1",
        productName: "Test Product",
        productDescription: "A test product",
        price: 99,
        category: "Test",
      });

      const product = await productService.getProductById("prod-1");

      expect(product).not.toBeNull();
      expect(product.productName).toBe("Test Product");
    });

    test("Returns null for non-existent product", async () => {
      const product = await productService.getProductById("does-not-exist");

      expect(product).toBeNull();
    });
  });

  describe("createProduct", () => {
    test("Creates product with auto-generated productId", async () => {
      const product = await productService.createProduct(
        {
          productName: "New Product",
          productDescription: "Description",
          price: 50,
          category: "Electronics",
        },
        "user-123"
      );

      expect(product.productId).toBeDefined();
      expect(product.createdBy).toBe("user-123");
      expect(product.updatedBy).toBe("user-123");
    });

    test("Sets default values for stock, rating, discount", async () => {
      const product = await productService.createProduct(
        {
          productName: "Defaults Product",
          productDescription: "Desc",
          price: 10,
          category: "Misc",
        },
        "user-1"
      );

      expect(product.stock).toBe(0);
      expect(product.rating).toBe(0);
      expect(product.discount).toBe(0);
    });
  });

  describe("updateProduct", () => {
    test("Updates product and sets updatedBy", async () => {
      await Products.create({
        productId: "prod-update",
        productName: "Old Name",
        productDescription: "Desc",
        price: 100,
        category: "Test",
      });

      const updated = await productService.updateProduct(
        "prod-update",
        { productName: "New Name" },
        "user-456"
      );

      expect(updated.productName).toBe("New Name");
      expect(updated.updatedBy).toBe("user-456");
    });

    test("Returns null for non-existent product", async () => {
      const result = await productService.updateProduct(
        "non-existent",
        { productName: "Fail" },
        "user-1"
      );

      expect(result).toBeNull();
    });
  });

  describe("deleteProduct", () => {
    test("Deletes product by productId", async () => {
      await Products.create({
        productId: "prod-delete",
        productName: "Delete Me",
        productDescription: "Desc",
        price: 10,
        category: "Test",
      });

      const deleted = await productService.deleteProduct("prod-delete");

      expect(deleted).not.toBeNull();
      expect(deleted.productId).toBe("prod-delete");

      const remaining = await Products.findOne({ productId: "prod-delete" });
      expect(remaining).toBeNull();
    });

    test("Returns null for non-existent product", async () => {
      const result = await productService.deleteProduct("does-not-exist");

      expect(result).toBeNull();
    });
  });

  describe("getAllProducts", () => {
    beforeEach(async () => {
      const products = Array.from({ length: 25 }, (_, i) => ({
        productId: `prod-${i}`,
        productName: `Product ${i}`,
        productDescription: `Description ${i}`,
        price: (i + 1) * 10,
        category: i % 2 === 0 ? "Electronics" : "Clothing",
        rating: i % 5,
        items: [{
          itemId: `item-${i}`,
          colour: "black",
          price: (i + 1) * 10,
          stockAvailability: true,
        }],
      }));
      await Products.insertMany(products);
    });

    test("Returns paginated results with default values", async () => {
      const result = await productService.getAllProducts({});

      expect(result.data).toHaveLength(20);
      expect(result.pagination.page).toBe(1);
      expect(result.pagination.limit).toBe(20);
      expect(result.pagination.total).toBe(25);
      expect(result.pagination.totalPages).toBe(2);
    });

    test("Respects custom page and limit", async () => {
      const result = await productService.getAllProducts({ page: "2", limit: "10" });

      expect(result.data).toHaveLength(10);
      expect(result.pagination.page).toBe(2);
      expect(result.pagination.limit).toBe(10);
    });

    test("Caps limit at 100", async () => {
      const result = await productService.getAllProducts({ limit: "200" });

      expect(result.pagination.limit).toBe(100);
    });

    test("Clamps page to minimum 1", async () => {
      const result = await productService.getAllProducts({ page: "-1" });

      expect(result.pagination.page).toBe(1);
    });

    test("Filters by category", async () => {
      const result = await productService.getAllProducts({ category: "Electronics" });

      expect(result.pagination.total).toBe(13);
      result.data.forEach((p) => expect(p.category).toBe("Electronics"));
    });

    test("Sorts by default (rating desc)", async () => {
      const result = await productService.getAllProducts({ limit: "25" });

      for (let i = 0; i < result.data.length - 1; i++) {
        expect(result.data[i].rating).toBeGreaterThanOrEqual(result.data[i + 1].rating);
      }
    });
  });
});
