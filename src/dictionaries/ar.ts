import { NavItem, SelectItem } from "@/types";
import { PROPERTY_TYPE } from "@prisma/client";

export default {
  site: {
    name: "ديل ai",
    description:
      "موقعنا يقدم خدمات متقدمة لتشغيل الأتمتة على منصات التواصل الاجتماعي باستخدام تقنيات الذكاء الاصطناعي المتطورة. نحن نساعد العملاء في تنفيذ حملات تسويقية متكاملة وموجهة خصيصاً للمشاريع العقارية. من خلال تحليل البيانات وتوقعات السوق، نوفر حلولاً مبتكرة تساعد على تحسين الاستهداف، وزيادة نسبة التفاعل مع المحتوى، ورفع مستوى أداء الحملات التسويقية. هدفنا هو تمكين العملاء من الوصول إلى جمهورهم المستهدف بكفاءة أعلى، وزيادة مبيعات العقارات بشكل استراتيجي، مع تقليل التكاليف وتسريع عملية تحقيق النتائج.",
  },
  auth: {
    login: {
      "since collaborating with Deal Ai, our property sales have surged by 40%, and client satisfaction has reached new heights. their platform has optimized our operations, driving significant business growth.":
        "منذ التعاون مع Deal Ai، شهدت مبيعاتنا العقارية زيادة بنسبة 40%، وبلغت رضا العملاء مستويات جديدة. لقد قامت منصتهم بتحسين عملياتنا، مما دفع إلى نمو كبير في الأعمال.",
      "Alex Thompson, CEO of Thompson Real Estate":
        "أليكس طومسون، الرئيس التنفيذي لشركة طومسون للعقارات",
      "don't have an account? sign up now": "ليس لديك حساب؟ سجل الآن",
      "or continue with": "أو تابع باستخدام",
      "sign in with email": "تسجيل الدخول بالبريد الإلكتروني",
      "sign in with google": "تسجيل الدخول بواسطة جوجل",
      "sign in with facebook": "تسجيل الدخول بواسطة فيسبوك",
      "forgot password": "هل نسيت كلمة المرور؟",
    },
    register: {
      "since collaborating with Deal Ai, our property sales have surged by 40%, and client satisfaction has reached new heights. their platform has optimized our operations, driving significant business growth.":
        "منذ التعاون مع Deal Ai، شهدت مبيعاتنا العقارية زيادة بنسبة 40%، وبلغت رضا العملاء مستويات جديدة. لقد قامت منصتهم بتحسين عملياتنا، مما دفع إلى نمو كبير في الأعمال.",
      "Alex Thompson, CEO of Thompson Real Estate":
        "أليكس طومسون، الرئيس التنفيذي لشركة طومسون للعقارات",
      "already have an account? sign in.": "هل لديك حساب بالفعل؟ تسجيل الدخول.",
      "or continue with": "أو تابع باستخدام",
      "sign up with email": "سجل باستخدام البريد الإلكتروني",
      "sign up with google": "سجل باستخدام جوجل",
      "sign up with facebook": "سجل باستخدام فيسبوك",
    },
  },
  dashboard: {
    user: {
      "main-nav": {
        top: [
          [
            {
              segment: null,
              value: "/dashboard",
              label: "الصفحة الرئيسية",
              icon: "home",
            },
            {
              segment: ["projects"],
              value: "/dashboard/projects",
              label: "مشاريعي",
              icon: "analytics",
            },
            {
              segment: ["calender"],
              value: "/dashboard/calender",
              label: "التقويم",
              icon: "calender",
            },
          ],
          [
            {
              segment: ["settings"],
              value: "/dashboard/settings",
              label: "الإعدادات",
              icon: "settings",
            },
            {
              segment: ["bin"],
              value: "/dashboard/bin",
              label: "سلة المهملات",
              icon: "trash",
            },
          ],
        ] as NavItem[][],
      },
      dashboard: {
        dashboard: "الصفحة الرئيسية",
        "take a glance and manage your projects.":
          "اطّلع على لمحة عامة وادير مشاريعك.",
        "create project": "إنشاء مشروع",
        "latest projects": "أحدث المشاريع",
      },
      calender: {
        calender: "التقويم",
        "timeline of your posts schedule.": "جدول زمني لمواعيد منشوراتك.",
      },
      projects: {
        "oops, no projects.": "عذرًا، لا توجد مشاريع.",
        "you have not created you project yet.": "لم تقم بإنشاء مشروعك بعد.",
        projects: "المشاريع",
        "create and manage projects.": "إنشاء وإدارة المشاريع.",
        "create project": "إنشاء مشروع",
        table: {
          project: "المشروع",
          "study case": "دراسة حالة",
          "target audience": "الجمهور المستهدف",
          properties: "الوحدات",
          posts: "المنشورات",
          platforms: "المنصات",
          edit: "تعديل",
          delete: "حذف",
          restore: "استعادة",
          deletedAt: "تاريخ الحذف",
        },
        project: {
          "view pdf": "إظهار الملف",
          "oops, no such project.": "عذرًا، لا يوجد مشروع بهذا الاسم.",
          "you have not created you project yet.": "لم تقم بإنشاء مشروعك بعد.",
          projects: "المشاريع",
          restore: "استعادة",
          delete: "حذف",
          "back to all projects": "العودة إلى جميع المشاريع",
          distinct: "الحي",
          city: "المدينة",
          country: "البلد",
          spaces: "المساحة",
          "study cases": "دراسة الحالات",
          "property types": "أنواع العقارات",
          platforms: "المنصات",
          "created at": "تاريخ الإنشاء",
          "here's a list of your study cases.":
            "إليك قائمة بدراسات الحالة الخاصة بك.",
          "create study case": "إنشاء دراسة حالة",
          "here's a list of your properties.": "إليك قائمة بوحداتك.",
          "create properties": "إنشاء وحدات",

          cases: {
            case: {
              "back to": "العودة إلي",
              "market strategy": "استراتيجية السوق",
              "error loading market strategy data.":
                "خطأ في تحميل بيانات استراتيجية السوق.",
              "no valid market strategy data available.":
                "لا توجد بيانات صالحة لاستراتيجية السوق.",

              "performance metrics": "مؤشرات الأداء",
              "error loading performance metrics data.":
                "خطأ في تحميل بيانات مؤشرات الأداء.",
              "no valid performance metrics data available.":
                "لا توجد بيانات صالحة لمؤشرات الأداء.",

              "ROI calculation": "حساب العائد على الاستثمار",
              "error loading ROI calculation data.":
                "خطأ في تحميل بيانات حساب العائد على الاستثمار.",
              "no valid ROI calculation data available.":
                "لا توجد بيانات صالحة لحساب العائد على الاستثمار.",

              "strategic insights": "رؤى استراتيجية",
              "error loading strategic insights data.":
                "خطأ في تحميل بيانات الرؤى الاستراتيجية.",
              "no valid strategic insights data available.":
                "لا توجد بيانات صالحة للرؤى الاستراتيجية.",

              recommendations: "التوصيات",
              "error loading recommendations data.":
                "خطأ في تحميل بيانات التوصيات.",
              "no valid recommendations data available.":
                "لا توجد بيانات صالحة للتوصيات.",

              "Post Frequency": "التكرار الأسبوعي للمنشورات",
              "error loading Post Frequency data.":
                "خطأ في تحميل بيانات التكرار الأسبوعي للمنشورات.",
              "no valid Post Frequency data available.":
                "لا توجد بيانات صالحة لـ تكرار الأسبوعي للمنشورات.",

              "it's project is deleted, once you restore it all will be editable.":
                "تم حذف المشروع، بمجرد استعادته سيكون كل شيء قابلاً للتعديل.",
              "oops, no such study case.":
                "عذرًا، لا توجد دراسة حالة بهذا الاسم.",
              "you have not created you study case yet.":
                "لم تقم بإنشاء دراسة الحالة الخاصة بك بعد.",
              projects: "المشاريع",
              restore: "استعادة",
              delete: "حذف",
              "warning!": "تحذير!",
              "oops, no posts.": "عذرًا، لا توجد منشورات.",
              "you have not created you posts yet.":
                "لم تقم بإنشاء منشوراتك بعد.",
              "study case content": "محتوى دراسة الحالة",
              "target audience": "الجمهور المستهدف",
              pros: "الإيجابيات",
              cons: "السلبيات",
              "reference images": "صور مرجعية",
              "navigate to get what you want.": "انتقل للحصول على ما تريده.",
              "create posts": "إنشاء منشورات",
              "campaign type": "نوع الحملة",
              "content length": "طول المحتوى",
              confirmed: "مؤكد",
              "not confirmed": "غير مؤكد",
              posts: {
                posts: "المنشورات",
                "oops, no posts.": "عذرًا، لا توجد منشورات.",
                "you have not created you posts yet.":
                  "لم تقم بإنشاء منشوراتك بعد.",
                post: {
                  "back to": "العودة إلي",
                  "it's project or study case is deleted, once you restore it all will be editable.":
                    "تم حذف المشروع أو دراسة الحالة، بمجرد استعادته سيكون كل شيء قابلاً للتعديل.",
                  "oops, no such post.": "عذرًا، لا توجد منشورة بهذا الاسم.",
                  "you have not created you post yet.":
                    "لم تقم بإنشاء منشورك بعد.",
                  projects: "المشاريع",
                  restore: "استعادة",
                  delete: "حذف",
                  "warning!": "تحذير!",
                },
              },
            },
            table: {
              name: "الاسم",
              description: "الوصف",
              "study case": "دراسة حالة",
              "target audience": "الجمهور المستهدف",
              posts: "المنشورات",
              platforms: "المنصات",
              edit: "تعديل",
              delete: "حذف",
              restore: "استعادة",
              deletedAt: "تاريخ الحذف",
            },
          },
          properties: {
            "back to": "العودة إلي",
            properties: "الوحدات",
            "oops, no such property.": "عذرًا، لا توجد خاصية بهذا الاسم.",
            "you have not created you property yet.":
              "لم تقم بإنشاء خاصيتك بعد.",
            projects: "المشاريع",
            "it's project is deleted, once you restore it all will be editable.":
              "تم حذف المشروع، بمجرد استعادته سيكون كل شيء قابلاً للتعديل.",
            "warning!": "تحذير!",
            restore: "استعادة",
            delete: "حذف",
            table: {
              name: "الاسم",
              units: "الوحدات",
              type: "النوع",
              space: "المساحة",
              finishing: "التشطيب",
              floors: "الطوابق",
              rooms: "الغرف",
              bathrooms: "الحمامات",
              livingrooms: "غرف المعيشة",
              price: "السعر",
              garden: "الحديقة",
              pool: "المسبح",
              view: "الإطلالة",
              edit: "تعديل",
              delete: "حذف",
              restore: "استعادة",
              deletedAt: "تاريخ الحذف",
            },
          },
        },
      },
      bin: {
        "main-nav": [
          { value: "/dashboard/bin", label: "المشاريع" },
          { value: "/dashboard/bin/cases", label: "دراسات الحالة" },
          { value: "/dashboard/bin/properties", label: "الوحدات" },
          { value: "/dashboard/bin/posts", label: "المنشورات" },
        ] as NavItem[],
        bin: "سلة المهملات",
        "below is a list of your deleted items. you can restore them within 30 days before they are permanently removed.":
          "فيما يلي قائمة بالعناصر المحذوفة الخاصة بك. يمكنك استعادتها خلال 30 يومًا قبل إزالتها نهائيًا.",
        projects: "المشاريع",
        cases: {
          "study cases": "دراسات الحالة",
        },
        properties: {
          properties: "الوحدات",
        },
        posts: {
          posts: "المنشورات",
        },
      },
      settings: {
        "main-nav": [
          { value: "/dashboard/settings", label: "الملف الشخصي" },
          { value: "/dashboard/settings/appearance", label: "المظهر" },
        ] as NavItem[],
        settings: "الإعدادات",
        "manage your account details, privacy settings, and how others perceive you on the platform.":
          "إدارة تفاصيل حسابك، إعدادات الخصوصية، وكيفية رؤية الآخرين لك على المنصة.",
        appearance: {
          appearance: "المظهر",
          "customize your appearance settings and preferences.":
            "تخصيص إعدادات المظهر وتفضيلاتك.",
        },
        profile: {
          profile: "الملف الشخصي",
          "this is how others will see you on the site.":
            "هذه هي الطريقة التي سيراك بها الآخرون على الموقع.",
        },
      },
    },
  },
  editors: {
    images: {
      image: {
        "back to": "العودة إلي",
        "post of project": "المنشور الخاص بـ مشروع",
      },
    },
  },
  siri: {
    "Chat with OpenAI (Voice & Text)": "المساعد الذكي",
    "clear history": "مسح المحادثة",
    hello: "مرحبا",
    send: "إرسال",
    say: "قل",
    "No Messages Yet": "لا توجد رسائل.",
    Message: "رسالة",
    "Message AI...": "أكتب رسالة للذكاء الاصطناعي...",
    "Stop Listening": "إنهي التحدث",
    "Start Listening": "إبدأ التحدث",
  },
  "apartment-form": {
    apartments: "شقق",
    "no apartment": "لا توجد شقق",
    "new apartment": "شقة جديدة",
    "create new apartment": "إنشاء شقة جديدة",
  },
  "villa-form": {
    villas: "فلل",
    "no villa": "لا توجد فلل",
    "new villa": "فيلا جديدة",
    "create new villa": "إنشاء فيلا جديدة",
  },
  "appearance-form": {
    theme: "الثيم",
    "automatically switch between day and night themes.":
      "التبديل التلقائي بين الثيمات النهارية والليلية.",
    light: "فاتح",
    dark: "داكن",
    system: "نظام",
    language: "اللغة",
    "automatically switch between languages.": "التبديل التلقائي بين اللغات.",
    "update preferences": "تحديث التفضيلات",
  },
  "back-button": {
    back: "رجوع",
  },
  "case-study-bin-button": {
    "deleted successfully.": "تم الحذف بنجاح.",
    delete: "حذف",
    "delete study case": "حذف دراسة حالة",
    "once deleted, the study case will be moved to the bin. you can manually delete it or it will be automatically removed after 30 days. if restored, everything will be reinstated as if nothing happened.":
      "بمجرد حذفها، سيتم نقل دراسة الحالة إلى سلة المهملات. يمكنك حذفها يدويًا أو سيتم إزالتها تلقائيًا بعد 30 يومًا. إذا تم استعادتها، سيتم استعادة كل شيء كما لو لم يحدث شيء.",
  },
  "case-study-create-button": {
    "initializing case...": "تحضير إنشاء دراسة الحالة...",
    "created successfully.": "تم الإنشاء بنجاح.",
    submit: "إرسال",
    "create study case": "إنشاء دراسة حالة",
    "create a A well-structured study case for your real estate project that helps highlight the unique features, target audience, market strategy, and performance metrics of your project. once created, these study cases can be used to inform potential buyers, partners, and stakeholders, demonstrating the value and potential of your real estate developments.":
      "إنشاء دراسة حالة منظمة جيدًا لمشروعك العقاري تساعد في إبراز الميزات الفريدة، الجمهور المستهدف، استراتيجية السوق، ومقاييس الأداء لمشروعك. بمجرد إنشائها، يمكن استخدام هذه الدراسات لإبلاغ المشترين المحتملين والشركاء وأصحاب المصلحة، مما يظهر قيمة وإمكانات مشاريعك العقارية.",
  },
  "case-study-delete-button": {
    "once deleted, this action cannot be undone. please be certain, as all relevant data will be permanently deleted.":
      "بمجرد حذفها، لا يمكن التراجع عن هذا الإجراء. يرجى التأكد، حيث سيتم حذف جميع البيانات ذات الصلة بشكل دائم.",
    "deleted successfully.": "تم الحذف بنجاح.",
    delete: "حذف",
    "delete study case": "حذف دراسة الحالة",
  },
  "case-study-form": {
    title: {
      label: "العنوان",
      "health center": "مركز صحي",
    },
    description: {
      label: "الوصف",
      "describe your study case": "وصف دراسة الحالة الخاصة بك",
    },
    refImages: {
      label: "صورة مرجعية",
    },
    content: {
      label: "المحتوى",
      "describe your study case's content": "وصف محتوى دراسة الحالة الخاصة بك",
    },
    targetAudience: {
      label: "الجمهور المستهدف",
      "describe your study case's target audience":
        "وصف الجمهور المستهدف لدراسة الحالة الخاصة بك",
    },
    pros: {
      label: "الإيجابيات",
      "describe your study case's pros": "وصف إيجابيات دراسة الحالة الخاصة بك",
    },
    cons: {
      label: "السلبيات",
      "describe your study case's cons": "وصف سلبيات دراسة الحالة الخاصة بك",
    },
  },
  "case-study-restore-button": {
    "restoring this study case will bring back all its data and settings, making it appear as if it was never deleted. all related information will be fully reinstated, allowing you to pick up right where you left off.":
      "استعادة دراسة الحالة هذه ستعيد جميع بياناتها وإعداداتها، مما يجعلها تظهر كما لو لم يتم حذفها أبدًا. سيتم استعادة جميع المعلومات ذات الصلة بشكل كامل، مما يسمح لك بالاستمرار من حيث توقفت.",
    "restored successfully.": "تم الاستعادة بنجاح.",
    restore: "استعادة",
    "restore study case": "استعادة دراسة الحالة",
  },
  "case-study-update-button": {
    "updated successfully.": "تم التحديث بنجاح.",
    submit: "إرسال",
    "update study case": "تحديث دراسة حالة",
    "updating a study case allows you to refine and enhance the details of your ongoing developments":
      "تحديث دراسة حالة يتيح لك تحسين وتعزيز تفاصيل مشاريعك الحالية",
  },
  "case-study-update-form": {
    "updated successfully.": "تم التحديث بنجاح.",
    submit: "إرسال",
    cancel: "إلغاء",
    edit: "تعديل",
  },
  "resizeable-layout": {
    logout: "تسجيل الخروج",
  },

  "dashboard-posts-bar-chart": {
    posts: "المنشورات",
    "showing total posts for the last 3 months.":
      "عرض إجمالي المنشورات لآخر 3 أشهر.",
    FACEBOOK: "فيسبوك",
    INSTAGRAM: "إنستغرام",
    LINKEDIN: "لينكد إن",
    TWITTER: "تويتر",
    views: "المشاهدات",
    "project name": "إسم المشروع",
  },
  "data-table": {
    "no results.": "لا توجد نتائج.",
  },
  "data-table-column-header": {
    asc: "تصاعدي",
    desc: "تنازلي",
    hide: "إخفاء",
  },
  "data-table-pagination": {
    of: "من",
    "row(s) selected.": "صف(وف) مختار(ة).",
    "rows per page": "الصفوف لكل صفحة",
    "go to first page": "انتقل إلى الصفحة الأولى",
    "go to previous page": "انتقل إلى الصفحة السابقة",
    "go to next page": "انتقل إلى الصفحة التالية",
    "go to last page": "انتقل إلى الصفحة الأخيرة",
    page: "الصفحة",
  },
  "data-table-row-actions": {
    actions: "التحرير",
    "open menu": "إفتح القائمة",
  },
  "data-table-view-options": {
    view: "عرض",
    "toggle columns": "تبديل الأعمدة",
  },
  dialog: {
    "are you sure you want to proceed?": "هل أنت متأكد أنك تريد المتابعة؟",
    "please confirm that all the provided information is accurate. This action cannot be undone.":
      "يرجى تأكيد أن جميع المعلومات المقدمة دقيقة. لا يمكن التراجع عن هذا الإجراء.",
    cancel: "إلغاء",
  },
  "image-editor": {
    "updated successfully.": "تم التحديث بنجاح.",
    dimensions: "الأبعاد",
    download: "تحميل",
    "post will be with no image": "سيكون المنشور بدون صورة",
    clear: "مسح",
    "save changes": "حفظ التغييرات",
    layers: "الطبقات",
    "image size": "حجم الصورة",
    recenter: "إعادة التمركز",
    "recenter all layers": "إعادة تمركز جميع الطبقات",
    photo: "صورة",
    width: "العرض",
    height: "الارتفاع",
    "choose frame": "اختر الإطار",
    "edit text": "تحرير النص",
    "new text": "نص جديد",
    color: "اللون",
    "font size": "حجم الخط",
  },
  "image-form": {
    "upload-file": { "upload image": "تحميل صورة" },
    "regenerate-image": {
      prompt: "وصف الصورة",
      "enhance prompt": "تحسين الوصف",
      "generate image": "إنشاء صورة",
      "enhanced successfully.": "تم تحسينه بنجاح.",
      "generated successfully.": "تم إنشاؤه بنجاح.",
      "generate image using AI": "generate Image using AI",
    },
    frame: {
      frame: "الإطار",
      "add frame": "إضافة إطار",
      "applying frames...": "يتم التطبيق...",
      "no frames to be applied...": "لا يوجد فريم للإختيا...",
    },
  },
  "add-field-with-type": {
    "add item": "إضافة عنصر",
    "field type": "نوع الحقل",
    types: [
      { value: "string", label: "نص" },
      { value: "number", label: "رقم" },
      { value: "boolean", label: "قيمة منطقية" },
      { value: "object", label: "كائن" },
      { value: "array", label: "مصفوفة" },
    ],
  },
  "locale-switcher": {
    "current locale of the website": "اللغة الحالية للموقع",
    en: "الإنجليزية (EN)",
    ar: "العربية (AR)",
    // fr: "الفرنسية (FR)",
    // de: "الألمانية (DE)",
    "change language": "تغيير اللغة",
  },
  "mode-toggle": {
    "toggle theme": "تبديل النظام",
    modes: [
      { value: "light", label: "نهاري", icon: "sun" },
      { value: "dark", label: "ليلي", icon: "moon" },
      { value: "system", label: "النظام", icon: "laptop" },
    ] as SelectItem[],
  },
  "post-bin-button": {
    "deleted successfully.": "تم الحذف بنجاح.",
    delete: "حذف",
    "delete post": "حذف المنشور",
    "once deleted, the post will be moved to the bin. you can manually delete it or it will be automatically removed after 30 days. if restored, everything will be reinstated as if nothing happened.":
      "بمجرد حذفه، سيتم نقل المنشور إلى سلة المهملات. يمكنك حذفه يدويًا أو سيتم إزالته تلقائيًا بعد 30 يومًا. إذا تم استعادته، سيتم استعادة كل شيء كما لو لم يحدث شيء.",
  },
  "post-create-button": {
    "initializing posts...": "تحضير إنشاء المنشورات...",
    "created successfully.": "تم الإنشاء بنجاح.",
    submit: "إرسال",
    "create posts": "إنشاء منشورات",
    "streamline your marketing efforts by generating and scheduling posts across all your platforms using AI, and automatically publishes it at optimal times, maximizing reach and engagement.":
      "تبسيط جهودك التسويقية من خلال إنشاء وجدولة المنشورات عبر جميع منصاتك باستخدام الذكاء الاصطناعي، ونشرها تلقائيًا في الأوقات المثلى، لزيادة الوصول والتفاعل.",
  },
  "post-delete-button": {
    "once deleted, this action cannot be undone. please be certain, as all relevant data will be permanently deleted.":
      "بمجرد حذفه، لا يمكن التراجع عن هذا الإجراء. يرجى التأكد، حيث سيتم حذف جميع البيانات ذات الصلة بشكل دائم.",
    "deleted successfully.": "تم الحذف بنجاح.",
    delete: "حذف",
    "delete post": "حذف المنشور",
  },
  "post-form": {
    title: {
      label: "العنوان",
      "health center": "مركز صحي",
    },
    confirmedAt: {
      label: "تأكيد هذا المنشور ليكون جاهزًا للنشر",
      "you can manage your posts in the": "يمكنك إدارة منشوراتك في",
      calender: "التقويم",
      page: "الصفحة",
    },
    description: {
      label: "الوصف",
      "describe your post": "وصف المنشور الخاص بك",
    },
    content: {
      label: "المحتوى",
      "describe your post's content": "وصف محتوى منشورك",
    },
    noOfWeeks: {
      label: "عدد الأسابيع",
    },
    campaignType: {
      label: "نوع الحملة",
      "select your campaign": "حدد حملتك",
    },
    contentLength: {
      label: "طول المحتوى",
      "select your content length": "حدد طول المحتوى",
    },
    platform: {
      label: "المنصة",
      "select your platform": "حدد منصتك",
    },
    postAt: {
      label: "نشر في",
    },
  },
  "post-restore-button": {
    "restoring this post will bring back all its data and settings, making it appear as if it was never deleted. all related information will be fully reinstated, allowing you to pick up right where you left off.":
      "استعادة هذا المنشور ستعيد جميع بياناته وإعداداته، مما يجعله يظهر كما لو لم يتم حذفه أبدًا. سيتم استعادة جميع المعلومات ذات الصلة بالكامل، مما يسمح لك بالاستمرار من حيث توقفت.",
    "restored successfully.": "تم الاستعادة بنجاح.",
    restore: "استعادة",
    "restore post": "استعادة المنشور",
  },
  "post-update-content-button": {
    "updating your post's content allows you to refine and enhance the details of your ongoing developments":
      "تحديث محتوى منشورك يتيح لك تحسين وتعزيز تفاصيل مشاريعك الحالية",
    "content updated successfully.": "تم تحديث المحتوى بنجاح.",
    submit: "إرسال",
    "update content": "تحديث المحتوى",
  },
  "post-update-form": {
    "updated successfully.": "تم التحديث بنجاح.",
    submit: "إرسال",
    "edit image": "تعديل الصورة",
    "post details": "تفاصيل المنشور",
    discard: "تجاهل",
    "save changes": "حفظ التغييرات",
    "post information": "معلومات المنشور",
    "update image": "تحديث الصورة",
    "restore post": "إستعادة المنشور",
    "delete post": "حذف المنشور",
    "updating an image allows you to refine and enhance the details of your ongoing developments":
      "تحديث الصورة يتيح لك تحسين وتعزيز تفاصيل مشاريعك الحالية",
    "choose file": "اختيار ملف",
    "generate using AI": "إنشاء باستخدام الذكاء الاصطناعي",
    "apply frame": "تطبيق الإطار المناسب...",
    "project name": "إسم المشروع التابع له",
  },
  "post-update-schedule-button": {
    "scheduled successfully.": "تم جدولته بنجاح.",
    submit: "إرسال",
    "update schedule": "تحديث الجدول",
    "updating your post's scheule allows you to refine and enhance the details of your ongoing developments":
      "تحديث جدول منشورك يتيح لك تحسين وتعزيز تفاصيل مشاريعك الحالية",
  },
  "project-bin-button": {
    "deleted successfully.": "تم الحذف بنجاح.",
    delete: "حذف",
    "delete project": "حذف المشروع",
    "once deleted, the project will be moved to the bin. you can manually delete it or it will be automatically removed after 30 days. if restored, everything will be reinstated as if nothing happened.":
      "بمجرد حذفه، سيتم نقل المشروع إلى سلة المهملات. يمكنك حذفه يدويًا أو سيتم إزالته تلقائيًا بعد 30 يومًا. إذا تم استعادته، سيتم استعادة كل شيء كما لو لم يحدث شيء.",
  },
  "project-create-button": {
    "initializing project...": "تحضير إنشاء المشروع...",
    "created successfully.": "تم الإنشاء بنجاح.",
    submit: "إرسال",
    "type of assets": "نوع الوحدات",
    unit: "وحدة",
    "create project": "إنشاء مشروع",
    "by providing detailed information about your project, you'll be able to streamline your operations, track progress, and ensure that all stakeholders are informed about the development's key aspects and milestones.":
      "من خلال توفير معلومات مفصلة عن مشروعك، ستتمكن من تبسيط عملياتك، وتتبع التقدم، وضمان اطلاع جميع المعنيين على الجوانب الرئيسية للمشروع والمعالم الهامة.",
  },
  "project-delete-button": {
    "once deleted, this action cannot be undone. please be certain, as all relevant data will be permanently deleted.":
      "بمجرد حذفه، لا يمكن التراجع عن هذا الإجراء. يرجى التأكد، حيث سيتم حذف جميع البيانات ذات الصلة بشكل دائم.",
    "deleted successfully.": "تم الحذف بنجاح.",
    delete: "حذف",
    "delete project": "حذف المشروع",
  },
  "project-form": {
    title: {
      label: "العنوان",
      "health center": "مركز صحي",
    },
    logo: { label: "اللوجو" },
    pdf: {
      label: "الملف",
      "fill fields using ai": "ملئ الخانات بالـ AI",
      "after confirming a pdf, you can't choose another one.":
        "بعد التوثيق، لا يمكنك إختيار ملف آخر.",
      "fields are filled using AI.": "تم ملئ الحقول تلقائيا.",
    },
    map: {
      label: "الخريطة",
      "choose on map": "إختر علي الخريطة",
    },
    description: {
      label: "الوصف",
      "describe your project": "وصف مشروعك",
    },
    distinct: {
      label: "الحي",
      "nasr city": "مدينة نصر",
    },
    city: {
      label: "المدينة",
      cairo: "القاهرة",
    },
    country: {
      label: "البلد",
      egypt: "مصر",
    },
    spaces: {
      label: "المساحة",
    },
    platforms: {
      label: "المنصات",
      "select your platform": "حدد منصتك",
      "connected successfully.": "تم الاتصال بنجاح.",
      connect: "اتصال",
      connected: "متصل",
    },
  },
  "project-restore-button": {
    "restoring this project will bring back all its data and settings, making it appear as if it was never deleted. all related information will be fully reinstated, allowing you to pick up right where you left off.":
      "استعادة هذا المشروع ستعيد جميع بياناته وإعداداته، مما يجعله يظهر كما لو لم يتم حذفه أبدًا. سيتم استعادة جميع المعلومات ذات الصلة بالكامل، مما يسمح لك بالاستمرار من حيث توقفت.",
    "restored successfully.": "تم الاستعادة بنجاح.",
    restore: "استعادة",
    "restore project": "استعادة المشروع",
  },
  "project-update-form": {
    "updated successfully.": "تم التحديث بنجاح.",
    submit: "إرسال",
    "update project": "تحديث المشروع",
    "updating a project allows you to refine and enhance the details of your ongoing developments":
      "تحديث المشروع يتيح لك تحسين وتعزيز تفاصيل مشاريعك الحالية",
  },
  "property-bin-button": {
    "deleted successfully.": "تم الحذف بنجاح.",
    delete: "حذف",
    "delete property": "حذف العقار",
    "once deleted, the property will be moved to the bin. you can manually delete it or it will be automatically removed after 30 days. if restored, everything will be reinstated as if nothing happened.":
      "بمجرد حذفه، سيتم نقل العقار إلى سلة المهملات. يمكنك حذفه يدويًا أو سيتم إزالته تلقائيًا بعد 30 يومًا. إذا تم استعادته، سيتم استعادة كل شيء كما لو لم يحدث شيء.",
  },
  "property-create-button": {
    "initializing property...": "تحضير إنشاء الوحدة...",
    "created successfully.": "تم الإنشاء بنجاح.",
    submit: "إرسال",
    "type of assets": "نوع الوحدات",
    unit: "وحدة",
    "create property": "إنشاء عقار",
    "by detailing each property, including its features, layout, and amenities, you ensure that all relevant information is captured, enabling better organization and presentation to potential buyers or tenants.":
      "من خلال تفصيل كل عقار، بما في ذلك ميزاته، وتخطيطه، والمرافق المتوفرة، تضمن توثيق جميع المعلومات ذات الصلة، مما يتيح تنظيمًا وعرضًا أفضل للمشترين أو المستأجرين المحتملين.",
  },
  "property-delete-button": {
    "once deleted, this action cannot be undone. please be certain, as all relevant data will be permanently deleted.":
      "بمجرد حذفه، لا يمكن التراجع عن هذا الإجراء. يرجى التأكد، حيث سيتم حذف جميع البيانات ذات الصلة بشكل دائم.",
    "deleted successfully.": "تم الحذف بنجاح.",
    delete: "حذف",
    "delete property": "حذف العقار",
  },
  "property-form": {
    type: { "select your property type": "حدد نوع العقار" },
    title: {
      label: "العنوان",
      "health center": "مركز صحي",
    },
    units: {
      units: "الوحدات",
      "no. of villas": "عدد الڤلل",
    },
    space: { label: "المساحة" },
    finishing: { label: "التشطيب" },
    floors: { label: "الأدوار" },
    rooms: { label: "الغرف" },
    bathrooms: { label: "الحمامات" },
    livingrooms: { "living rooms": "غرف المعيشة" },
    price: { label: "السعر" },
    garden: { label: "الحديقة" },
    pool: { label: "المسبح" },
    view: { label: "الإطلالة" },
  },
  "property-restore-button": {
    "restoring this property will bring back all its data and settings, making it appear as if it was never deleted. all related information will be fully reinstated, allowing you to pick up right where you left off.":
      "استعادة هذا العقار ستعيد جميع بياناته وإعداداته، مما يجعله يظهر كما لو لم يتم حذفه أبدًا. سيتم استعادة جميع المعلومات ذات الصلة بالكامل، مما يسمح لك بالاستمرار من حيث توقفت.",
    "restored successfully.": "تم الاستعادة بنجاح.",
    restore: "استعادة",
    "restore property": "استعادة العقار",
  },
  scheduler: {
    today: "اليوم",
  },
  "user-form": {
    name: {
      label: "الاسم الكامل",
      placeholder: "جو دو",
    },
    email: {
      label: "البريد الإلكتروني",
    },
    password: {
      label: "كلمة المرور",
    },
  },
  "user-profile-password-form": {
    "updated successfully.": "تم التحديث بنجاح.",
    "reset password": "إعادة تعيين كلمة المرور؟",
    "new password": "كلمة مرور جديدة",
    "confirm new password": "تأكيد كلمة المرور الجديدة",
    discard: "تجاهل",
    submit: "إرسال",
    "this will update your password and help keep your account secure.":
      "سيؤدي هذا إلى تحديث كلمة المرور الخاصة بك ومساعدة في تأمين حسابك.",
  },
  "user-profile-personal-form": {
    "updated successfully.": "تم التحديث بنجاح.",
    "personal information": "المعلومات الشخصية",
    discard: "تجاهل",
    "save changes": "حفظ التغييرات",
    "this information will be used to create your public profile.":
      "سيتم استخدام هذه المعلومات لإنشاء ملفك الشخصي العام.",
  },
  constants: {
    days: [
      { value: "SUN", label: "الأحد" },
      { value: "MON", label: "الاثنين" },
      { value: "TUE", label: "الثلاثاء" },
      { value: "WED", label: "الأربعاء" },
      { value: "THU", label: "الخميس" },
      { value: "FRI", label: "الجمعة" },
      { value: "SAT", label: "السبت" },
    ] as SelectItem[],
    frames: {
      reservation: "إحجز وحدتك:",
    },
  },
  db: {
    platforms: [
      { value: "FACEBOOK", label: "فيسبوك" },
      { value: "LINKEDIN", label: "لينكد إن" },
      { value: "INSTAGRAM", label: "إنستغرام" },
      { value: "TWITTER", label: "تويتر" },
    ] as SelectItem[],
    propertyTypes: [
      { value: "APARTMENT", label: "شقة" },
      { value: "VILLA", label: "فيلا" },
    ] as (SelectItem & { value: PROPERTY_TYPE })[],
    campaignTypes: [
      { value: "BRANDING_AWARENESS", label: "زيادة الوعي بالعلامة التجارية" },
      { value: "ENGAGEMENT", label: "التفاعل" },
      { value: "SALES_CONVERSION", label: "تحويل المبيعات" },
    ] as SelectItem[],
    contentLength: [
      { value: "SHORT", label: "قصير" },
      { value: "MEDIUM", label: "متوسط" },
      { value: "LONG", label: "طويل" },
    ] as SelectItem[],
  },
  actions: {
    // users: {
    "this email is already used.": "هذا البريد الإلكتروني مستخدم بالفعل.",
    "incorrect email address.": "عنوان بريد إلكتروني غير صحيح.",
    "incorrect password": "كلمة المرور غير صحيحة.",
    "no password setting to that account, login using google.":
      "لا توجد كلمة مرور لهذا الحساب، سجل عن طريق جوجل.",
    "you are not logged in.": "لم تقم بتسجيل الدخول.",
    "your user account was not logged in. please try again.":
      "لم يتم التسجيل للحساب الخاص بك. الرجاء المحاولة مرة أخرى.",
    "your user account was not created. please try again.":
      "لم يتم إنشاء الحساب الخاص بك. الرجاء المحاولة مرة أخرى.",
    "your user account was not updated. please try again.":
      "لم يتم تحديث الحساب الخاص بك. الرجاء المحاولة مرة أخرى.",
    "your user account was not deleted. please try again.":
      "لم يتم حذف الحساب الخاص بك. الرجاء المحاولة مرة أخرى.",

    // projects: {
    "your project was not created. please try again.":
      "لم يتم إنشاء المشروع الخاص بك. الرجاء المحاولة مرة أخرى.",
    "your project was not updated. please try again.":
      "لم يتم تحديث المشروع الخاص بك. الرجاء المحاولة مرة أخرى.",
    "your project was not deleted. please try again.":
      "لم يتم حذف المشروع الخاص بك. الرجاء المحاولة مرة أخرى.",
    "project created successfully with title": "تم إنشاء المشروع بنجاح بعنوان",

    // "study-case": {
    "your study case was not created. please try again.":
      "لم يتم إنشاء دراسة الحالة الخاصة بك. الرجاء المحاولة مرة أخرى.",
    "your study case was not deleted. please try again.":
      "لم يتم حذف دراسة الحالة الخاصة بك. الرجاء المحاولة مرة أخرى.",
    "your study case was not updated. please try again.":
      "لم يتم تحديث دراسة الحالة الخاصة بك. الرجاء المحاولة مرة أخرى.",

    // "properties": {
    "your property was not created. please try again.":
      "لم يتم إنشاء الوحدة الخاصة بك. الرجاء المحاولة مرة أخرى.",
    "your property was not updated. please try again.":
      "لم يتم تحديث الوحدة الخاصة بك. الرجاء المحاولة مرة أخرى.",
    "your property was not deleted. please try again.":
      "لم يتم حذف الوحدة الخاصة بك. الرجاء المحاولة مرة أخرى.",

    // posts: {
    "your post was not created. please try again.":
      "لم يتم إنشاء المنشور الخاص بك. الرجاء المحاولة مرة أخرى.",
    "your post was not updated. please try again.":
      "لم يتم تحديث المنشور الخاص بك. الرجاء المحاولة مرة أخرى.",
    "your post was not deleted. please try again.":
      "لم يتم حذف المنشور الخاص بك. الرجاء المحاولة مرة أخرى.",

    // images: {
    "your image was not created. please try again.":
      "لم يتم إنشاء الصورة الخاصة بك. الرجاء المحاولة مرة أخرى.",
    "your image was not updated. please try again.":
      "لم يتم تحديث الصورة الخاصة بك. الرجاء المحاولة مرة أخرى.",
    "your image was not deleted. please try again.":
      "لم يتم حذف الصورة الخاصة بك. الرجاء المحاولة مرة أخرى.",
    "your image prompt was not updated. please try again.":
      "لم يتم تحديث الوصف الخاص بك. الرجاء المحاولة مرة أخرى.",
    "your image url was not generated. please try again.":
      "لم يتم إنشاء الصورة الخاصة بك. الرجاء المحاولة مرة أخرى.",
    "your image url was not uploaded. please try again.":
      "لم يتم رفع الصورة الخاصة بك. الرجاء المحاولة مرة أخرى.",
    "your file was not uploaded. please try again.":
      "لم يتم رفع الملف الخاص بك. الرجاء المحاولة مرة أخرى.",

    "this action needs you to be logged in.":
      "يجب أن تكون مسجل أولاً لهذا الإجراء.",
    "you don't have access to do this action.":
      "أنت غير مسموح لك بهذا الإجراء.",
  },
};
