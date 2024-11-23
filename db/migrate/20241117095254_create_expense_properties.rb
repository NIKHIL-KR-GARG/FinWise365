class CreateExpenseProperties < ActiveRecord::Migration[7.2]
  def change
    create_table :expense_properties do |t|
      t.integer :user_id
      t.string :property_name
      t.string :property_type
      t.date :start_date
      t.date :end_date
      t.string :location
      t.string :currency
      t.string :expense_name_1
      t.float :expense_value_1
      t.string :expense_name_2
      t.float :expense_value_2
      t.string :expense_name_3
      t.float :expense_value_3
      t.string :expense_name_4
      t.float :expense_value_4
      t.string :expense_name_5
      t.float :expense_value_5
      t.string :expense_name_6
      t.float :expense_value_6
      t.string :expense_name_7
      t.float :expense_value_7
      t.string :expense_name_8
      t.float :expense_value_8
      t.float :total_expense
      t.float :inflation_rate

      t.timestamps
    end
  end
end
