class Api::AssetPortfolioDetailsController < ApplicationController
    before_action :set_asset_portfolio_detail, only: [:show, :update, :destroy]
  
    # GET /api/asset_portfolio_details
    def index
        user_id = params[:user_id]
        portfolio_id = params[:portfolio_id]
        if user_id && portfolio_id
            @asset_portfolio_details = AssetPortfolioDetail.where(user_id: user_id, portfolio_id: portfolio_id)
        elsif user_id
            @asset_portfolio_details = AssetPortfolioDetail.where(user_id: user_id)
        else
            @asset_portfolio_details = AssetPortfolioDetail.all
        end
        render json: @asset_portfolio_details
    end
  
    # GET /api/asset_portfolio_details/:id
    def show
        render json: @asset_portfolio_detail
    end
  
    # POST /api/asset_portfolio_details
    def create
        @asset_portfolio_detail = AssetPortfolioDetail.new(asset_portfolio_detail_params)
        if @asset_portfolio_detail.save
          render json: @asset_portfolio_detail, status: :created
        else
          render json: @asset_portfolio_detail.errors, status: :unprocessable_entity
        end
    end
  
    # PUT /api/asset_portfolio_details/:id
    def update
        if @asset_portfolio_detail.update(asset_portfolio_detail_params)
          render json: @asset_portfolio_detail
        else
          render json: @asset_portfolio_detail.errors, status: :unprocessable_entity
        end
    end
  
    # DELETE /api/asset_portfolio_details/:id
    def destroy
        @asset_portfolio_detail.destroy
        head :no_content
    end

    # DELETE /api/asset_portfolio_details/delete_by_portfolio_id/:portfolio_id
    def destroy_by_portfolio_id
        portfolio_id = params[:portfolio_id]
        AssetPortfolioDetail.where(portfolio_id: portfolio_id).destroy_all
        head :no_content
    end
  
    private
  
    def set_asset_portfolio_detail
        @asset_portfolio_detail = AssetPortfolioDetail.find(params[:id])
    end
  
    def asset_portfolio_detail_params
        params.require(:asset_portfolio_detail).permit(
            :id,
            :user_id,
            :portfolio_id,
            :scrip,
            :description,
            :quantity,
            :buy_date,
            :buy_price,
            :buy_tax_and_charges,
            :sale_date,
            :sale_price,
            :sale_tax_and_charges,
            :current_price,
            :created_at,
            :updated_at
        ) 
    end
end