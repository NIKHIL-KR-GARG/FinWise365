class AddIsRecurringAndLoanAmountToDreams < ActiveRecord::Migration[7.2]
  def change
    add_column :dreams, :is_recurring, :boolean, default: false
    add_column :dreams, :loan_amount, :float
    add_column :dreams, :recurring_amount, :float
    add_column :dreams, :recurring_frequency, :float
  end
end
