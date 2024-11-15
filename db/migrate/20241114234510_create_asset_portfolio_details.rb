class CreateAssetPortfolioDetails < ActiveRecord::Migration[7.2]
  def change
    create_table :asset_portfolio_details do |t|
      t.integer :user_id
      t.integer :portfolio_id
      t.string :scrip
      t.string :description
      t.float :quantity
      t.date :buy_date
      t.float :buy_price
      t.float :buy_tax_and_charges
      t.date :sale_date
      t.float :sale_price
      t.float :sale_tax_and_charges
      t.float :current_price

      t.timestamps
    end
  end
end
