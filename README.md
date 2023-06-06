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
<div style="text-align: center;">
  ![teslo](https://github.com/frgryr2001/Teslo-shop/blob/main/gif/home.gif)
</div>

<div style="text-align: center;">
  ![teslo](https://github.com/frgryr2001/Teslo-shop/blob/main/gif/responsive.gif)
</div>

<div style="text-align: center;">
  ![teslo](https://github.com/frgryr2001/Teslo-shop/blob/main/gif/category.gif)
</div>

<div style="text-align: center;">
  ![teslo](https://github.com/frgryr2001/Teslo-shop/blob/main/gif/addtoCart.gif)
</div>

<div style="text-align: center;">
  ![teslo](https://github.com/frgryr2001/Teslo-shop/blob/main/gif/addAddress.gif)
</div>

<div style="text-align: center;">
  ![teslo](https://github.com/frgryr2001/Teslo-shop/blob/main/gif/checkout.gif)
</div>

<div style="text-align: center;">
  ![teslo](https://github.com/frgryr2001/Teslo-shop/blob/main/gif/history.png)
</div>

### Admin:
