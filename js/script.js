const NAV_HEIGHT = 58;
const SECTION_ORDER = [
  "beranda",
  "kenapa-payu",
  "layanan",
  "karya",
  "harga",
  "faq",
];
let timelineModel = [];
let cachedKontakStart = 0;
let cachedKontakEnd = 0;
let cachedKenapaStart = 600;
let cachedMaxHeroParallax = 900;
let cachedFooterTop = 5000;
let cachedFooterTotalDist = 1000;

// Case Studies Data for Portfolio Modal
const CASE_STUDIES = [
  {
    tag: "JayantisBakery.bali — Denpasar",
    title: "Content Creation & Visual Produk",
    img: "assets/porto-sosmed.webp",
    challenge:
      "Homemade bakery dengan tampilan sosial media yang ingin di percantik.",
    impact:
      "Peningkatan interaksi organik hingga 3x lipat dalam 60 hari pertama serta lonjakan kunjungan pelanggan baru yang mengetahui menu lewat Reels dan Postingan rutin.",
    deliverables: [
      "Photoshoot",
      "12 Konten Feed Bulanan",
      "Reels Video Production",
      "Copywriting & Hashtag Lokal",
    ],
  },
  {
    tag: "SewaCamping — BALI",
    title: "Website Aesthetic & Reservasi Langsung",
    img: "assets/web-laptop.webp",
    challenge:
      "Ketergantungan tinggi pada komisi platform OTA pihak ketiga karena belum memiliki situs resmi yang cepat, mobile-friendly, dan meyakinkan bagi wisatawan.",
    impact:
      "Memangkas waktu muat halaman di bawah 1,8 detik dan meningkatkan porsi pemesanan langsung (direct booking) via WhatsApp tanpa potongan komisi.",
    deliverables: [
      "UI/UX Design di Figma",
      "Responsive Web Development",
      "Integrasi Direct WhatsApp",
      "Technical & Local SEO",
    ],
  },
  {
    tag: "BRAND STRATEGY — UMKM BALI",
    title: "Strategic & Content Planning",
    img: "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?q=80&w=1000&auto=format&fit=crop",
    challenge:
      "Unggahan media sosial sebelumnya tidak memiliki benang merah visual maupun jadwal yang teratur, sehingga calon pembeli ragu terhadap kredibilitas brand.",
    impact:
      "Identitas visual menjadi seragam di seluruh titik sentuh digital, menghemat waktu pemilik usaha hingga 15 jam per minggu dalam memikirkan konten.",
    deliverables: [
      "Brand Identity Guideline",
      "Kalender Editorial 30 Hari",
      "Desain Template Story & Feed",
      "Laporan Analitik Bulanan",
    ],
  },
];

function openCaseModal(idx) {
  const data = CASE_STUDIES[idx];
  const modal = document.getElementById("case-study-modal");
  const dialog = document.getElementById("case-study-dialog");
  if (!data || !modal) return;

  document.getElementById("modal-img").src = data.img;
  document.getElementById("modal-tag").innerText = data.tag;
  document.getElementById("modal-title").innerText = data.title;
  document.getElementById("modal-challenge").innerText = data.challenge;
  document.getElementById("modal-impact").innerText = data.impact;

  const delivBox = document.getElementById("modal-deliverables");
  delivBox.innerHTML = data.deliverables
    .map(
      (item) =>
        `<span class="px-3 py-1 rounded-full bg-brandBlueLight text-brandBlue text-xs font-bold">${item}</span>`,
    )
    .join("");

  modal.classList.remove("hidden");
  modal.classList.add("flex");
  requestAnimationFrame(() => {
    modal.classList.remove("opacity-0");
    dialog.classList.remove("scale-95");
    dialog.classList.add("scale-100");
  });
}

function closeCaseModal() {
  const modal = document.getElementById("case-study-modal");
  const dialog = document.getElementById("case-study-dialog");
  if (!modal) return;
  modal.classList.add("opacity-0");
  if (dialog) {
    dialog.classList.remove("scale-100");
    dialog.classList.add("scale-95");
  }
  setTimeout(() => {
    modal.classList.remove("flex");
    modal.classList.add("hidden");
  }, 280);
}

// Mobile Menu Drawer Toggle
let mobileMenuOpen = false;
function toggleMobileMenu() {
  mobileMenuOpen = !mobileMenuOpen;
  const drawer = document.getElementById("mobile-menu-drawer");
  const btn = document.getElementById("mobile-menu-btn");
  const l1 = document.getElementById("burger-line-1");
  const l2 = document.getElementById("burger-line-2");
  const l3 = document.getElementById("burger-line-3");
  if (!drawer) return;

  if (mobileMenuOpen) {
    drawer.classList.remove("hidden-drawer");
    drawer.classList.add("open-drawer");
    if (btn) btn.setAttribute("aria-expanded", "true");
    if (l1) l1.style.transform = "translateY(8px) rotate(45deg)";
    if (l2) l2.style.opacity = "0";
    if (l3) l3.style.transform = "translateY(-8px) rotate(-45deg)";
  } else {
    closeMobileMenu();
  }
}

function closeMobileMenu() {
  mobileMenuOpen = false;
  const drawer = document.getElementById("mobile-menu-drawer");
  const btn = document.getElementById("mobile-menu-btn");
  const l1 = document.getElementById("burger-line-1");
  const l2 = document.getElementById("burger-line-2");
  const l3 = document.getElementById("burger-line-3");
  if (drawer) {
    drawer.classList.remove("open-drawer");
    drawer.classList.add("hidden-drawer");
  }
  if (btn) btn.setAttribute("aria-expanded", "false");
  if (l1) l1.style.transform = "";
  if (l2) l2.style.opacity = "1";
  if (l3) l3.style.transform = "";
}

let lenis;
if (typeof Lenis !== "undefined") {
  lenis = new Lenis({
    duration: 1.05,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
}

// Document-relative scroll coordinate for any section ID
function getSectionTargetScroll(id) {
  if (id === "beranda") return 0;
  const sec = document.getElementById(id);
  if (!sec) return 0;
  const currentScrollY =
    window.pageYOffset || document.documentElement.scrollTop;
  const rect = sec.getBoundingClientRect();
  return Math.max(0, rect.top + currentScrollY - NAV_HEIGHT);
}

// End of #kontak (Sapa Kami) in document scroll coordinates (excludes Footer Parallax)
function getKontakEndScroll() {
  const kontakSec = document.getElementById("kontak");
  if (!kontakSec)
    return document.documentElement.scrollHeight - window.innerHeight;
  const currentScrollY =
    window.pageYOffset || document.documentElement.scrollTop;
  const rect = kontakSec.getBoundingClientRect();
  const kontakBottomDoc = rect.bottom + currentScrollY;
  const kontakStart = getSectionTargetScroll("kontak");
  return Math.max(
    kontakStart + 250,
    kontakBottomDoc - window.innerHeight + NAV_HEIGHT,
  );
}

// Compute dynamic block widths and piece-wise scroll mapping + cache layout metrics to eliminate scroll layout thrashing
function buildTimelineModel() {
  const ctaContainer = document.getElementById("nav-cta-container");
  const totalHeaderW = window.innerWidth;
  const ctaW =
    ctaContainer && totalHeaderW >= 768 ? ctaContainer.offsetWidth : 0;
  const trackW = Math.max(320, totalHeaderW - ctaW);
  const trackRatioOfHeader = totalHeaderW >= 768 ? trackW / totalHeaderW : 0.85;

  const scrollStarts = SECTION_ORDER.map((id) => getSectionTargetScroll(id));
  const kontakStart = getSectionTargetScroll("kontak");
  const kontakEnd = getKontakEndScroll();

  cachedKontakStart = kontakStart;
  cachedKontakEnd = kontakEnd;
  cachedKenapaStart = scrollStarts[1] || 600;

  const heroPinWrapper = document.getElementById("hero-pin-wrapper");
  cachedMaxHeroParallax = heroPinWrapper
    ? heroPinWrapper.offsetHeight
    : window.innerHeight * 1.35;

  const footerWrap = document.getElementById("footer-parallax-wrapper");
  if (footerWrap) {
    const currentScrollY =
      window.pageYOffset || document.documentElement.scrollTop;
    cachedFooterTop = footerWrap.getBoundingClientRect().top + currentScrollY;
    cachedFooterTotalDist = Math.max(
      1,
      footerWrap.offsetHeight - window.innerHeight,
    );
  }

  // Raw scroll spans for the 6 timeline blocks before CTA
  const rawSpans = scrollStarts.map((startY, i) => {
    const nextY =
      i < scrollStarts.length - 1 ? scrollStarts[i + 1] : kontakStart;
    return Math.max(150, nextY - startY);
  });
  const totalSpan = rawSpans.reduce((a, b) => a + b, 0);

  const minPcts = [13, 15, 13, 13, 13, 15];
  const minSum = minPcts.reduce((a, b) => a + b, 0);
  const remainingPct = Math.max(0, 100 - minSum);

  let currentLeftPct = 0;
  timelineModel = [];

  const blocks = document.querySelectorAll(
    "#desktop-timeline-nav .timeline-block",
  );
  scrollStarts.forEach((startY, i) => {
    const nextY =
      i < scrollStarts.length - 1 ? scrollStarts[i + 1] : kontakStart;
    const weight = rawSpans[i] / totalSpan;
    const widthInTrackPct = minPcts[i] + weight * remainingPct;

    if (blocks[i]) {
      blocks[i].style.left = `${currentLeftPct}%`;
      blocks[i].style.width = `${widthInTrackPct}%`;
    }

    const headerStartPct = currentLeftPct * trackRatioOfHeader;
    const headerEndPct =
      (currentLeftPct + widthInTrackPct) * trackRatioOfHeader;

    timelineModel.push({
      id: SECTION_ORDER[i],
      scrollStart: startY,
      scrollEnd: nextY,
      barStartPct: headerStartPct,
      barEndPct: headerEndPct,
    });

    currentLeftPct += widthInTrackPct;
  });

  // Final segment: Sapa Kami (#kontak) spans across the Sharp CTA Button to 100% right edge
  timelineModel.push({
    id: "kontak",
    scrollStart: kontakStart,
    scrollEnd: kontakEnd,
    barStartPct: trackRatioOfHeader * 100,
    barEndPct: 100,
  });
}

function computeProgressBarPercentage(scrollY) {
  if (!timelineModel.length) buildTimelineModel();
  if (scrollY <= 0) return 0;

  const lastSeg = timelineModel[timelineModel.length - 1];
  if (scrollY >= lastSeg.scrollEnd) return 100;

  for (let i = 0; i < timelineModel.length; i++) {
    const seg = timelineModel[i];
    if (scrollY >= seg.scrollStart && scrollY <= seg.scrollEnd) {
      const span = Math.max(1, seg.scrollEnd - seg.scrollStart);
      const localRatio = (scrollY - seg.scrollStart) / span;
      return seg.barStartPct + localRatio * (seg.barEndPct - seg.barStartPct);
    }
  }
  return 100;
}

let isProgrammaticNav = false;
function scrollToSection(id) {
  buildTimelineModel();
  const targetY = getSectionTargetScroll(id);
  isProgrammaticNav = true;
  setTimeout(() => {
    isProgrammaticNav = false;
  }, 1350);

  if (lenis) {
    lenis.scrollTo(targetY, {
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
  } else {
    window.scrollTo({ top: targetY, behavior: "smooth" });
  }
}

function selectService(index) {
  const items = document.querySelectorAll(".service-item");
  items.forEach((item, i) => {
    const accGrid = item.querySelector(".service-accordion-grid");
    const number = item.querySelector(".service-num");
    if (i === index) {
      item.classList.remove(
        "bg-white",
        "hover:bg-gray-50/80",
        "border-transparent",
      );
      item.classList.add("bg-[#DDE7EB]/75", "border-brandBlue");
      if (number) {
        number.classList.remove("text-brandGrayText");
        number.classList.add("text-brandBlue");
      }
      if (accGrid) accGrid.classList.add("is-open");
    } else {
      item.classList.remove("bg-[#DDE7EB]/75", "border-brandBlue");
      item.classList.add(
        "bg-white",
        "hover:bg-gray-50/80",
        "border-transparent",
      );
      if (number) {
        number.classList.remove("text-brandBlue");
        number.classList.add("text-brandGrayText");
      }
      if (accGrid) accGrid.classList.remove("is-open");
    }
  });
  setTimeout(buildTimelineModel, 460);
}

let currentPricingMode = "sosmed";
let selectedPackageLabel = "";

function choosePackage(serviceCategory, packageDetail) {
  const serviceSelect = document.getElementById("form-service");
  const banner = document.getElementById("selected-package-banner");
  const bannerText = document.getElementById("selected-package-text");

  if (serviceSelect) {
    serviceSelect.value = serviceCategory;
  }
  selectedPackageLabel = packageDetail;
  if (banner && bannerText) {
    bannerText.innerText = packageDetail;
    banner.classList.remove("hidden");
  }
  scrollToSection("kontak");
  setTimeout(() => {
    const nameInput = document.getElementById("form-name");
    if (nameInput) nameInput.focus({ preventScroll: true });
  }, 900);
}

function clearSelectedPackage() {
  selectedPackageLabel = "";
  const banner = document.getElementById("selected-package-banner");
  if (banner) banner.classList.add("hidden");
}

function selectPricingCard(cardIdx) {
  const names = document.querySelectorAll(".price-name");
  const vals = document.querySelectorAll(".price-val");
  const name = names[cardIdx] ? names[cardIdx].innerText : "Paket PAYU";

  let val = "";
  if (vals[cardIdx]) {
    const clone = vals[cardIdx].cloneNode(true);
    const strike = clone.querySelector(".line-through");
    if (strike) strike.remove();
    val = clone.innerText.replace(/\s+/g, " ").trim();
  }

  const category =
    currentPricingMode === "sosmed"
      ? "Sosial Media Management"
      : "Pembuatan Website";
  choosePackage(category, `${name} (${val})`);
}

function setPricingTab(type) {
  currentPricingMode = type;
  const container = document.getElementById("pricing-container");
  const wrapper = document.getElementById("pricing-cards-wrapper");
  const card4 = document.getElementById("pricing-card-4");
  const popularBadge = document.getElementById("popular-badge");

  if (wrapper) {
    wrapper.style.opacity = "0.35";
    wrapper.style.transform = "translateY(8px)";
    setTimeout(() => {
      wrapper.style.opacity = "1";
      wrapper.style.transform = "translateY(0)";
    }, 160);
  }

  const tabSosmed = document.getElementById("tab-sosmed");
  const tabWeb = document.getElementById("tab-web");
  const vals = document.querySelectorAll(".price-val");
  const names = document.querySelectorAll(".price-name");
  const subs = document.querySelectorAll(".price-sub");
  const cats = document.querySelectorAll(".price-category");

  const list1 = document.getElementById("price-list-1");
  const list2 = document.getElementById("price-list-2");
  const list3 = document.getElementById("price-list-3");
  const list4 = document.getElementById("price-list-4");

  if (type === "sosmed") {
    tabSosmed.className =
      "px-6 sm:px-8 py-2.5 rounded-full text-xs sm:text-sm font-bold bg-brandBlue text-white transition-all shadow-sm";
    tabWeb.className =
      "px-6 sm:px-8 py-2.5 rounded-full text-xs sm:text-sm font-semibold text-brandGrayText hover:text-brandDark transition-all";

    if (container) {
      container.classList.remove("max-w-7xl");
      container.classList.add("max-w-5xl");
    }
    if (wrapper) {
      wrapper.className =
        "grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 text-left transition-all duration-300";
    }
    if (card4) {
      card4.classList.add("hidden");
      card4.classList.remove("flex");
    }
    if (popularBadge) {
      popularBadge.innerText = "PALING POPULER";
    }

    cats[0].innerText = "BRONZE";
    cats[1].innerText = "SILVER";
    cats[2].innerText = "GOLD";

    vals[0].innerHTML =
      'Rp 750.000 <span class="text-xs font-normal text-brandGrayText">/bulan</span>';
    vals[1].innerHTML =
      'Rp 1.200.000 <span class="text-xs font-normal text-brandGrayText">/bulan</span>';
    vals[2].innerHTML =
      'Rp 2.800.000 <span class="text-xs font-normal text-brandGrayText">/bulan</span>';

    names[0].innerText = "Bronze";
    names[1].innerText = "Silver";
    names[2].innerText = "Gold";

    subs[0].innerHTML =
      '<strong class="block text-brandDark mb-1">Solusi Hemat &amp; Rapi</strong>Solusi awal hemat dan rapi untuk usaha yang ingin mulai aktif di sosial media.';
    subs[1].innerHTML =
      '<strong class="block text-brandDark mb-1">Branding Konsisten</strong>Paket paling pas buat UMKM yang ingin interaksi kencang dan branding konsisten.';
    subs[2].innerHTML =
      '<strong class="block text-brandDark mb-1">Pendampingan All-In</strong>Pendampingan menyeluruh dari media sosial, company profile hingga Google review.';

    if (list1) {
      list1.innerHTML = `
        <div class="flex items-center gap-2"><span class="text-brandBlue font-bold">✓</span> Content Planning</div>
        <div class="flex items-center gap-2"><span class="text-brandBlue font-bold">✓</span> 9 Post</div>
        <div class="flex items-center gap-2"><span class="text-brandBlue font-bold">✓</span> 1 Template Story</div>
        <div class="flex items-center gap-2"><span class="text-brandBlue font-bold">✓</span> 2x Revisi</div>
        <div class="flex items-center gap-2"><span class="text-brandBlue font-bold">✓</span> 2 Reels</div>
        <div class="flex items-center gap-2"><span class="text-brandBlue font-bold">✓</span> Channel WA</div>
        <div class="flex items-center gap-2"><span class="text-brandBlue font-bold">✓</span> Report Bulanan</div>
      `;
    }
    if (list2) {
      list2.innerHTML = `
        <div class="flex items-center gap-2"><span class="text-brandBlue font-bold">✓</span> Content Planning</div>
        <div class="flex items-center gap-2"><span class="text-brandBlue font-bold">✓</span> 12 Post</div>
        <div class="flex items-center gap-2"><span class="text-brandBlue font-bold">✓</span> 3 Template Story</div>
        <div class="flex items-center gap-2"><span class="text-brandBlue font-bold">✓</span> 3x Revisi</div>
        <div class="flex items-center gap-2"><span class="text-brandBlue font-bold">✓</span> 3 Reels</div>
        <div class="flex items-center gap-2"><span class="text-brandBlue font-bold">✓</span> Channel WA</div>
        <div class="flex items-center gap-2"><span class="text-brandBlue font-bold">✓</span> Report Bulanan</div>
      `;
    }
    if (list3) {
      list3.innerHTML = `
        <div class="flex items-center gap-2"><span class="text-brandBlue font-bold">✓</span> Content Planning</div>
        <div class="flex items-center gap-2"><span class="text-brandBlue font-bold">✓</span> 21 Post</div>
        <div class="flex items-center gap-2"><span class="text-brandBlue font-bold">✓</span> 3 Template Story</div>
        <div class="flex items-center gap-2"><span class="text-brandBlue font-bold">✓</span> 5x Revisi</div>
        <div class="flex items-center gap-2"><span class="text-brandBlue font-bold">✓</span> 5 Reels</div>
        <div class="flex items-center gap-2"><span class="text-brandBlue font-bold">✓</span> Channel WA</div>
        <div class="flex items-center gap-2"><span class="text-brandBlue font-bold">✓</span> Report Bulanan</div>
        <div class="flex items-center gap-2"><span class="text-brandBlue font-bold">✓</span> Basic Landing Page</div>
        <div class="flex items-center gap-2"><span class="text-brandBlue font-bold">✓</span> Google Review</div>
      `;
    }
  } else {
    tabWeb.className =
      "px-6 sm:px-8 py-2.5 rounded-full text-xs sm:text-sm font-bold bg-brandBlue text-white transition-all shadow-sm";
    tabSosmed.className =
      "px-6 sm:px-8 py-2.5 rounded-full text-xs sm:text-sm font-semibold text-brandGrayText hover:text-brandDark transition-all";

    if (container) {
      container.classList.remove("max-w-5xl");
      container.classList.add("max-w-7xl");
    }
    if (wrapper) {
      wrapper.className =
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left transition-all duration-300";
    }
    if (card4) {
      card4.classList.remove("hidden");
      card4.classList.add("flex");
    }
    if (popularBadge) {
      popularBadge.innerText = "REKOMENDASI KLIEN";
    }

    cats[0].innerText = "LANDING PAGE";
    cats[1].innerText = "BUSINESS PRO";
    cats[2].innerText = "PREMIUM";
    if (cats[3]) cats[3].innerText = "ENTERPRISE";

    vals[0].innerHTML =
      '<span class="block text-xs font-normal text-gray-400 line-through">Rp 2.500.000</span>Rp 1.500.000';
    vals[1].innerHTML =
      '<span class="block text-xs font-normal text-gray-400 line-through">Rp 4.000.000</span>Rp 2.400.000';
    vals[2].innerHTML =
      '<span class="block text-xs font-normal text-gray-400 line-through">Rp 8.000.000</span>Rp 4.500.000';
    if (vals[3]) vals[3].innerHTML = "Hubungi Kami";

    names[0].innerText = "Landing Page";
    names[1].innerText = "Business Pro";
    names[2].innerText = "Premium";
    if (names[3]) names[3].innerText = "Enterprise";

    subs[0].innerHTML =
      '<strong class="block text-brandDark mb-1">Cocok untuk Usaha Rintisan</strong>Website 1 halaman praktis untuk promosi dan langsung arahkan pembeli chat ke WhatsApp.';
    subs[1].innerHTML =
      '<strong class="block text-brandDark mb-1">Paling Pas untuk Bisnis Berkembang</strong>Website profil usaha lengkap &amp; profesional agar bisnis makin dipercaya pelanggan.';
    subs[2].innerHTML =
      '<strong class="block text-brandDark mb-1">Untuk Brand &amp; Usaha Mapan</strong>Website skala besar dengan tampilan lebih interaktif, dua bahasa, dan fitur berita.';
    if (subs[3]) {
      subs[3].innerHTML =
        '<strong class="block text-brandDark mb-1">Toko Online, Booking &amp; Sistem Khusus</strong>Website dengan sistem transaksi atau operasional otomatis sesuai kebutuhan bisnis Anda.';
    }

    if (list1) {
      list1.innerHTML = `
        <div class="flex items-center gap-2"><span class="text-brandBlue font-bold">✓</span> 1 halaman ringkas (maks. 6 bagian)</div>
        <div class="flex items-center gap-2"><span class="text-brandBlue font-bold">✓</span> Tampilan rapi di HP &amp; laptop</div>
        <div class="flex items-center gap-2"><span class="text-brandBlue font-bold">✓</span> Mudah ditemukan di Google</div>
        <div class="flex items-center gap-2"><span class="text-brandBlue font-bold">✓</span> Formulir kontak &amp; tombol WhatsApp</div>
        <div class="flex items-center gap-2"><span class="text-brandBlue font-bold">✓</span> Gratis revisi 2x</div>
        <div class="flex items-center gap-2"><span class="text-brandBlue font-bold">✓</span> Selesai 7 hari kerja + bantuan 1 bulan</div>
      `;
    }

    if (list2) {
      list2.innerHTML = `
        <div class="flex items-center gap-2"><span class="text-brandBlue font-bold">✓</span> Hingga 10 halaman (desain khusus)</div>
        <div class="flex items-center gap-2"><span class="text-brandBlue font-bold">✓</span> Tampilan rapi di HP, tablet &amp; laptop</div>
        <div class="flex items-center gap-2"><span class="text-brandBlue font-bold">✓</span> Optimasi agar lebih mudah muncul di Google</div>
        <div class="flex items-center gap-2"><span class="text-brandBlue font-bold">✓</span> Bisa edit teks &amp; foto sendiri dengan mudah</div>
        <div class="flex items-center gap-2"><span class="text-brandBlue font-bold">✓</span> Gratis revisi 3x</div>
        <div class="flex items-center gap-2"><span class="text-brandBlue font-bold">✓</span> Selesai 21 hari kerja + bantuan 3 bulan</div>
      `;
    }

    if (list3) {
      list3.innerHTML = `
        <div class="flex items-center gap-2"><span class="text-brandBlue font-bold">✓</span> Hingga 20 halaman (desain eksklusif)</div>
        <div class="flex items-center gap-2"><span class="text-brandBlue font-bold">✓</span> 2 Bahasa (Indonesia &amp; Inggris)</div>
        <div class="flex items-center gap-2"><span class="text-brandBlue font-bold">✓</span> Animasi &amp; tampilan lebih hidup</div>
        <div class="flex items-center gap-2"><span class="text-brandBlue font-bold">✓</span> Akses website super cepat</div>
        <div class="flex items-center gap-2"><span class="text-brandBlue font-bold">✓</span> Halaman blog / berita yang mudah di-update</div>
        <div class="flex items-center gap-2"><span class="text-brandBlue font-bold">✓</span> Gratis revisi 3x</div>
        <div class="flex items-center gap-2"><span class="text-brandBlue font-bold">✓</span> Selesai 6–8 minggu + bantuan 4 bulan</div>
      `;
    }

    if (list4) {
      list4.innerHTML = `
        <div class="flex items-center gap-2"><span class="text-brandBlue font-bold">✓</span> Toko online dengan pembayaran otomatis</div>
        <div class="flex items-center gap-2"><span class="text-brandBlue font-bold">✓</span> Sistem booking &amp; reservasi online</div>
        <div class="flex items-center gap-2"><span class="text-brandBlue font-bold">✓</span> Dashboard admin / sistem internal khusus</div>
        <div class="flex items-center gap-2"><span class="text-brandBlue font-bold">✓</span> Terhubung otomatis ke pembayaran &amp; ongkir</div>
        <div class="flex items-center gap-2"><span class="text-brandBlue font-bold">✓</span> Harga &amp; lama pengerjaan sesuai kebutuhan</div>
      `;
    }
  }
  setTimeout(buildTimelineModel, 100);
}

function scrollFaqTrack(direction) {
  const container = document.getElementById("faq-card-grid");
  if (!container) return;
  const scrollAmount = direction === "left" ? -320 : 320;
  container.scrollBy({ left: scrollAmount, behavior: "smooth" });
}

function activateFaqCard(index) {
  const cards = document.querySelectorAll("#faq-card-grid .faq-card");
  const counterBadge = document.getElementById("faq-counter-badge");
  if (counterBadge) {
    counterBadge.innerText = `0${index + 1} / 0${cards.length}`;
  }
  cards.forEach((card, i) => {
    const answer = card.querySelector(".faq-card-answer");
    const heading = card.querySelector(".faq-card-title");
    const footer = card.querySelector(".faq-card-footer");
    const badge = card.querySelector(".faq-status-badge");

    if (i === index) {
      card.className =
        "faq-card snap-start shrink-0 w-[300px] sm:w-[420px] lg:w-[480px] h-[420px] bg-brandBlue text-white p-6 sm:p-8 rounded-3xl flex flex-col justify-between shadow-xl cursor-pointer select-none transition-all duration-300";
      if (answer) {
        answer.classList.remove("hidden");
        answer.style.display = "block";
      }
      if (heading)
        heading.className =
          "faq-card-title text-lg sm:text-2xl font-bold leading-snug tracking-tight mb-4 text-white break-words";
      if (footer)
        footer.className =
          "faq-card-footer text-xs font-semibold uppercase tracking-wider text-blue-200 pt-4 border-t border-white/10 mt-auto flex items-center justify-between shrink-0";
      if (badge) {
        badge.innerText = "TERBUKA";
        badge.className =
          "faq-status-badge text-[10px] bg-white/20 px-2.5 py-0.5 rounded-full text-white";
      }
      card.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    } else {
      card.className =
        "faq-card snap-start shrink-0 w-[260px] sm:w-[280px] h-[420px] bg-[#E2E4E8] text-brandDark p-6 sm:p-8 rounded-3xl flex flex-col justify-between shadow-sm hover:shadow-md cursor-pointer select-none transition-all duration-300";
      if (answer) {
        answer.classList.add("hidden");
        answer.style.display = "none";
      }
      if (heading)
        heading.className =
          "faq-card-title text-base sm:text-xl font-bold leading-snug tracking-tight mb-4 text-gray-800 break-words";
      if (footer)
        footer.className =
          "faq-card-footer text-xs font-semibold uppercase tracking-wider text-gray-500 pt-4 border-t border-gray-300/60 mt-auto flex items-center justify-between shrink-0";
      if (badge) {
        badge.innerText = "KLIK DETAIL";
        badge.className =
          "faq-status-badge text-[10px] bg-gray-300/60 px-2.5 py-0.5 rounded-full text-gray-600";
      }
    }
  });
}

function handleContactSubmit(e) {
  e.preventDefault();
  const name = document.getElementById("form-name").value;
  const phone = document.getElementById("form-phone").value;
  const service = document.getElementById("form-service").value;
  const pkgNote = selectedPackageLabel
    ? ` (Paket: ${selectedPackageLabel})`
    : "";

  const text = `Halo PAYU Studio! Saya ${name} (${phone}), ingin konsultasi mengenai layanan ${service}${pkgNote}.`;
  const waUrl = `https://wa.me/6289676970005?text=${encodeURIComponent(text)}`;

  const toast = document.getElementById("toast");
  if (toast) {
    toast.classList.remove("translate-y-24", "opacity-0");
    setTimeout(() => toast.classList.add("translate-y-24", "opacity-0"), 3500);
  }

  setTimeout(() => {
    window.open(waUrl, "_blank");
  }, 800);
}

let isLooping = false;
let loopCooldown = false;

function executeInfiniteLoop(toTop = true) {
  if (loopCooldown) return;
  loopCooldown = true;
  isLooping = true;

  const overlay = document.getElementById("loop-color-overlay");
  if (overlay) {
    overlay.classList.remove("opacity-0", "pointer-events-none");
    overlay.classList.add("opacity-100");
  }

  setTimeout(() => {
    const targetY = toTop ? 0 : getKontakEndScroll();
    window.scrollTo(0, targetY);
    if (typeof lenis !== "undefined" && lenis) {
      lenis.scrollTo(targetY, { immediate: true });
    }
    window.dispatchEvent(new Event("scroll"));

    setTimeout(() => {
      if (overlay) {
        overlay.classList.remove("opacity-100");
        overlay.classList.add("opacity-0", "pointer-events-none");
      }
      setTimeout(() => {
        loopCooldown = false;
        isLooping = false;
      }, 500);
    }, 200);
  }, 500);
}

window.scrollToSection = scrollToSection;
window.selectService = selectService;
window.setPricingTab = setPricingTab;
window.choosePackage = choosePackage;
window.clearSelectedPackage = clearSelectedPackage;
window.selectPricingCard = selectPricingCard;
window.scrollFaqTrack = scrollFaqTrack;
window.activateFaqCard = activateFaqCard;
window.handleContactSubmit = handleContactSubmit;
window.executeInfiniteLoop = executeInfiniteLoop;
window.openCaseModal = openCaseModal;
window.closeCaseModal = closeCaseModal;
window.toggleMobileMenu = toggleMobileMenu;
window.closeMobileMenu = closeMobileMenu;

function initWordScrollReveal() {
  const container = document.getElementById("scroll-reveal-text");
  if (!container) return;
  const words = container.querySelectorAll(".rev-word");
  if (!words.length) return;

  function updateWordReveal() {
    const section = document.getElementById("catchphrase-section");
    if (!section) return;
    const rect = section.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const startThreshold = windowHeight * 0.5;
    const endThreshold = windowHeight * 0.005;

    const progress = Math.max(
      0,
      Math.min(
        1,
        (startThreshold - rect.top) / (startThreshold - endThreshold),
      ),
    );
    const activeIndex = Math.floor(progress * words.length);

    words.forEach((word, idx) => {
      const isHighlight = word.getAttribute("data-highlight") === "true";
      if (idx <= activeIndex) {
        word.classList.remove("text-gray-300", "scale-95");
        if (isHighlight) {
          word.classList.add("text-brandBlue", "scale-105", "font-black");
        } else {
          word.classList.add("text-brandDark", "scale-100");
        }
      } else {
        word.classList.remove(
          "text-brandDark",
          "text-brandBlue",
          "scale-105",
          "font-black",
        );
        word.classList.add("text-gray-300", "scale-95");
      }
    });
  }

  window.addEventListener("scroll", updateWordReveal, { passive: true });
  if (lenis) lenis.on("scroll", updateWordReveal);
  updateWordReveal();
}

document.addEventListener("DOMContentLoaded", () => {
  const navWrapper = document.getElementById("main-nav-wrapper");
  const progressBar = document.getElementById("scroll-progress-bar");
  const allNavBlocks = document.querySelectorAll(".nav-block[data-target]");
  const heroText = document.getElementById("hero-text-content");
  const heroMonumen = document.getElementById("hero-monumen-wrapper");
  const darkOverlay = document.getElementById("footer-dark-overlay");
  const logo = document.getElementById("footer-glowing-logo");
  const glowBg = document.getElementById("footer-glow-bg");
  const subDetails = document.getElementById("footer-sub-details");
  const giantBrand = document.getElementById("footer-giant-brand");

  initWordScrollReveal();
  buildTimelineModel();
  window.addEventListener(
    "resize",
    () => {
      if (window.innerWidth >= 768 && mobileMenuOpen) closeMobileMenu();
      buildTimelineModel();
    },
    { passive: true },
  );
  setTimeout(buildTimelineModel, 500);

  // Close modal on Escape key
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeCaseModal();
      if (mobileMenuOpen) closeMobileMenu();
    }
  });

  // Scroll Reveal & Animated Number Counters via IntersectionObserver
  const revealEls = document.querySelectorAll(".reveal-up");
  if ("IntersectionObserver" in window) {
    const revealObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14 },
    );
    revealEls.forEach((el) => revealObs.observe(el));

    // Counter Animation
    const counters = document.querySelectorAll("[data-counter]");
    const counterObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const targetVal = parseInt(el.getAttribute("data-counter"), 10);
          const suffix = el.getAttribute("data-suffix") || "";
          const duration = 1400;
          const startTime = performance.now();

          function tickCounter(now) {
            const elapsed = now - startTime;
            const p = Math.min(1, elapsed / duration);
            const eased = 1 - Math.pow(1 - p, 3);
            el.innerText = Math.floor(eased * targetVal) + suffix;
            if (p < 1) requestAnimationFrame(tickCounter);
          }
          requestAnimationFrame(tickCounter);
          counterObs.unobserve(el);
        });
      },
      { threshold: 0.5 },
    );
    counters.forEach((c) => counterObs.observe(c));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  // Subtle Magnetic Pull on Primary Buttons (Desktop only)
  if (window.matchMedia("(pointer: fine)").matches) {
    document.querySelectorAll("[data-magnetic]").forEach((btn) => {
      btn.addEventListener("mousemove", (e) => {
        const rect = btn.getBoundingClientRect();
        const dx = (e.clientX - (rect.left + rect.width / 2)) * 0.18;
        const dy = (e.clientY - (rect.top + rect.height / 2)) * 0.18;
        btn.style.transform = `translate(${dx}px, ${dy}px)`;
      });
      btn.addEventListener("mouseleave", () => {
        btn.style.transform = "";
      });
    });
  }

  // Floating preview on Service Rows with Velocity Tilt (only runs rAF when active)
  const floatingPreview = document.getElementById("service-floating-preview");
  const previewImg = document.getElementById("floating-preview-img");
  const previewTitle = document.getElementById("floating-preview-title");
  const previewTag = document.getElementById("floating-preview-tag");
  const serviceItems = document.querySelectorAll(".service-item");

  let mouseX = 0,
    mouseY = 0,
    curX = 0,
    curY = 0;
  let previewLoopActive = false;

  window.addEventListener(
    "mousemove",
    (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    },
    { passive: true },
  );

  function renderFloatingPreview() {
    if (!previewLoopActive) return;
    const vx = mouseX - curX;
    curX += vx * 0.16;
    curY += (mouseY - curY) * 0.16;
    const tilt = Math.max(-7, Math.min(7, vx * 0.12));
    if (floatingPreview) {
      floatingPreview.style.left = `${curX + 40}px`;
      floatingPreview.style.top = `${curY}px`;
      floatingPreview.style.transform = `translate(-50%, -50%) scale(1) rotate(${tilt}deg)`;
    }
    requestAnimationFrame(renderFloatingPreview);
  }

  serviceItems.forEach((item) => {
    item.addEventListener("mouseenter", () => {
      const img = item.getAttribute("data-img");
      const title = item.getAttribute("data-title");
      const tag = item.getAttribute("data-tag");
      if (img && previewImg && floatingPreview && window.innerWidth >= 1024) {
        previewImg.src = img;
        previewTitle.innerText = title;
        previewTag.innerText = tag;
        curX = mouseX;
        curY = mouseY;
        floatingPreview.classList.add("active");
        if (!previewLoopActive) {
          previewLoopActive = true;
          requestAnimationFrame(renderFloatingPreview);
        }
      }
    });
    item.addEventListener("mouseleave", () => {
      if (floatingPreview) {
        floatingPreview.classList.remove("active");
        floatingPreview.style.transform = `translate(-50%, -50%) scale(0.86) rotate(0deg)`;
      }
      previewLoopActive = false;
    });
  });

  // Overscroll wheel loop trigger at bottom of footer
  let wheelOverscrollCount = 0;
  window.addEventListener(
    "wheel",
    (e) => {
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll =
        window.pageYOffset || document.documentElement.scrollTop;
      if (currentScroll >= maxScroll - 15 && e.deltaY > 25) {
        wheelOverscrollCount++;
        if (wheelOverscrollCount >= 2 && !loopCooldown) {
          wheelOverscrollCount = 0;
          executeInfiniteLoop(true);
        }
      } else {
        wheelOverscrollCount = 0;
      }
    },
    { passive: true },
  );

  // High-Performance Scroll Sync (Zero DOM Reflows / Zero getBoundingClientRect inside scroll)
  let scrollTicking = false;
  function updateScrollFrame() {
    scrollTicking = false;
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    // 1. Update Edge-to-Edge Progress Bar (mapped 1:1 with navbar blocks up to end of Sapa Kami)
    const pct = computeProgressBarPercentage(scrollY);
    if (progressBar) {
      progressBar.style.width = `${pct}%`;
    }

    // 2. Active Block Highlight
    let activeId = "beranda";
    for (let i = 0; i < timelineModel.length; i++) {
      if (scrollY >= timelineModel[i].scrollStart - 12) {
        activeId = timelineModel[i].id;
      }
    }
    allNavBlocks.forEach((block) => {
      block.classList.toggle(
        "active",
        block.getAttribute("data-target") === activeId,
      );
    });

    // 3. Hero Parallax (using cached height)
    if (scrollY <= cachedMaxHeroParallax) {
      const p = scrollY / cachedMaxHeroParallax;
      if (heroText) {
        heroText.style.transform = `translateY(${scrollY * 0.28}px)`;
        heroText.style.opacity = Math.max(0, 1 - p * 1.55);
      }
      if (heroMonumen) {
        heroMonumen.style.transform = `translateY(${scrollY * 0.11}px)`;
      }
    }

    // 4. Footer Parallax & Navbar Theme Switching (using cached coordinates)
    const footerOffsetTop = cachedFooterTop - scrollY;
    const inDarkFooter = footerOffsetTop <= NAV_HEIGHT;

    if (navWrapper) {
      if (inDarkFooter) {
        navWrapper.classList.remove("nav-theme-hero", "nav-theme-scrolled");
        navWrapper.classList.add("nav-theme-dark");
        if (progressBar) progressBar.style.backgroundColor = "#3B82F6";
      } else if (scrollY >= cachedKenapaStart - 20) {
        navWrapper.classList.remove("nav-theme-hero", "nav-theme-dark");
        navWrapper.classList.add("nav-theme-scrolled");
        if (progressBar) progressBar.style.backgroundColor = "#003893";
      } else {
        navWrapper.classList.remove("nav-theme-scrolled", "nav-theme-dark");
        navWrapper.classList.add("nav-theme-hero");
        if (progressBar) progressBar.style.backgroundColor = "#FFFFFF";
      }
    }

    // 5. Footer Logo Zoom & Reveal
    if (scrollY + window.innerHeight >= cachedFooterTop) {
      const scrolledIntoFooter = Math.max(0, scrollY - cachedFooterTop);
      const progress = Math.max(
        0,
        Math.min(1, scrolledIntoFooter / cachedFooterTotalDist),
      );

      const darkProgress = Math.min(1, Math.max(0, progress / 0.25));
      if (darkOverlay) darkOverlay.style.opacity = darkProgress;

      const textProgress = Math.max(0, Math.min(1, (progress - 0.2) / 0.3));
      const textOpacity = Math.min(1, textProgress * 1.5);
      if (subDetails) {
        subDetails.style.opacity = textOpacity;
        subDetails.style.transform = `translateY(${(1 - textProgress) * 30}px)`;
      }
      if (giantBrand) {
        giantBrand.style.opacity = textOpacity;
        giantBrand.style.transform = `translateY(${(1 - textProgress) * 50}px)`;
      }

      const entranceProgress = Math.max(0, Math.min(1, (progress - 0.1) / 0.3));
      let logoScale = 0.6;
      if (progress <= 0.45) {
        logoScale = 0.6 + (0.4 * (progress - 0.1)) / 0.35;
      } else {
        const zoomProgress = (progress - 0.45) / 0.48;
        logoScale = 1.0 + Math.pow(Math.max(0, zoomProgress), 2.2) * 13.0;
      }

      if (glowBg) {
        glowBg.style.opacity = Math.min(1, entranceProgress * 1.2);
        glowBg.style.transform = `translate(-50%, -50%) scale(${0.5 + progress * 2.8})`;
      }
      if (logo) {
        logo.style.opacity = Math.min(1, entranceProgress * 1.5);
        logo.style.transform = `scale(${logoScale})`;
      }

      if (progress >= 0.96 && !loopCooldown && !isProgrammaticNav) {
        executeInfiniteLoop(true);
      }
    }
  }

  function handleScrollSync() {
    if (!scrollTicking) {
      scrollTicking = true;
      requestAnimationFrame(updateScrollFrame);
    }
  }

  window.addEventListener("scroll", handleScrollSync, { passive: true });
  if (lenis) lenis.on("scroll", handleScrollSync);
  updateScrollFrame();
});
