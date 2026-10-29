import {
  discountPercent,
  isOnSale,
  parseFilters,
  parseSort,
  toggleValue,
  writeListParam,
} from "@/modules/products/utils/products.utils";
import { getErrorMessage, getFieldErrors } from "@/shared/utils/error.utils";
import { formatPrice, shortId } from "@/shared/utils/format.utils";

describe("product utils", () => {
  it("reads only known, unique filters from the URL", () => {
    const params = new URLSearchParams("category=men,MEN,aliens,kids&brand=h%26m,unknown");
    expect(parseFilters(params)).toEqual({ category: ["men", "kids"], brand: ["h&m"] });
  });

  it("falls back to the default sort for unknown values", () => {
    expect(parseSort(new URLSearchParams("sortBy=title-ztoa"))).toBe("title-ztoa");
    expect(parseSort(new URLSearchParams("sortBy=random"))).toBe("price-lowtohigh");
  });

  it("toggles filter values and removes empty params", () => {
    expect(toggleValue(["men"], "kids")).toEqual(["men", "kids"]);
    expect(toggleValue(["men", "kids"], "men")).toEqual(["kids"]);
    expect(
      writeListParam(
        new URLSearchParams("category=men&sortBy=title-atoz"),
        "category",
        [],
      ).toString(),
    ).toBe("sortBy=title-atoz");
  });

  it("computes discounts from the final price", () => {
    expect(isOnSale({ price: 100, finalPrice: 75 })).toBe(true);
    expect(discountPercent({ price: 100, finalPrice: 75 })).toBe(25);
    expect(discountPercent({ price: 100, finalPrice: 100 })).toBe(0);
  });
});

describe("shared utils", () => {
  it("formats prices and short ids", () => {
    expect(formatPrice(1234.5)).toBe("$1,234.50");
    expect(shortId("6ae35bdfc3b449041155bb17")).toBe("1155BB17");
  });

  it("reads API error messages and field errors", () => {
    const error = {
      status: 400,
      data: { error: { message: "Check fields", details: { email: ["Taken"] } } },
    };
    expect(getErrorMessage(error)).toBe("Check fields");
    expect(getFieldErrors(error)).toEqual({ email: ["Taken"] });
    expect(getErrorMessage({ status: "FETCH_ERROR" })).toMatch(/Cannot reach the server/);
    expect(getErrorMessage(new Error("x"), "Fallback")).toBe("Fallback");
  });
});
