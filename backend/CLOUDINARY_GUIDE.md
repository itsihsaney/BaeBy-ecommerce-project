# Cloudinary Image Hosting Guide

I have implemented the Cloudinary image upload system for your backend. This allows you to upload product images to the cloud and store the secure URLs in your database.

## 1. Setup Environment Variables
Add these to your `backend/.env` file:
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## 2. API Endpoint
**URL:** `POST /api/upload`  
**Description:** Uploads a single image to Cloudinary.  
**Headers:** `Authorization: Bearer <your_jwt_token>`  
**Body:** `form-data` with a field named `image` containing the file.

### Postman Example:
1. Set method to **POST**.
2. URL: `http://localhost:5001/api/upload`.
3. Go to **Authorization** tab -> Select **Bearer Token** -> Paste your token.
4. Go to **Body** tab -> Select **form-data**.
5. Key: `image`, Change type from **Text** to **File**.
6. Value: Select an image from your computer.
7. Click **Send**.
8. You will receive a JSON response with the Cloudinary URL:
   ```json
   {
     "message": "Image uploaded successfully",
     "url": "https://res.cloudinary.com/..."
   }
   ```

## 3. Saving to Product
When creating or updating a product (`POST /api/products` or `PUT /api/products/:id`), simply use the `url` received from the upload step in the `image` field.

## 4. Frontend Fallback Handling
To prevent infinite loops if an image fails to load, use this pattern in your React components:

```jsx
<img
  src={product.image || "/fallback.png"}
  alt={product.name}
  onError={(e) => {
    // Only set the fallback once to avoid infinite loop
    if (e.target.src !== "/fallback.png") {
      e.target.onerror = null; // Important: Clear the handler
      e.target.src = "/fallback.png";
    }
  }}
/>
```

## 5. How it works
1. **Frontend** sends image to `server.js` (`/api/upload`).
2. **Multer Middleware** (`uploadRoutes.js`) catches the image.
3. **Cloudinary Storage Engine** (`config/cloudinary.js`) sends it directly to Cloudinary.
4. **Cloudinary** returns a secure URL.
5. **Controller** (`uploadController.js`) sends this URL back to your Frontend.
6. **Frontend** then saves this URL when creating/updating the Product in your Database.
