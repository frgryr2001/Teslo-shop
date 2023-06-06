# Next.js Teslo Shop

To run locally, a database is needed.

```
docker-compose up -d
```

- El -d, significa **detached**

## Set environment variable

Rename the **.env.template** file to **.env**

- MongoDB URL Local:

```
MONGO_URL=mongodb://localhost:27017/teslodb
```

- Rebuild Node Modules and Upgrades Next

```
yarn install
yarn dev
```

## Fill in the test information database

Call to API seed data in project configuration:

```
http://localhost:3000/api/seed
```

<!-- upload gif -->

## Demo:

### Client:
<div style="display: flex; justify-content: center;">
  <img src="https://github.com/frgryr2001/Teslo-shop/blob/main/gif/home.gif" alt="teslo" />
</div>

<div style="display: flex; justify-content: center;">
  <img src="https://github.com/frgryr2001/Teslo-shop/blob/main/gif/responsive.gif" alt="teslo" />
</div>

<div style="display: flex; justify-content: center;">
  <img src="https://github.com/frgryr2001/Teslo-shop/blob/main/gif/category.gif" alt="teslo" />
</div>

<div style="display: flex; justify-content: center;">
  <img src="https://github.com/frgryr2001/Teslo-shop/blob/main/gif/addtoCart.gif" alt="teslo" />
</div>

<div style="display: flex; justify-content: center;">
  <img src="https://github.com/frgryr2001/Teslo-shop/blob/main/gif/addAddress.gif" alt="teslo" />
</div>

<div style="display: flex; justify-content: center;">
  <img src="https://github.com/frgryr2001/Teslo-shop/blob/main/gif/checkout.gif" alt="teslo" />
</div>

<div style="display: flex; justify-content: center;">
  <img src="https://github.com/frgryr2001/Teslo-shop/blob/main/gif/history.png" alt="teslo" />
</div>

### Admin:

<div style="display: flex; justify-content: center;">
  <img src="https://github.com/frgryr2001/Teslo-shop/blob/main/gif/admin.png" alt="teslo" />
</div>


<div style="display: flex; justify-content: center;">
  <img src="https://github.com/frgryr2001/Teslo-shop/blob/main/gif/adminProducts.png" alt="teslo" />
</div>

<div style="display: flex; justify-content: center;">
  <img src="https://github.com/frgryr2001/Teslo-shop/blob/main/gif/addProduct.png" alt="teslo" />
</div>

<div style="display: flex; justify-content: center;">
  <img src="https://github.com/frgryr2001/Teslo-shop/blob/main/gif/viewOrderAdmin.png" alt="teslo" />
</div>

<div style="display: flex; justify-content: center;">
  <img src="https://github.com/frgryr2001/Teslo-shop/blob/main/gif/viewAllUsers.png" alt="teslo" />
</div>
