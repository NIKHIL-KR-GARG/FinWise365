class Api::ExpensePersonalLoansController < ApplicationController
    before_action :set_expense_personal_loan, only: [:show, :update, :destroy]
  
    # GET /api/expense_personal_loans
    def index
        if params[:user_id]
            @expense_personal_loans = ExpensePersonalLoan.where(user_id: params[:user_id])
        else
            @expense_personal_loans = ExpensePersonalLoan.all
        end
        render json: @expense_personal_loans
    end
  
    # GET /api/expense_personal_loans/:id
    def show
        render json: @expense_personal_loan
    end
  
    # POST /api/expense_personal_loans
    def create
        @expense_personal_loan = ExpensePersonalLoan.new(expense_personal_loan_params)
        if @expense_personal_loan.save
          render json: @expense_personal_loan, status: :created
        else
          render json: @expense_personal_loan.errors, status: :unprocessable_entity
        end
    end
  
    # PUT /api/expense_personal_loans/:id
    def update
        if @expense_personal_loan.update(expense_personal_loan_params)
          render json: @expense_personal_loan
        else
          render json: @expense_personal_loan.errors, status: :unprocessable_entity
        end
    end
  
    # DELETE /api/expense_personal_loans/:id
    def destroy
        @expense_personal_loan.destroy
        head :no_content
    end
  
    private
  
    def set_expense_personal_loan
        @expense_personal_loan = ExpensePersonalLoan.find(params[:id])
    end
  
    def expense_personal_loan_params
        params.require(:expense_personal_loan).permit(
            :id,
            :user_id,
            :loan_name,
            :institution_name,
            :location,
            :currency,
            :start_date,
            :duration,
            :end_date,
            :loan_amount,
            :interest_rate,
            :emi_amount,
            :created_at,
            :updated_at
        ) 
    end
end