class Api::AssetPropertiesController < ApplicationController
    before_action :set_asset_property, only: [:show, :update, :destroy]
  
    # GET /api/asset_properties
    def index
        if params[:user_id]
            @asset_properties = AssetProperty.where(user_id: params[:user_id])
        else
            @asset_properties = AssetProperty.all
        end
        render json: @asset_properties
    end
  
    # GET /api/asset_properties/:id
    def show
        render json: @asset_property
    end
  
    # POST /api/asset_properties
    def create
        @asset_property = AssetProperty.new(asset_property_params)
        if @asset_property.save
          render json: @asset_property, status: :created
        else
          render json: @asset_property.errors, status: :unprocessable_entity
        end
    end
  
    # PUT /api/asset_properties/:id
    def update
        if @asset_property.update(asset_property_params)
          render json: @asset_property
        else
          render json: @asset_property.errors, status: :unprocessable_entity
        end
    end
  
    # DELETE /api/asset_properties/:id
    def destroy
        @asset_property.destroy
        head :no_content
    end
  
    private
  
    def set_asset_property
        @asset_property = AssetProperty.find(params[:id])
    end
  
    def asset_property_params
        params.require(:asset_property).permit(
            :id,
            :user_id,
            :property_name,
            :property_type,
            :property_location,
            :property_number,
            :purchase_date,
            :currency,
            :purchase_price,
            :tentative_current_value,
            :is_primary_property,
            :is_under_loan,
            :loan_amount,
            :loan_remaining_duration,
            :loan_type,
            :loan_interest_rate,
            :is_loan_locked,
            :loan_locked_till,
            :is_on_rent,
            :rental_amount,
            :property_value_growth_rate,
            :is_plan_to_sell,
            :tentative_sale_date,
            :tentative_sale_amount,
            :annual_property_tax_amount,
            :annual_property_maintenance_amount,
            :created_at,
            :updated_at
        ) 
    end
end