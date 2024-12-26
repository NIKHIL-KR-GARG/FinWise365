class CreateCashflowAssets < ActiveRecord::Migration[7.2]
  def change
    create_table :cashflow_assets do |t|
      t.integer :user_id
      t.date :cashflow_date
      t.integer :month
      t.integer :year
      t.integer :age
      t.integer :asset_id
      t.string :asset_type
      t.string :asset_name
      t.float :original_asset_value
      t.float :asset_value
      t.boolean :is_locked
      t.boolean :is_cash
      t.float :growth_rate

      t.timestamps
    end
  end
end
