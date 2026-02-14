import { Label } from '@radix-ui/react-label'
import { X } from 'lucide-react'
import React from 'react'
import { Input } from './input'
import { Button } from './button'
import { Card, CardContent } from './card'

const ImageUpload = ({ productData, setProductData }) => {
  const handleFiles = (e) => {
    const files = Array.from(e.target.files || [])

    if (files.length) {
      setProductData((prev) => ({
        ...prev,
        productImg: [...(prev.productImg || []), ...files],
      }))
    }
  }
  const removeImage = (index) =>{
    setProductData((prev)=>{
      const updatedImages = prev.productImg.filter((_, i)=> i !== index);
      return {...prev, productImg:updatedImages}

    })
  }

  return (
    <div className="grid gap-2">
      <Label>Product Images</Label>

      <Input
        type="file"
        id="file-upload"
        className="hidden"
        accept="image/*"
        multiple
        onChange={handleFiles}
      />

      <Button variant="outline" type="button">
        <label htmlFor="file-upload" className="cursor-pointer">
          Upload
        </label>
      </Button>

      {/* Images Preview */}
      {productData?.productImg?.length > 0 && (
        <div className="grid grid-cols-4 gap-4 mt-4">
          {productData.productImg.map((file, idx) => {
            let preview = ""

            if (file instanceof File) {
              preview = URL.createObjectURL(file)
            } else if (typeof file === "string") {
              preview = file
            } else if (file?.url) {
              preview = file.url
            } else {
              return null
            }

            return (
              <Card key={idx} className="relative group overflow-hidden">
                <CardContent className="p-2">
                  <img
                    src={preview}
                    alt="product"
                    className="w-full h-32 object-cover rounded-md"
                  />

                  {/* Remove button */}
                  <button
                  onClick={()=>removeImage(idx)}
                    type="button"
                    className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                  >
                    <X size={14} />
                  </button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default ImageUpload
