export const content = {
  en: {
    language: 'English',
    skip: 'Skip to content',
    menu: 'Menu',
    brandLine: 'Equipment & parts sourcing',
    nav: {
      home: 'Home',
      equipment: 'Equipment',
      parts: 'Parts',
      manufacturing: 'Manufacturing partners',
      delivery: 'Delivery & support',
      contact: 'Contact'
    },
    request: 'Send your requirements',
    factoryLink: 'Explore manufacturing partners',
    photoCredit: 'On-site photo at a manufacturing partner’s workshop in China',
    home: {
      title: 'Construction equipment and parts from China',
      headline: ['Construction equipment', 'and parts from China'],
      intro: 'We work with manufacturing partners in China to help dealers, repair businesses and contractors source equipment and parts.',
      sourcing: 'What are you sourcing?',
      manufacturingTitle: 'Inside our manufacturing partners’ workshops',
      manufacturingText: 'See workshop floors and production equipment. For an individual order, ask us to confirm which processes and inspection records apply.',
      audienceTitle: 'How do you buy?'
    },
    equipment: {
      title: 'Equipment sourcing',
      description: 'Share your target machine or job requirements so we can review supply options with you.',
      checklistTitle: 'What to include',
      checklist: [
        ['Machine or application', 'Tell us the equipment type, target model or the job it needs to do.'],
        ['Configuration and quantity', 'Include any capacity, attachment or operating requirements and how many units you need.'],
        ['Destination and timing', 'Share the delivery country or port and the date you need the equipment.']
      ],
      action: 'Send equipment requirements'
    },
    parts: {
      title: 'Parts sourcing',
      description: 'Share a part number or machine model so we can review fit and availability.',
      checklistTitle: 'What helps us check fit',
      checklist: [
        ['Part number or machine model', 'Include the machine serial number or production year if available.'],
        ['Dimensions or a photo', 'Note the critical dimensions or mention any nameplate, old-part photos or drawings you have.'],
        ['Quantity and destination', 'Tell us how many you need and where the parts will be delivered.']
      ],
      action: 'Ask about a part'
    },
    audiences: [
      { type: 'dealer', title: 'Dealers & distributors', detail: 'Share product categories, expected volumes and the market you supply.', action: 'Dealer & bulk inquiries' },
      { type: 'parts', title: 'Repair & parts buyers', detail: 'Send a part number, machine model or the details on a nameplate.', action: 'Find replacement parts' },
      { type: 'project', title: 'Engineering contractors', detail: 'Tell us the application, configuration and delivery schedule for your project.', action: 'Project equipment inquiries' }
    ],
    manufacturing: {
      title: 'Manufacturing partners in China',
      description: 'A look at the workshops and production equipment behind our sourcing network.',
      equipmentTitle: 'Production equipment',
      workshopTitle: 'Workshop environment',
      gallerySource: 'Yanxu official photo gallery',
      tourTitle: 'Workshop walkthrough',
      tourNote: 'On-site footage from a partner workshop in China.',
      play: 'Load workshop video',
      videoLabel: 'Workshop walkthrough, without audio',
      videoFallback: 'Open the workshop video',
      qualityTitle: 'Confirm inspection requirements for your order',
      qualityText: 'Include the model or part number and any dimensions, tolerances or documents your team needs to review. We’ll confirm what can be supplied for that item.'
    },
    delivery: {
      title: 'Delivery & support',
      description: 'From the first inquiry to shipment, we review the details that apply to your order.',
      steps: [
        ['Share your requirements', 'Tell us the machine or part, quantity, destination and delivery window.'],
        ['Confirm the configuration', 'We review the model, fit or configuration and the available production or supply option.'],
        ['Review the quote and inspection scope', 'Agree on pricing, lead time, documents and any checks required before shipment.'],
        ['Agree on the shipping and support terms', 'Confirm packaging, transport arrangements and order-specific support before proceeding.']
      ]
    },
    contact: {
      title: 'Tell us what you’re sourcing',
      description: 'A list of models, a part number or a brief description of the job is enough to start.',
      formTitle: 'Prepare an inquiry',
      note: 'This form creates a draft in your browser. You can download it or use an available contact channel to send it.',
      draftNote: 'Your draft is ready to review.',
      select: 'Choose an inquiry type',
      labels: {
        name: 'Name',
        email: 'Email',
        country: 'Destination country or region',
        type: 'Inquiry type',
        requirements: 'Requirements'
      },
      types: { equipment: 'Equipment sourcing', parts: 'Parts & fit check', dealer: 'Dealer & bulk inquiry', project: 'Project equipment inquiry' },
      hints: {
        default: 'Include the equipment or parts you need and the expected quantity.',
        equipment: 'Include the target machine, application or configuration, quantity and delivery window.',
        parts: 'Include the part number or machine model, quantity and any dimensions you know.',
        dealer: 'Include the product categories, expected volumes and the market you supply.',
        project: 'Include the application, equipment requirements, delivery location and project schedule.'
      },
      prepare: 'Prepare draft',
      download: 'Download draft',
      emailAction: 'Open in email',
      briefLabel: 'Inquiry draft',
      noScript: 'Enable JavaScript to prepare an inquiry draft.',
      whatsapp: 'Chat on WhatsApp'
    },
    ctaTitle: 'Have a model, part number or purchase list?',
    ctaText: 'Share what you need and where it’s going so we can review your request.',
    notFound: 'Page not found'
  },
  'zh-CN': {
    language: '简体中文',
    skip: '跳到正文',
    menu: '菜单',
    brandLine: '工程机械与配件采购',
    nav: {
      home: '首页',
      equipment: '整机采购',
      parts: '配件采购',
      manufacturing: '合作工厂',
      delivery: '交付与支持',
      contact: '联系'
    },
    request: '提交采购需求',
    factoryLink: '了解合作工厂',
    photoCredit: '中国合作工厂车间实拍',
    home: {
      title: '中国工程机械与配件采购',
      headline: ['中国工程机械', '与配件采购'],
      intro: '我们与中国制造合作伙伴协作，为经销商、维修商和工程承包商对接整机与配件采购。',
      sourcing: '您需要采购什么？',
      manufacturingTitle: '走进合作工厂',
      manufacturingText: '查看现场车间和生产设备。您可以按订单要求核对适用的生产工序及检验资料。',
      audienceTitle: '按采购场景进入'
    },
    equipment: {
      title: '整机采购',
      description: '告诉我们目标机型或实际工况，我们会根据需求确认可供选项。',
      checklistTitle: '建议提供的信息',
      checklist: [
        ['机型或应用场景', '提供设备类别、目标机型，或说明设备需要完成什么作业。'],
        ['配置与数量', '说明吨位、容量、属具或作业条件等要求，以及计划采购的数量。'],
        ['目的地与时间', '提供目的地国家或港口，以及预计需要设备的日期。']
      ],
      action: '提交整机需求'
    },
    parts: {
      title: '配件采购',
      description: '提供零件号或设备型号，我们会据此核对适配和供货情况。',
      checklistTitle: '核对适配需要的信息',
      checklist: [
        ['零件号或整机型号', '如有设备序列号或生产年份，也可一并提供。'],
        ['尺寸或照片', '说明关键尺寸，或注明您有铭牌、旧件照片或图纸。'],
        ['数量与目的地', '告诉我们预计采购数量及配件交付地点。']
      ],
      action: '提交配件需求'
    },
    audiences: [
      { type: 'dealer', title: '经销商', detail: '提供采购品类、预计数量和销售市场。', action: '经销与批量采购' },
      { type: 'parts', title: '维修及配件采购商', detail: '提供件号、设备型号或铭牌信息。', action: '维修配件匹配' },
      { type: 'project', title: '工程承包商', detail: '说明项目工况、设备配置和交付时间。', action: '工程项目采购' }
    ],
    manufacturing: {
      title: '中国制造合作工厂',
      description: '查看我们在国内合作的生产车间与设备。',
      equipmentTitle: '生产设备',
      workshopTitle: '厂房环境',
      gallerySource: '岩旭官网相册',
      tourTitle: '车间巡览',
      tourNote: '视频在国内合作工厂实地拍摄。',
      play: '加载车间视频',
      videoLabel: '车间巡览，无音轨',
      videoFallback: '打开车间视频',
      qualityTitle: '按订单确认检验要求',
      qualityText: '如需查阅检验资料，请提供型号或零件号，并说明希望核对的尺寸、公差或文件，我们会确认该产品可提供的资料。'
    },
    delivery: {
      title: '交付与支持',
      description: '从收到需求到安排出运，我们逐项核对适用于您的订单条件。',
      steps: [
        ['提交采购需求', '说明设备或配件、数量、目的地及计划交付时间。'],
        ['确认机型和配置', '根据工况、尺寸和适配要求核对供货选项。'],
        ['核对报价与验收要求', '确认价格、预计交期、可提供的文件及出运前的检验项目。'],
        ['确认运输与支持条件', '在订单推进前核对包装、运输安排及适用的支持条件。']
      ]
    },
    contact: {
      title: '告诉我们您的采购需求',
      description: '一份机型清单、一个零件号或一段工况描述，都可以作为沟通起点。',
      formTitle: '填写询盘草稿',
      note: '表单在您的浏览器内生成草稿。您可以下载，也可以通过页面提供的联系渠道发送。',
      draftNote: '询盘草稿已生成，请核对内容。',
      select: '请选择采购类型',
      labels: {
        name: '联系人',
        email: '邮箱',
        country: '目的地国家或地区',
        type: '采购类型',
        requirements: '采购需求'
      },
      types: { equipment: '整机采购', parts: '配件采购与适配', dealer: '经销与批量采购', project: '工程项目采购' },
      hints: {
        default: '说明需要的整机或配件和预计数量。',
        equipment: '说明目标机型、工况或配置、数量和计划交付时间。',
        parts: '提供零件号或整机型号、预计数量和已知尺寸。',
        dealer: '说明采购品类、预计采购量和销售市场。',
        project: '说明项目工况、设备要求、交付地点及时间。'
      },
      prepare: '生成草稿',
      download: '下载草稿',
      emailAction: '使用邮件发送',
      briefLabel: '询盘草稿',
      noScript: '启用 JavaScript 后可生成询盘草稿。',
      whatsapp: '通过 WhatsApp 联系'
    },
    ctaTitle: '手上有机型、件号或采购清单？',
    ctaText: '请告诉我们您需要什么、计划发往哪里，以便核对供货选项。',
    notFound: '页面不存在'
  }
};
