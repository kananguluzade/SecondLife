import React, { useEffect, useState, useContext } from "react";
import styles from "./Sharing.module.css";
import { Modal, Button } from "rsuite";
import { AuthContext } from "../../Auth/Services/authContext";

const Sharing = () => {
  const { user } = useContext(AuthContext);
  const [sharedProducts, setSharedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteProductId, setDeleteProductId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchSharedProducts = async () => {
      try {
        const response = await fetch(`${BASE_URL}/products`);
        const data = await response.json();

        const userSharedProducts = data.filter(
          (share) => share.owner_id === user.id
        );
        setSharedProducts(userSharedProducts);
      } catch (error) {
        console.error("Error fetching shared products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchSharedProducts();
    }
  }, [user, BASE_URL]);

  const handleEdit = (shareId) => {
    console.log(`Edit product with ID: ${shareId}`);
  };

  const handleDelete = (shareId) => {
    setDeleteProductId(shareId);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    try {
      // For future backend integration:
      // await fetch(`${BASE_URL}/shares/${deleteProductId}`, { method: 'DELETE' });

      setSharedProducts((prev) =>
        prev.filter((product) => product.id !== deleteProductId)
      );
      console.log("Deleted product ID:", deleteProductId);
    } catch (error) {
      console.error("Error deleting product:", error);
    } finally {
      setShowModal(false);
      setDeleteProductId(null);
    }
  };

  if (isLoading) {
    return <div>Yükleniyor...</div>;
  }

  if (sharedProducts.length === 0) {
    return (
      <div className={styles.noProducts}>Hələ paylaşılan məhsul yoxdur.</div>
    );
  }

  return (
    <div className={styles.share}>
      {sharedProducts.map((share) => (
        <div key={share.id} className={styles.share__card}>
          <div className={styles.share__img}>
            <img src={share.otherImages[0]} alt={share.description} />
          </div>
          <div className={styles.share__desc}>
            <div className={styles.share__category}>
              <h4>{share.category}</h4>
              <svg
                width="20"
                height="18"
                viewBox="0 0 20 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={styles.heart__icon}
              >
                <path
                  d="M19 5.88722C19 0.430447 12 -0.569537 10.0063 3.80562C8 -0.569501 1 0.430542 1 5.88722C1 11.3439 7.00635 15.1142 10.0063 16.9305C14.0001 14.0584 19 9.95018 19 5.88722Z"
                  stroke="#EB4A4A"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className={styles.share__info}>
              <p>{share.content}</p>
            </div>
            <div className={styles.share__buttons}>
              <button onClick={() => handleEdit(share.id)}>Düzenle</button>
              <button onClick={() => handleDelete(share.id)}>Sil</button>
            </div>
          </div>
        </div>
      ))}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header>
          <Modal.Title>Onayla</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Bu ürünü silmek istediğinize emin misiniz?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setShowModal(false)} appearance="subtle">
            İptal
          </Button>
          <Button onClick={confirmDelete} appearance="primary">
            Sil
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Sharing;
