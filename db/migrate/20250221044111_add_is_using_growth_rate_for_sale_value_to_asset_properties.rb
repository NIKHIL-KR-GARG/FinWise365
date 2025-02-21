class AddIsUsingGrowthRateForSaleValueToAssetProperties < ActiveRecord::Migration[7.2]
  def change
    add_column :asset_properties, :is_using_growth_rate_for_sale_value, :boolean, default: false
  end
end
