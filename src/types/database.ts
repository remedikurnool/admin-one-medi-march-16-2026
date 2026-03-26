/**
 * Database Types
 *
 * Type definitions for key tables across all Supabase schemas.
 * These types reflect the actual database structure — do NOT modify
 * unless the underlying tables change.
 */

// ─── Commerce ───────────────────────────────────────────────────────────────

export interface Medicine {
  id: string
  name: string
  generic_name: string | null
  brand: string | null
  dosage_form: string | null
  strength: string | null
  manufacturer: string | null
  description: string | null
  requires_prescription: boolean
  vendor_id: string | null
  category_id: string | null
  image_url: string | null
  is_active: boolean
  created_at: string
  updated_at: string
  medicine_categories?: MedicineCategory | null
  medicine_inventory?: MedicineInventory[] | null
}

export interface MedicineCategory {
  id: string
  name: string
  description: string | null
  parent_id: string | null
  image_url: string | null
  created_at: string
}

export interface MedicineInventory {
  id: string
  medicine_id: string
  vendor_id: string | null
  stock_quantity: number
  price: number
  mrp: number | null
  sku: string | null
  batch_number: string | null
  expiry_date: string | null
  is_active: boolean
  created_at: string
  updated_at: string
  medicines?: Pick<Medicine, 'name' | 'brand' | 'generic_name'> | null
}

export interface MedicineOrder {
  id: string
  user_id: string
  order_number: string | null
  total_amount: number
  discount_amount: number | null
  delivery_fee: number | null
  status: string
  payment_status: string | null
  payment_method: string | null
  delivery_address: string | null
  prescription_id: string | null
  vendor_id: string | null
  notes: string | null
  created_at: string
  updated_at: string
  medicine_order_items?: MedicineOrderItem[] | null
}

export interface MedicineOrderItem {
  id: string
  order_id: string
  medicine_id: string
  quantity: number
  unit_price: number
  total_price: number
  medicines?: Pick<Medicine, 'name'> | null
}

export interface Prescription {
  id: string
  user_id: string
  doctor_id: string | null
  image_url: string | null
  status: string
  notes: string | null
  created_at: string
  updated_at: string
}

// ─── Diagnostics ────────────────────────────────────────────────────────────

export interface Lab {
  id: string
  name: string
  address: string | null
  city: string | null
  phone: string | null
  email: string | null
  logo_url: string | null
  is_active: boolean
  is_home_collection: boolean | null
  rating: number | null
  created_at: string
  updated_at: string
}

export interface LabTest {
  id: string
  test_name: string
  description: string | null
  category_id: string | null
  sample_type: string | null
  preparation: string | null
  report_time: string | null
  is_active: boolean
  created_at: string
  updated_at: string
  test_categories?: TestCategory | null
}

export interface TestCategory {
  id: string
  name: string
  description: string | null
  icon_url: string | null
  created_at: string
}

export interface LabPricing {
  id: string
  lab_id: string
  test_id: string
  price: number
  discount_price: number | null
  is_active: boolean
  created_at: string
  updated_at: string
  labs?: Pick<Lab, 'name'> | null
  lab_tests?: Pick<LabTest, 'test_name'> | null
}

export interface LabBooking {
  id: string
  user_id: string
  lab_id: string
  total_amount: number
  status: string
  booking_date: string | null
  slot_time: string | null
  collection_type: string | null
  collection_address: string | null
  payment_status: string | null
  created_at: string
  updated_at: string
  labs?: Pick<Lab, 'name'> | null
  user_profiles?: { full_name: string; email: string } | null
}

export interface LabReport {
  id: string
  booking_id: string
  report_url: string | null
  status: string
  notes: string | null
  uploaded_at: string
  lab_bookings?: {
    id: string
    user_id: string
    labs?: Pick<Lab, 'name'> | null
  } | null
}

// ─── Consultations ──────────────────────────────────────────────────────────

export interface Doctor {
  id: string
  full_name: string
  email: string | null
  phone: string | null
  speciality_id: string | null
  qualification: string | null
  experience_years: number | null
  bio: string | null
  profile_image: string | null
  consultation_fee: number | null
  is_active: boolean
  rating: number | null
  created_at: string
  updated_at: string
  specialities?: Speciality | null
}

export interface Speciality {
  id: string
  name: string
  description: string | null
  icon_url: string | null
  created_at: string
}

export interface ConsultationBooking {
  id: string
  user_id: string
  doctor_id: string
  slot_id: string | null
  status: string
  consultation_type: string | null
  symptoms: string | null
  notes: string | null
  amount: number | null
  payment_status: string | null
  created_at: string
  updated_at: string
  doctors?: Pick<Doctor, 'full_name'> | null
}

export interface DoctorSlot {
  id: string
  doctor_id: string
  slot_time: string
  slot_date: string | null
  is_booked: boolean
  is_active: boolean
  created_at: string
  doctors?: Pick<Doctor, 'full_name'> | null
}

// ─── Logistics ──────────────────────────────────────────────────────────────

export interface DeliveryPartner {
  id: string
  name: string
  contact_person: string | null
  phone: string | null
  email: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface DeliveryAgent {
  id: string
  partner_id: string
  full_name: string
  phone: string | null
  vehicle_type: string | null
  vehicle_number: string | null
  is_active: boolean
  is_available: boolean
  current_location: string | null
  created_at: string
  updated_at: string
  delivery_partners?: Pick<DeliveryPartner, 'name'> | null
}

export interface DeliveryOrder {
  id: string
  order_id: string | null
  booking_id: string | null
  agent_id: string | null
  tracking_number: string | null
  status: string
  pickup_address: string | null
  delivery_address: string | null
  estimated_delivery: string | null
  actual_delivery: string | null
  created_at: string
  updated_at: string
}

export interface DeliveryTracking {
  id: string
  delivery_order_id: string
  status: string
  location: string | null
  notes: string | null
  updated_at: string
  delivery_orders?: Pick<DeliveryOrder, 'tracking_number'> | null
}

// ─── Finance ────────────────────────────────────────────────────────────────

export interface PartnerCommission {
  id: string
  partner_id: string | null
  order_id: string | null
  amount: number
  commission_rate: number | null
  status: string
  created_at: string
  updated_at: string
}

export interface VendorSettlement {
  id: string
  vendor_id: string
  amount: number
  status: string
  settlement_date: string | null
  reference_number: string | null
  bank_details: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface PartnerPayout {
  id: string
  partner_id: string
  amount: number
  status: string
  payout_date: string | null
  reference_number: string | null
  created_at: string
  updated_at: string
}

export interface CommissionTransaction {
  id: string
  commission_id: string | null
  type: string
  amount: number
  description: string | null
  created_at: string
}

// ─── Marketing ──────────────────────────────────────────────────────────────

export interface Coupon {
  id: string
  code: string
  title: string | null
  description: string | null
  discount_type: string
  discount_value: number
  min_order_amount: number | null
  max_discount: number | null
  usage_limit: number | null
  used_count: number
  valid_from: string | null
  valid_until: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Campaign {
  id: string
  name: string
  description: string | null
  type: string | null
  status: string
  start_date: string | null
  end_date: string | null
  budget: number | null
  target_audience: string | null
  created_at: string
  updated_at: string
}

export interface CustomerSegment {
  id: string
  name: string
  description: string | null
  criteria: string | null
  customer_count: number | null
  created_at: string
  updated_at: string
}

export interface AbandonedCart {
  id: string
  user_id: string
  cart_items: unknown
  total_amount: number | null
  recovery_status: string | null
  last_reminder_at: string | null
  created_at: string
  updated_at: string
}

export interface CouponRedemption {
  id: string
  coupon_id: string
  user_id: string
  order_id: string | null
  discount_amount: number
  redeemed_at: string
}

// ─── Analytics ──────────────────────────────────────────────────────────────

export interface DailyRevenue {
  id: string
  day: string
  revenue: number
  transactions: number
  created_at: string
}

export interface MonthlyRevenue {
  id: string
  month: string
  revenue: number
  transactions: number
  created_at: string
}

export interface ModuleRevenue {
  id: string
  module: string
  revenue: number
  total_revenue: number
  total_transactions: number
  percentage: number | null
}

export interface VendorRevenueSummary {
  vendor_id: string
  total_transactions: number
  total_revenue: number
  vendor_earnings: number
  platform_commission: number
  // Supabase joins return arrays; the dashboard accesses `.full_name` via optional chaining
  users?: { full_name: string; email: string } | { full_name: string; email: string }[] | null
}

export interface CustomerLtv {
  id: string
  user_id: string
  total_spent: number
  total_orders: number
  first_order_at: string | null
  last_order_at: string | null
  ltv_score: number | null
}

export interface SalesFunnelEvent {
  id: string
  event_type: string
  user_id: string | null
  session_id: string | null
  metadata: unknown
  created_at: string
}

// ─── Audit ──────────────────────────────────────────────────────────────────

export interface AuditLog {
  id: string
  table_name: string
  record_id: string | null
  action: string
  old_data: unknown
  new_data: unknown
  performed_by: string | null
  created_at: string
}

export interface AdminActivityLog {
  id: string
  admin_id: string
  action: string
  resource_type: string | null
  resource_id: string | null
  details: string | null
  ip_address: string | null
  created_at: string
}

export interface SecurityEvent {
  id: string
  event_type: string
  user_id: string | null
  ip_address: string | null
  user_agent: string | null
  details: string | null
  severity: string
  created_at: string
}

export interface LoginAttempt {
  id: string
  user_id: string | null
  email: string | null
  ip_address: string | null
  success: boolean
  failure_reason: string | null
  attempted_at: string
}

export interface SystemAlert {
  id: string
  title: string
  message: string | null
  severity: string
  source: string | null
  is_resolved: boolean
  resolved_at: string | null
  created_at: string
}

// ─── Locations ──────────────────────────────────────────────────────────────

export interface City {
  id: string
  city_name: string
  state: string | null
  is_active: boolean
  created_at: string
}

export interface Pincode {
  id: string
  pincode: string
  city_id: string
  area_name: string | null
  is_serviceable: boolean
  created_at: string
  cities?: Pick<City, 'city_name'> | null
}

export interface ServiceModule {
  id: string
  module_name: string
  description: string | null
  is_active: boolean
  created_at: string
}

// ─── Inventory ──────────────────────────────────────────────────────────────

export interface VendorInventory {
  id: string
  vendor_id: string
  product_id: string | null
  quantity: number
  reorder_level: number | null
  last_restocked: string | null
  created_at: string
  updated_at: string
}

export interface StockAlert {
  id: string
  inventory_id: string
  alert_type: string
  message: string | null
  is_resolved: boolean
  created_at: string
  inventory?: { vendor_id: string; product_id: string | null } | null
}

// ─── Notifications ──────────────────────────────────────────────────────────

export interface NotificationLog {
  id: string
  user_id: string | null
  type: string
  channel: string | null
  title: string | null
  body: string | null
  status: string
  sent_at: string | null
  created_at: string
}

export interface NotificationTemplate {
  id: string
  name: string
  type: string
  channel: string | null
  subject: string | null
  body_template: string
  variables: unknown
  is_active: boolean
  created_at: string
  updated_at: string
}
