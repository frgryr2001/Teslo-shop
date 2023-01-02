import Head from "next/head";
import React, { FC } from "react";
import { Navbar } from "../ui";

interface Props {
  children: React.ReactNode;
  title: string;
  pageDescription: string;
  imageFullUrl?: string;
}

export const ShopLayout: FC<Props> = ({
  children,
  title,
  pageDescription,
  imageFullUrl,
}) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={pageDescription} />

        <meta name="og:title" content={title} />
        <meta name="og:description" content={pageDescription} />
        {
          // if imageFullUrl is not undefined, then add the meta tag
          imageFullUrl && <meta name="og:image" content={imageFullUrl} />
        }
      </Head>

      <nav>
        <Navbar />
      </nav>

      <main
        style={{
          margin: "80px auto",
          maxWidth: "1400px",
          padding: " 0 30px",
        }}
      >
        {children}
      </main>

      <footer>{/* footer */}</footer>
    </>
  );
};
