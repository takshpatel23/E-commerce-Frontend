import React from "react" 
import slide1 from "./slide1.jpg"
import slide2 from "./slide2.jpg"
import slide3 from "./slide3.jpg" 
import blacktshirt from "./blacktshirt.jpg"
import woman1 from "./woman1.jpg"
import jacket from "./jacket1.jpg"
import Shirt1 from "./Shirt1.jpg"
import Shirt2 from "./Shirt2.jpg"
import jeans1 from "./jeans1.jpg"
import Shirt3 from "./Shirt3.jpg"
import Hoodie from "./Hoodie.jpg"
import Track from "./TrackPant2.jpg"
import Kurta from "./kurta1.jpg"
import Shorts from "./Shorts.jpg"
import Blazer from "./Blazer.jpg"
import Kurti from "./Kurti.jpg"
import  Saree from "./saree1.jpg"
import WomenTop from "./WomenTop.jpg"
import WomenJeans from "./WomenJeans.jpg"
import WomenDress from "./dress.jpg"
import WomenLeggings from "./WomenLeggings.jpg"
import WomenSkirt from "./WomenSkirt.jpg"
import WomenJacket from "./WomenJacket.jpg"
import WomenNightwear from "./WomenNightwear.jpg"
import WomenGown from "./gown.jpg"
import KidsTShirt from "./KidsTShirt.jpg"
import KidsJeans from "./KidsJeans.jpg"
import KidsShorts from "./KidsShorts.jpg"
import KidsFrock from "./KidsFrock.jpg"
import KidsHoodie from "./KidsHoodie.jpg"
import KidsJacket from "./KidsJacket.jpg"
import KidsSuit from "./KidsSuit.jpg"
import EthnicWear from "./EthnicWear.jpg"
import TrackPants from "./TrackPants.jpg"
import PartyDress from "./PartyDress.jpg"
import video3 from "./video3.mp4"
export const data={
    slide1: slide1,
    slide2: slide2,
    slide3: slide3,
    blacktshirt: blacktshirt,
    woman1: woman1,
    jacket: jacket,
    Shirt1: Shirt1,
    Shirt2: Shirt2,
    jeans1: jeans1,
    Shirt3: Shirt3,
    Hoodie: Hoodie,
    Track: Track,
    Kurta: Kurta,
    Shorts: Shorts,
    Blazer: Blazer,
    Kurti: Kurti,
    Saree: Saree,
    WomenTop: WomenTop,
    WomenJeans: WomenJeans,
    WomenDress: WomenDress,
    WomenLeggings: WomenLeggings,
    WomenSkirt: WomenSkirt,
    WomenJacket: WomenJacket,
    WomenNightwear: WomenNightwear,
    WomenGown: WomenGown,
    KidsTShirt: KidsTShirt,
    KidsJeans: KidsJeans,
    KidsShorts: KidsShorts,
    KidsFrock: KidsFrock,
    KidsHoodie: KidsHoodie,
    KidsJacket: KidsJacket,
    KidsSuit: KidsSuit,
    EthnicWear: EthnicWear,
    TrackPants: TrackPants,
    PartyDress: PartyDress,
    video3: video3,
};
export const products = [
  {
    id: 1,
    name: "Men Black T-Shirt",
    price: 799,
    category: "Men",
    image: blacktshirt,
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: 2,
    name: "Women Summer Dress",
    price: 1499,
    category: "Women",
    image: woman1,
    sizes: ["S", "M", "L"],
  },
  {
    id: 3,
    name: "Men Denim Jacket",
    price: 2499,
    category: "Men",
    image:jacket,
    sizes: ["M", "L", "XL"],
  },
]

export const slides = [
  
  {
    id: 1,
    video: video3,
    title: "Summer Sale",
    subtitle: "Up to 50% Off on Selected Items",
  },
]
export const menProducts = [
  {
    id: 1,
    name: "Men Casual Shirt",
    price: 1299,
    category: "Men",
    type: "Shirt",
    img: Shirt1,
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: 2,
    name: "Men Formal Shirt",
    price: 1599,
    category: "Men",
    type: "Shirt",
    img: Shirt2,
    sizes: ["M", "L", "XL"]
  },
  {
    id: 3,
    name: "Men Denim Jeans",
    price: 1999,
    category: "Men",
    type: "Jeans",
    img: jeans1,
    sizes: ["30", "32", "34", "36"]
  },
  {
    id: 4,
    name: "Men T-Shirt",
    price: 799,
    category: "Men",
    type: "T-Shirt",
    img: Shirt3,
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: 5,
    name: "Men Hoodie",
    price: 1799,
    category: "Men",
    type: "Hoodie",
    img: Hoodie,
    sizes: ["M", "L", "XL"]
  },
  {
    id: 6,
    name: "Men Track Pants",
    price: 999,
    category: "Men",
    type: "Pants",
    img: Track,
    sizes: ["M", "L", "XL"]
  },
  {
    id: 7,
    name: "Men Jacket",
    price: 3999,
    category: "Men",
    type: "Jacket",
    img: jacket,
    sizes: ["L", "XL"]
  },
  {
    id: 8,
    name: "Men Kurta",
    price: 1499,
    category: "Men",
    type: "Ethnic",
    img: Kurta,
    sizes: ["M", "L", "XL"]
  },
  {
    id: 9,
    name: "Men Shorts",
    price: 699,
    category: "Men",
    type: "Shorts",
    img: Shorts,
    sizes: ["M", "L"]
  },
  {
    id: 10,
    name: "Men Blazer",
    price: 3499,
    category: "Men",
    type: "Blazer",
    img: Blazer,
    sizes: ["M", "L", "XL"]
  }
];
export const womenProducts = [
  {
    id: 11,
    name: "Women Kurti",
    price: 1399,
    category: "Women",
    type: "Kurti",
    img: Kurti,
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: 12,
    name: "Women Saree",
    price: 2999,
    category: "Women",
    type: "Saree",
    img: Saree,
    sizes: ["Free Size"]
  },
  {
    id: 13,
    name: "Women Top",
    price: 899,
    category: "Women",
    type: "Top",
    img: WomenTop,
    sizes: ["S", "M", "L"]
  },
  {
    id: 14,
    name: "Women Jeans",
    price: 1899,
    category: "Women",
    type: "Jeans",
    img: WomenJeans,
    sizes: ["28", "30", "32", "34"]
  },
  {
    id: 15,
    name: "Women Dress",
    price: 2199,
    category: "Women",
    type: "Dress",
    img: WomenDress,
    sizes: ["S", "M", "L"]
  },
  {
    id: 16,
    name: "Women Leggings",
    price: 699,
    category: "Women",
    type: "Leggings",
    img: WomenLeggings,
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: 17,
    name: "Women Skirt",
    price: 1299,
    category: "Women",
    type: "Skirt",
    img: WomenSkirt,
    sizes: ["S", "M", "L"]
  },
  {
    id: 18,
    name: "Women Jacket",
    price: 2499,
    category: "Women",
    type: "Jacket",
    img: WomenJacket,
    sizes: ["M", "L", "XL"]
  },
  {
    id: 19,
    name: "Women Nightwear",
    price: 999,
    category: "Women",
    type: "Nightwear",
    img: WomenNightwear,
    sizes: ["S", "M", "L"]
  },
  {
    id: 20,
    name: "Women Gown",
    price: 3599,
    category: "Women",
    type: "Ethnic",
    img: WomenGown,
    sizes: ["M", "L", "XL"]
  }
];
export const kidsProducts = [
  {
    id: 21,
    name: "Kids T-Shirt",
    price: 499,
    category: "Kids",
    type: "T-Shirt",
    img: KidsTShirt,
    sizes: ["2-3Y", "4-5Y", "6-7Y"]
  },
  {
    id: 22,
    name: "Kids Jeans",
    price: 899,
    category: "Kids",
    type: "Jeans",
    img: KidsJeans,
    sizes: ["3-4Y", "5-6Y", "7-8Y"]
  },
  {
    id: 23,
    name: "Kids Shorts",
    price: 399,
    category: "Kids",
    type: "Shorts",
    img: KidsShorts,
    sizes: ["2-3Y", "4-5Y"]
  },
  {
    id: 24,
    name: "KidsFrock",
    price: 999,
    category: "Kids",
    type: "Frock",
    img: KidsFrock,
    sizes: ["2-3Y", "4-5Y", "6-7Y"]
  },
  {
    id: 25,
    name: "Kids Hoodie",
    price: 1199,
    category: "Kids",
    type: "Hoodie",
    img: KidsHoodie,
    sizes: ["4-5Y", "6-7Y"]
  },
  {
    id: 26,
    name: "Kids Jacket",
    price: 1499,
    category: "Kids",
    type: "Jacket",
    img: KidsJacket,
    sizes: ["5-6Y", "7-8Y"]
  },
  {
    id: 27,
    name: "Kids Night Suit",
    price: 799,
    category: "Kids",
    type: "Nightwear",
    img: KidsSuit,
    sizes: ["3-4Y", "5-6Y"]
  },
  {
    id: 28,
    name: "Kids Ethnic Wear",
    price: 1699,
    category: "Kids",
    type: "Ethnic",
    img: EthnicWear,
    sizes: ["4-5Y", "6-7Y"]
  },
  {
    id: 29,
    name: "Kids Track Pants",
    price: 699,
    category: "Kids",
    type: "Pants",
    img: TrackPants,
    sizes: ["4-5Y", "6-7Y"]
  },
  {
    id: 30,
    name: "Kids Party Dress",
    price: 1999,
    category: "Kids",
    type: "Dress",
    img: PartyDress,
    sizes: ["3-4Y", "5-6Y", "7-8Y"]
  }
];
