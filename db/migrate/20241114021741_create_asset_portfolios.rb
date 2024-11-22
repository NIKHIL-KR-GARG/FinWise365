class CreateAssetPortfolios < ActiveRecord::Migration[7.2]
  def change
    create_table :asset_portfolios do |t|
      t.integer :user_id
      t.string :portfolio_name
      t.string :institution_name
      t.string :portfolio_type
      t.string :location
      t.string :currency
      t.date :buying_date
      t.float :buying_value
      t.float :growth_rate
      t.float :coupon_rate
      t.boolean :is_paying_dividend
      t.float :dividend_rate
      t.float :dividend_amount
      t.string :dividend_frequency
      t.boolean :is_plan_to_sell
      t.date :sale_date
      t.float :sale_value
      t.boolean :is_sip
      t.float :sip_amount
      t.string :sip_frequency

      t.timestamps
    end
  end
end
