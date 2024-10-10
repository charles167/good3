const express = require("express");
const route = express();
const ProductModel = require("../model/ProductModel");
const Review = require("../model/Review");
const DeliveryPriceModel = require("../model/DeliveryPriceModel");
const Order = require("../model/Order");
const Notes = require("../model/Notes");
const upload = require("../upload"); // Correctly import upload config
//applying multer
//creating product
route.post("/products", upload.single("image"), async (req, res) => {
  try {
    // Generate new product ID
    let product = await ProductModel.find({});
    let Id = product.length > 0 ? product[product.length - 1].id + 1 : 1;

    const { Pname, vendor, availability, price, description, category } =
      req.body;

    // Get the URL of the uploaded image from Cloudinary response
    const image = req.file.path || ""; // Ensure the file path is extracted properly

    // Create a new product
    const createProduct = await ProductModel.create({
      id: Id,
      Pname,
      vendor,
      availability,
      price,
      description,
      category,
      image, // Store the image URL from Cloudinary
    });

    if (createProduct) {
      // Emit event when a new product is added (optional, depending on your use case)
      global.io.emit("productAdded", createProduct);

      // Send success response
      res.status(201).send({
        success: true,
        msg: "Product created successfully",
        createProduct,
      });
    } else {
      res.status(500).send({
        success: false,
        msg: "Product cannot be created",
      });
    }
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).send({
      success: false,
      msg: "Internal server error",
      error,
    });
  }
});
//getting all products
route.get("/getalProducts", async (req, res) => {
  const response = await ProductModel.find();
  if (response) {
    res.status(200).send({
      success: true,
      response,
    });
  }
});
//deleting products
route.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const response = await ProductModel.findByIdAndDelete(id);

    if (response) {
      // Emit the product ID to the client using socket.io
      global.io.emit("productDelete", id);

      return res.status(200).json({
        success: true,
        message: "Product deleted successfully",
        productId: id, // Returning the deleted product ID
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
  } catch (error) {
    console.error("Error deleting product:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});
//deleting all products
route.delete("/products/delete", async (req, res) => {
  try {
    const deleteProduct = await ProductModel.deleteMany();
    res.send({ success: true, message: "products deleted successfully" });
  } catch (error) {
    console.log(error.message);
  }
});
//getting single product
route.get("/products/:id", async function (req, res) {
  const { id } = req.params;
  const response = await ProductModel.findById(id);
  if (response) {
    res.status(200).send({ success: true, response: response });
  } else {
    res.status(404).send({ success: false, response: "product not found" });
  }
});
//editing
route.put("/products/:id", upload.single("image"), async function (req, res) {
  const { id } = req.params;
  const { Pname, vendor, availability, price, description, category } =
    req.body;

  // Conditionally set the image
  const image = req.file ? req.file.filename : undefined; // undefined if no new image

  try {
    // Prepare the update fields
    const updateFields = {
      Pname,
      vendor,
      availability,
      price,
      description,
      category,
    };

    // Only update the image if a new file is uploaded
    if (image) {
      updateFields.image = image; // Only set image if a new one is provided
    }

    const response = await ProductModel.findByIdAndUpdate(id, updateFields, {
      new: true,
      runValidators: true, // Ensures validators are run on the update
    });

    if (response) {
      // Emit the updated product details or id
      global.io.emit("ProductUpdated", response); // Emitting the whole response could be useful
      return res.status(200).json({
        success: true,
        response: response,
        msg: "Product updated successfully",
      });
    } else {
      return res.status(404).json({
        success: false,
        msg: "Product not found",
      });
    }
  } catch (error) {
    console.error("Error updating product:", error); // Log the error for debugging
    return res.status(500).json({
      success: false,
      msg: "Server error",
      error: error.message,
    });
  }
});

//route for Delivery Price
route.post("/price", async (req, res) => {
  const { vendor, DeliveryFee, ServiceFee } = req.body;
  try {
    const Create = await DeliveryPriceModel.create({
      vendor,
      DeliveryFee,
      ServiceFee,
    });
    if (Create) {
      res.send({
        success: true,
        message: "added successfully",
      });
    } else {
      res.send({ success: false, message: "failed" });
    }
  } catch (error) {
    if (error.status === 11000) {
      res.send({ success: false, message: "Vendor already exists" });
    } else {
      res.status(500).send({
        success: false,
        message: "An error occurred",
      });
    }
    console.log(error.message);
  }
});
// route for deleting fee
route.delete("/deleteFee/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deleteFee = await DeliveryPriceModel.findByIdAndDelete(id);
    if (deleteFee) {
      res.send({ success: true, message: "Fee deleted successfully" });
    } else {
      res.send({ success: false, message: "failed" });
    }
  } catch (error) {
    console.log(error.message);
  }
});
// router for getting all prices
route.get("/AllPrice", async (req, res) => {
  try {
    const allPrice = await DeliveryPriceModel.find();
    if (allPrice) {
      res.send({ success: true, message: allPrice });
    } else {
      res.send({ success: false, message: "failed" });
    }
  } catch (error) {
    console.log(error.message);
  }
});
//add customer review
route.post("/review", async (req, res) => {
  const { name, Date, show, Content, Email } = req.body;
  const response = await Review.create({
    name,
    Email,
    Date,
    show,
    Content,
  });
  if (response) {
    res.send({
      success: false,
      message: "review added successfully",
      response: response,
    });
  } else {
    res.send({ success: false, message: "review not added" });
  }
});
//delete customer review
route.delete("/reviews/:id", async (req, res) => {
  const { id } = req.params;
  const response = await Review.findByIdAndDelete(id);
  if (response) {
    res.send({ success: true, message: "review deleted successfully" });
  } else {
    res.send({ success: false, message: "review not found" });
  }
});
//Editing customer review
route.put("/reviews/:id", async (req, res) => {
  const { id } = req.params;
  const { show } = req.body;
  const response = await Review.findByIdAndUpdate(
    id,
    { show: show },
    { new: true }
  ); // Return the updated order);
  if (response) {
    res.send({ success: true, message: "review edited successfully" });
  } else {
    res.send({ success: false, message: "review not edited" });
  }
});
//getting all the review
route.get("/allReivew", async (req, res) => {
  const response = await Review.find();
  if (response) {
    res.send({ success: true, message: response });
  } else {
    res.send({ success: false, message: "review not found" });
  }
});
//getting single review
route.get("/review/:id", async (req, res) => {
  const { id } = req.params;
  const review = await Review.findById(id);
  if (review) {
    res.send({ success: true, message: review });
  } else {
    res.send({ success: false, message: "No such review" });
  }
});

//end point for adding notes
route.post("/note", async (req, res) => {
  const { note, date, status } = req.body;
  const notes = await Notes.create({
    note,
    date,
    status,
  });
  if (notes) {
    res.send({ success: true, message: "note created successfully" });
  } else {
    res.send({ success: false, message: "note cannot be created" });
  }
});
//end point for getting all notes
route.get("/note", async (req, res) => {
  const data = await Notes.find();
  if (data) {
    res.send({ success: true, message: "note retrived successfully", data });
  } else {
    res.send({ success: false, message: "note cannot be found" });
  }
});
//end point for deleting note
route.delete("/note/:id", async (req, res) => {
  const { id } = req.params;
  const note = await Notes.findByIdAndDelete(id);
  if (note) {
    res.send({ success: true, message: "note deleted successfully" });
  } else {
    res.send({ success: false, message: "note cannot be deleted" });
  }
});

//endpoint for posting order
route.post("/PostOrder", upload.single("image"), async (req, res) => {
  try {
    // Destructure the body to extract required fields
    const {
      OrderStatus,
      name,
      phoneNumber,
      gender,
      totalPrice,
      Address,
      PackPrice,
      orderId,
      cartItems, // Assuming this is passed as a JSON string
      Vendor,
    } = req.body;

    // Handle the uploaded image
    const image = req.file.path || ""; // Ensure the file path is extracted properly

    // Parse cartItems if it's sent as a JSON string
    let parsedCartItems = [];
    if (cartItems) {
      try {
        parsedCartItems = JSON.parse(cartItems);
      } catch (error) {
        return res
          .status(400)
          .send({ success: false, message: "Invalid cartItems format" });
      }
    }

    // Create the order in the database
    const order = await Order.create({
      OrderStatus,
      name,
      phoneNumber,
      gender,
      totalPrice,
      Address,
      WhatsApp,
      PackPrice,
      orderId,
      image,
      cartItems: parsedCartItems, // Store parsed cart items
      Vendor,
    });

    if (order) {
      global.io.emit("OrderAdded", order);
      // Send a success response if order is created
      return res.status(201).send({
        success: true,
        message: "Order created successfully",
        response: order,
      });
    } else {
      return res
        .status(500)
        .send({ success: false, message: "Order cannot be added" });
    }
  } catch (error) {
    // Handle any errors during the order creation process
    return res.status(500).send({
      success: false,
      message: "Error occurred while creating order",
      error: error.message,
    });
  }
});

//endpoint for getting all order
route.get("/orders", async (req, res) => {
  const order = await Order.find();
  if (order) {
    res.send({ success: true, message: order });
  } else {
    res.send({ success: false, message: "Order cannot be Fetched" });
  }
});
//endpoint for deleting order
route.delete("/order/:id", async (req, res) => {
  const { id } = req.params;
  const order = await Order.findByIdAndDelete(id);
  if (order) {
    res.send({
      success: true,
      message: "Order deleted successfully",
    });
  } else {
    res.send({ success: false, message: "Order cannot be Deleted" });
  }
});
//endpoint for deleting all orders
route.delete("/delete_all", async (req, res) => {
  try {
    const deleteOrder = await Order.deleteMany();
    res.send({ success: true, message: "Orders deleted successfully" });
  } catch (error) {
    console.log(error.message);
  }
});
//endpoint for getting single order
route.get("/order/:id", async (req, res) => {
  const { id } = req.params;
  const order = await Order.findById(id);
  if (order) {
    res.send({
      success: true,
      message: "Order gotten successfully",
      response: order,
    });
  } else {
    res.send({ success: false, message: "Order cannot be gotten" });
  }
});
route.put("/order/:id", async (req, res) => {
  const { id } = req.params;
  const { orderStatus } = req.body;

  // Validate input
  if (orderStatus === undefined) {
    return res.status(400).send({
      success: false,
      message: "Order status is required",
    });
  }

  try {
    // Find and update the order
    const order = await Order.findByIdAndUpdate(
      id,
      { orderStatus: orderStatus },
      { new: true } // Return the updated order
    );

    // Check if order exists
    if (order) {
      return res.send({
        success: true,
        message: "Order status updated successfully",
        order,
      });
    } else {
      return res.status(404).send({
        success: false,
        message: "Order not found",
      });
    }
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error updating order status",
      error: error.message,
    });
  }
});

module.exports = route;
