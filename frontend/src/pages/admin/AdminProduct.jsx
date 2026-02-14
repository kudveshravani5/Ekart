import { Input } from "@/components/ui/input";
import { Edit, Search, Trash2 } from "lucide-react";
import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { setProducts } from "@/redux/productSlice";
import ImageUpload from "@/components/ui/ImageUpload";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const AdminProduct = () => {
  const { products } = useSelector((store) => store.product);
  const [editProduct, setEditProduct] = useState(null);
  const [open, setOpen] = useState(false);
  const accessToken = localStorage.getItem("accessToken");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("");

  const dispatch = useDispatch();

  // Helper function to get price - handles both field names
  const getPrice = (product) => {
    return Number(product.productPrice ?? product.Productprice ?? 0);
  };

  // Filter products
  let filteredProducts = products.filter((product) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      product.productName?.toLowerCase().includes(searchLower) ||
      product.brand?.toLowerCase().includes(searchLower) ||
      product.category?.toLowerCase().includes(searchLower)
    );
  });

  // Sort products
  if (sortOrder === "lowToHigh") {
    filteredProducts = [...filteredProducts].sort(
      (a, b) => getPrice(a) - getPrice(b)
    );
  }
  if (sortOrder === "highToLow") {
    filteredProducts = [...filteredProducts].sort(
      (a, b) => getPrice(b) - getPrice(a)
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Save product updates
  const handleSave = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("productName", editProduct.productName);
    formData.append("productPrice", editProduct.productPrice || editProduct.Productprice);
    formData.append("productDesc", editProduct.productDesc);
    formData.append("category", editProduct.category);
    formData.append("brand", editProduct.brand);

    // Add existing images public_ids
    const existingImageIds = editProduct.productImg
      .filter((img) => !(img instanceof File))
      .map((img) => img.public_id);

    if (existingImageIds.length > 0) {
      formData.append("existingImages", JSON.stringify(existingImageIds));
    }

    // Add new image files
    editProduct.productImg
      .filter((img) => img instanceof File)
      .forEach((file) => {
        formData.append("images", file);
      });

    try {
      const res = await axios.put(
        `http://localhost:5000/api/v1/product/update/${editProduct._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (res.data.success) {
        toast.success("Product updated successfully");

        const updatedProducts = products.map((p) =>
          p._id === editProduct._id ? res.data.product : p
        );

        dispatch(setProducts(updatedProducts));
        setOpen(false);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Update failed");
    }
  };

  // Delete product
  const deleteProductHandler = async (productId) => {
    try {
      const res = await axios.delete(
        `http://localhost:5000/api/v1/product/delete/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (res.data.success) {
        toast.success("Product deleted successfully");
        const remainingProducts = products.filter((p) => p._id !== productId);
        dispatch(setProducts(remainingProducts));
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="pl-[350px] py-24 pr-20 flex flex-col gap-6 min-h-screen bg-gray-100">
      {/* Top Bar */}
      <div className="flex justify-between items-center">
        {/* Search */}
        <div className="relative bg-white rounded-lg shadow-sm">
          <Input
            type="text"
            placeholder="Search Product..."
            className="w-[400px] pr-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
        </div>

        {/* Sort */}
        <Select onValueChange={(value) => setSortOrder(value)}>
          <SelectTrigger className="w-[200px] bg-white shadow-sm">
            <SelectValue placeholder="Sort by Price" />
          </SelectTrigger>

          <SelectContent className="bg-white z-[9999] shadow-lg border">
            <SelectGroup>
              <SelectItem value="lowToHigh">Price: Low to High</SelectItem>
              <SelectItem value="highToLow">Price: High to Low</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Product List */}
      {filteredProducts.length > 0 ? (
        filteredProducts.map((product) => {
          return (
            <Card key={product._id} className="px-4 py-3 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex gap-3 items-center">
                  <img
                    src={product.productImg?.[0]?.url || "/placeholder.png"}
                    alt={product.productName}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <h1 className="font-bold w-96 text-gray-700">
                    {product.productName}
                  </h1>
                </div>
                <h1 className="font-semibold text-gray-800">
                  ₹{getPrice(product)}
                </h1>
                <div className="flex gap-3">
                  {/* Edit Dialog */}
                  <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                      <Edit
                        onClick={() => {
                          setEditProduct({
                            ...product,
                            productPrice: getPrice(product),
                          });
                          setOpen(true);
                        }}
                        className="text-green-500 cursor-pointer hover:text-green-600"
                      />
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto bg-white">
                      <form onSubmit={handleSave}>
                        <DialogHeader>
                          <DialogTitle className="text-xl font-semibold text-gray-900">
                            Edit Product
                          </DialogTitle>
                          <DialogDescription className="text-gray-600">
                            Make changes to your product here. Click save when you&apos;re done.
                          </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 py-4">
                          {/* Product Name */}
                          <div className="space-y-2">
                            <Label htmlFor="productName" className="text-sm font-medium text-gray-900">
                              Product Name
                            </Label>
                            <Input
                              id="productName"
                              type="text"
                              name="productName"
                              value={editProduct?.productName || ""}
                              onChange={handleChange}
                              placeholder="Enter product name"
                              className="w-full bg-white text-gray-900 border-gray-300"
                              required
                            />
                          </div>

                          {/* Price */}
                          <div className="space-y-2">
                            <Label htmlFor="productPrice" className="text-sm font-medium text-gray-900">
                              Price
                            </Label>
                            <Input
                              id="productPrice"
                              type="number"
                              name="productPrice"
                              value={editProduct?.productPrice || ""}
                              onChange={handleChange}
                              placeholder="Enter price"
                              className="w-full bg-white text-gray-900 border-gray-300"
                              required
                            />
                          </div>

                          {/* Brand and Category - Side by Side */}
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="brand" className="text-sm font-medium text-gray-900">
                                Brand
                              </Label>
                              <Input
                                id="brand"
                                type="text"
                                name="brand"
                                value={editProduct?.brand || ""}
                                onChange={handleChange}
                                placeholder="e.g., Apple"
                                className="w-full bg-white text-gray-900 border-gray-300"
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="category" className="text-sm font-medium text-gray-900">
                                Category
                              </Label>
                              <Input
                                id="category"
                                type="text"
                                name="category"
                                value={editProduct?.category || ""}
                                onChange={handleChange}
                                placeholder="e.g., Mobile"
                                className="w-full bg-white text-gray-900 border-gray-300"
                                required
                              />
                            </div>
                          </div>

                          {/* Description */}
                          <div className="space-y-2">
                            <Label htmlFor="productDesc" className="text-sm font-medium text-gray-900">
                              Description
                            </Label>
                            <Textarea
                              id="productDesc"
                              name="productDesc"
                              value={editProduct?.productDesc || ""}
                              onChange={handleChange}
                              placeholder="About this item"
                              className="w-full min-h-[120px] resize-none bg-white text-gray-900 border-gray-300"
                              rows={5}
                            />
                          </div>

                          {/* Product Images */}
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-900">
                              Product Images
                            </Label>
                            <ImageUpload
                              productData={editProduct}
                              setProductData={setEditProduct}
                            />
                          </div>
                        </div>

                        <DialogFooter className="gap-2 sm:gap-0">
                          <DialogClose asChild>
                            <Button type="button" variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                              Cancel
                            </Button>
                          </DialogClose>
                          <Button
                            type="submit"
                            className="bg-pink-600 hover:bg-pink-500 text-white"
                          >
                            Save Changes
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>

                  {/* Delete Alert Dialog */}
                  <AlertDialog>
                    <AlertDialogTrigger>
                      <Trash2 className="text-red-500 cursor-pointer hover:text-red-600" />
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-white">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-gray-900">
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-600">
                          This action cannot be undone. This will permanently delete &quot;
                          {product.productName}&quot; and remove it from our servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="border-gray-300 text-gray-700 hover:bg-gray-100">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteProductHandler(product._id)}
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </Card>
          );
        })
      ) : (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">No products found</p>
          {searchTerm && (
            <p className="text-gray-400 text-sm mt-2">
              Try adjusting your search term
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminProduct;