class Spot < ActiveRecord::Base
  attr_accessible :content, :lat, :lng, :spot_type, :main_image
  
  has_attached_file :main_image, :styles => { :small => "150x150>", :small_fix => "70x70#", :normal => "600x350#" }

  validates_attachment_size :main_image, :less_than => 5.megabytes
  validates_attachment_content_type :main_image, :content_type => ['image/jpeg', 'image/png']

  validates_presence_of :lat
  validates_presence_of :lng
  validates_presence_of :content
  validates_presence_of :main_image

end
