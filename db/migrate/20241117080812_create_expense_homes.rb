class CreateExpenseHomes < ActiveRecord::Migration[7.2]
  def change
    create_table :expense_homes do |t|
      t.integer :user_id
      t.string :home_name
      t.date :start_date
      t.date :end_date
      t.string :location
      t.string :currency
      t.float :groceries
      t.float :clothes
      t.float :utilities
      t.float :furniture
      t.float :health
      t.float :transport
      t.float :communication
      t.float :entertainment
      t.float :education
      t.float :dining
      t.float :holidays
      t.float :miscellaneous
      t.float :total_expense
      t.float :inflation_rate

      t.timestamps
    end
  end
end
