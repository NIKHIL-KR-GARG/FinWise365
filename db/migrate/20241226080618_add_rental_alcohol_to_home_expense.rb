class AddRentalAlcoholToHomeExpense < ActiveRecord::Migration[7.2]
  def change
    add_column :expense_homes, :rental, :float
    add_column :expense_homes, :alcohol, :float
  end
end
