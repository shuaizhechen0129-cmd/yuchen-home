const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const tabs = Array.from(document.querySelectorAll(".layout-tab"));
const panels = Array.from(document.querySelectorAll(".layout-panel"));
const revealItems = Array.from(document.querySelectorAll(".reveal"));
const langButtons = Array.from(document.querySelectorAll(".lang-button"));
const year = document.querySelector("#year");
const storageKey = "yuchen-language";

// Image carousel functionality
class ImageCarousel {
  constructor(carouselId) {
    this.carousel = document.getElementById(carouselId);
    if (!this.carousel) return;

    this.container = this.carousel.querySelector('.carousel-container');
    this.slides = this.carousel.querySelectorAll('.carousel-slide');
    this.prevButton = this.carousel.querySelector('.carousel-nav.prev');
    this.nextButton = this.carousel.querySelector('.carousel-nav.next');
    this.currentIndex = 0;
    this.isDragging = false;
    this.startX = 0;
    this.currentX = 0;
    this.translateX = 0;

    this.init();
  }

  init() {
    // Add dots indicator
    this.addDots();

    // Add event listeners
    this.prevButton.addEventListener('click', () => this.prevSlide());
    this.nextButton.addEventListener('click', () => this.nextSlide());

    // Touch events
    this.container.addEventListener('touchstart', (e) => this.handleTouchStart(e));
    this.container.addEventListener('touchmove', (e) => this.handleTouchMove(e));
    this.container.addEventListener('touchend', () => this.handleTouchEnd());

    // Mouse events
    this.container.addEventListener('mousedown', (e) => this.handleMouseDown(e));
    this.container.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    this.container.addEventListener('mouseup', () => this.handleMouseUp());
    this.container.addEventListener('mouseleave', () => this.handleMouseUp());

    // Keyboard navigation
    this.carousel.addEventListener('keydown', (e) => this.handleKeyDown(e));
    this.container.setAttribute('tabindex', '0');

    // Pause on hover
    this.carousel.addEventListener('mouseenter', () => this.pauseAutoPlay());
    this.carousel.addEventListener('mouseleave', () => this.startAutoPlay());

    // Start auto play
    this.startAutoPlay();
  }

  addDots() {
    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'carousel-dots';

    this.slides.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot';
      if (index === 0) dot.classList.add('active');
      dot.addEventListener('click', () => this.goToSlide(index));
      dotsContainer.appendChild(dot);
    });

    this.carousel.appendChild(dotsContainer);
    this.dots = dotsContainer.querySelectorAll('.carousel-dot');
  }

  updateCarousel() {
    this.translateX = -this.currentIndex * 100;
    this.container.style.transform = `translateX(${this.translateX}%)`;

    // Update dots
    this.dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === this.currentIndex);
    });
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
    this.updateCarousel();
    this.resetAutoPlay();
  }

  prevSlide() {
    this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
    this.updateCarousel();
    this.resetAutoPlay();
  }

  goToSlide(index) {
    this.currentIndex = index;
    this.updateCarousel();
    this.resetAutoPlay();
  }

  handleTouchStart(e) {
    this.isDragging = true;
    this.startX = e.touches[0].clientX;
    this.pauseAutoPlay();
  }

  handleTouchMove(e) {
    if (!this.isDragging) return;
    e.preventDefault();
    this.currentX = e.touches[0].clientX;
    const diff = this.currentX - this.startX;
    const currentTranslate = this.currentIndex * -100;
    this.container.style.transform = `translateX(${currentTranslate + (diff / this.carousel.offsetWidth) * 100}%)`;
  }

  handleTouchEnd() {
    if (!this.isDragging) return;
    this.isDragging = false;

    const diff = this.currentX - this.startX;
    const threshold = this.carousel.offsetWidth * 0.2;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        this.prevSlide();
      } else {
        this.nextSlide();
      }
    } else {
      this.updateCarousel();
    }

    this.startAutoPlay();
  }

  handleMouseDown(e) {
    this.isDragging = true;
    this.startX = e.clientX;
    this.currentX = e.clientX;
    this.carousel.style.cursor = 'grabbing';
    this.pauseAutoPlay();
  }

  handleMouseMove(e) {
    if (!this.isDragging) return;
    e.preventDefault();
    this.currentX = e.clientX;
    const diff = this.currentX - this.startX;
    const currentTranslate = this.currentIndex * -100;
    this.container.style.transform = `translateX(${currentTranslate + (diff / this.carousel.offsetWidth) * 100}%)`;
  }

  handleMouseUp() {
    if (!this.isDragging) return;
    this.isDragging = false;
    this.carousel.style.cursor = 'grab';

    const diff = this.currentX - this.startX;
    const threshold = this.carousel.offsetWidth * 0.2;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        this.prevSlide();
      } else {
        this.nextSlide();
      }
    } else {
      this.updateCarousel();
    }

    this.startAutoPlay();
  }

  handleKeyDown(e) {
    switch(e.key) {
      case 'ArrowLeft':
        this.prevSlide();
        break;
      case 'ArrowRight':
        this.nextSlide();
        break;
    }
  }

  startAutoPlay() {
    this.stopAutoPlay();
    this.autoPlayInterval = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  pauseAutoPlay() {
    this.stopAutoPlay();
  }

  stopAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  }

  resetAutoPlay() {
    this.pauseAutoPlay();
    this.startAutoPlay();
  }
}

// Initialize all carousels
document.addEventListener('DOMContentLoaded', () => {
  new ImageCarousel('carousel-a');
  new ImageCarousel('carousel-b');
  new ImageCarousel('carousel-c');
});

function getStoredLanguage() {
  try {
    return window.localStorage.getItem(storageKey);
  } catch {
    return null;
  }
}

function setStoredLanguage(language) {
  try {
    window.localStorage.setItem(storageKey, language);
  } catch {
    // Ignore storage failures and keep the current page state.
  }
}

const translations = {
  zh: {
    html_lang: "zh-CN",
    "meta.title": "雨宸公寓 | 上海嘉定保租房官方网站",
    "meta.description":
      "雨宸公寓位于上海嘉定区菊园新区中心，提供约32-45平方米品质保租房、公区配套与安心服务，打造15分钟生活圈中的青年安居社区。",
    "header.brand_aria": "雨宸公寓首页",
    "header.nav_aria": "主导航",
    "header.nav_toggle_aria": "切换导航",
    "header.menu_label": "菜单",
    "header.hotline": "咨询热线 021-69588188",
    "header.cta": "立即咨询",
    "header.lang_zh": "中文",
    "header.lang_en": "EN",
    "mobile.contact_cta": "联系我们",
    "nav.overview": "项目概览",
    "nav.location": "生活圈",
    "nav.experience": "居住体验",
    "nav.layouts": "户型鉴赏",
    "nav.amenities": "共享设施",
    "nav.contact": "联系我们",
    "hero.eyebrow": "上海嘉定 菊园新区保租房社区",
    "hero.title": "雨宸公寓",
    "hero.text":
      "位于上海市嘉定区菊园新区中心，邻近11号线嘉定北站与嘉闵线城北路站，以约32-45m²品质户型、共享社区空间、景观绿意与安心服务，为城市青年和企业人才提供更体面、更稳定、更有温度的租住生活。作为政府认证的保障性住房，可提取住房公积金，让安居更有保障。",
    "hero.primary_cta": "预约咨询",
    "hero.secondary_cta": "查看企业宣讲册",
    "hero.stat_units": "套房源",
    "hero.stat_area": "主力建面",
    "hero.stat_circle": "生活圈",
    "hero.stat_monitor": "设备监控",
    "hero.quote1": "【雨】你一起",
    "hero.quote2": "【宸】就生活",
    "hero.image_alt": "雨宸公寓项目主视觉",
    "hero.note_label": "官方资料提炼",
    "hero.note_text": "地铁可达 · 绿意环绕 · 社群共享 · 安心居住",
    "overview.eyebrow": "项目概览",
    "overview.title": "一个适合长期安居的保租房社区",
    "overview.text":
      "雨宸公寓不是单一的租房产品，而是围绕通勤、休闲、社交、居住品质与服务保障，打造的城市型青年安居解决方案。",
    "overview.card1.title": "地段与通勤",
    "overview.card1.text": "位于嘉定菊园新区中心，临近11号线嘉定北站、嘉闵线城北路站，出行衔接顺畅。",
    "overview.card2.title": "社区与配套",
    "overview.card2.text": "共享健身房、洗衣房、阅览室、桌球室与台球室，让生活从居住延展到社交与兴趣。",
    "overview.card3.title": "品质与服务",
    "overview.card3.text": "智能闸机、人脸识别、迅达电梯、维修响应、前台服务与社群活动，构建安心入住体验。",
    "location.eyebrow": "15分钟生活圈",
    "location.title": "四维生活圈，举步即达",
    "location.text": "项目周边商业、休闲、医疗和交通配套成熟，兼顾城市效率与日常生活便利。",
    "location.traffic.title": "交通",
    "location.traffic.text": "11号线嘉定北站、嘉闵线城北路站、环城路北大街公交、平成路陈家山路公交。",
    "location.commerce.title": "商业",
    "location.commerce.text": "信业购物中心、日月光中心、嘉定老街、大润发，满足日常消费与休闲需求。",
    "location.leisure.title": "休闲",
    "location.leisure.text": "环城河步行道、嘉定老城区、博物馆、州桥老街，生活节奏松弛而丰富。",
    "location.medical.title": "医疗",
    "location.medical.text": "嘉定中心医院、嘉定中医院、社区卫生服务中心，为日常与应急提供支持。",
    "location.map_alt": "雨宸公寓15分钟生活圈示意图",
    "location.map_caption": "社区位于上海市嘉定区菊园新区中心，周边配套齐全，畅达城芯。",
    "experience.eyebrow": "居住体验",
    "experience.title": "把归家、社交、自然与服务串联起来",
    "experience.text": "从入户大堂到共享空间，从推窗见绿到安心服务，雨宸公寓希望把“住得好”具体化。",
    "experience.card1.kicker": "景观环境",
    "experience.card1.title": "推窗见绿，移步即景",
    "experience.card1.text":
      "私享口袋花园，河川环绕，社区绿化种有樱花、玉兰、合欢、桂花等40余种开花绿植，周边可达盘驼子公园、长廊公园、荷花公园、秋霞圃等城市绿地。",
    "experience.card1.alt": "雨宸公寓景观环境展示",
    "experience.card2.kicker": "入户体验",
    "experience.card2.title": "体面的归家第一印象",
    "experience.card2.text": "8米挑高大堂、与LOGO同线条的水晶吊灯、前台管家服务与双重识别系统，营造安心与品质感。",
    "experience.card2.alt": "雨宸公寓入户大堂",
    "experience.card3.kicker": "共享空间",
    "experience.card3.title": "鼓励连接，也尊重独处",
    "experience.card3.text": "健身房、洗衣房、阅览室、桌球室，共同构成开放、友好、健康的社群生活场景。",
    "experience.card3.alt": "雨宸公寓共享空间",
    "experience.card4.kicker": "安心服务",
    "experience.card4.title": "从配套到社群的一整套支持",
    "experience.card4.text": "覆盖贴心配套、安心居住、维修服务、舒心生活、协助服务和社群活动，让入住后的每一天更省心。",
    "experience.card4.alt": "雨宸公寓安心服务",
    "standards.eyebrow": "居住标准",
    "standards.title": "把居住细节做进日常里",
    "standards.text": "官方资料中反复强调的，并不是“装得多豪华”，而是每一个真正会影响居住体验的基础标准。",
    "standards.card1.title": "超强隔音",
    "standards.card1.text": "阳台门与窗户双重隔音保障，结合三层玻璃配置，为城市生活保留安静居所。",
    "standards.card2.title": "95%遮光率",
    "standards.card2.text": "遮阳窗帘减少光线干扰，帮助建立更稳定的睡眠节奏与居住舒适感。",
    "standards.card3.title": "16m²定制柜体",
    "standards.card3.text": "立体收纳系统带来4倍收纳空间，让衣物、日用品、被褥与杂物都有明确归处。",
    "standards.card4.title": "E0级环保定制家具",
    "standards.card4.text": "金牌橱柜定制家具与完整收纳体系，兼顾环保、耐用与日常使用效率。",
    "standards.card5.title": "厨房电器齐全",
    "standards.card5.text": "冰箱、油烟机、微波炉、电磁炉等基础电器到位，满足一人居、双人居的烹饪需求。",
    "standards.card6.title": "干湿分离卫浴",
    "standards.card6.text": "镜柜与墙柜结合的卫浴收纳，加上定制淋浴空间，使洗护动线更清晰、更整洁。",
    "layouts.eyebrow": "户型鉴赏",
    "layouts.title": "三种主力户型，覆盖不同安居需求",
    "layouts.text": "从高效一居到更舒展的45m²空间，雨宸公寓以统一的品质基线，匹配不同阶段的生活方式。",
    "layouts.tablist_aria": "户型切换",
    "layouts.tab_a": "A户型",
    "layouts.tab_b": "B户型",
    "layouts.tab_c": "C户型",
    "layoutA.kicker": "A户型",
    "layoutA.title": "雨宸·安居",
    "layoutA.metric3": "主力房型",
    "layoutA.text": "适合追求高效通勤和完整功能的一人居住者。卧室、厨房、收纳、独立阳台和干湿分离淋浴空间配置均衡，是项目中的核心主力产品。",
    "layoutA.bullet1": "L形桌面拓展办公、用餐与娱乐需求",
    "layoutA.bullet2": "独立阳台带来采光、通风与晾晒空间",
    "layoutA.bullet3": "AB面床垫与高遮光窗帘提升睡眠体验",
    "layoutA.bullet4": "全屋定制柜体强化日常收纳效率",
    "layoutA.alt": "雨宸公寓A户型展示",
    "layoutB.kicker": "B户型",
    "layoutB.title": "雨宸·欣居",
    "layoutB.metric3": "精致一居",
    "layoutB.text": "B户型延续了项目统一的品质配置，在空间组织上更强调精巧与舒适，适合看重居住氛围、希望拥有完整一居动线的城市青年。",
    "layoutB.bullet1": "厨房、电器与卫浴配置齐全",
    "layoutB.bullet2": "卧室与阳台衔接，保留通透采光感",
    "layoutB.bullet3": "三层玻璃隔音窗构建安静休息环境",
    "layoutB.bullet4": "镜柜、墙柜与杂物收纳空间较为完整",
    "layoutB.alt": "雨宸公寓B户型展示",
    "layoutC.kicker": "C户型",
    "layoutC.title": "45m²舒展空间",
    "layoutC.metric3": "更宽适居住",
    "layoutC.text": "面向更注重空间舒展度的人群，C户型在起居活动、收纳体量和厨房尺度上更从容，能承接更长期、更稳定的安居需求。",
    "layoutC.bullet1": "更大的活动面积提升居家松弛感",
    "layoutC.bullet2": "厨房与阳台尺度更舒展，动线更从容",
    "layoutC.bullet3": "延续16m²定制柜体与环保定制家具体系",
    "layoutC.bullet4": "适合追求长期居住品质的个人或双人居住场景",
    "layoutC.alt": "雨宸公寓C户型展示",
    "contact.eyebrow": "联系我们",
    "contact.title": "欢迎咨询雨宸公寓",
    "contact.text": "支持个人租住咨询，也可对接企业团租、入住流程和政策相关沟通。如需进一步了解房源与入住安排，可通过以下方式联系项目团队。",
    "contact.card1.label": "咨询热线",
        "contact.card3.label": "项目位置",
    "contact.card3.value": "上海市嘉定区菊园新区中心",
    "contact.media_alt": "雨宸公寓官方联系方式与二维码",
    "contact.caption": "扫码关注雨宸公寓客服号，获取最新房源与入住信息。",
    "footer.tagline": "上海嘉定保租房项目展示页",
    "amenities.eyebrow": "共享设施",
    "amenities.title": "共享社区空间",
    "amenities.text": "健身房、洗衣房、阅览室、台球室等共享空间，让生活从居住延展到社交与兴趣。",
    "amenities.gym.title": "健身房",
    "amenities.gym.text": "配备专业健身器材，让您在繁忙的工作之余，保持健康活力。",
    "amenities.laundry.title": "洗衣房",
    "amenities.laundry.text": "配备洗衣机和烘干机，方便您的日常生活，省时省力。",
    "amenities.reading.title": "阅览室",
    "amenities.reading.text": "安静舒适的阅读空间，供您学习、工作或放松身心。",
    "amenities.billiards.title": "台球室",
    "amenities.billiards.text": "专业的台球设备，让您在闲暇时光享受运动的乐趣。",
    "amenities.lounge.title": "休闲区",
    "amenities.lounge.text": "舒适的公共休息区，是邻里交流、放松心情的好去处。",
    "amenities.eyebrow": "共享设施",
    "amenities.cafe.title": "咖啡吧",
    "amenities.cafe.text": "社区咖啡吧，为您提供社交和放松的温馨空间.",
    "amenities.eyebrow_en": "Shared Amenities",
    "amenities.convenience.title": "24小时便民设施",
    "amenities.convenience.text": "自助打印机、售货机，24小时为您提供便民服务，方便您的日常生活.",
    "layoutA.floorplan_title": "A户型平面图",
    "layoutA.floorplan_desc": "32平方米户型布局展示",
    "layoutA.living_title": "A户型卧室",
    "layoutA.living_desc": "开放式设计，空间宽敞明亮",
    "layoutA.bedroom_title": "A户型洗手间",
    "layoutA.bedroom_desc": "舒适的主卧空间，配备优质床垫",
    "layoutA.kitchen_title": "A户型厨房",
    "layoutA.kitchen_desc": "功能齐全的现代化厨房",
    "layoutA.balcony_title": "A户型阳台",
    "layoutA.balcony_desc": "独立阳台，采光通风良好",
    "layoutA.storage_title": "A户型收纳",
    "layoutA.storage_desc": "定制收纳系统，空间利用最大化",
    "layoutB.floorplan_title": "B户型平面图",
    "layoutB.floorplan_desc": "32平方米精致户型布局",
    "layoutB.overview_title": "B户型整体",
    "layoutB.overview_desc": "精致的布局设计，空间利用合理",
    "layoutB.bedroom_title": "B户型卧室",
    "layoutB.bedroom_desc": "温馨舒适的主卧空间",
    "layoutB.kitchen_title": "B户型厨房",
    "layoutB.kitchen_desc": "现代化厨房设计，功能齐全",
    "layoutB.living_title": "B户型客厅",
    "layoutB.living_desc": "宽敞明亮的起居空间",
    "layoutB.bathroom_title": "B户型卫浴",
    "layoutB.bathroom_desc": "干湿分离设计，品质卫浴设施",
    "layoutB.balcony_title": "B户型阳台",
    "layoutB.balcony_desc": "连接卧室的私密阳台",
    "layoutC.floorplan_title": "C户型平面图",
    "layoutC.floorplan_desc": "45平方米舒展户型布局",
    "layoutC.overview_title": "C户型整体",
    "layoutC.overview_desc": "宽敞的45平方米空间，布局合理",
    "layoutC.living_title": "C户型客厅",
    "layoutC.living_desc": "宽敞的客厅空间，采光极佳",
    "layoutC.bedroom_title": "C户型卧室",
    "layoutC.bedroom_desc": "舒适的主卧，空间宽适",
    "layoutC.kitchen_title": "C户型厨房",
    "layoutC.kitchen_desc": "宽敞的现代化厨房，功能齐全",
    "layoutC.dining_title": "C户型卫浴",
    "layoutC.dining_desc": "干湿分离设计，品质卫浴设施",
    "layoutC.balcony_title": "C户型阳台",
    "layoutC.balcony_desc": "宽敞的阳台，视野开阔",

  },
  en: {
    html_lang: "en",
    "meta.title": "YUCHEN Apartment | Official Affordable Rental Housing Website in Jiading, Shanghai",
    "meta.description":
      "YUCHEN Apartment is located in the center of Juyuan New Area, Jiading, Shanghai, offering quality rental homes of about 32-45 sqm, shared amenities, and reliable living services within a 15-minute lifestyle circle.",
    "header.brand_aria": "YUCHEN Apartment homepage",
    "header.nav_aria": "Primary navigation",
    "header.nav_toggle_aria": "Toggle navigation",
    "header.menu_label": "Menu",
    "header.hotline": "Hotline 021-69588188",
    "header.cta": "Contact Us",
    "header.lang_zh": "中文",
    "header.lang_en": "EN",
    "mobile.contact_cta": "Contact",
    "nav.overview": "Overview",
    "nav.location": "Location",
    "nav.experience": "Experience",
    "nav.layouts": "Layouts",
    "nav.contact": "Contact",
    "nav.amenities": "Shared Amenities",
    "hero.eyebrow": "Affordable Rental Community in Juyuan, Jiading, Shanghai",
    "hero.title": "YUCHEN Apartment",
    "hero.text":
      "Located in the heart of Juyuan New Area in Jiading, Shanghai, near Jiading North Station on Metro Line 11 and Chengbeilu Station on the Jiamin Line, YUCHEN Apartment offers quality homes of about 32-45 sqm, shared community spaces, green surroundings, and reliable living services for young professionals and enterprise talent. As a government-certified affordable housing project, residents can apply for housing provident fund benefits.",
    "hero.primary_cta": "Book a Visit",
    "hero.secondary_cta": "View Brochure",
    "hero.stat_units": "units",
    "hero.stat_area": "main layouts",
    "hero.stat_circle": "lifestyle circle",
    "hero.stat_monitor": "equipment monitoring",
    "hero.quote1": "Live Together",
    "hero.quote2": "Live at YUCHEN",
    "hero.image_alt": "Main project visual of YUCHEN Apartment",
    "hero.note_label": "From the official brochure",
    "hero.note_text": "Metro access · Green surroundings · Shared community · Peace-of-mind living",
    "overview.eyebrow": "Project Overview",
    "overview.title": "An affordable rental community built for long-term living",
    "overview.text":
      "YUCHEN Apartment is more than a single rental product. It is an urban living solution designed around commuting, leisure, social life, housing quality, and service support.",
    "overview.card1.title": "Location & Commute",
    "overview.card1.text": "Located in the center of Juyuan New Area in Jiading, close to Jiading North Station on Metro Line 11 and Chengbeilu Station on the Jiamin Line.",
    "overview.card2.title": "Community & Amenities",
    "overview.card2.text": "Shared gym, laundry room, reading room, billiards room extend daily living into social life and personal interests.",
    "overview.card3.title": "Quality & Services",
    "overview.card3.text": "Smart gates, facial recognition, Schindler elevators, maintenance response, front-desk support, and community activities create a reassuring move-in experience.",
    "location.eyebrow": "15-Minute Living Circle",
    "location.title": "Everything you need within easy reach",
    "location.text": "Commercial, leisure, healthcare, and transportation resources around the project are all well developed, balancing urban efficiency with daily convenience.",
    "location.traffic.title": "Transport",
    "location.traffic.text": "Jiading North Station on Metro Line 11, Chengbeilu Station on the Jiamin Line, and nearby bus stops on Huancheng Road and Pingcheng Road.",
    "location.commerce.title": "Retail",
    "location.commerce.text": "Xinye Shopping Center, Riyueguang Center, Jiading Old Street, and RT-Mart support daily shopping and leisure.",
    "location.leisure.title": "Leisure",
    "location.leisure.text": "Huancheng River Walkway, Jiading Old Town, museums, and Zhouqiao Old Street bring a relaxed yet layered lifestyle.",
    "location.medical.title": "Healthcare",
    "location.medical.text": "Jiading Central Hospital, Jiading Hospital of Traditional Chinese Medicine, and community health centers support both routine and urgent needs.",
    "location.map_alt": "15-minute lifestyle circle map of YUCHEN Apartment",
    "location.map_caption": "The community sits in the center of Juyuan New Area in Jiading, Shanghai, with mature surrounding amenities and convenient city access.",
    "experience.eyebrow": "Living Experience",
    "experience.title": "Connecting arrival, social life, nature, and service",
    "experience.text": "From the entrance lobby to shared spaces, from green views to reliable support, YUCHEN Apartment turns better living into tangible everyday experience.",
    "experience.card1.kicker": "Landscape",
    "experience.card1.title": "Green views at the window, scenery at every step",
    "experience.card1.text":
      "Pocket gardens and waterfront surroundings are complemented by more than 40 flowering plants in the community, with parks and gardens nearby for daily outdoor living.",
    "experience.card1.alt": "Landscape environment of YUCHEN Apartment",
    "experience.card2.kicker": "Arrival Experience",
    "experience.card2.title": "A dignified first impression of home",
    "experience.card2.text": "An 8-meter-high lobby, chandelier lines echoing the logo, front-desk support, and dual access systems create both quality and security.",
    "experience.card2.alt": "Entrance lobby of YUCHEN Apartment",
    "experience.card3.kicker": "Shared Spaces",
    "experience.card3.title": "Encouraging connection while respecting privacy",
    "experience.card3.text": "The gym, laundry room, reading room, and billiards room shape an open, friendly, and healthy community culture.",
    "experience.card3.alt": "Shared spaces of YUCHEN Apartment",
    "experience.card4.kicker": "Resident Services",
    "experience.card4.title": "Support that goes beyond the room itself",
    "experience.card4.text": "A full set of supporting services covers daily convenience, safe living, maintenance, assistance, and community activities.",
    "experience.card4.alt": "Resident services of YUCHEN Apartment",
    "standards.eyebrow": "Residential Standards",
    "standards.title": "Everyday details that truly shape living quality",
    "standards.text": "The brochure focuses less on luxury and more on the practical standards that make a real difference to daily comfort.",
    "standards.card1.title": "Strong Sound Insulation",
    "standards.card1.text": "Balcony doors and windows provide dual sound insulation, combined with triple-glazed configuration for a quieter home.",
    "standards.card2.title": "95% Blackout Rate",
    "standards.card2.text": "Blackout curtains reduce light interference and help build a more stable and comfortable sleep routine.",
    "standards.card3.title": "16 sqm of Custom Storage",
    "standards.card3.text": "A three-dimensional storage system creates four times the storage capacity, giving everything a defined place.",
    "standards.card4.title": "E0 Eco-Friendly Custom Furniture",
    "standards.card4.text": "Custom cabinetry and an integrated storage system balance environmental performance, durability, and everyday efficiency.",
    "standards.card5.title": "Complete Kitchen Appliances",
    "standards.card5.text": "Refrigerator, range hood, microwave, and induction cooker are all included to support everyday cooking needs.",
    "standards.card6.title": "Wet-Dry Separated Bathroom",
    "standards.card6.text": "A dedicated shower area with mirror and wall cabinets makes bathing and storage more organized and efficient.",
    "layouts.eyebrow": "Layouts",
    "layouts.title": "Three main layouts for different living needs",
    "layouts.text": "From efficient one-person layouts to a more spacious 45 sqm option, YUCHEN Apartment keeps a consistent quality baseline across different lifestyles.",
    "layouts.tablist_aria": "Layout switcher",
    "layouts.tab_a": "Layout A",
    "layouts.tab_b": "Layout B",
    "layouts.tab_c": "Layout C",
    "layoutA.kicker": "Layout A",
    "layoutA.title": "YUCHEN Anju",
    "layoutA.metric3": "signature layout",
    "layoutA.text": "Designed for residents who value efficient commuting and complete daily functionality, this is the core layout of the project with balanced living, kitchen, storage, balcony, and bathroom zones.",
    "layoutA.bullet1": "L-shaped desk expands space for work, dining, and entertainment",
    "layoutA.bullet2": "Private balcony brings daylight, ventilation, and drying space",
    "layoutA.bullet3": "Dual-side mattress and blackout curtains improve sleep quality",
    "layoutA.bullet4": "Custom cabinetry strengthens everyday storage efficiency",
    "layoutA.alt": "Layout A of YUCHEN Apartment",
    "layoutB.kicker": "Layout B",
    "layoutB.title": "YUCHEN Xinju",
    "layoutB.metric3": "compact one-bedroom",
    "layoutB.text": "Layout B continues the same quality baseline while placing greater emphasis on compact comfort, ideal for young residents who want a complete and refined one-bedroom experience.",
    "layoutB.bullet1": "Kitchen, appliances, and bathroom are all fully equipped",
    "layoutB.bullet2": "Bedroom connects naturally with the balcony for better openness",
    "layoutB.bullet3": "Triple-glazed windows help create a quieter rest environment",
    "layoutB.bullet4": "Mirror cabinets, wall cabinets, and utility storage are well arranged",
    "layoutB.alt": "Layout B of YUCHEN Apartment",
    "layoutC.kicker": "Layout C",
    "layoutC.title": "45 sqm Spacious Layout",
    "layoutC.metric3": "more spacious living",
    "layoutC.text": "For residents who value more generous room scale, Layout C provides a more relaxed balance of activity space, storage volume, and kitchen dimension for long-term living.",
    "layoutC.bullet1": "Larger activity area creates a more relaxed home atmosphere",
    "layoutC.bullet2": "Kitchen and balcony dimensions feel more open and comfortable",
    "layoutC.bullet3": "Continues the 16 sqm custom storage and eco-friendly furniture system",
    "layoutC.bullet4": "Suitable for long-term living by individuals or couples seeking higher comfort",
    "layoutC.alt": "Layout C of YUCHEN Apartment",
    "contact.eyebrow": "Contact",
    "contact.title": "Get in touch with YUCHEN Apartment",
    "contact.text": "We support individual rental inquiries as well as enterprise leasing coordination, move-in procedures, and policy-related communication. Contact the project team through the following channels for more information.",
    "contact.card1.label": "Hotline",
        "contact.card3.label": "Location",
    "contact.card3.value": "Juyuan New Area Center, Jiading, Shanghai",
    "contact.media_alt": "Official contact details and QR code of YUCHEN Apartment",
    "contact.caption": "Scan the QR code to follow the YUCHEN Apartment service account for the latest leasing and move-in information.",
    "footer.tagline": "Project showcase page for affordable rental housing in Jiading, Shanghai",
    "amenities.eyebrow": "Shared Amenities",
    "amenities.title": "Shared Community Spaces",
    "amenities.text": "Shared spaces like gym, laundry room, reading room, and billiards room extend daily living into social life and personal interests.",
    "amenities.gym.title": "Gym",
    "amenities.gym.text": "Equipped with professional fitness equipment to help you stay healthy and active after busy work days.",
    "amenities.laundry.title": "Laundry Room",
    "amenities.laundry.text": "Equipped with washing machines and dryers for convenient daily living, saving time and effort.",
    "amenities.reading.title": "Reading Room",
    "amenities.reading.text": "A quiet and comfortable reading space for study, work, or relaxation.",
    "amenities.billiards.title": "Billiards Room",
    "amenities.billiards.text": "Professional billiards equipment for you to enjoy the fun of sports in your leisure time.",
    "amenities.lounge.title": "Lounge",
    "amenities.lounge.text": "Comfortable public lounge area, a great place for neighbors to communicate and unwind.",
    "amenities.convenience.title": "24-Hour Convenience Facilities",
    "amenities.convenience.text": "Self-service printers and vending machines provide 24-hour convenience services for your daily life.",
    "amenities.cafe.title": "Café",
    "amenities.cafe.text": "Community café providing a warm space for socializing and relaxation.",
    "layoutA.floorplan_title": "Layout A Floor Plan",
    "layoutA.floorplan_desc": "32 square meter layout display",
    "layoutA.living_title": "Layout A Living Room",
    "layoutA.living_desc": "Open design with spacious and bright space",
    "layoutA.bedroom_title": "Layout A Bedroom",
    "layoutA.bedroom_desc": "Comfortable master bedroom with quality mattress",
    "layoutA.kitchen_title": "Layout A Kitchen",
    "layoutA.kitchen_desc": "Fully equipped modern kitchen",
    "layoutA.bathroom_title": "Layout A Bathroom",
    "layoutA.balcony_title": "Layout A Balcony",
    "layoutA.balcony_desc": "Private balcony with good daylight and ventilation",
    "layoutA.storage_title": "Layout A Storage",
    "layoutA.storage_desc": "Custom storage system maximizing space utilization",
    "layoutB.floorplan_title": "Layout B Floor Plan",
    "layoutB.floorplan_desc": "32 square meter exquisite layout",
    "layoutB.overview_title": "Layout B Overview",
    "layoutB.overview_desc": "Exquisite layout design with rational space utilization",
    "layoutB.bedroom_title": "Layout B Bedroom",
    "layoutB.bedroom_desc": "Cozy and comfortable master bedroom",
    "layoutB.kitchen_title": "Layout B Kitchen",
    "layoutB.kitchen_desc": "Modern kitchen design, fully equipped",
    "layoutB.living_title": "Layout B Living Room",
    "layoutB.living_desc": "Spacious and bright living space",
    "layoutB.bathroom_title": "Layout B Bathroom",
    "layoutB.bathroom_desc": "Wet-dry separation design with quality bathroom fixtures",
    "layoutB.balcony_title": "Layout B Balcony",
    "layoutB.balcony_desc": "Private balcony connected to the bedroom",
    "layoutC.floorplan_title": "Layout C Floor Plan",
    "layoutC.floorplan_desc": "45 square meter spacious layout",
    "layoutC.overview_title": "Layout C Overview",
    "layoutC.overview_desc": "Spacious 45 square meter space with reasonable layout",
    "layoutC.living_title": "Layout C Living Room",
    "layoutC.living_desc": "Spacious living room with excellent daylight",
    "layoutC.bedroom_title": "Layout C Bedroom",
    "layoutC.bedroom_desc": "Comfortable master bedroom with ample space",
    "layoutC.kitchen_title": "Layout C Kitchen",
    "layoutC.kitchen_desc": "Spacious modern kitchen, fully equipped",
    "layoutC.dining_title": "Layout C Dining Room",
    "layoutC.dining_desc": "Separate dining space for comfortable meals",
    "layoutC.balcony_title": "Layout C Balcony",
    "layoutC.balcony_desc": "Spacious balcony with open views",
    "layoutC.storage_title": "Layout C Storage",
    "layoutC.storage_desc": "Large-capacity storage system making full use of space",
  },
  "amenities.convenience.title": "24小时便民设施",
  "amenities.convenience.text": "自助打印机、售货机，24小时为您提供便民服务，方便您的日常生活.",
};

function applyLanguage(language) {
  const nextLanguage = translations[language] ? language : "zh";
  const dictionary = translations[nextLanguage];

  document.documentElement.lang = dictionary.html_lang;

  document.querySelectorAll("[data-i18n]").forEach((node) => {
    const key = node.dataset.i18n;
    const value = dictionary[key];

    if (!value) {
      return;
    }

    const attribute = node.dataset.i18nAttr;
    if (attribute) {
      node.setAttribute(attribute, value);
      return;
    }

    node.textContent = value;
  });

  langButtons.forEach((button) => {
    const active = button.dataset.lang === nextLanguage;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  setStoredLanguage(nextLanguage);
}

if (year) {
  year.textContent = new Date().getFullYear();
}

const initialLanguage = getStoredLanguage() || "zh";
applyLanguage(initialLanguage);

langButtons.forEach((button) => {
  button.addEventListener("click", () => {
    applyLanguage(button.dataset.lang);
  });
});

// Mobile navigation handling
const navOverlay = document.querySelector(".site-nav-overlay");
const navClose = document.querySelector(".nav-close");

// Check if elements exist before adding event listeners
if (navToggle && header) {
  navToggle.addEventListener("click", () => {
    const isOpen = header.classList.contains("is-open");
    const newState = !isOpen;

    // Toggle header and navigation states
    header.classList.toggle("is-open", newState);
    navToggle.classList.toggle("is-open", newState);
    const siteNav = document.querySelector(".site-nav");
    if (siteNav) {
      siteNav.classList.toggle("is-open", newState);
    }

    // Update toggle button aria-expanded
    navToggle.setAttribute("aria-expanded", String(newState));

    // Update overlay visibility
    if (navOverlay) {
      navOverlay.classList.toggle("is-open", newState);
    }

    // Prevent body scroll when menu is open
    document.body.style.overflow = newState ? "hidden" : "";
  });

  // Close navigation when clicking overlay
  if (navOverlay) {
    navOverlay.addEventListener("click", () => {
      closeMobileMenu();
    });
  }

  // Close navigation when clicking close button
  if (navClose) {
    navClose.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeMobileMenu();
    });
  }

  // Handle navigation links
  document.querySelectorAll(".site-nav a, .header-cta a").forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (href && href.startsWith("#")) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          // Calculate offset for sticky header
          const headerOffset = 80;
          const targetPosition = target.offsetTop - headerOffset;

          // Smooth scroll to target
          window.scrollTo({
            top: targetPosition,
            behavior: "smooth"
          });
        }

        // Close mobile menu after navigation
        closeMobileMenu();
      }
    });
  });
}

// Function to close mobile menu
function closeMobileMenu() {
  if (header) {
    header.classList.remove("is-open");
  }
  const siteNav = document.querySelector(".site-nav");
  if (siteNav) {
    siteNav.classList.remove("is-open");
  }
  if (navToggle) {
    navToggle.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  }
  if (navOverlay) {
    navOverlay.classList.remove("is-open");
  }
  document.body.style.overflow = "";
}

// Close menu when pressing Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && header && header.classList.contains("is-open")) {
    closeMobileMenu();
  }
});

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const targetId = tab.getAttribute("aria-controls");

    tabs.forEach((item) => {
      item.classList.remove("is-active");
      item.setAttribute("aria-selected", "false");
    });

    panels.forEach((panel) => {
      const active = panel.id === targetId;
      panel.classList.toggle("is-active", active);
      panel.hidden = !active;
    });

    tab.classList.add("is-active");
    tab.setAttribute("aria-selected", "true");
  });
});

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -40px 0px",
    },
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}
