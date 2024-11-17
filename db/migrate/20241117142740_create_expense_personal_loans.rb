class CreateExpensePersonalLoans < ActiveRecord::Migration[7.2]
  def change
    create_table :expense_personal_loans do |t|
      t.integer :user_id
      t.string :loan_name
      t.string :institution_name
      t.string :location
      t.string :currency
      t.date :start_date
      t.integer :duration
      t.date :end_date
      t.float :loan_amount
      t.float :interest_rate
      t.float :emi_amount

      t.timestamps
    end
  end
end
