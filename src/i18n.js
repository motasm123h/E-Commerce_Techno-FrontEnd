import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
    en: {
        translation: {
            "search_placeholder": "Search high-end components...",
            "add_to_cart": "Add to Cart",
            "view_cart": "View Cart",
            "total_cost": "Total Cost",
            "pc_builder": "Build Your PC",
            "catalog": "Catalog logs",
            "track_order": "Track Order",
            "about_us": "About Us",
            "contact_us": "Contact Us",
            "home": "Home",
            "products": "Products",
            "navigate": "Navigate",
            "categories": "Categories",
            "top": "Top",
            "sold_out": "Out Of Stock",
            "cart_empty_title": "Your cart is empty",
            "cart_empty_desc": "No hardware logged inside this session container.",
            "continue_shopping": "Continue Shopping",
            "th_component": "Component",
            "th_specs": "Specs Name",
            "th_unit": "Unit",
            "th_quantity": "Quantity",
            "th_subtotal": "Subtotal",
            "rec_title": "Complete your battle station",
            "rec_empty": "No setup items optimized at this interval.",
            "summary_title": "Order Summary",
            "summary_subtotal": "Subtotal Matrix",
            "summary_total": "Total Build Price",
            "checkout_btn": "Proceed to Checkout",
            // عبارات صفحة الـ Checkout والـ MiniCart الجديدة
            "order_confirmed": "Order Confirmed",
            "trans_success": "Transaction Successful",
            "tracking_code_title": "Your Tracking Code",
            "safeguard_token": "Please safeguard this invoice token to monitor delivery routing.",
            "track_status_btn": "Track Order Status",
            "checkout_unavailable": "Checkout Unavailable",
            "cart_repo_empty": "Your cart repository is empty",
            "return_store": "Return To Storefront",
            "account_details": "Account Details",
            "billing_details": "Billing Details",
            "label_phone": "Phone",
            "label_first_name": "First Name",
            "label_last_name": "Last Name",
            "label_area": "Area OR Region Name",
            "label_city": "City",
            "label_order_note": "Order Note",
            "placeholder_note": "Special note for delivery",
            "label_payment_method": "Payment Method",
            "label_shipping_zone": "Shipping Zone",
            "cod_option": "Cash on Delivery (COD)",
            "haram_option": "Al-Haram Transfer",
            "loading_zones": "Loading zones...",
            "select_zone_placeholder": "Select Shipping Zone",
            "shipping_cost": "Shipping Cost",
            "calc_shipping": "Calculating...",
            "agree_terms": "I agree to the Terms & Conditions",
            "place_order_btn": "Place Order",
            "processing_trans": "Processing Transaction...",
            "mini_cart_empty": "Your cart is currently empty.",
            "mini_cart_subtotal": "Subtotal",
            "mini_cart_checkout": "Checkout",
            "err_select_zone": "Please select a valid shipping zone."
        }
    },
    ar: {
        translation: {
            "search_placeholder": "ابحث عن القطع الاحترافية...",
            "add_to_cart": "أضف إلى السلة",
            "view_cart": "عرض السلة",
            "total_cost": "التكلفة الإجمالية",
            "pc_builder": "جمّع حاسوبك",
            "catalog": "كتالوج المنتجات",
            "track_order": "تتبع الطلب",
            "about_us": "من نحن",
            "contact_us": "اتصل بنا",
            "home": "الصفحة الاساسية",
            "products": "المنتجات",
            "navigate": "انتقل الى",
            "categories": "التصنيفات",
            "top": "اعلى",
            "sold_out": "نفدت",
            "cart_empty_title": "سلة المشتريات فارغة",
            "cart_empty_desc": "لم يتم تسجيل أي قطع هاردوير داخل جلسة التصفح الحالية.",
            "continue_shopping": "متابعة التسوق",
            "th_component": "القطعة",
            "th_specs": "اسم المنتج",
            "th_unit": "سعر الوحدة",
            "th_quantity": "الكمية",
            "th_subtotal": "المجموع",
            "rec_title": "أكمل عتاد صندوقك الاحترافي",
            "rec_empty": "لا توجد قطع تجميعية مقترحة حالياً.",
            "summary_title": "ملخص الطلب",
            "summary_subtotal": "مجموع القطع",
            "summary_total": "التكلفة الإجمالية للملف",
            "checkout_btn": "الانتقال لإتمام الشراء",
            // عبارات صفحة الـ Checkout والـ MiniCart الجديدة
            "order_confirmed": "تم تأكيد طلبك بنجاح",
            "trans_success": "عملية برمجية ناجحة",
            "tracking_code_title": "كود تتبع الشحنة الخاص بك",
            "safeguard_token": "يرجى الاحتفاظ برمز الفاتورة هذا لمراقبة مسار التوصيل والوصول التلقائي.",
            "track_status_btn": "تتبع حالة شحنتك الآن",
            "checkout_unavailable": "إتمام الشراء غير متاح",
            "cart_repo_empty": "مستودع عربة المشتريات لديك فارغ تماماً",
            "return_store": "العودة إلى المتجر الرئيسي",
            "account_details": "بيانات الحساب والطلب",
            "billing_details": "تفاصيل الفاتورة والشحن",
            "label_phone": "رقم الهاتف",
            "label_first_name": "الاسم الأول",
            "label_last_name": "الكنية / اسم العائلة",
            "label_area": "المنطقة / الحي / اسم الشارع بالتفصيل",
            "label_city": "المدينة / المحافظة",
            "label_order_note": "ملاحظات إضافية مع الطلب",
            "placeholder_note": "اكتب هنا أي ملاحظة خاصة لتسهيل عملية التوصيل...",
            "label_payment_method": "طريقة الدفع المعتمدة",
            "label_shipping_zone": "مركز شحن المحافظات المستهدف",
            "cod_option": "الدفع عند الاستلام داخل سوريا (COD)",
            "haram_option": "حوالة عبر شركة الهرم",
            "loading_zones": "جاري تحميل مراكز الشحن وسيرفرات التوصيل...",
            "select_zone_placeholder": "اختر مركز الشحن التابع لمحافظتك",
            "shipping_cost": "تكلفة الشحن والتوصيل",
            "calc_shipping": "جاري احتساب المسار...",
            "agree_terms": "أوافق تماماً على كافة الشروط والأحكام الخاصة بالمتجر",
            "place_order_btn": "تأكيد الطلب وشراء العتاد",
            "processing_trans": "جاري معالجة المعاملة وحجز المخزون الحركي...",
            "mini_cart_empty": "عربة المشتريات فارغة حالياً.",
            "mini_cart_subtotal": "المجموع الفرعي",
            "mini_cart_checkout": "إتمام الشراء",
            "err_select_zone": "يرجى اختيار مركز شحن صحيح وفعال لمتابعة العملية."
        }
    }
};

i18n
    .use(LanguageDetector) 
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false
        }
    });

i18n.on('languageChanged', (lng) => {
    document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lng;
});

export default i18n;