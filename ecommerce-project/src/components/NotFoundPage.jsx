import { Header } from "./Header";
import './NotFoundPage.css';

export function NotFoundPage({ cart }) {
  return (
    <>
      <Header cart={cart} />

      <div className="home-page">
        <div className="text-page">
          <p className="notfound-page-text">
            404 Not Found
          </p>
        </div>
      </div>
    </>
  )
}