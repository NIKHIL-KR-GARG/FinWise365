class DropAvatarAndProfilePictureFromUsers < ActiveRecord::Migration[7.2]
  def change
    remove_column :users, :avatar
    remove_column :users, :profile_picture
  end
end
