// import React, { useRef } from "react"
// import { useSelector } from "react-redux"
// import ProductCard from "./ProductCard"
// import { ChevronLeft, ChevronRight } from "lucide-react"

// const ProductList = () => {
//   const sliderRef = useRef(null)

//  const { men, women, kids, selectedCategory, allProducts } =
//   useSelector((state) => state.products)

// let products =
//   selectedCategory === "men"
//     ? men
//     : selectedCategory === "women"
//     ? women
//     : selectedCategory === "kids"
//     ? kids
//     : allProducts


// if (!men || !women || !kids) {
//   return <h2>Loading...</h2>
// }

//   const scrollLeft = () => {
//     sliderRef.current.scrollBy({ left: -300, behavior: "smooth" })
//   }

//   const scrollRight = () => {
//     sliderRef.current.scrollBy({ left: 300, behavior: "smooth" })
//   }

//   return (
//     <div className="relative mt-8">
//       {/* Left Button */}
//       <button
//         onClick={scrollLeft}
//         className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md p-2 rounded-full hover:bg-gray-100"
//       >
//         <ChevronLeft />
//       </button>

//       {/* Products */}
//       <div
//         ref={sliderRef}
//         className="flex gap-6 overflow-x-hidden scroll-smooth px-10"
//       >
//         {products.map((product) => (
//           <div key={product.id} className="min-w-[260px]">
//             <ProductCard product={product} />
//           </div>
//         ))}
//       </div>

//       {/* Right Button */}
//       <button
//         onClick={scrollRight}
//         className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md p-2 rounded-full hover:bg-gray-100"
//       >
//         <ChevronRight />
//       </button>
//     </div>
//   )
// }

// export default ProductList
