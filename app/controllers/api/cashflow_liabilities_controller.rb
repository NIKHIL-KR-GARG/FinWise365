class Api::CashflowLiabilitiesController < ApplicationController
    before_action :set_cashflow_liability, only: [:show, :update, :destroy]
  
    # GET /api/cashflow_liabilities
    def index
        if params[:user_id]
            @cashflow_liabilities = CashflowLiability.where("user_id = ? OR (user_id = 0 AND is_dummy_data = ?)", params[:user_id], params[:is_display_dummy_data])
        else
            @cashflow_liabilities = CashflowLiability.all
        end
        render json: @cashflow_liabilities
    end
  
    # GET /api/cashflow_liabilities/:id
    def show
        render json: @cashflow_liability
    end
  
    # POST /api/cashflow_liabilities
    def create
        @cashflow_liability = CashflowLiability.new(cashflow_liability_params)
        if @cashflow_liability.save
          render json: @cashflow_liability, status: :created
        else
          render json: @cashflow_liability.errors, status: :unprocessable_entity
        end
    end

    # POST /api/cashflow_liabilities/bulk
    def bulk_create
        cashflow_liabilities = CashflowLiability.insert_all(cashflow_liabilities_params[:cashflowLiabilities])
        render json: { status: 'success', data: cashflow_liabilities }, status: :created
    rescue => e
        render json: { status: 'error', message: e.message }, status: :unprocessable_entity
    end
  
    # PUT /api/cashflow_liabilities/:id
    def update
        if @cashflow_liability.update(cashflow_liability_params)
          render json: @cashflow_liability
        else
          render json: @cashflow_liability.errors, status: :unprocessable_entity
        end
    end
  
    # DELETE /api/cashflow_liabilities/:id
    def destroy
        @cashflow_liability.destroy
        head :no_content
    end
  
    private
  
    def set_cashflow_liability
        @cashflow_liability = CashflowLiability.find(params[:id])
    end
  
    def cashflow_liability_params
        params.require(:cashflow_liability).permit(
            :id,
            :user_id,
            :cashflow_date,
            :month,
            :year,
            :age,
            :liability_id,
            :liability_type,
            :liability_name,
            :liability_value,
            :is_dummy_data,
            :cashflow_id,
            :currency,
            :created_at,
            :updated_at
        ) 
    end

    def cashflow_liabilities_params
        params.permit(cashflowLiabilities: [
            :user_id,
            :cashflow_date,
            :month,
            :year,
            :age,
            :liability_id,
            :liability_type,
            :liability_name,
            :liability_value,
            :is_dummy_data,
            :cashflow_id,
            :currency,
        ])
    end
end