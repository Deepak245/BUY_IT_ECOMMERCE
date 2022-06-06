import React from "react";
import { Helmet } from "react-helmet";

// helmet is package we use for creating custom titles
// we can define description,keywords,auther what ever...
const MetaData = ({ title }) => {
  return (
    <Helmet>
      <title>{`${title} - BuyIT`}</title>
    </Helmet>
  );
};

export default MetaData;
