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

<p align="center">
  ![teslo](https://github.com/frgryr2001/Teslo-shop/blob/main/gif/home.gif)
</p>
<p align="center">
  ![teslo](https://github.com/frgryr2001/Teslo-shop/blob/main/gif/responsive.gif)
</p>

<p align="center">
  ![teslo](https://github.com/frgryr2001/Teslo-shop/blob/main/gif/category.gif)
</p>
<p align="center">
  ![teslo](https://github.com/frgryr2001/Teslo-shop/blob/main/gif/addtoCart.gif)
</p>
<p align="center">
  ![teslo](https://github.com/frgryr2001/Teslo-shop/blob/main/gif/addAddress.gif)
</p>
<p align="center">
  ![teslo](https://github.com/frgryr2001/Teslo-shop/blob/main/gif/checkout.gif)
</p>

<p align="center">
  ![teslo](https://github.com/frgryr2001/Teslo-shop/blob/main/gif/history.png)
</p>

### Admin:
