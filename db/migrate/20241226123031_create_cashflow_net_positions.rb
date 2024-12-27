class CreateCashflowNetPositions < ActiveRecord::Migration[7.2]
  def change
    create_table :cashflow_net_positions do |t|
      t.integer :user_id
      t.date :cashflow_date
      t.integer :month
      t.integer :year
      t.integer :age
      t.float :income
      t.float :expense
      t.float :net_position
      t.float :liquid_assets
      t.float :locked_assets
      t.float :net_worth
      t.boolean :is_dummy_data
      t.integer :cashflow_id

      t.timestamps
    end
  end
end
