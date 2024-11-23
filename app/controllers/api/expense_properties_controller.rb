class Api::ExpensePropertiesController < ApplicationController
    before_action :set_expense_property, only: [:show, :update, :destroy]
  
    # GET /api/expense_properties
    def index
        if params[:user_id]
            @expense_properties = ExpenseProperty.where(user_id: params[:user_id])
        else
            @expense_properties = ExpenseProperty.all
        end
        render json: @expense_properties
    end
  
    # GET /api/expense_properties/:id
    def show
        render json: @expense_property
    end
  
    # POST /api/expense_properties
    def create
        @expense_property = ExpenseProperty.new(expense_property_params)
        if @expense_property.save
          render json: @expense_property, status: :created
        else
          render json: @expense_property.errors, status: :unprocessable_entity
        end
    end
  
    # PUT /api/expense_properties/:id
    def update
        if @expense_property.update(expense_property_params)
          render json: @expense_property
        else
          render json: @expense_property.errors, status: :unprocessable_entity
        end
    end
  
    # DELETE /api/expense_properties/:id
    def destroy
        @expense_property.destroy
        head :no_content
    end
  
    private
  
    def set_expense_property
        @expense_property = ExpenseProperty.find(params[:id])
    end
  
    def expense_property_params
        params.require(:expense_property).permit(
            :id,
            :user_id,
            :property_name,
            :property_type,
            :start_date,
            :end_date,
            :location,
            :currency,
            :expense_name_1,
            :expense_value_1,
            :expense_name_2,
            :expense_value_2,
            :expense_name_3,
            :expense_value_3,
            :expense_name_4,
            :expense_value_4,
            :expense_name_5,
            :expense_value_5,
            :expense_name_6,
            :expense_value_6,
            :expense_name_7,
            :expense_value_7,
            :expense_name_8,
            :expense_value_8,
            :total_expense,
            :inflation_rate,
            :created_at,
            :updated_at
        ) 
    end
end