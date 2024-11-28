class Api::AssetPortfoliosController < ApplicationController
    before_action :set_asset_portfolio, only: [:show, :update, :destroy]
  
    # GET /api/asset_portfolios
    def index
        if params[:user_id]
            @asset_portfolios = AssetPortfolio.where("user_id = ? OR (user_id = 0 AND is_dummy_data = ?)", params[:user_id], params[:is_display_dummy_data])
        else
            @asset_portfolios = AssetPortfolio.all
        end
        render json: @asset_portfolios
    end
  
    # GET /api/asset_portfolios/:id
    def show
        render json: @asset_portfolio
    end
  
    # POST /api/asset_portfolios
    def create
        @asset_portfolio = AssetPortfolio.new(asset_portfolio_params)
        if @asset_portfolio.save
          render json: @asset_portfolio, status: :created
        else
          render json: @asset_portfolio.errors, status: :unprocessable_entity
        end
    end
  
    # PUT /api/asset_portfolios/:id
    def update
        if @asset_portfolio.update(asset_portfolio_params)
          render json: @asset_portfolio
        else
          render json: @asset_portfolio.errors, status: :unprocessable_entity
        end
    end
  
    # DELETE /api/asset_portfolios/:id
    def destroy
        @asset_portfolio.destroy
        head :no_content
    end
  
    private
  
    def set_asset_portfolio
        @asset_portfolio = AssetPortfolio.find(params[:id])
    end
  
    def asset_portfolio_params
        params.require(:asset_portfolio).permit(
            :id,
            :user_id,
            :portfolio_name,
            :institution_name,
            :portfolio_type,
            :location,
            :currency,
            :buying_date,
            :buying_value,
            :growth_rate,
            :coupon_rate,
            :coupon_frequency,
            :maturity_date,
            :is_paying_dividend,
            :dividend_rate,
            :dividend_amount,
            :dividend_frequency,
            :is_plan_to_sell,
            :sale_date,
            :sale_value,
            :is_sip,
            :sip_amount,
            :sip_frequency,
            :buy_price,
            :current_value,
            :profit,
            :profit_percentage,
            :loss,
            :loss_percentage,
            :is_dummy_data,
            :created_at,
            :updated_at
        ) 
    end
end