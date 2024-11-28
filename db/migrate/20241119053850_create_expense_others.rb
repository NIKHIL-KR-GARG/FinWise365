class CreateExpenseOthers < ActiveRecord::Migration[7.2]
  def change
    create_table :expense_others do |t|
      t.integer :user_id
      t.string :expense_name
      t.string :location
      t.string :currency
      t.boolean :is_recurring
      t.date :expense_date
      t.integer :duration
      t.date :end_date
      t.float :amount
      t.float :recurring_amount
      t.float :inflation_rate
      t.string :recurring_frequency
      t.boolean :is_dummy_data
      
      t.timestamps
    end
  end
end
