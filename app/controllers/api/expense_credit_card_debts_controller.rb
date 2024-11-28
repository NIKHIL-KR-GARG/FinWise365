class Api::ExpenseCreditCardDebtsController < ApplicationController
    before_action :set_expense_credit_card_debt, only: [:show, :update, :destroy]
  
    # GET /api/expense_credit_card_debts
    def index
        if params[:user_id]
            @expense_credit_card_debts = ExpenseCreditCardDebt.where("user_id = ? OR (user_id = 0 AND is_dummy_data = ?)", params[:user_id], params[:is_display_dummy_data])
        else
            @expense_credit_card_debts = ExpenseCreditCardDebt.all
        end
        render json: @expense_credit_card_debts
    end
  
    # GET /api/expense_credit_card_debts/:id
    def show
        render json: @expense_credit_card_debt
    end
  
    # POST /api/expense_credit_card_debts
    def create
        @expense_credit_card_debt = ExpenseCreditCardDebt.new(expense_credit_card_debt_params)
        if @expense_credit_card_debt.save
          render json: @expense_credit_card_debt, status: :created
        else
          render json: @expense_credit_card_debt.errors, status: :unprocessable_entity
        end
    end
  
    # PUT /api/expense_credit_card_debts/:id
    def update
        if @expense_credit_card_debt.update(expense_credit_card_debt_params)
          render json: @expense_credit_card_debt
        else
          render json: @expense_credit_card_debt.errors, status: :unprocessable_entity
        end
    end
  
    # DELETE /api/expense_credit_card_debts/:id
    def destroy
        @expense_credit_card_debt.destroy
        head :no_content
    end
  
    private
  
    def set_expense_credit_card_debt
        @expense_credit_card_debt = ExpenseCreditCardDebt.find(params[:id])
    end
  
    def expense_credit_card_debt_params
        params.require(:expense_credit_card_debt).permit(
            :id,
            :user_id,
            :debt_type,
            :card_name,
            :institution_name,
            :location,
            :currency,
            :start_date,
            :duration,
            :end_date,
            :loan_amount,
            :interest_rate,
            :emi_amount,
            :is_dummy_data,
            :created_at,
            :updated_at
        ) 
    end
end