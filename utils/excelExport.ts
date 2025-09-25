import * as XLSX from 'xlsx'

export interface ExportData {
  [key: string]: any
}

export interface ExportColumn {
  key: string
  label: string
  formatter?: (value: any) => string
}

/**
 * تصدير البيانات إلى ملف Excel
 * @param data البيانات المراد تصديرها
 * @param columns تعريف الأعمدة
 * @param filename اسم الملف
 */
export function exportToExcel(
  data: ExportData[],
  columns: ExportColumn[],
  filename: string = 'export.xlsx'
) {
  try {
    // تحويل البيانات إلى تنسيق Excel
    const worksheetData = data.map(item => {
      const row: { [key: string]: any } = {}
      columns.forEach(column => {
        const value = item[column.key]
        row[column.label] = column.formatter ? column.formatter(value) : value
      })
      return row
    })

    // إنشاء ورقة العمل
    const worksheet = XLSX.utils.json_to_sheet(worksheetData)
    
    // إنشاء المصنف
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')

    // تحميل الملف
    XLSX.writeFile(workbook, filename)
    
    return true
  } catch (error) {
    console.error('خطأ في تصدير البيانات:', error)
    return false
  }
}

/**
 * تصدير الحجوزات إلى Excel
 */
export function exportBookingsToExcel(bookings: any[]) {
  const columns: ExportColumn[] = [
    { key: 'booking_number', label: 'رقم الحجز' },
    { key: 'customer_name', label: 'اسم العميل' },
    { key: 'customer_email', label: 'البريد الإلكتروني' },
    { key: 'customer_phone', label: 'رقم الهاتف' },
    { key: 'package_title', label: 'اسم الباقة' },
    { key: 'travel_date', label: 'تاريخ السفر' },
    { key: 'return_date', label: 'تاريخ العودة' },
    { key: 'adults', label: 'عدد البالغين' },
    { key: 'children', label: 'عدد الأطفال' },
    { key: 'status', label: 'حالة الحجز', formatter: (value) => getBookingStatusName(value) },
    { key: 'payment_status', label: 'حالة الدفع', formatter: (value) => getPaymentStatusName(value) },
    { key: 'total_amount', label: 'المبلغ الإجمالي', formatter: (value) => formatPrice(value) },
    { key: 'currency', label: 'العملة' },
    { key: 'created_at', label: 'تاريخ الحجز', formatter: (value) => formatDate(value) }
  ]

  const filename = `حجوزات_${new Date().toISOString().split('T')[0]}.xlsx`
  return exportToExcel(bookings, columns, filename)
}

/**
 * تصدير الباقات إلى Excel
 */
export function exportPackagesToExcel(packages: any[]) {
  const columns: ExportColumn[] = [
    { key: 'title_ar', label: 'العنوان (عربي)' },
    { key: 'title_en', label: 'العنوان (إنجليزي)' },
    { key: 'description_ar', label: 'الوصف (عربي)' },
    { key: 'price', label: 'السعر', formatter: (value) => formatPrice(value) },
    { key: 'duration_days', label: 'المدة (أيام)' },
    { key: 'travel_period', label: 'الوجهة' },
    { key: 'category', label: 'الفئة', formatter: (value) => getCategoryName(value) },
    { key: 'status', label: 'الحالة', formatter: (value) => getPackageStatusName(value) },
    { key: 'featured', label: 'مميزة', formatter: (value) => value ? 'نعم' : 'لا' },
    { key: 'created_at', label: 'تاريخ الإنشاء', formatter: (value) => formatDate(value) }
  ]

  const filename = `حزم_${new Date().toISOString().split('T')[0]}.xlsx`
  return exportToExcel(packages, columns, filename)
}

/**
 * تصدير الوجهات إلى Excel
 */
export function exportDestinationsToExcel(destinations: any[]) {
  const columns: ExportColumn[] = [
    { key: 'name_ar', label: 'الاسم (عربي)' },
    { key: 'name_en', label: 'الاسم (إنجليزي)' },
    { key: 'description_ar', label: 'الوصف (عربي)' },
    { key: 'country', label: 'البلد' },
    { key: 'city', label: 'المدينة' },
    { key: 'region', label: 'المنطقة' },
    { key: 'type', label: 'النوع', formatter: (value) => getDestinationTypeName(value) },
    { key: 'status', label: 'الحالة', formatter: (value) => getDestinationStatusName(value) },
    { key: 'is_featured', label: 'مميزة', formatter: (value) => value ? 'نعم' : 'لا' },
    { key: 'created_at', label: 'تاريخ الإنشاء', formatter: (value) => formatDate(value) }
  ]

  const filename = `وجهات_${new Date().toISOString().split('T')[0]}.xlsx`
  return exportToExcel(destinations, columns, filename)
}

/**
 * تصدير المستخدمين إلى Excel
 */
export function exportUsersToExcel(users: any[]) {
  const columns: ExportColumn[] = [
    { key: 'full_name', label: 'الاسم الكامل' },
    { key: 'email', label: 'البريد الإلكتروني' },
    { key: 'phone', label: 'رقم الهاتف' },
    { key: 'role', label: 'الدور', formatter: (value) => getRoleName(value) },
    { key: 'status', label: 'الحالة', formatter: (value) => getUserStatusName(value) },
    { key: 'city', label: 'المدينة' },
    { key: 'country', label: 'البلد' },
    { key: 'created_at', label: 'تاريخ الإنشاء', formatter: (value) => formatDate(value) }
  ]

  const filename = `مستخدمين_${new Date().toISOString().split('T')[0]}.xlsx`
  return exportToExcel(users, columns, filename)
}

// دوال المساعدة
function formatPrice(price: number): string {
  if (!price) return '0.00 ر.س'
  return new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: 'SAR'
  }).format(price)
}

function formatDate(dateString: string): string {
  if (!dateString) return 'غير محدد'
  const date = new Date(dateString)
  return date.toLocaleDateString('ar-SA')
}

function getBookingStatusName(status: string): string {
  const statuses: { [key: string]: string } = {
    confirmed: 'مؤكدة',
    pending: 'في الانتظار',
    cancelled: 'ملغية',
    completed: 'مكتملة'
  }
  return statuses[status] || status
}

function getPaymentStatusName(status: string): string {
  const statuses: { [key: string]: string } = {
    paid: 'مدفوع',
    partial: 'مدفوع جزئياً',
    pending: 'في الانتظار',
    refunded: 'مسترد'
  }
  return statuses[status] || status
}

function getCategoryName(category: string): string {
  const categories: { [key: string]: string } = {
    domestic: 'محلي',
    international: 'دولي',
    religious: 'ديني',
    adventure: 'مغامرة',
    cultural: 'ثقافي'
  }
  return categories[category] || category
}

function getPackageStatusName(status: string): string {
  const statuses: { [key: string]: string } = {
    active: 'نشط',
    inactive: 'غير نشط',
    draft: 'مسودة'
  }
  return statuses[status] || status
}

function getDestinationTypeName(type: string): string {
  const types: { [key: string]: string } = {
    city: 'مدينة',
    landmark: 'معلم تاريخي',
    nature: 'طبيعة',
    beach: 'شاطئ',
    mountain: 'جبل'
  }
  return types[type] || type
}

function getDestinationStatusName(status: string): string {
  const statuses: { [key: string]: string } = {
    active: 'نشط',
    inactive: 'غير نشط',
    draft: 'مسودة'
  }
  return statuses[status] || status
}

function getRoleName(role: string): string {
  const roles: { [key: string]: string } = {
    admin: 'مدير',
    moderator: 'مشرف',
    user: 'مستخدم'
  }
  return roles[role] || role
}

function getUserStatusName(status: string): string {
  const statuses: { [key: string]: string } = {
    active: 'نشط',
    inactive: 'غير نشط',
    suspended: 'معلق'
  }
  return statuses[status] || status
}
