/* Baskery: menu, cart and WhatsApp ordering. Prices and stock come from /data/menu.json. */
(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const reduceMotion = () => window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const storage = kind => ({
    get(k, d) { try { const v = window[kind].getItem(k); return v ? JSON.parse(v) : d; } catch (_) { return d; } },
    set(k, v) { try { window[kind].setItem(k, JSON.stringify(v)); } catch (_) {} },
    del(k) { try { window[kind].removeItem(k); } catch (_) {} }
  });
  const local = storage('localStorage'), session = storage('sessionStorage');

  const T = {
    en: {
      docTitle: 'Baskery · Fresh cookies & brownies, order on WhatsApp',
      skip: 'Skip to the menu', homeLabel: 'Baskery, back to top', sectionsLabel: 'Sections',
      navMenu: 'Menu', navBoxes: 'Boxes', navEvents: 'Events', navFaq: 'FAQ',
      heroTitle: 'Baked to make you smile',
      heroSub: 'Fresh cookies and brownies, baked for your order. Pick what you like and send the order on WhatsApp.',
      orderNow: 'Order now', chatUs: 'Chat on WhatsApp',
      heroAlt: 'A Baskery cookie broken in half with melted caramel inside',
      aheadTitle: "Order a day ahead, so it's baked fresh for you.",
      aheadText: 'Items marked "In stock today" can come today.',
      menuTitle: 'Menu', menuSub: 'Prices in EGP. Every cookie comes in white, milk or dark chocolate.',
      categories: 'Categories', loading: 'Loading the menu…',
      loadError: "The menu didn't load. Check your connection and try again, or order directly on WhatsApp.", retry: 'Try again',
      dealBadge: 'Box deal', dealTitle: 'Boxes cost less than singles',
      dealText: 'Boxes of 4, 6 or 12. Save up to 60 EGP on a box of 12, for cookies and brownies.',
      dealCookie: 'Build a cookie box', dealBrownie: 'Brownie box',
      howTitle: 'How to order',
      how1: 'Pick your cookies or brownies', how1t: 'Choose the size, the chocolate and how many.',
      how2: 'Add your details', how2t: 'Name, phone, address, and the day that suits you.',
      how3: 'Send it on WhatsApp', how3t: 'Your order opens in WhatsApp, ready to send. We reply to confirm the delivery fee and time.',
      eventsTitle: 'Parties & events', eventsText: 'Custom cookie and brownie trays for birthdays, offices and holidays, like our Halloween table.',
      eventsAlt: 'A Baskery Halloween table with ghost cookies, brownies and wrapped cookies', askUs: 'Ask us on WhatsApp',
      storyTitle: 'Freshly made with love',
      storyText: "We bake in small batches, so every cookie is soft, fresh and made for your order. That's why we ask you to order a day ahead.",
      faqTitle: 'Questions',
      q1: 'How far ahead should I order?', a1: 'At least a day ahead, so we can bake it fresh for you. If something is marked "In stock today", you can order it for today.',
      q2: 'How much is delivery?', a2: 'It depends on your area. We confirm the delivery fee on WhatsApp before we bake.',
      q3: 'How do I pay?', a3: 'You choose how to pay when you order, and we confirm it on WhatsApp.',
      q4: 'Can I choose the chocolate?', a4: 'Yes. Every cookie and cookie box comes in white, milk or dark chocolate.',
      q5: 'Do you take custom orders?', a5: 'Yes, for parties, offices and holidays. Send us the date and the quantity on WhatsApp.',
      footOrders: 'Orders on WhatsApp:',
      helloMsg: 'Hi Baskery!', eventMsg: "Hi Baskery! I'd like to ask about a custom order for an event.",
      cat_all: 'All', from: 'from', priceSoon: 'Price soon', askPrice: 'Ask for price',
      b_best: 'Best seller', b_save: 'Save up to 60', b_season: 'Limited', b_today: 'In stock today',
      size: 'Size', chocolate: 'Chocolate', white: 'White', milk: 'Milk', dark: 'Dark',
      whiteFull: 'White chocolate', milkFull: 'Milk chocolate', darkFull: 'Dark chocolate',
      pieces: 'Box size', pcs: 'pcs', g: 'g', save: 'Save', qty: 'Quantity', addToCart: 'Add to cart', added: 'Added to cart', close: 'Close',
      todayNote: 'In stock today: you can order this for today.',
      waitingPrice: "We're still setting the price for this one. Ask us on WhatsApp and we'll tell you.",
      askMsg: n => `Hi Baskery! I'd like to ask about: ${n}`,
      viewCart: 'View cart', items: n => n === 1 ? '1 item' : `${n} items`,
      cartLabel: n => n ? `Cart, ${n === 1 ? '1 item' : `${n} items`}` : 'Cart',
      cart: 'Your cart', emptyT: 'Your cart is empty', emptyP: 'Add a cookie or two and they will show up here.', seeMenu: 'See the menu',
      subtotal: 'Subtotal', deliveryFee: 'Delivery fee', total: 'Total', confirmOnChat: 'confirmed on WhatsApp', addMore: 'Add more items', cont: 'Continue',
      boxTip: 'Tip: boxes cost less than singles.',
      switchT: (n, s) => `Make ${n} of these a box of ${n} and save ${s}.`, switchBtn: 'Switch', switched: s => `Switched to a box. You saved ${s}.`,
      minOrder: m => `The minimum order is ${m}.`, fewer: 'Fewer', more: 'More',
      details: 'Your details', step: n => `Step ${n} of 3`, name: 'Name', phone: 'Phone', method: 'Delivery or pickup',
      deliveryOpt: 'Delivery', pickupOpt: 'Pickup', area: 'Area', chooseArea: 'Choose your area', address: 'Address',
      areaPh: 'e.g. Maadi', addressPh: 'Street, building, floor, apartment',
      pickupNote: 'We send the pickup address in the chat.',
      when: 'Day', today: 'Today', tomorrow: 'Tomorrow', later: 'Pick a date', dateLabel: 'Date',
      todayOff: 'Orders are baked fresh, so the earliest day is tomorrow. "Today" opens when everything in your cart is In stock today.',
      time: 'Time', morning: 'Morning', afternoon: 'Afternoon', evening: 'Evening',
      payment: 'Payment', cash: 'Cash on delivery', instapay: 'InstaPay', vodafone: 'Vodafone Cash',
      notes: 'Notes (optional)', notesShort: 'Notes', notesPh: 'Gift message, allergies, best time to call…',
      remember: 'We keep your details on this phone, so your next order is faster.',
      review: 'Review order',
      errName: 'Add your name.', errPhone: 'Add a phone number with at least 10 digits.', errAddress: 'Add the delivery address.',
      errArea: 'Choose your area.', errDate: 'Pick a date.',
      reviewT: 'Check your order', reviewP: 'This is the message Baskery receives. Tap the green button, then press Send in WhatsApp.',
      sendWA: 'Send order on WhatsApp', copy: 'Copy message', copied: 'Copied', copyFail: 'Select the message and copy it',
      sentT: 'Almost done!', sentP: 'Press Send in WhatsApp. We reply to confirm the delivery fee and time.',
      again: 'Open WhatsApp again', newOrder: 'Back to menu', order: 'Order',
      msgHi: "Hi Baskery! 🍪 I'd like to order:", msgPickup: 'I will pick it up',
      back: 'Back', lang: 'عربي'
    },
    ar: {
      docTitle: 'Baskery · كوكيز وبراونيز طازة، اطلب على واتساب',
      skip: 'انتقل للمنيو', homeLabel: 'Baskery، ارجع لأول الصفحة', sectionsLabel: 'الأقسام',
      navMenu: 'المنيو', navBoxes: 'البوكسات', navEvents: 'المناسبات', navFaq: 'أسئلة',
      heroTitle: 'مخبوزة عشان تفرّحك',
      heroSub: 'كوكيز وبراونيز طازة، بنخبزها مخصوص لطلبك. اختار اللي يعجبك وابعت الطلب على واتساب.',
      orderNow: 'اطلب دلوقتي', chatUs: 'كلّمنا على واتساب',
      heroAlt: 'كوكي من Baskery مقسومة نصين وجواها كراميل سايح',
      aheadTitle: 'اطلب قبلها بيوم عشان نخبزهالك طازة.',
      aheadText: 'المنتجات المكتوب عليها «متاح النهارده» ممكن توصلك النهارده.',
      menuTitle: 'المنيو', menuSub: 'الأسعار بالجنيه. كل الكوكيز متاحة بشوكولاتة وايت أو ميلك أو دارك.',
      categories: 'الأقسام', loading: 'المنيو بيحمّل…',
      loadError: 'المنيو محمّلش. اتأكد من النت وجرب تاني، أو اطلب على واتساب على طول.', retry: 'جرب تاني',
      dealBadge: 'عرض البوكس', dealTitle: 'البوكس أوفر من القطع لوحدها',
      dealText: 'بوكس 4 أو 6 أو 12. وفّر لحد 60 ج.م في بوكس الـ12، للكوكيز والبراونيز.',
      dealCookie: 'جهّز بوكس كوكيز', dealBrownie: 'بوكس براونيز',
      howTitle: 'إزاي تطلب',
      how1: 'اختار الكوكيز أو البراونيز', how1t: 'اختار الحجم والشوكولاتة والعدد.',
      how2: 'اكتب بياناتك', how2t: 'الاسم والموبايل والعنوان واليوم اللي يناسبك.',
      how3: 'ابعته على واتساب', how3t: 'طلبك هيفتح في واتساب جاهز للإرسال، وهنرد نأكد مصاريف التوصيل والميعاد.',
      eventsTitle: 'حفلات ومناسبات', eventsText: 'صواني كوكيز وبراونيز مخصوص لأعياد الميلاد والشركات والمناسبات، زي ترابيزة الهالوين بتاعتنا.',
      eventsAlt: 'ترابيزة هالوين من Baskery عليها كوكيز وبراونيز بأشباح وكوكيز متغلفة', askUs: 'اسألنا على واتساب',
      storyTitle: 'معمولة طازة بحب',
      storyText: 'بنخبز بكميات صغيرة عشان كل كوكي تبقى طرية وطازة ومعمولة مخصوص لطلبك. عشان كده بنطلب إن الأوردر يتعمل قبلها بيوم.',
      faqTitle: 'أسئلة',
      q1: 'أطلب قبلها بقد إيه؟', a1: 'قبلها بيوم على الأقل عشان نخبزهالك طازة. لو المنتج مكتوب عليه «متاح النهارده» تقدر تطلبه لنفس اليوم.',
      q2: 'التوصيل بكام؟', a2: 'على حسب منطقتك. بنأكد مصاريف التوصيل على واتساب قبل ما نخبز.',
      q3: 'أدفع إزاي؟', a3: 'بتختار طريقة الدفع وقت الطلب، وبنأكدها على واتساب.',
      q4: 'أقدر أختار نوع الشوكولاتة؟', a4: 'أيوه. كل الكوكيز وبوكسات الكوكيز متاحة بشوكولاتة وايت أو ميلك أو دارك.',
      q5: 'بتعملوا طلبات خاصة؟', a5: 'أيوه، للحفلات والشركات والمناسبات. ابعتلنا التاريخ والعدد على واتساب.',
      footOrders: 'الطلبات على واتساب:',
      helloMsg: 'أهلاً Baskery!', eventMsg: 'أهلاً Baskery! عندي استفسار عن طلب خاص لمناسبة.',
      cat_all: 'الكل', from: 'من', priceSoon: 'السعر قريبًا', askPrice: 'اسأل عن السعر',
      b_best: 'الأشهر', b_save: 'وفّر لحد 60', b_season: 'لفترة محدودة', b_today: 'متاح النهارده',
      size: 'الحجم', chocolate: 'الشوكولاتة', white: 'وايت', milk: 'ميلك', dark: 'دارك',
      whiteFull: 'شوكولاتة وايت', milkFull: 'شوكولاتة ميلك', darkFull: 'شوكولاتة دارك',
      pieces: 'عدد القطع', pcs: 'قطع', g: ' جم', save: 'وفّر', qty: 'الكمية', addToCart: 'أضف للسلة', added: 'اتضاف للسلة', close: 'إغلاق',
      todayNote: 'متاح النهارده: تقدر تطلبه لنفس اليوم.',
      waitingPrice: 'لسه بنحدد سعر المنتج ده. اسألنا على واتساب وهنقولك.',
      askMsg: n => `أهلاً Baskery! عندي استفسار عن: ${n}`,
      viewCart: 'عرض السلة', items: n => n === 1 ? 'منتج واحد' : n === 2 ? 'منتجين' : n <= 10 ? `${n} منتجات` : `${n} منتج`,
      cartLabel: n => n ? `السلة، ${n === 1 ? 'منتج واحد' : n === 2 ? 'منتجين' : n <= 10 ? `${n} منتجات` : `${n} منتج`}` : 'السلة',
      cart: 'سلتك', emptyT: 'سلتك فاضية', emptyP: 'ضيف كوكي أو اتنين وهتلاقيهم هنا.', seeMenu: 'شوف المنيو',
      subtotal: 'المجموع', deliveryFee: 'مصاريف التوصيل', total: 'الإجمالي', confirmOnChat: 'بتتأكد على واتساب', addMore: 'ضيف حاجة كمان', cont: 'كمّل',
      boxTip: 'نصيحة: البوكس أوفر من القطع لوحدها.',
      switchT: (n, s) => `حوّل ${n} منهم لبوكس ${n} ووفّر ${s}.`, switchBtn: 'حوّل', switched: s => `اتحولوا لبوكس. وفّرت ${s}.`,
      minOrder: m => `أقل طلب ${m}.`, fewer: 'أقل', more: 'أكتر',
      details: 'بياناتك', step: n => `خطوة ${n} من 3`, name: 'الاسم', phone: 'رقم الموبايل', method: 'توصيل ولا استلام',
      deliveryOpt: 'توصيل', pickupOpt: 'استلام', area: 'المنطقة', chooseArea: 'اختار منطقتك', address: 'العنوان',
      areaPh: 'مثلاً: المعادي', addressPh: 'الشارع، العمارة، الدور، الشقة',
      pickupNote: 'هنبعتلك عنوان الاستلام في الشات.',
      when: 'اليوم', today: 'النهارده', tomorrow: 'بكرة', later: 'اختار يوم', dateLabel: 'التاريخ',
      todayOff: 'بنخبز كل طلب طازة، فأقرب ميعاد بكرة. «النهارده» بيتفتح لو كل اللي في السلة متاح النهارده.',
      time: 'الوقت', morning: 'الصبح', afternoon: 'بعد الضهر', evening: 'بالليل',
      payment: 'طريقة الدفع', cash: 'كاش عند الاستلام', instapay: 'إنستاباي', vodafone: 'فودافون كاش',
      notes: 'ملاحظات (اختياري)', notesShort: 'ملاحظات', notesPh: 'رسالة هدية، حساسية من أكل، ميعاد مناسب…',
      remember: 'بنحفظ بياناتك على الموبايل ده عشان الطلب الجاي يبقى أسرع.',
      review: 'راجع الطلب',
      errName: 'اكتب اسمك.', errPhone: 'اكتب رقم موبايل 10 أرقام على الأقل.', errAddress: 'اكتب عنوان التوصيل.',
      errArea: 'اختار منطقتك.', errDate: 'اختار يوم.',
      reviewT: 'راجع طلبك', reviewP: 'دي الرسالة اللي هتوصل Baskery. دوس على الزرار الأخضر، وبعدين دوس إرسال في واتساب.',
      sendWA: 'ابعت الطلب على واتساب', copy: 'انسخ الرسالة', copied: 'اتنسخت', copyFail: 'حدد الرسالة وانسخها',
      sentT: 'خلاص تقريبًا!', sentP: 'دوس إرسال في واتساب، وهنرد عليك نأكد مصاريف التوصيل والميعاد.',
      again: 'افتح واتساب تاني', newOrder: 'ارجع للمنيو', order: 'طلب رقم',
      msgHi: 'أهلاً Baskery! 🍪 ممكن أطلب:', msgPickup: 'هستلم بنفسي',
      back: 'رجوع', lang: 'EN'
    }
  };

  const ICON = {
    back: '<svg class="flip" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>',
    close: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    wa: '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><use href="#i-wa"/></svg>',
    wink: '<svg class="wink" viewBox="0 0 64 44" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" aria-hidden="true"><path d="M20 8v7"/><path d="M38 13q6-7 12 0"/><path d="M12 25q20 20 40 0"/></svg>',
    winkAnim: '<svg class="wink wink-anim" viewBox="0 0 64 44" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" aria-hidden="true"><path d="M20 8v7"/><path class="eye-open" d="M44 8v7"/><path class="eye-wink" d="M38 13q6-7 12 0"/><path class="mouth" d="M12 25q20 20 40 0"/></svg>'
  };
  const CHOC_SWATCH = { white: '#F3E9D8', milk: '#8A5A3B', dark: '#3B1F14' };
  const DOTS = [16, 20, 24];
  const FLOW = ['cart', 'details', 'review', 'sent'];
  const KEYS = { cart: 'baskery-cart', details: 'baskery-details', lang: 'baskery-lang', orderNo: 'baskery-order-no', lastMsg: 'baskery-last-message' };

  // ---------- state ----------
  const blankForm = () => ({ name: '', phone: '', method: 'delivery', area: '', address: '', day: 'tomorrow', date: '', slot: '', pay: '', notes: '' });
  const savedDetails = local.get(KEYS.details, {});
  const state = {
    lang: local.get(KEYS.lang, null) || ((navigator.language || '').toLowerCase().startsWith('ar') ? 'ar' : 'en'),
    menu: null, P: {}, cat: 'all', route: null,
    cart: local.get(KEYS.cart, []),
    form: Object.assign(blankForm(), savedDetails, { day: 'tomorrow', date: '', notes: '' }),
    errors: {}, sheet: null, sheetEnter: false, sheetTrigger: null, bump: false, copied: ''
  };

  // ---------- text, money, dates ----------
  const tr = (lang, k, ...a) => { const v = T[lang][k]; return typeof v === 'function' ? v(...a) : (v ?? k); };
  const t = (k, ...a) => tr(state.lang, k, ...a);
  const moneyIn = (lang, n) => lang === 'ar' ? `${n} ج.م` : `${n} EGP`;
  const money = n => moneyIn(state.lang, n);
  const S = () => (state.menu && state.menu.settings) || {};
  const waLink = text => `https://wa.me/${S().whatsappNumber || '201154948726'}?text=${encodeURIComponent(text)}`;
  const fmtWA = text => esc(text).replace(/\*([^*\n]+)\*/g, '<b>$1</b>');
  const normDigits = s => String(s).replace(/[٠-٩]/g, d => String(d.charCodeAt(0) - 1632)).replace(/[۰-۹]/g, d => String(d.charCodeAt(0) - 1776));
  const pad = n => String(n).padStart(2, '0');
  const ymd = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
  const fmtDate = (d, lang) => new Intl.DateTimeFormat(lang === 'ar' ? 'ar-EG' : 'en-GB', { weekday: 'short', day: 'numeric', month: 'short' }).format(d);
  const imgSrc = p => '/' + String(p.image || '').replace(/^\//, '');
  const nameOf = (p, lang = state.lang) => (p.name && (p.name[lang] || p.name.en)) || p.id;
  const descOf = (p, lang = state.lang) => (p.description && (p.description[lang] || p.description.en)) || '';

  // ---------- prices ----------
  const isAvailable = p => {
    if (!p || p.available === false) return false;
    const today = ymd(new Date());
    if (p.availableFrom && today < p.availableFrom) return false;
    if (p.availableUntil && today > p.availableUntil) return false;
    return true;
  };
  function priceOf(p, sel) {
    if (p.pieces) {
      const pc = p.pieces.find(x => x.count === sel.count);
      if (!pc) return null;
      if (pc.prices) return typeof pc.prices[String(sel.grams)] === 'number' ? pc.prices[String(sel.grams)] : null;
      return typeof pc.price === 'number' ? pc.price : null;
    }
    if (p.sizes) { const s = p.sizes.find(x => x.grams === sel.grams); return s && typeof s.price === 'number' ? s.price : null; }
    return typeof p.price === 'number' ? p.price : null;
  }
  const combos = p => (p.sizes ? p.sizes.map(s => s.grams) : [undefined]).flatMap(g => (p.pieces ? p.pieces.map(x => x.count) : [undefined]).map(c => ({ grams: g, count: c })));
  const minPrice = p => { const v = combos(p).map(c => priceOf(p, c)).filter(x => x != null); return v.length ? Math.min(...v) : null; };
  const orderable = p => minPrice(p) != null;
  function saving(p, sel) {
    const single = p.singleVersion && state.P[p.singleVersion];
    if (!single) return 0;
    const one = priceOf(single, { grams: sel.grams }), box = priceOf(p, sel);
    return one != null && box != null ? Math.max(0, one * sel.count - box) : 0;
  }
  const lineUnit = l => priceOf(state.P[l.id], l);
  const lineTotal = l => lineUnit(l) * l.qty;
  const subtotal = () => state.cart.reduce((s, l) => s + lineTotal(l), 0);
  const count = () => state.cart.reduce((s, l) => s + l.qty, 0);
  const canToday = () => state.cart.length > 0 && state.cart.every(l => state.P[l.id].inStockToday === true);
  const areas = () => (S().deliveryAreas || []).filter(a => a && a.id);
  function deliveryFee() {
    if (state.form.method !== 'delivery') return 0;
    const a = areas().find(x => x.id === state.form.area);
    return a && typeof a.fee === 'number' ? a.fee : null;
  }
  const lineValid = l => {
    const p = state.P[l.id];
    if (!p || !isAvailable(p) || !Number.isInteger(l.qty) || l.qty < 1) return false;
    if (p.chocolate && !p.chocolate.includes(l.choc)) return false;
    return priceOf(p, l) != null;
  };
  function lineName(l, lang = state.lang) {
    const p = state.P[l.id];
    return l.count ? `${nameOf(p, lang)} (${l.count} ${tr(lang, 'pcs')})` : nameOf(p, lang);
  }
  function lineOpts(l, lang = state.lang) {
    const parts = [];
    if (l.grams) parts.push(`${l.grams}${tr(lang, 'g')}`);
    if (l.choc) parts.push(tr(lang, l.choc + 'Full'));
    return parts.join(' · ');
  }
  const saveCart = () => local.set(KEYS.cart, state.cart);
  function addLine(nl) {
    const same = state.cart.find(l => l.id === nl.id && l.grams === nl.grams && l.choc === nl.choc && l.count === nl.count);
    if (same) same.qty += nl.qty; else state.cart.push(nl);
    saveCart();
  }

  // ---------- order message ----------
  function orderNo() {
    let n = session.get(KEYS.orderNo, null);
    if (!n) {
      const d = new Date();
      n = `${S().orderPrefix || 'BK'}-${pad(d.getMonth() + 1)}${pad(d.getDate())}-${Math.floor(100 + Math.random() * 900)}`;
      session.set(KEYS.orderNo, n);
    }
    return n;
  }
  function chosenDate() {
    const f = state.form, today = new Date();
    if (f.day === 'today') return today;
    if (f.day === 'tomorrow') return addDays(today, 1);
    if (f.date) { const [y, m, d] = f.date.split('-').map(Number); return new Date(y, m - 1, d); }
    return null;
  }
  function buildMessage(lang = state.lang) {
    const L = (k, ...a) => tr(lang, k, ...a), m = n => moneyIn(lang, n), f = state.form, out = [];
    out.push(L('msgHi'), '', `*${L('order')} ${orderNo()}*`, '');
    state.cart.forEach(l => out.push(`${l.qty}× ${lineName(l, lang)}`, `   ${[lineOpts(l, lang), m(lineTotal(l))].filter(Boolean).join(' — ')}`));
    const sub = subtotal(), fee = deliveryFee();
    out.push('', `*${L('subtotal')}:* ${m(sub)}`);
    if (f.method === 'delivery') {
      if (fee != null) out.push(`${L('deliveryFee')}: ${m(fee)}`, `*${L('total')}:* ${m(sub + fee)}`);
      else out.push(`${L('deliveryFee')}: ${L('confirmOnChat')}`);
    }
    out.push('', `*${L('name')}:* ${f.name.trim() || '—'}`, `*${L('phone')}:* ${normDigits(f.phone).trim() || '—'}`);
    if (f.method === 'delivery') {
      const a = areas().find(x => x.id === f.area);
      const areaName = a ? (a.name && (a.name[lang] || a.name.en)) || a.id : f.area.trim();
      out.push(`*${L('deliveryOpt')}:* ${[areaName, f.address.trim()].filter(Boolean).join(' — ') || '—'}`);
    } else out.push(`*${L('pickupOpt')}:* ${L('msgPickup')}`);
    const d = chosenDate();
    out.push(`*${L('when')}:* ${d ? fmtDate(d, lang) : '—'}${f.slot ? ` · ${L(f.slot)}` : ''}`);
    if (f.pay) out.push(`*${L('payment')}:* ${L(f.pay)}`);
    if (f.notes.trim()) out.push(`*${L('notesShort')}:* ${f.notes.trim()}`);
    return out.join('\n');
  }
  function validate() {
    const f = state.form, e = {};
    if (!f.name.trim()) e.name = 'errName';
    if (normDigits(f.phone).replace(/\D/g, '').length < 10) e.phone = 'errPhone';
    if (f.method === 'delivery') {
      if (areas().length && !areas().some(a => a.id === f.area)) e.area = 'errArea';
      if (!f.address.trim()) e.address = 'errAddress';
    }
    if (f.day === 'later' && !f.date) e.date = 'errDate';
    state.errors = e;
    return Object.keys(e)[0] || null;
  }
  const belowMinimum = () => (S().minimumOrder || 0) > 0 && subtotal() < S().minimumOrder;
  const track = name => { try { if (typeof window.va === 'function') window.va('event', { name }); } catch (_) {} };

  // ---------- static text ----------
  function applyStatic() {
    const html = document.documentElement;
    html.lang = state.lang; html.dir = state.lang === 'ar' ? 'rtl' : 'ltr';
    document.title = t('docTitle');
    $$('[data-i18n]').forEach(el => { const v = T[state.lang][el.dataset.i18n]; if (typeof v === 'string') el.textContent = v; });
    $$('[data-i18n-aria]').forEach(el => el.setAttribute('aria-label', t(el.dataset.i18nAria)));
    $$('[data-i18n-alt]').forEach(el => el.setAttribute('alt', t(el.dataset.i18nAlt)));
    $$('[data-wa]').forEach(a => { a.href = waLink(t(a.dataset.wa)); });
    const lb = $('#langBtn');
    lb.textContent = t('lang'); lb.lang = state.lang === 'en' ? 'ar' : 'en';
    lb.setAttribute('aria-label', state.lang === 'en' ? 'اقرأ الموقع بالعربي' : 'Read the site in English');
  }
  function updateCartCount() {
    const n = count(), c = $('#cartCount');
    c.hidden = !n; c.textContent = n;
    c.classList.toggle('bump', state.bump && !reduceMotion());
    $('#cartBtn').setAttribute('aria-label', t('cartLabel', n));
  }

  // ---------- menu ----------
  const visibleProducts = () => state.menu.products.filter(isAvailable);
  function card(p) {
    const ok = orderable(p);
    const badge = !ok ? `<span class="badge soon">${t('priceSoon')}</span>`
      : p.inStockToday ? `<span class="badge today">${t('b_today')}</span>`
      : p.badge ? `<span class="badge${p.badge === 'season' ? ' season' : ''}">${t('b_' + p.badge)}</span>` : '';
    return `<button type="button" class="pcard" data-act="open" data-id="${esc(p.id)}" data-k="card-${esc(p.id)}">
      <span class="pimg"><img src="${esc(imgSrc(p))}" alt="" width="720" height="720" loading="lazy" decoding="async">${badge}${ok ? '<span class="plus" aria-hidden="true">+</span>' : ''}</span>
      <span class="nm">${esc(nameOf(p))}</span>
      <span class="pr${ok ? '' : ' soon'}">${ok ? `${t('from')} ${money(minPrice(p))}` : t('askPrice')}</span></button>`;
  }
  function renderMenu() {
    if (!state.menu) return;
    const prods = visibleProducts();
    const cats = state.menu.categories.filter(c => prods.some(p => p.category === c.id));
    if (state.cat !== 'all' && !cats.some(c => c.id === state.cat)) state.cat = 'all';
    $('#menuChips').innerHTML = [{ id: 'all' }, ...cats].map(c => `<button type="button" class="chip" data-act="cat" data-v="${esc(c.id)}" data-k="cat-${esc(c.id)}" aria-pressed="${state.cat === c.id}">${esc(c.id === 'all' ? t('cat_all') : (c.name[state.lang] || c.name.en))}</button>`).join('');
    $('#menuGroups').innerHTML = cats.filter(c => state.cat === 'all' || state.cat === c.id).map(c => `
      <section class="cat" id="cat-${esc(c.id)}" aria-labelledby="h-${esc(c.id)}">
        <h3 id="h-${esc(c.id)}">${esc(c.name[state.lang] || c.name.en)}</h3>
        <div class="grid">${prods.filter(p => p.category === c.id).map(card).join('')}</div>
      </section>`).join('');
  }

  // ---------- product sheet ----------
  function openSheet(id, trigger) {
    const p = state.P[id];
    if (!p || !isAvailable(p)) return;
    const mid = p.sizes ? (p.sizes[1] || p.sizes[0]).grams : undefined;
    const counts = p.pieces ? p.pieces.map(x => x.count) : null;
    state.sheet = {
      id, qty: 1,
      grams: mid,
      count: counts ? (counts.includes(6) ? 6 : counts[0]) : undefined,
      choc: p.chocolate ? (p.chocolate.includes('milk') ? 'milk' : p.chocolate[0]) : undefined
    };
    state.sheetEnter = true; state.sheetTrigger = trigger || null;
    document.documentElement.classList.add('lock');
    renderSheet();
  }
  function closeSheet() {
    state.sheet = null;
    document.documentElement.classList.remove('lock');
    renderSheet();
    const trig = state.sheetTrigger; state.sheetTrigger = null;
    if (trig && document.contains(trig)) trig.focus({ preventScroll: true });
  }
  function sheetHTML() {
    const s = state.sheet, p = state.P[s.id];
    let h = `<div class="sh-handle" aria-hidden="true"></div>
      <div class="sh-img"><img src="${esc(imgSrc(p))}" alt="" width="720" height="720"></div>
      <button type="button" class="sh-close" data-act="close" data-k="sh-close" aria-label="${t('close')}">${ICON.close}</button>
      <div class="sh-body"><div><h2 id="shT">${esc(nameOf(p))}</h2><p class="muted" style="margin-top:6px">${esc(descOf(p))}</p></div>`;
    if (!orderable(p)) {
      return h + `<p class="note">${t('waitingPrice')}</p></div>
        <div class="sh-foot"><a class="btn btn-wa btn-block" href="${waLink(t('askMsg', nameOf(p)))}" target="_blank" rel="noopener">${ICON.wa}${t('askUs')}</a></div>`;
    }
    if (p.inStockToday) h += `<p class="note blue">${t('todayNote')}</p>`;
    const opt = (kind, v, main, sub, pressed, extra = '', save = '') =>
      `<button type="button" class="opt" data-act="opt" data-kind="${kind}" data-v="${esc(v)}" data-k="o-${kind}-${esc(v)}" aria-pressed="${pressed}">${extra}<span class="o-main">${main}</span>${sub ? `<span class="o-sub">${sub}</span>` : ''}${save}</button>`;
    if (p.pieces) {
      h += `<fieldset><legend>${t('pieces')}</legend><div class="opts">${p.pieces.map(pc => {
        const sel = { grams: s.grams, count: pc.count }, price = priceOf(p, sel), sv = saving(p, sel);
        return opt('count', pc.count, `${pc.count} ${t('pcs')}`, p.sizes ? '' : (price != null ? money(price) : ''), s.count === pc.count, '', sv ? `<span class="o-save">${t('save')} ${money(sv)}</span>` : '');
      }).join('')}</div></fieldset>`;
    }
    if (p.sizes) {
      h += `<fieldset><legend>${t('size')}</legend><div class="opts">${p.sizes.map((z, i) => {
        const price = priceOf(p, { grams: z.grams, count: s.count });
        return opt('grams', z.grams, `${z.grams}${t('g')}`, price != null ? money(price) : '—', s.grams === z.grams, `<span class="cdot" style="width:${DOTS[i] || 24}px;height:${DOTS[i] || 24}px"></span>`);
      }).join('')}</div></fieldset>`;
    }
    if (p.chocolate) {
      h += `<fieldset><legend>${t('chocolate')}</legend><div class="opts">${p.chocolate.map(c => opt('choc', c, t(c), '', s.choc === c, `<span class="swdot" style="background:${CHOC_SWATCH[c] || '#8A5A3B'}"></span>`)).join('')}</div></fieldset>`;
    }
    h += `<div class="qty-row"><span class="lbl" id="qtyLbl">${t('qty')}</span>${stepper('sq', s.qty)}</div></div>`;
    const unit = priceOf(p, s);
    return h + `<div class="sh-foot"><button type="button" class="btn btn-primary btn-block" data-act="add" data-k="sh-add"${unit == null ? ' disabled' : ''}>${t('addToCart')}${unit != null ? ` · ${money(unit * s.qty)}` : ''}</button></div>`;
  }
  function renderSheet() {
    const w = $('#sheet');
    if (!state.sheet) { w.hidden = true; w.innerHTML = ''; return; }
    const active = document.activeElement, fk = active && w.contains(active) ? active.dataset.k : null;
    const top = w.querySelector('.sheet') ? w.querySelector('.sheet').scrollTop : 0;
    w.hidden = false;
    w.innerHTML = `<div class="sheet-backdrop" data-act="close"></div><div class="sheet${state.sheetEnter ? ' enter' : ''}" role="dialog" aria-modal="true" aria-labelledby="shT">${sheetHTML()}</div>`;
    const sh = w.querySelector('.sheet');
    if (state.sheetEnter) { state.sheetEnter = false; $('[data-k="sh-close"]', w).focus({ preventScroll: true }); }
    else { sh.scrollTop = top; if (fk) { const el = w.querySelector(`[data-k="${fk}"]`); if (el) el.focus({ preventScroll: true }); } }
  }
  const stepper = (key, val) => `<span class="stepper"><button type="button" data-act="${key}" data-d="-1" data-k="${key}-m" aria-label="${t('fewer')}">−</button><output aria-live="polite">${val}</output><button type="button" data-act="${key}" data-d="1" data-k="${key}-p" aria-label="${t('more')}">+</button></span>`;

  // ---------- order flow views ----------
  function upsell() {
    for (let i = 0; i < state.cart.length; i++) {
      const l = state.cart[i], p = state.P[l.id], box = p.boxVersion && state.P[p.boxVersion];
      if (!box || !isAvailable(box) || !box.pieces || l.qty < 4) continue;
      const counts = box.pieces.map(x => x.count).filter(c => c <= l.qty && priceOf(box, { grams: l.grams, count: c }) != null).sort((a, b) => b - a);
      if (!counts.length) continue;
      const c = counts[0], sv = saving(box, { grams: l.grams, count: c });
      if (sv > 0) return `<div class="tip"><span>${t('switchT', c, money(sv))}</span><button type="button" class="btn btn-cocoa btn-sm" data-act="convert" data-i="${i}" data-c="${c}" data-k="convert">${t('switchBtn')}</button></div>`;
    }
    return state.cart.some(l => state.P[l.id].boxVersion) ? `<div class="tip"><span>${t('boxTip')}</span></div>` : '';
  }
  const VIEWS = {
    cart: () => {
      if (!state.cart.length) return `<div class="empty">${ICON.wink}<h2>${t('emptyT')}</h2><p class="muted">${t('emptyP')}</p><a class="btn btn-primary" href="#menu">${t('seeMenu')}</a></div>`;
      const fee = deliveryFee();
      return `<div class="flow-body">
        <ul class="lines">${state.cart.map((l, i) => {
          const p = state.P[l.id], o = lineOpts(l);
          return `<li class="line"><img src="${esc(imgSrc(p))}" alt="" width="72" height="72" loading="lazy">
            <div><b>${esc(lineName(l))}</b>${o ? `<span class="opts-txt">${esc(o)}</span>` : ''}
            <div class="line-row">${stepper('lq' + i, l.qty)}<span class="line-price">${money(lineTotal(l))}</span></div></div></li>`;
        }).join('')}</ul>
        ${upsell()}
        <dl class="sumlist">
          <div><dt>${t('subtotal')}</dt><dd>${money(subtotal())}</dd></div>
          <div><dt>${t('deliveryFee')}</dt><dd>${fee != null && fee > 0 ? money(fee) : t('confirmOnChat')}</dd></div>
        </dl>
        ${belowMinimum() ? `<p class="note">${t('minOrder', money(S().minimumOrder))}</p>` : ''}
        <a class="a-link" href="#menu">+ ${t('addMore')}</a>
      </div>`;
    },
    details: () => {
      const f = state.form, e = state.errors, todayOk = canToday(), s = S();
      const errAttr = id => e[id] ? ` aria-invalid="true" aria-describedby="e-${id}"` : '';
      const errMsg = id => e[id] ? `<span class="err" id="e-${id}">${t(e[id])}</span>` : '';
      const input = (id, type, label, ac, ph = '') => `<div class="field${e[id] ? ' has-err' : ''}"><label for="f-${id}">${label}</label>
        <input id="f-${id}" name="${id}" type="${type}" data-f="${id}" value="${esc(f[id])}" placeholder="${esc(ph)}" autocomplete="${ac}"${type === 'tel' ? ' inputmode="tel" dir="ltr"' : ''}${errAttr(id)}>${errMsg(id)}</div>`;
      const area = (id, label, ac, ph) => `<div class="field${e[id] ? ' has-err' : ''}"><label for="f-${id}">${label}</label>
        <textarea id="f-${id}" name="${id}" data-f="${id}" placeholder="${esc(ph)}" autocomplete="${ac}"${errAttr(id)}>${esc(f[id])}</textarea>${errMsg(id)}</div>`;
      const seg = (key, label, opts, hint = '') => `<div class="field"><span class="lbl" id="l-${key}">${label}</span>
        <div class="seg" role="group" aria-labelledby="l-${key}">${opts.map(([v, txt, off]) => `<button type="button" class="chip" data-act="fopt" data-f="${key}" data-v="${esc(v)}" data-k="f-${key}-${esc(v)}" aria-pressed="${f[key] === v}"${off ? ' disabled' : ''}>${esc(txt)}</button>`).join('')}</div>
        ${hint ? `<span class="hint">${hint}</span>` : ''}</div>`;
      const now = new Date();
      let areaField;
      if (areas().length) {
        areaField = `<div class="field${e.area ? ' has-err' : ''}"><label for="f-area">${t('area')}</label>
          <select id="f-area" data-f="area"${errAttr('area')}><option value="">${t('chooseArea')}</option>${areas().map(a => `<option value="${esc(a.id)}"${f.area === a.id ? ' selected' : ''}>${esc((a.name && (a.name[state.lang] || a.name.en)) || a.id)}${typeof a.fee === 'number' ? ` · ${money(a.fee)}` : ''}</option>`).join('')}</select>${errMsg('area')}</div>`;
      } else areaField = input('area', 'text', t('area'), 'address-level2', t('areaPh'));
      return `<form class="flow-body" id="detailsForm" novalidate>
        ${input('name', 'text', t('name'), 'name')}
        ${input('phone', 'tel', t('phone'), 'tel', '01x xxxx xxxx')}
        ${s.pickup !== false ? seg('method', t('method'), [['delivery', t('deliveryOpt')], ['pickup', t('pickupOpt')]]) : ''}
        ${f.method === 'delivery' ? areaField + area('address', t('address'), 'street-address', t('addressPh')) : `<p class="note">${t('pickupNote')}</p>`}
        ${seg('day', t('when'), [
          ['today', `${t('today')} · ${fmtDate(now, state.lang)}`, !todayOk],
          ['tomorrow', `${t('tomorrow')} · ${fmtDate(addDays(now, 1), state.lang)}`],
          ['later', t('later')]
        ], todayOk ? '' : t('todayOff'))}
        ${f.day === 'later' ? `<div class="field${e.date ? ' has-err' : ''}"><label for="f-date">${t('dateLabel')}</label>
          <input id="f-date" type="date" data-f="date" value="${esc(f.date)}" min="${ymd(addDays(now, 2))}" max="${ymd(addDays(now, 60))}"${errAttr('date')}>${errMsg('date')}</div>` : ''}
        ${(s.timeSlots || []).length ? seg('slot', t('time'), s.timeSlots.map(x => [x, t(x)])) : ''}
        ${(s.payments || []).length ? seg('pay', t('payment'), s.payments.map(x => [x, t(x)])) : ''}
        ${area('notes', t('notes'), 'off', t('notesPh'))}
        <p class="hint">${t('remember')}</p>
      </form>`;
    },
    review: () => `<div class="flow-body">
        <p class="muted">${t('reviewP')}</p>
        <div class="wa-chat"><div class="wa-bubble" id="msgBubble">${fmtWA(buildMessage())}<span class="wa-time">${new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit' }).format(new Date())}</span></div></div>
      </div>`,
    sent: () => {
      const last = session.get(KEYS.lastMsg, null);
      return `<div class="done"><span class="wink-wrap" id="sentWink">${ICON.winkAnim}</span>
        <h1 tabindex="-1">${t('sentT')}</h1><p class="muted">${t('sentP')}</p>
        ${last ? `<p class="order-no">${esc(last.no)}</p><a class="btn btn-wa" href="${waLink(last.text)}" target="_blank" rel="noopener">${ICON.wa}${t('again')}</a>` : ''}
        <a class="btn btn-ghost" href="#menu">${t('newOrder')}</a></div>`;
    }
  };
  const BACK = { cart: '#menu', details: '#cart', review: '#details' };
  const TITLES = { cart: ['cart', 1], details: ['details', 2], review: ['reviewT', 3] };
  function renderFlow(focusTitle = false) {
    const v = state.route, el = $('#flow');
    const active = document.activeElement, fk = active && el.contains(active) ? active.dataset.k : null;
    const head = v === 'sent' ? '' : `<div class="flow-head"><a class="icon-btn" href="${BACK[v]}" aria-label="${t('back')}">${ICON.back}</a>
      <div class="flow-title"><h1 tabindex="-1">${t(TITLES[v][0])}</h1><span>${t('step', TITLES[v][1])}</span></div></div>`;
    el.innerHTML = head + VIEWS[v]();
    if (focusTitle) { const h = $('h1', el); if (h) h.focus({ preventScroll: true }); }
    else if (fk) { const x = el.querySelector(`[data-k="${fk}"]`); if (x) x.focus({ preventScroll: true }); }
  }

  function renderBar() {
    const v = state.route, n = count(), bar = $('#bar');
    let h = '';
    if (v === 'home' && n) h = `<a class="cartbar" href="#cart"><span>${t('viewCart')} · ${t('items', n)}</span><span class="sum">${money(subtotal())}</span></a>`;
    else if (v === 'cart' && n) h = `<button type="button" class="cartbar" data-act="go" data-to="details"${belowMinimum() ? ' disabled' : ''}><span>${t('cont')}</span><span class="sum">${money(subtotal())}</span></button>`;
    else if (v === 'details') h = `<button type="button" class="cartbar" data-act="review"><span>${t('review')}</span><span class="sum">${money(subtotal() + (deliveryFee() || 0))}</span></button>`;
    else if (v === 'review') h = `<a class="btn btn-wa btn-block" href="${waLink(buildMessage())}" target="_blank" rel="noopener" data-act="send">${ICON.wa}${t('sendWA')}</a>
      <button type="button" class="btn btn-ghost btn-block" data-act="copy">${state.copied || t('copy')}</button>`;
    bar.innerHTML = h ? `<div class="bar-in">${h}</div>` : '';
    bar.hidden = !h;
  }

  function renderAll() {
    updateCartCount();
    renderMenu();
    if (state.route && state.route !== 'home') renderFlow();
    renderBar();
    renderSheet();
    state.bump = false;
  }

  // ---------- routing ----------
  function route() {
    if (!state.menu) return;
    const h = decodeURIComponent(location.hash.slice(1));
    let v = FLOW.includes(h) ? h : 'home';
    if ((v === 'details' || v === 'review') && !state.cart.length) { location.replace('#cart'); return; }
    if (v === 'review' && validate()) { location.replace('#details'); return; }
    if (state.sheet) closeSheet();
    const prev = state.route;
    state.route = v; state.copied = '';
    $('#home').hidden = v !== 'home';
    $('#flow').hidden = v === 'home';
    if (v === 'home') {
      if (prev && prev !== 'home') {
        const target = h && document.getElementById(h);
        requestAnimationFrame(() => target ? target.scrollIntoView() : window.scrollTo(0, 0));
      }
    } else {
      if (v !== 'details') state.errors = {};
      renderFlow(true);
      window.scrollTo(0, 0);
      if (v === 'sent') celebrate();
    }
    renderBar();
  }

  // ---------- motion ----------
  function burst(host) {
    const colors = ['#D49A57', '#482217', '#F3D859', '#ADC6E5', '#205BCF'];
    for (let i = 0; i < 18; i++) {
      const c = document.createElement('span'), size = 5 + Math.random() * 7;
      c.className = 'crumb';
      c.style.width = c.style.height = size + 'px';
      c.style.background = colors[i % colors.length];
      host.appendChild(c);
      const ang = (i / 18) * Math.PI * 2 + Math.random() * .4, dist = 60 + Math.random() * 50;
      const a = c.animate([
        { transform: 'translate(-50%,-50%) scale(.4)', opacity: 1 },
        { transform: `translate(calc(-50% + ${Math.cos(ang) * dist}px), calc(-50% + ${Math.sin(ang) * dist + 16}px)) scale(1)`, opacity: 0 }
      ], { duration: 750 + Math.random() * 300, easing: 'cubic-bezier(.2,.8,.2,1)' });
      a.onfinish = () => c.remove();
    }
  }
  function celebrate() {
    const host = $('#sentWink'); if (!host) return;
    requestAnimationFrame(() => host.querySelector('.wink-anim').classList.add('play'));
    if (!reduceMotion() && host.animate) burst(host);
  }
  let toastTimer = 0;
  function toast(msg) {
    const el = $('#toast');
    el.textContent = msg; el.hidden = false;
    clearTimeout(toastTimer); toastTimer = setTimeout(() => { el.hidden = true; }, 1900);
  }

  // ---------- events ----------
  document.addEventListener('click', ev => {
    const opener = ev.target.closest('[data-open]');
    if (opener) { ev.preventDefault(); openSheet(opener.dataset.open, opener); return; }
    const el = ev.target.closest('[data-act]');
    if (!el) return;
    const act = el.dataset.act, s = state.sheet;
    if (act === 'send') {
      const text = buildMessage();
      session.set(KEYS.lastMsg, { no: orderNo(), text });
      track('Order sent');
      setTimeout(() => {
        state.cart = []; saveCart(); session.del(KEYS.orderNo);
        state.form.notes = '';
        updateCartCount();
        location.hash = 'sent';
      }, 400);
      return;
    }
    ev.preventDefault();
    if (act === 'cat') {
      state.cat = el.dataset.v; renderMenu();
      const menu = $('#menu'), barTop = $('.chips-bar').getBoundingClientRect().top;
      if (barTop > (parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--head-h')) || 64) + 4) return;
      menu.scrollIntoView();
      return;
    }
    if (act === 'open') return openSheet(el.dataset.id, el);
    if (act === 'close') return closeSheet();
    if (act === 'opt') {
      const k = el.dataset.kind;
      s[k] = k === 'choc' ? el.dataset.v : Number(el.dataset.v);
      return renderSheet();
    }
    if (act === 'sq') { s.qty = Math.max(1, Math.min(99, s.qty + Number(el.dataset.d))); return renderSheet(); }
    if (act === 'add') {
      const p = state.P[s.id], nl = { id: s.id, qty: s.qty };
      if (p.sizes) nl.grams = s.grams;
      if (p.pieces) nl.count = s.count;
      if (p.chocolate) nl.choc = s.choc;
      if (priceOf(p, nl) == null) return;
      addLine(nl);
      state.bump = true;
      try { if (navigator.vibrate) navigator.vibrate(12); } catch (_) {}
      closeSheet(); renderAll();
      track('Add to cart');
      return toast(t('added'));
    }
    if (act.startsWith('lq')) {
      const i = Number(act.slice(2)), l = state.cart[i];
      if (!l) return;
      l.qty = Math.min(99, l.qty + Number(el.dataset.d));
      if (l.qty < 1) state.cart.splice(i, 1);
      saveCart(); return renderAll();
    }
    if (act === 'convert') {
      const i = Number(el.dataset.i), c = Number(el.dataset.c), l = state.cart[i];
      if (!l) return;
      const box = state.P[state.P[l.id].boxVersion], sv = saving(box, { grams: l.grams, count: c });
      l.qty -= c;
      if (l.qty < 1) state.cart.splice(i, 1);
      const nl = { id: box.id, count: c, qty: 1 };
      if (box.sizes) nl.grams = l.grams;
      if (box.chocolate) nl.choc = l.choc;
      addLine(nl); renderAll();
      return toast(t('switched', money(sv)));
    }
    if (act === 'go') { location.hash = el.dataset.to; return; }
    if (act === 'fopt') {
      state.form[el.dataset.f] = el.dataset.v;
      if (el.dataset.f === 'day' && el.dataset.v !== 'later') state.form.date = '';
      saveDetails(); renderFlow(); return renderBar();
    }
    if (act === 'review') {
      const bad = validate();
      if (bad) { renderFlow(); const f = $(`#f-${bad}`); if (f) f.focus(); return; }
      location.hash = 'review'; return;
    }
    if (act === 'copy') {
      const text = buildMessage();
      const done = label => { state.copied = label; renderBar(); setTimeout(() => { state.copied = ''; if (state.route === 'review') renderBar(); }, 1800); };
      const fallback = () => {
        const b = $('#msgBubble');
        if (b) { const r = document.createRange(); r.selectNodeContents(b); const sel = getSelection(); sel.removeAllRanges(); sel.addRange(r); }
        done(t('copyFail'));
      };
      try { navigator.clipboard.writeText(text).then(() => done(t('copied')), fallback); } catch (_) { fallback(); }
    }
  });

  function saveDetails() {
    const { name, phone, method, area, address, slot, pay } = state.form;
    local.set(KEYS.details, { name, phone, method, area, address, slot, pay });
  }
  document.addEventListener('input', ev => {
    const el = ev.target.closest('[data-f]');
    if (!el || el.tagName === 'BUTTON') return;
    state.form[el.dataset.f] = el.value;
    if (state.errors[el.dataset.f]) { delete state.errors[el.dataset.f]; }
    saveDetails();
    if (el.dataset.f === 'area') renderBar();
  });
  document.addEventListener('submit', ev => ev.preventDefault());
  document.addEventListener('keydown', ev => {
    if (!state.sheet) return;
    if (ev.key === 'Escape') { ev.preventDefault(); closeSheet(); return; }
    if (ev.key === 'Tab') {
      const items = $$('#sheet button:not([disabled]), #sheet a[href]');
      if (!items.length) return;
      const first = items[0], last = items[items.length - 1];
      if (ev.shiftKey && document.activeElement === first) { ev.preventDefault(); last.focus(); }
      else if (!ev.shiftKey && document.activeElement === last) { ev.preventDefault(); first.focus(); }
    }
  });
  $('#langBtn').addEventListener('click', () => {
    state.lang = state.lang === 'en' ? 'ar' : 'en';
    local.set(KEYS.lang, state.lang);
    applyStatic(); renderAll();
  });
  window.addEventListener('hashchange', route);
  window.addEventListener('storage', ev => {
    if (ev.key === KEYS.cart && state.menu) { state.cart = local.get(KEYS.cart, []).filter(lineValid); renderAll(); }
  });

  // ---------- start ----------
  async function load() {
    $('#menuGroups').innerHTML = `<p class="loading">${t('loading')}</p>`;
    try {
      const res = await fetch('/data/menu.json', { cache: 'no-cache' });
      if (!res.ok) throw new Error(res.status);
      const menu = await res.json();
      state.menu = menu;
      state.P = Object.fromEntries(menu.products.map(p => [p.id, p]));
      const s = menu.settings;
      if (!state.form.slot || !(s.timeSlots || []).includes(state.form.slot)) state.form.slot = (s.timeSlots || [])[0] || '';
      if (!state.form.pay || !(s.payments || []).includes(state.form.pay)) state.form.pay = (s.payments || [])[0] || '';
      if (s.pickup === false) state.form.method = 'delivery';
      if (areas().length && !areas().some(a => a.id === state.form.area)) state.form.area = '';
      state.cart = state.cart.filter(lineValid);
      if (!canToday()) state.form.day = 'tomorrow';
      saveCart();
      const phone = $('#footPhone');
      phone.href = waLink(t('helloMsg')); phone.textContent = s.whatsappDisplay || s.whatsappNumber;
      const social = [['Instagram', s.instagram], ['TikTok', s.tiktok]].filter(x => x[1]);
      if (social.length) { const fs = $('#footSocial'); fs.innerHTML = social.map(([n, u]) => `<a href="${esc(u)}" target="_blank" rel="noopener">${n}</a>`).join(''); fs.hidden = false; }
      applyStatic();
      renderAll();
      route();
    } catch (err) {
      $('#menuGroups').innerHTML = `<div class="load-error"><p>${t('loadError')}</p><p style="margin-top:12px;display:flex;gap:10px;flex-wrap:wrap"><button type="button" class="btn btn-ghost btn-sm" id="retry">${t('retry')}</button><a class="btn btn-wa btn-sm" href="${waLink(t('helloMsg'))}" target="_blank" rel="noopener">${ICON.wa}${t('chatUs')}</a></p></div>`;
      $('#retry').addEventListener('click', load);
    }
  }

  $('#year').textContent = new Date().getFullYear();
  applyStatic();
  load();
})();
