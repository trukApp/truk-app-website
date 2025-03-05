// import ProductMasterPage from './productmaster'
// // import apiconfig from "@/Config/Config";
// import { Product } from "./productmaster";
 

// async function ProductMasterServer() {
//   const res = await fetch(`https://dev-api.trukapp.com/truk/masterProducts/all-products`, {
//     cache: "no-store",
//   });

//   console.log('res :', res)
//   if (!res.ok) {
//     console.error("Failed to fetch products");
//     return <p>Error fetching products.</p>;
//   }

//   const productsFromServer: Product[] = await res.json();

//   // ✅ Pass productsFromServer as props
//   return <ProductMasterPage productsFromServer={productsFromServer} />;
// }

// export default ProductMasterServer;
