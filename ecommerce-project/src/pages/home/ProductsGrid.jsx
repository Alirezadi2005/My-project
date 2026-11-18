import { Product } from './Product';

export function ProductsGrid({ products, loadCart }) {
  // controlled input value and onChange property when change selector it updates state and that updates page.
  // we should put react hooks at the top level of each component. 
  // when loop through an array in react we need to give it key prop.

  return (
    <div className="products-grid">
      {products.map((product) => {
        return (
          <Product key={product.id} product={product} loadCart={loadCart} /> 
        )
      })}
    </div>
  )
}