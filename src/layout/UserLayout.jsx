import { Outlet } from 'react-router-dom';
import UserNavbar from '../components/user/UserNavbar';
import UserFooter from '../components/user/UserFooter';
import ScrollToTop from '../content/ScrollToTop';
import { useState, useEffect } from 'react';

export default function UserLayout() {
  const [products, setProducts] = useState([]);
  const [filterProducts, setFilterProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch("http://localhost:8080/products/all");
      const data = await res.json();
      setProducts(data.data || []);
      setFilterProducts(data.data || []);
    };
    fetchProducts();
  }, []);

  const sortProductsByPrice = (flag) => {
    let sorted = [...filterProducts];
    sorted.sort((a, b) => flag === "asc" ? a.price - b.price : b.price - a.price);
    setFilterProducts(sorted);
  };

  const searchProductsByTitle = (title) => {
    if (!title) {
      setFilterProducts(products);
      return;
    }
    setFilterProducts(
      products.filter((p) =>
        p.name.toLowerCase().includes(title.toLowerCase())
      )
    );
  };

  return (
    <>
      <UserNavbar onSearchProductsByTitle={searchProductsByTitle} />
      <ScrollToTop />
      <div className='mt-15'>
        <Outlet context={{ filterProducts, sortProductsByPrice }} /> 
      </div>
      <UserFooter />
    </>
  );
}
