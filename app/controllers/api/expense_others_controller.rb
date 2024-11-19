class Api::ExpenseOthersController < ApplicationController
    before_action :set_expense_other, only: [:show, :update, :destroy]
  
    # GET /api/expense_others
    def index
        if params[:user_id]
            @expense_others = ExpenseOther.where(user_id: params[:user_id])
        else
            @expense_others = ExpenseOther.all
        end
        render json: @expense_others
    end
  
    # GET /api/expense_others/:id
    def show
        render json: @expense_other
    end
  
    # POST /api/expense_others
    def create
        @expense_other = ExpenseOther.new(expense_other_params)
        if @expense_other.save
          render json: @expense_other, status: :created
        else
          render json: @expense_other.errors, status: :unprocessable_entity
        end
    end
  
    # PUT /api/expense_others/:id
    def update
        if @expense_other.update(expense_other_params)
          render json: @expense_other
        else
          render json: @expense_other.errors, status: :unprocessable_entity
        end
    end
  
    # DELETE /api/expense_others/:id
    def destroy
        @expense_other.destroy
        head :no_content
    end
  
    private
  
    def set_expense_other
        @expense_other = ExpenseOther.find(params[:id])
    end
  
    def expense_other_params
        params.require(:expense_other).permit(
            :id,
            :user_id,
            :expense_name,
            :location,
            :currency,
            :is_recurring,
            :expense_date,
            :duration,
            :end_date,
            :amount,
            :recurring_amount,
            :inflation_rate,
            :recurring_frequency,
            :created_at,
            :updated_at
        ) 
    end
end