class AddSipEndDateToAssetPortfolio < ActiveRecord::Migration[7.2]
  def change
    add_column :asset_portfolios, :sip_end_date, :date
  end
end
