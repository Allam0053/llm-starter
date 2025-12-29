export interface Root {
  message: string
  data: Data
  errors: any
}

export interface Data {
  data: Daum[]
  meta: Meta
}

export interface Daum {
  id: number
  page_id: number
  image_url: string
  code: string
  buy_price: number
  current_price: number
  valuation: number
  margin_of_safety: number
  created_at: string
  updated_at: string
  status: string
  created_by?: CreatedBy
  updated_by?: UpdatedBy3
  deleted_at: any
  deleted_by: any
  page: Page
  changes: number
}

export interface CreatedBy {
  id: number
  fullname: string
  email: string
  role: string
  has_link_product: number
  ip_address: any
  last_login_ip: any
  picture_url: string
  member_active_roles: MemberActiveRole[]
  member_roles: MemberRole[]
}

export interface MemberActiveRole {
  id: number
  user_id: number
  role_id: number
  expired_date: string
  created_at: string
  updated_at: string
  created_by: CreatedBy2
  updated_by: UpdatedBy
  role: Role
}

export interface CreatedBy2 {
  id: number
  fullname: string
  email: string
  role: string
  has_link_product: number
  ip_address: any
  last_login_ip: any
  picture_url: any
  member_active_roles: any[]
  member_roles: any[]
}

export interface UpdatedBy {
  id: number
  fullname: string
  email: string
  role: string
  has_link_product: number
  ip_address: any
  last_login_ip: any
  picture_url: any
  member_active_roles: any[]
  member_roles: any[]
}

export interface Role {
  id: number
  title: string
  role: string
  access: string
  telegram_group: any
  created_at: string
  updated_at: string
}

export interface MemberRole {
  id: number
  user_id: number
  role_id: number
  expired_date: string
  created_at: string
  updated_at: string
  created_by: CreatedBy3
  updated_by: UpdatedBy2
  role: Role2
}

export interface CreatedBy3 {
  id: number
  fullname: string
  email: string
  role: string
  has_link_product: number
  ip_address: any
  last_login_ip: any
  picture_url: any
  member_active_roles: any[]
  member_roles: any[]
}

export interface UpdatedBy2 {
  id: number
  fullname: string
  email: string
  role: string
  has_link_product: number
  ip_address: any
  last_login_ip: any
  picture_url: any
  member_active_roles: any[]
  member_roles: any[]
}

export interface Role2 {
  id: number
  title: string
  role: string
  access: string
  telegram_group: any
  created_at: string
  updated_at: string
}

export interface UpdatedBy3 {
  id: number
  fullname: string
  email: string
  role: string
  has_link_product: number
  ip_address: any
  last_login_ip: any
  picture_url: string
  member_active_roles: MemberActiveRole2[]
  member_roles: MemberRole2[]
}

export interface MemberActiveRole2 {
  id: number
  user_id: number
  role_id: number
  expired_date: string
  created_at: string
  updated_at: string
  created_by: CreatedBy4
  updated_by: UpdatedBy4
  role: Role3
}

export interface CreatedBy4 {
  id: number
  fullname: string
  email: string
  role: string
  has_link_product: number
  ip_address: any
  last_login_ip: any
  picture_url: any
  member_active_roles: any[]
  member_roles: any[]
}

export interface UpdatedBy4 {
  id: number
  fullname: string
  email: string
  role: string
  has_link_product: number
  ip_address: any
  last_login_ip: any
  picture_url: any
  member_active_roles: any[]
  member_roles: any[]
}

export interface Role3 {
  id: number
  title: string
  role: string
  access: string
  telegram_group: any
  created_at: string
  updated_at: string
}

export interface MemberRole2 {
  id: number
  user_id: number
  role_id: number
  expired_date: string
  created_at: string
  updated_at: string
  created_by: CreatedBy5
  updated_by: UpdatedBy5
  role: Role4
}

export interface CreatedBy5 {
  id: number
  fullname: string
  email: string
  role: string
  has_link_product: number
  ip_address: any
  last_login_ip: any
  picture_url: any
  member_active_roles: any[]
  member_roles: any[]
}

export interface UpdatedBy5 {
  id: number
  fullname: string
  email: string
  role: string
  has_link_product: number
  ip_address: any
  last_login_ip: any
  picture_url: any
  member_active_roles: any[]
  member_roles: any[]
}

export interface Role4 {
  id: number
  title: string
  role: string
  access: string
  telegram_group: any
  created_at: string
  updated_at: string
}

export interface Page {
  id: number
  title: string
  slug: string
  type: string
  status: string
  content_html: string
  content_json: string
  is_show_header: number
  header_type: string
  is_show_footer: number
  footer_type: string
  visibility: string
  created_at: string
  updated_at: string
  deleted_at: any
  created_by: CreatedBy6
  updated_by?: UpdatedBy8
  deleted_by: any
}

export interface CreatedBy6 {
  id: number
  fullname: string
  email: string
  role: string
  has_link_product: number
  ip_address: any
  last_login_ip: any
  picture_url: string
  member_active_roles: MemberActiveRole3[]
  member_roles: MemberRole3[]
}

export interface MemberActiveRole3 {
  id: number
  user_id: number
  role_id: number
  expired_date: string
  created_at: string
  updated_at: string
  created_by: CreatedBy7
  updated_by: UpdatedBy6
  role: Role5
}

export interface CreatedBy7 {
  id: number
  fullname: string
  email: string
  role: string
  has_link_product: number
  ip_address: any
  last_login_ip: any
  picture_url: any
  member_active_roles: any[]
  member_roles: any[]
}

export interface UpdatedBy6 {
  id: number
  fullname: string
  email: string
  role: string
  has_link_product: number
  ip_address: any
  last_login_ip: any
  picture_url: any
  member_active_roles: any[]
  member_roles: any[]
}

export interface Role5 {
  id: number
  title: string
  role: string
  access: string
  telegram_group: any
  created_at: string
  updated_at: string
}

export interface MemberRole3 {
  id: number
  user_id: number
  role_id: number
  expired_date: string
  created_at: string
  updated_at: string
  created_by: CreatedBy8
  updated_by: UpdatedBy7
  role: Role6
}

export interface CreatedBy8 {
  id: number
  fullname: string
  email: string
  role: string
  has_link_product: number
  ip_address: any
  last_login_ip: any
  picture_url: any
  member_active_roles: any[]
  member_roles: any[]
}

export interface UpdatedBy7 {
  id: number
  fullname: string
  email: string
  role: string
  has_link_product: number
  ip_address: any
  last_login_ip: any
  picture_url: any
  member_active_roles: any[]
  member_roles: any[]
}

export interface Role6 {
  id: number
  title: string
  role: string
  access: string
  telegram_group: any
  created_at: string
  updated_at: string
}

export interface UpdatedBy8 {
  id: number
  fullname: string
  email: string
  role: string
  has_link_product: number
  ip_address: any
  last_login_ip: any
  picture_url: string
  member_active_roles: MemberActiveRole4[]
  member_roles: MemberRole4[]
}

export interface MemberActiveRole4 {
  id: number
  user_id: number
  role_id: number
  expired_date: string
  created_at: string
  updated_at: string
  created_by: CreatedBy9
  updated_by: UpdatedBy9
  role: Role7
}

export interface CreatedBy9 {
  id: number
  fullname: string
  email: string
  role: string
  has_link_product: number
  ip_address: any
  last_login_ip: any
  picture_url: any
  member_active_roles: any[]
  member_roles: any[]
}

export interface UpdatedBy9 {
  id: number
  fullname: string
  email: string
  role: string
  has_link_product: number
  ip_address: any
  last_login_ip: any
  picture_url: any
  member_active_roles: any[]
  member_roles: any[]
}

export interface Role7 {
  id: number
  title: string
  role: string
  access: string
  telegram_group: any
  created_at: string
  updated_at: string
}

export interface MemberRole4 {
  id: number
  user_id: number
  role_id: number
  expired_date: string
  created_at: string
  updated_at: string
  created_by: CreatedBy10
  updated_by: UpdatedBy10
  role: Role8
}

export interface CreatedBy10 {
  id: number
  fullname: string
  email: string
  role: string
  has_link_product: number
  ip_address: any
  last_login_ip: any
  picture_url: any
  member_active_roles: any[]
  member_roles: any[]
}

export interface UpdatedBy10 {
  id: number
  fullname: string
  email: string
  role: string
  has_link_product: number
  ip_address: any
  last_login_ip: any
  picture_url: any
  member_active_roles: any[]
  member_roles: any[]
}

export interface Role8 {
  id: number
  title: string
  role: string
  access: string
  telegram_group: any
  created_at: string
  updated_at: string
}

export interface Meta {
  page: number
  start: number
  end: number
  search: string
  total: number
}
