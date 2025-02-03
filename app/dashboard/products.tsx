import { getProducts } from "~/models/product";
import type { Route } from "./+types/products";

export async function loader() {
  let result = await getProducts();
  let products = result.map((item) => ({
    ...item,
    _id: item._id.toString(),
  }));

  return products;
}

export default function Products({ loaderData }: Route.ComponentProps) {
  let products = loaderData;
  console.log({ products });
  return (
    <div>
      <h1>Products</h1>
      <ul>
        {products.map((item) => (
          <li key={item._id}>
            <article>
              <img src={item.image} alt="" />
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
}
