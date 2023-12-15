import React, { useState } from "react";
import DesignOverlay from "../../components/designOverlay/DesignOverlay";

import "./create-your-own.css";

import tShirtImageFront from "../../assets/shirt-front-438x570.png";
import tShirtImageBack from "../../assets/shirt-back-438x570.png";
import tShirtImageRight from "../../assets/shirt-right-438.png";
import tShirtImageLeft from "../../assets/shirt-left-438.png";

const item = {
  approvedForMarketplace: false,
  category: "t-shirts",
  description: "T-shirt",
  img: tShirtImageFront,
  images: {
    front: tShirtImageFront,
    back: tShirtImageBack,
    right: tShirtImageRight,
    left: tShirtImageLeft,
  },
  name: "T-shirt",
  styles: {
    front: {
      top: "12%",
      left: "23%",
      width: "53%",
      height: "70%",
    },
    back: { top: "12%", left: "23%", width: "53%", height: "70%" },
    right: { top: "33%", left: "25%", width: "45%", height: "47%" },
    left: { top: "33%", left: "25%", width: "45%", height: "47%" },
  },
};

const CreateYourOwn = () => {
  const [uploadedImage, setUploadedImage] = useState();
  const [backgroundImage, setBackgroundImage] = useState(item.images.front);
  const [style, setStyle] = useState(item.styles.front);
  const [designDetails, setDesignDetails] = useState({
    location: "",
    notes: "",
  });
  const [images, setImages] = useState([]);
  const [side, setSide] = useState("front");
  const [state, setState] = useState({
    front: { designs: [], backgroundImg: item.images.front },
    back: { designs: [], backgroundImg: item.images.back },
    right: { designs: [], backgroundImg: item.images.right },
    left: { designs: [], backgroundImg: item.images.left },
  });

  const handleProductChange = () => {
    // Implement product change logic (e.g., switch to another product)
    console.log("Change Product");
  };

  const handleAddToCart = () => {
    // Implement add to cart logic
    console.log("Add to Cart");
    console.log(uploadedImage);
    console.log(designDetails);
    let item = {};
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDesignDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
  };

  const handleBack = () => {};

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    setImages((prevImages) => [...prevImages, ...selectedFiles]);

    setState((prevState) => ({
      ...prevState,
      [side]: {
        ...prevState[side],
        designs: [...prevState[side].designs, ...selectedFiles],
      },
    }));
  };

  const removeImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    setState((prevState) => {
      const updatedDesigns = [...prevState[side].designs];
      updatedDesigns.splice(index, 1);

      return {
        ...prevState,
        [side]: {
          ...prevState[side],
          designs: updatedDesigns,
        },
      };
    });
  };

  const imagePreview = (
    <div>
      {state[side].designs.map((image, index) => (
        <div key={index}>
          <img
            src={URL.createObjectURL(image)}
            alt={`preview-${index}`}
            style={{ width: "100px", height: "auto" }}
          />
          <button onClick={() => removeImage(index)}>Remove</button>
        </div>
      ))}
    </div>
  );

  return (
    <div className="create-your-own">
      <div className="create-your-own-card">
        <h2>Create Your Own</h2>
        <div className="images-preview" draggable="false">
          <DesignOverlay
            backgroundImage={backgroundImage}
            overlayImages={state[side].designs}
            style={style}
          />
        </div>
        <button
          onClick={() => {
            setSide("back");
            setBackgroundImage(item.images.back);
            setStyle(item.styles.back);
          }}
        >
          back
        </button>
        <button
          onClick={() => {
            setSide("front");
            setBackgroundImage(item.images.front);
            setStyle(item.styles.front);
          }}
        >
          front
        </button>
        <button
          onClick={() => {
            setSide("right");
            setBackgroundImage(item.images.right);
            setStyle(item.styles.right);
          }}
        >
          right
        </button>
        <button
          onClick={() => {
            setSide("left");
            setBackgroundImage(item.images.left);
            setStyle(item.styles.left);
          }}
        >
          left
        </button>
        <div className="step-form">
          <div>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
            />
            {imagePreview}
          </div>
          {/* <button>add text</button> */}
          {/* <button>choose from designs</button> */}
          <textarea
            name="notes"
            value={designDetails.notes}
            onChange={handleInputChange}
            placeholder="Add any notes"
          />
          <div className="buttons">
            <button onClick={handleBack} className="back-button">
              Back
            </button>
            <button onClick={handleAddToCart} className="add-to-cart-button">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateYourOwn;
