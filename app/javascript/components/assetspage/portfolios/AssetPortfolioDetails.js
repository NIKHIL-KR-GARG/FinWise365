import React from "react";

const AssetPortfolioDetails = ({ portfolio: initialPortfolio }) => {

    return (
        <div>
            <h1>Portfolio Details</h1>
            <h2>{initialPortfolio.portfolio_name}</h2>
        </div>
    );
}

export default AssetPortfolioDetails;